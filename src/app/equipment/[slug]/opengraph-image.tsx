import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { findEquipmentBySerialNumber } from '@/lib/db';

export const alt = 'paraMOT Equipment Registry';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OGImage({ params }: Props) {
  const { slug } = await params;
  const equipment = await findEquipmentBySerialNumber(slug);

  const title = equipment
    ? `${equipment.manufacturer} ${equipment.model}`
    : 'Equipment Registry';
  const subtitle = equipment ? `${equipment.size}  ·  ${equipment.serialNumber}` : '';

  const logoData = await readFile(join(process.cwd(), 'public/images/paramot-logo.png'));
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 60,
        gap: 24,
        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={logoSrc} width={48} height={48} style={{ objectFit: 'contain' }} />
        <span style={{ fontSize: 28, fontWeight: 700, color: '#0c4a6e' }}>paraMOT</span>
      </div>

      <span
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: '#0c4a6e',
          lineHeight: 1.2,
        }}
      >
        {title}
      </span>

      {subtitle && <span style={{ fontSize: 26, color: '#0369a1' }}>{subtitle}</span>}

      <span
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: '#0369a1',
          background: '#bae6fd',
          padding: '8px 20px',
          borderRadius: 20,
        }}
      >
        Equipment Service History
      </span>
    </div>,
    { ...size },
  );
}
