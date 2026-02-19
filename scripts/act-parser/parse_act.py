#!/usr/bin/env python3
"""
paraMOT ACT Parser — Extracts reference data from APPI ACT .ods files.

Usage:
    python parse_act.py <path-to-act-file.ods> [--output <output.json>]

Outputs structured JSON for seeding the Prisma database.
"""

import json
import re
import sys
from pathlib import Path

from odf.opendocument import load
from odf.table import Table, TableRow, TableCell
from odf.text import P


# =============================================================================
# ODS HELPERS
# =============================================================================

def get_cell_text(cell) -> str:
    """Extract text content from an ODS cell."""
    ps = cell.getElementsByType(P)
    if ps:
        parts = []
        for p in ps:
            text = ""
            for node in p.childNodes:
                if hasattr(node, "data"):
                    text += node.data
                elif hasattr(node, "__str__"):
                    text += str(node)
            parts.append(text)
        return "\n".join(parts)
    val = cell.getAttribute("value")
    return val if val else ""


def get_row_cells(row, max_cols: int = 70) -> list[str]:
    """Get cell values from a row, handling repeated/covered cells."""
    cells = []
    for child in row.childNodes:
        tag = child.qname[1]
        if tag in ("table-cell", "covered-table-cell"):
            repeat = child.getAttribute("numbercolumnsrepeated")
            repeat = int(repeat) if repeat else 1
            val = get_cell_text(child) if tag == "table-cell" else ""
            if repeat > 100 and not val:
                # Pad remaining with empty strings
                cells.extend([""] * (max_cols - len(cells)))
                break
            for _ in range(min(repeat, max_cols - len(cells))):
                cells.append(val)
                if len(cells) >= max_cols:
                    break
    # Pad to max_cols
    while len(cells) < max_cols:
        cells.append("")
    return cells


def get_sheet(doc, name: str):
    """Get a sheet by name."""
    for sheet in doc.spreadsheet.getElementsByType(Table):
        if sheet.getAttribute("name") == name:
            return sheet
    return None


def get_all_rows(sheet) -> list[list[str]]:
    """Get all rows from a sheet as lists of strings."""
    raw_rows = sheet.getElementsByType(TableRow)
    return [get_row_cells(row) for row in raw_rows]


def parse_int(val: str) -> int | None:
    """Parse an integer from a string, returning None if not possible."""
    val = val.strip()
    if not val or val.upper() == "X":
        return None
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return None


def parse_float(val: str) -> float | None:
    """Parse a float from a string, returning None if not possible."""
    val = val.strip()
    if not val or val.upper() == "X":
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


# =============================================================================
# PARSERS
# =============================================================================

def parse_model_header(rows: list[list[str]]) -> dict:
    """
    Parse the model/size header from the Data sheet.
    Row 0 col 1: "SKYMAN ROCK2 XS-23.5 60-85KG"
    Row 1 col 7: Class (e.g. "A", "B", "C")
    """
    raw = rows[0][1].strip()
    # Pattern: "MANUFACTURER MODEL SIZE-WINGAREA MINWEIGHT-MAXWEIGHTKG"
    # Example: "SKYMAN ROCK2 XS-23.5 60-85KG"
    match = re.match(
        r"^(\S+)\s+(.+?)\s+(\S+?)[-–](\d+(?:\.\d+)?)\s+(\d+)[-–](\d+)\s*KG",
        raw,
        re.IGNORECASE,
    )
    if not match:
        # Try without wing area: "MANUFACTURER MODEL SIZE MINWEIGHT-MAXWEIGHTKG"
        match = re.match(
            r"^(\S+)\s+(.+?)\s+(\S+?)\s+(\d+)[-–](\d+)\s*KG",
            raw,
            re.IGNORECASE,
        )
        if match:
            manufacturer = match.group(1)
            model = match.group(2)
            size = match.group(3)
            min_weight = int(match.group(4))
            max_weight = int(match.group(5))
            wing_area = None
        else:
            raise ValueError(f"Could not parse model header: '{raw}'")
    else:
        manufacturer = match.group(1)
        model = match.group(2)
        size = match.group(3)
        wing_area = float(match.group(4))
        min_weight = int(match.group(5))
        max_weight = int(match.group(6))

    # Certification class from row 1, col 7
    cert_class_raw = rows[1][7].strip()
    cert_class = f"EN-{cert_class_raw}" if cert_class_raw and cert_class_raw.isalpha() else cert_class_raw or None

    return {
        "manufacturer": manufacturer.upper(),
        "model": model.strip(),
        "size": size.upper(),
        "wingArea": wing_area,
        "minWeight": min_weight,
        "maxWeight": max_weight,
        "certificationClass": cert_class,
    }


