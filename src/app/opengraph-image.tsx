import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'paraMOT — Paraglider Servicing & Repairs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  const logoData = await readFile(join(process.cwd(), 'public/images/paramot-logo.png'));
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: 60,
        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
      }}
    >
      <img src={logoSrc} width={120} height={120} style={{ objectFit: 'contain' }} />

      <span style={{ fontSize: 56, fontWeight: 700, color: '#0c4a6e' }}>
        para<span style={{ color: '#38bdf8' }}>MOT</span>
      </span>

      <span
        style={{
          fontSize: 26,
          color: '#0369a1',
          textAlign: 'center',
          maxWidth: 700,
        }}
      >
        Professional paraglider servicing and repairs. APPI certified workshop in South
        Wales.
      </span>
    </div>,
    { ...size },
  );
}
