import { FormEvent, useEffect, useRef, useState } from 'react';

type Settings = {
  seed: string;
  waterPercentage: number;
  continentCount: number;
  tectonicActivity: number;
};

const WIDTH = 960;
const HEIGHT = 540;

const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number): (() => number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const drawWorld = (ctx: CanvasRenderingContext2D, settings: Settings): void => {
  const random = mulberry32(hashString(settings.seed));

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const waterLightness = 52 + Math.round((settings.waterPercentage - 50) / 5);
  ctx.fillStyle = `hsl(208 60% ${waterLightness}%)`;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const landTarget = 1 - settings.waterPercentage / 100;
  const mountainChance = 0.1 + settings.tectonicActivity * 0.1;

  const totalBlobs = Math.max(6, settings.continentCount * 6);
  for (let i = 0; i < totalBlobs; i += 1) {
    const continentId = i % settings.continentCount;
    const continentalBand = WIDTH / settings.continentCount;
    const baseX = continentalBand * continentId + continentalBand * (0.15 + random() * 0.7);

    const x = baseX + (random() - 0.5) * continentalBand * 0.8;
    const y = HEIGHT * (0.15 + random() * 0.7);

    const sizeScale = 0.7 + landTarget;
    const radius = (16 + random() * 56) * sizeScale;

    ctx.beginPath();
    const points = 10 + Math.floor(random() * 12);
    for (let p = 0; p < points; p += 1) {
      const angle = (p / points) * Math.PI * 2;
      const variance = 0.55 + random() * 0.95;
      const px = x + Math.cos(angle) * radius * variance;
      const py = y + Math.sin(angle) * radius * variance;
      if (p === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    const green = 35 + Math.round(random() * 25);
    const light = 35 + Math.round(random() * 15);
    ctx.fillStyle = `hsl(105 ${green}% ${light}%)`;
    ctx.fill();

    if (random() < mountainChance) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(90, 80, 80, 0.55)';
      ctx.lineWidth = 1.4;
      const segments = 4 + Math.floor(random() * 4);
      for (let s = 0; s < segments; s += 1) {
        const mx = x + (random() - 0.5) * radius;
        const my = y + (random() - 0.5) * radius;
        if (s === 0) {
          ctx.moveTo(mx, my);
        } else {
          ctx.lineTo(mx, my);
        }
      }
      ctx.stroke();
    }
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  for (let i = 0; i < 250; i += 1) {
    const x = random() * WIDTH;
    const y = random() * HEIGHT;
    const r = random() * 1.8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
};

const randomSeed = (): string => Math.random().toString(36).slice(2, 10);

export const App = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [settings, setSettings] = useState<Settings>({
    seed: randomSeed(),
    waterPercentage: 62,
    continentCount: 4,
    tectonicActivity: 5
  });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    drawWorld(ctx, settings);
  }, [settings, version]);

  const regenerate = (event?: FormEvent): void => {
    event?.preventDefault();
    setVersion((prev) => prev + 1);
  };

  const exportImage = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const link = document.createElement('a');
    link.download = `atlas-world-${settings.seed}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <main className="layout">
      <section className="panel">
        <h1>Atlas-Engine MVP</h1>
        <p>Generate a quick procedural world map from a few worldbuilding controls.</p>

        <form onSubmit={regenerate} className="controls">
          <label>
            Seed
            <input
              value={settings.seed}
              onChange={(e) => setSettings((prev) => ({ ...prev, seed: e.target.value }))}
            />
          </label>

          <label>
            Water percentage: {settings.waterPercentage}%
            <input
              type="range"
              min={20}
              max={90}
              value={settings.waterPercentage}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, waterPercentage: Number(e.target.value) }))
              }
            />
          </label>

          <label>
            Continent count: {settings.continentCount}
            <input
              type="range"
              min={1}
              max={8}
              value={settings.continentCount}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, continentCount: Number(e.target.value) }))
              }
            />
          </label>

          <label>
            Tectonic activity: {settings.tectonicActivity}
            <input
              type="range"
              min={1}
              max={10}
              value={settings.tectonicActivity}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, tectonicActivity: Number(e.target.value) }))
              }
            />
          </label>

          <div className="actions">
            <button type="button" onClick={() => setSettings((prev) => ({ ...prev, seed: randomSeed() }))}>
              New Seed
            </button>
            <button type="submit">Regenerate</button>
            <button type="button" onClick={exportImage}>
              Export PNG
            </button>
          </div>
        </form>
      </section>

      <section className="mapWrap">
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} aria-label="Generated world map" />
      </section>
    </main>
  );
};