def parse_metadata(rows: list[list[str]]) -> dict:
    """Parse additional metadata from the Data sheet."""
    # Measurement method: search for "inner surface" or "line end" text
    method = "canopy_inner"  # default
    for r in range(4, 8):
        for c in range(10):
            text = rows[r][c].strip().lower()
            if "inner surface" in text or "canopy" in text:
                method = "canopy_inner"
            elif "line end" in text:
                method = "line_end"

    # Right-side metadata block (col 18=label, col 21=value)
    max_weight = None
    num_rows = None

    for r in range(0, 15):
        label = rows[r][18].strip().lower() if rows[r][18].strip() else ""
        value = rows[r][21].strip()
        if "max total flying" in label:
            max_weight = parse_int(value)
        elif "number of rows" in label or "design: number of row" in label:
            num_rows = parse_int(value)

    return {
        "measurementMethod": method,
        "numLineRows": num_rows,
        "maxFlyingWeight": max_weight,
    }


def parse_line_lengths(rows: list[list[str]]) -> dict:
    """
    Parse the line length table from the Data sheet.
    Rows 8-38, cols 0-7: position, A, B, C, D, E, (gap), K
    """
    row_labels = ["A", "B", "C", "D", "E"]
    col_map = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "K": 7}

    lengths: dict[str, list[int | None]] = {}

    # Read positions 1-30 (rows 9-38 in the sheet)
    for label, col in col_map.items():
        values = []
        for row_idx in range(9, 39):  # positions 1-30
            val = parse_int(rows[row_idx][col])
            values.append(val)
        # Trim trailing Nones
        while values and values[-1] is None:
            values.pop()
        if values and any(v is not None for v in values):
            lengths[label] = values

    return lengths


def parse_group_mappings(rows: list[list[str]]) -> dict:
    """
    Parse the group mapping table from the Data sheet.
    Starts at row 9, col 44 (AT): "Group table" header
    Row 10: wing center, 1, 2, 3, ...
    Row 11+: row label, G1A, G1A, G2A, ...
    """
    # Group table is at cols 44-63 (AT through BG roughly)
    # Row 10 at col 44: "wing center", positions start at col 45
    # Row 11: "A", groups start at col 45

    row_map = {
        11: "A",
        12: "B",
        13: "C",
        14: "D",
        15: "E",
        # 16 is empty
        17: "K",
    }

    mappings: dict[str, list[str | None]] = {}

    for row_idx, label in row_map.items():
        values = []
        for col in range(45, 65):  # positions 1-20
            val = rows[row_idx][col].strip()
            if not val or val.upper() == "X":
                values.append(None)
            else:
                values.append(val)
        # Trim trailing Nones
        while values and values[-1] is None:
            values.pop()
        if values and any(v is not None for v in values):
            mappings[label] = values

    return mappings


def parse_line_materials(rows: list[list[str]]) -> list[dict]:
    """
    Parse line material specifications from the Data sheet.
    Starts at row 19 (header), data from row 22+.
    Cols 45-48: Line ID, Brand, Material Reference, Strength new
    """
    materials = []
    seen = set()

    for row_idx in range(20, 50):
        line_id = rows[row_idx][45].strip()
        if not line_id or line_id == "---":
            continue

        brand = rows[row_idx][46].strip()
        mat_ref = rows[row_idx][47].strip()
        strength = parse_float(rows[row_idx][48])

        if not brand or not line_id:
            continue

        # Deduplicate (same line appears for L and R in the strength sheet)
        key = line_id
        if key in seen:
            continue
        seen.add(key)

        # Parse line ID to extract cascade level, row, index
        # Format: L{cascade}{row}{index} e.g. L1A1, L2B2, L3A1
        id_match = re.match(r"L(\d)([A-Z])(\d)", line_id)
        if id_match:
            cascade_level = int(id_match.group(1))
            line_row = id_match.group(2)
            cascade_index = int(id_match.group(3))
        else:
            cascade_level = 1
            line_row = "A"
            cascade_index = 1

        materials.append({
            "lineId": line_id,
            "cascadeLevel": cascade_level,
            "lineRow": line_row,
            "cascadeIndex": cascade_index,
            "brand": brand,
            "materialRef": mat_ref,
            "strengthNew": strength,
        })

    return materials


