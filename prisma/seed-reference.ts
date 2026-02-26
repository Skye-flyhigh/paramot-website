/**
 * Seed reference data from ACT parser JSON output.
 * Populates: Manufacturer, GliderModel, GliderSize, LineMaterial
 *
 * Usage: Called from seed.ts, or directly via `npx tsx prisma/seed-reference.ts`
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '../src/generated/prisma';

// =============================================================================
// Types matching parser JSON output
// =============================================================================

interface ACTData {
  manufacturer: string;
  model: string;
  certificationClass: string | null;
  numLineRows: number;
  measurementMethod: string;
  size: {
    label: string;
    minWeight: number;
    maxWeight: number;
    wingArea: number | null;
    aspectRatio: number | null;
    numLinesPerSide: number;
  };
  lineLengths: Record<string, (number | null)[]>;
  groupMappings: Record<string, (string | null)[]>;
  lineMaterials: {
    lineId: string;
    cascadeLevel: number;
    lineRow: string;
    cascadeIndex: number;
    brand: string;
    materialRef: string;
    strengthNew: number | null;
  }[];
}

// =============================================================================
// Seed functions
// =============================================================================

export async function seedReferenceData(prisma: PrismaClient) {
  const outputDir = join(__dirname, '../scripts/act-parser/output');

  let files: string[];
  try {
    files = readdirSync(outputDir).filter((f) => f.endsWith('.json'));
  } catch {
    console.log('⏭️  No ACT parser output found — skipping reference data seed');
    return;
  }

  if (files.length === 0) {
    console.log('⏭️  No JSON files in parser output — skipping reference data seed');
    return;
  }

  console.log(`\n📦 Seeding reference data from ${files.length} ACT file(s)...`);

  for (const file of files) {
    const filepath = join(outputDir, file);
    const data: ACTData = JSON.parse(readFileSync(filepath, 'utf-8'));

    console.log(`\n  Processing: ${data.manufacturer} ${data.model} ${data.size.label}`);

    // 1. Upsert Manufacturer
    const manufacturer = await prisma.manufacturer.upsert({
      where: { name: data.manufacturer },
      update: {},
      create: {
        name: data.manufacturer,
      },
    });
    console.log(`    ✅ Manufacturer: ${manufacturer.name}`);

    // 2. Upsert GliderModel
    const model = await prisma.gliderModel.upsert({
      where: {
        manufacturerId_name: {
          manufacturerId: manufacturer.id,
          name: data.model,
        },
      },
      update: {
        certificationClass: data.certificationClass,
        numLineRows: data.numLineRows,
        measurementMethod: data.measurementMethod,
      },
      create: {
        manufacturerId: manufacturer.id,
        name: data.model,
        certificationClass: data.certificationClass,
        numLineRows: data.numLineRows,
        measurementMethod: data.measurementMethod,
      },
    });
    console.log(`    ✅ Model: ${model.name}`);

    // 3. Upsert GliderSize
    const size = await prisma.gliderSize.upsert({
      where: {
        gliderModelId_sizeLabel: {
          gliderModelId: model.id,
          sizeLabel: data.size.label,
        },
      },
      update: {
        minWeight: data.size.minWeight,
        maxWeight: data.size.maxWeight,
        wingArea: data.size.wingArea,
        aspectRatio: data.size.aspectRatio,
        numLinesPerSide: data.size.numLinesPerSide,
        lineLengths: data.lineLengths,
        groupMappings: data.groupMappings,
      },
      create: {
        gliderModelId: model.id,
        sizeLabel: data.size.label,
        minWeight: data.size.minWeight,
        maxWeight: data.size.maxWeight,
        wingArea: data.size.wingArea,
        aspectRatio: data.size.aspectRatio,
        numLinesPerSide: data.size.numLinesPerSide,
        lineLengths: data.lineLengths,
        groupMappings: data.groupMappings,
      },
    });
    console.log(
      `    ✅ Size: ${size.sizeLabel} (${data.size.minWeight}-${data.size.maxWeight} kg)`,
    );

    // 4. Upsert LineMaterials
    let materialsCount = 0;
    for (const mat of data.lineMaterials) {
      await prisma.lineMaterial.upsert({
        where: {
          gliderModelId_lineId: {
            gliderModelId: model.id,
            lineId: mat.lineId,
          },
        },
        update: {
          cascadeLevel: mat.cascadeLevel,
          lineRow: mat.lineRow,
          cascadeIndex: mat.cascadeIndex,
          brand: mat.brand,
          materialRef: mat.materialRef,
          strengthNew: mat.strengthNew ?? 0,
        },
        create: {
          gliderModelId: model.id,
          lineId: mat.lineId,
          cascadeLevel: mat.cascadeLevel,
          lineRow: mat.lineRow,
          cascadeIndex: mat.cascadeIndex,
          brand: mat.brand,
          materialRef: mat.materialRef,
          strengthNew: mat.strengthNew ?? 0,
        },
      });
      materialsCount++;
    }
    console.log(`    ✅ Line materials: ${materialsCount} entries`);
  }

  console.log('\n📦 Reference data seed complete!');
}

// =============================================================================
// Standalone execution
// =============================================================================

if (require.main === module) {
  const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
  });

  seedReferenceData(prisma)
    .catch((e) => {
      console.error('❌ Reference seed failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
