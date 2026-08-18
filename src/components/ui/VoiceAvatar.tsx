import React from 'react';

interface VoiceAvatarProps {
  type: 'agent' | 'customer';
  name?: string;
  gender?: 'male' | 'female' | 'auto';
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Female name detection heuristic
const FEMALE_NAMES = new Set([
  'sarah', 'sara', 'emily', 'maria', 'chioma', 'chloe', 'fatima', 'aisha', 'amina',
  'jessica', 'jennifer', 'amanda', 'elizabeth', 'lisa', 'anna', 'mary', 'grace',
  'joy', 'ngozi', 'zainab', 'victoria', 'rachel', 'laura', 'sophia', 'olivia',
  'emma', 'ava', 'isabella', 'mia', 'harper', 'evelyn', 'abigail', 'elena', 'charlotte',
  'brenda', 'karen', 'stephanie', 'claire', 'hannah', 'naomi', 'vanessa', 'ruth', 'fiona'
]);

function inferGender(name?: string): 'male' | 'female' {
  if (!name) return 'male';
  const firstName = name.trim().split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
  if (FEMALE_NAMES.has(firstName)) return 'female';
  // Common female suffix patterns in international names
  if (firstName.endsWith('ina') || firstName.endsWith('ette') || firstName.endsWith('elle')) {
    return 'female';
  }
  return 'male';
}

/**
 * Modern Illustrative Vector Avatars
 */
export function VoiceAvatar({
  type,
  name = '',
  gender = 'auto',
  size = 32,
  style = {},
}: VoiceAvatarProps) {
  if (type === 'agent') {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: '#1b5a92',
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 2px 8px rgba(27, 90, 146, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
          ...style
        }}
        title={`${name || 'Amira Agent'} (AI Assistant)`}
      >
        <img
          src="/amira-head.png"
          alt="Amira Agent"
          style={{
            width: '88%',
            height: '88%',
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>
    );
  }

  // Customer Avatar: Male or Female Illustrative Vector
  const resolvedGender = gender === 'auto' ? inferGender(name) : gender;

  if (resolvedGender === 'female') {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: '#ec489915',
          border: '1.5px solid #ec489930',
          boxShadow: '0 2px 8px rgba(236, 72, 153, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
          ...style
        }}
        title={`${name || 'Caller'} (Female Customer)`}
      >
        <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background circle */}
          <circle cx="20" cy="20" r="20" fill="#fdf2f8" />
          {/* Shoulders / Blouse */}
          <path d="M7 38 C7 28, 14 25, 20 25 C26 25, 33 28, 33 38 Z" fill="#ec4899" />
          <path d="M16 25 L20 29 L24 25 Z" fill="#fbcfe8" />
          {/* Neck */}
          <rect x="17" y="19" width="6" height="7" rx="3" fill="#fed7aa" />
          {/* Long Hair Back */}
          <path d="M10 16 C10 8, 30 8, 30 16 C30 26, 28 27, 28 27 L12 27 C12 27, 10 26, 10 16 Z" fill="#831843" />
          {/* Face */}
          <ellipse cx="20" cy="17" rx="7.5" ry="8.5" fill="#ffedd5" />
          {/* Hair Front / Bangs */}
          <path d="M12.5 14 C12.5 8.5, 27.5 8.5, 27.5 14 C25 10.5, 22 10.5, 20 11.5 C18 10.5, 15 10.5, 12.5 14 Z" fill="#9d174d" />
          {/* Eyes */}
          <circle cx="17" cy="16.5" r="1.1" fill="#475569" />
          <circle cx="23" cy="16.5" r="1.1" fill="#475569" />
          {/* Smile */}
          <path d="M18 20 Q20 21.5 22 20" stroke="#f43f5e" strokeWidth="1.2" strokeLinecap="round" />
          {/* Earrings */}
          <circle cx="12" cy="18" r="1" fill="#fbbf24" />
          <circle cx="28" cy="18" r="1" fill="#fbbf24" />
        </svg>
      </div>
    );
  }

  // Male Illustrative Avatar
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: '#10b98115',
        border: '1.5px solid #10b98130',
        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        ...style
      }}
      title={`${name || 'Caller'} (Male Customer)`}
    >
      <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background circle */}
        <circle cx="20" cy="20" r="20" fill="#ecfdf5" />
        {/* Shoulders / Shirt */}
        <path d="M7 38 C7 28, 14 25, 20 25 C26 25, 33 28, 33 38 Z" fill="#059669" />
        <path d="M17 25 L20 29 L23 25 Z" fill="#a7f3d0" />
        {/* Neck */}
        <rect x="17" y="19" width="6" height="7" rx="3" fill="#fed7aa" />
        {/* Face */}
        <ellipse cx="20" cy="17" rx="7.5" ry="8.5" fill="#ffedd5" />
        {/* Short Modern Hair */}
        <path d="M12.5 14 C12 7, 28 7, 27.5 14 C26 10, 23 10, 20 10 C17 10, 14 10, 12.5 14 Z" fill="#1e293b" />
        <path d="M12.5 14 C12.5 10, 15 9, 17 9.5 L20 10.5 L23 9.5 C25 9, 27.5 10, 27.5 14 C27.5 14, 28 12, 27 10 C25 7, 15 7, 13 10 C12 12, 12.5 14, 12.5 14 Z" fill="#0f172a" />
        {/* Eyes */}
        <circle cx="17" cy="16.5" r="1.1" fill="#334155" />
        <circle cx="23" cy="16.5" r="1.1" fill="#334155" />
        {/* Smile */}
        <path d="M18 20 Q20 21.5 22 20" stroke="#047857" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