def calculate_aspect_ratio(wing_area: float | None, line_lengths: dict) -> float | None:
    """
    Estimate aspect ratio if not directly available.
    AR = span² / area. We can approximate span from outermost line lengths.
    For now, return None — this should be provided by the manufacturer.
    """
    # The ACT doesn't directly contain aspect ratio.
    # It would need to be calculated from the wing geometry or provided manually.
    return None


def count_lines_per_side(line_lengths: dict) -> int:
    """Count the max number of line positions per side from the length table."""
    max_positions = 0
    for row_label, lengths in line_lengths.items():
        count = sum(1 for v in lengths if v is not None)
        max_positions = max(max_positions, count)
    return max_positions


# =============================================================================
# MAIN PARSER
# =============================================================================

def parse_act(filepath: str) -> dict:
    """Parse an ACT .ods file and return structured reference data."""
    doc = load(filepath)

    data_sheet = get_sheet(doc, "Data")
    if not data_sheet:
        raise ValueError("Could not find 'Data' sheet in ACT file")

    rows = get_all_rows(data_sheet)

    # Parse all sections
    header = parse_model_header(rows)
    metadata = parse_metadata(rows)
    line_lengths = parse_line_lengths(rows)
    group_mappings = parse_group_mappings(rows)
    line_materials = parse_line_materials(rows)

    num_lines_per_side = count_lines_per_side(line_lengths)

    # Determine actual number of line rows from the data (excluding K/stabilo)
    active_rows = [r for r in ["A", "B", "C", "D", "E"] if r in line_lengths]
    num_line_rows = metadata["numLineRows"] or len(active_rows)

    return {
        "manufacturer": header["manufacturer"],
        "model": header["model"],
        "certificationClass": header["certificationClass"],
        "numLineRows": num_line_rows,
        "measurementMethod": metadata["measurementMethod"],
        "size": {
            "label": header["size"],
            "minWeight": header["minWeight"],
            "maxWeight": header["maxWeight"],
            "wingArea": header["wingArea"],
            "aspectRatio": calculate_aspect_ratio(header["wingArea"], line_lengths),
            "numLinesPerSide": num_lines_per_side,
        },
        "lineLengths": line_lengths,
        "groupMappings": group_mappings,
        "lineMaterials": line_materials,
    }


# =============================================================================
# CLI
# =============================================================================

def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_act.py <act-file.ods> [--output <output.json>]")
        sys.exit(1)

    filepath = sys.argv[1]
    output_path = None

    if "--output" in sys.argv:
        idx = sys.argv.index("--output")
        if idx + 1 < len(sys.argv):
            output_path = sys.argv[idx + 1]

    if not Path(filepath).exists():
        print(f"Error: File not found: {filepath}")
        sys.exit(1)

    print(f"Parsing: {filepath}")
    result = parse_act(filepath)

    # Summary
    print(f"  Manufacturer: {result['manufacturer']}")
    print(f"  Model: {result['model']}")
    print(f"  Size: {result['size']['label']}")
    print(f"  Weight range: {result['size']['minWeight']}-{result['size']['maxWeight']} kg")
    print(f"  Wing area: {result['size']['wingArea']} m²")
    print(f"  Class: {result['certificationClass']}")
    print(f"  Line rows: {result['numLineRows']}")
    print(f"  Measurement method: {result['measurementMethod']}")
    print(f"  Lines per side: {result['size']['numLinesPerSide']}")
    print(f"  Line materials: {len(result['lineMaterials'])} entries")
    print(f"  Line length rows: {list(result['lineLengths'].keys())}")
    print(f"  Group mapping rows: {list(result['groupMappings'].keys())}")

    if output_path:
        with open(output_path, "w") as f:
            json.dump(result, f, indent=2)
        print(f"\nOutput written to: {output_path}")
    else:
        # Default: write to same directory as input with .json extension
        default_out = Path(filepath).with_suffix(".json")
        with open(default_out, "w") as f:
            json.dump(result, f, indent=2)
        print(f"\nOutput written to: {default_out}")


if __name__ == "__main__":
    main()
