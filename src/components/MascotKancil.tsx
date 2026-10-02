import React from 'react';
import { useApp } from '../context/AppContext';
import mascotKancilImg from '../assets/images/mascot_kancil_1790906572543.jpg';
import mascotCelebratingImg from '../assets/images/mascot_celebrating_1790906586966.jpg';

interface MascotKancilProps {
  mood?: 'happy' | 'celebrating' | 'thinking' | 'encouraging';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechText?: string;
  showAccessory?: boolean;
}

export const MascotKancil: React.FC<MascotKancilProps> = ({
  mood = 'happy',
  size = 'md',
  speechText,
  showAccessory = true,
}) => {
  const { activeChild, accessories } = useApp();

  const activeAcc = accessories.find((a) => a.id === activeChild?.activeAccessory);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  const imgSrc = mood === 'celebrating' ? mascotCelebratingImg : mascotKancilImg;

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative ${sizeClasses[size]} shrink-0 transition-transform duration-200 hover:scale-105`}>
        {/* Outer pastel ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-200 to-emerald-200 p-1 shadow-md">
          <img
            src={imgSrc}
            alt="Kancil Pintar Mascot"
            className="w-full h-full object-cover rounded-full bg-purple-50"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback to inline styled mascot if image fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Equipped Avatar Accessory Badge */}
        {showAccessory && activeAcc && (
          <span
            className="absolute -top-1 -right-1 text-lg sm:text-2xl filter drop-shadow-md animate-bounce"
            title={activeAcc.nameMs}
          >
            {activeAcc.icon}
          </span>
        )}
      </div>

      {speechText && (
        <div className="relative bg-white border border-purple-200 rounded-2xl p-3 shadow-sm max-w-xs text-xs sm:text-sm text-slate-700">
          <div className="absolute -left-2 top-4 w-3 h-3 bg-white border-b border-l border-purple-200 transform rotate-45" />
          <p className="font-medium leading-relaxed">{speechText}</p>
        </div>
      )}
    </div>
  );
};
