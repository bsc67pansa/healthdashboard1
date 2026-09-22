import { useId } from 'react';

export function SparkleBackground() {
  const baseId = useId();

  // Defined sparkle positions for reliable rendering
  const sparkles = [
    { top: '6%', left: '8%', size: 'w-4 h-4', delay: '0s', dur: '3.2s', opacity: 0.85 },
    { top: '12%', right: '14%', size: 'w-5 h-5', delay: '1.2s', dur: '4s', opacity: 0.9 },
    { top: '22%', left: '25%', size: 'w-3 h-3', delay: '0.6s', dur: '2.8s', opacity: 0.7 },
    { top: '38%', right: '8%', size: 'w-4 h-4', delay: '2s', dur: '3.6s', opacity: 0.8 },
    { top: '55%', left: '12%', size: 'w-5 h-5', delay: '1.5s', dur: '4.2s', opacity: 0.75 },
    { top: '70%', right: '22%', size: 'w-3.5 h-3.5', delay: '0.8s', dur: '3s', opacity: 0.85 },
    { top: '85%', left: '18%', size: 'w-4 h-4', delay: '2.4s', dur: '3.8s', opacity: 0.8 },
    { top: '92%', right: '10%', size: 'w-3 h-3', delay: '1s', dur: '3.4s', opacity: 0.7 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-pink-50 via-sky-50 to-white selection:bg-pink-300">
      {/* Soft radial glow orbs in pink & sky blue */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300/25 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/4 -right-32 w-[30rem] h-[30rem] bg-sky-200/35 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-32 left-1/3 w-[36rem] h-[36rem] bg-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-blue-100/30 rounded-full blur-2xl" />

      {/* Twinkling sparkle star glyphs (วิ้งๆ) */}
      {sparkles.map((sp, idx) => (
        <div
          key={`${baseId}-sp-${idx}`}
          className={`absolute ${sp.size} text-pink-400/80 animate-sparkle`}
          style={{
            top: sp.top,
            left: sp.left,
            right: sp.right,
            animationDelay: sp.delay,
            animationDuration: sp.dur,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
