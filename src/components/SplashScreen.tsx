import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SEGMENT_COUNT = 12;

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [activeSegments, setActiveSegments] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const segInterval = window.setInterval(() => {
      setActiveSegments((prev) => {
        if (prev >= SEGMENT_COUNT) {
          window.clearInterval(segInterval);
          return SEGMENT_COUNT;
        }
        return prev + 1;
      });
    }, 105);

    const fadeTimer = window.setTimeout(() => {
      window.clearInterval(segInterval);
      setActiveSegments(SEGMENT_COUNT);
      setFadingOut(true);
    }, 1450);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1900);

    return () => {
      window.clearInterval(segInterval);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col justify-between items-center overflow-hidden transition-opacity duration-400 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading Bharat Peyjal Jal Mitra"
    >
      <div className="flex-1 flex flex-col justify-center items-center w-full pb-5 px-6">
        {/* Circular Jal Mitra Logo */}
        <div className="w-[220px] h-[220px] max-w-[62vw] max-h-[62vw] flex items-center justify-center mb-6">
          <img
            src="/pwa-512x512.png"
            alt="जल मित्र"
            className="w-full h-full object-contain rounded-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.14)]"
          />
        </div>

        {/* 12-Segment Green Progress Bar */}
        <div className="flex flex-col items-center mt-2">
          <div className="flex gap-[2.5px] border-2 border-[#22c55e] p-[2.5px] rounded-[2px] w-[178px] h-[15px] bg-white">
            {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-full transition-colors duration-100 ${
                  i < activeSegments ? 'bg-[#22c55e]' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
          <p className="font-mono font-extrabold text-[11px] tracking-[2px] text-[#22c55e] mt-1.5">
            LOADING...
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center">
        <div className="text-center mb-6">
          <span className="block text-[11.5px] text-slate-500 font-medium">Powered by</span>
          <div className="text-[19px] text-slate-600 font-bold tracking-tight mt-0.5">
            Bharat Peyjal
          </div>
        </div>
        <div className="w-full h-[14px] bg-[#ff6a13]" />
      </div>
    </div>
  );
};
