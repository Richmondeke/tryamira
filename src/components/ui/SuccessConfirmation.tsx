'use client';

interface SuccessConfirmationProps {
  title: string;
  subtitle: string;
  icon?: string;
  features?: string[];
  ctaText: string;
  onCtaClick: () => void;
  secondaryCtaText?: string;
  onSecondaryClick?: () => void;
}

export default function SuccessConfirmation({
  title,
  subtitle,
  icon = '✨',
  features = [],
  ctaText,
  onCtaClick,
  secondaryCtaText,
  onSecondaryClick
}: SuccessConfirmationProps) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '1.5rem 0.5rem 0.5rem 0.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      animation: 'fadeInSuccess 0.4s ease-out'
    }}>
      <style>{`
        @keyframes fadeInSuccess {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleInSuccess {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseSuccess {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @keyframes floatEffect {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }
      `}</style>

      {/* Floating 3D Checkmark indicator with active pulsing glow */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        marginBottom: '1.25rem',
        animation: 'scaleInSuccess 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), pulseSuccess 2s infinite, floatEffect 4s ease-in-out infinite',
        cursor: 'default'
      }}>
        {icon}
      </div>

      <h3 style={{
        fontSize: '16px',
        fontWeight: 700,
        color: 'var(--stripe-navy)',
        margin: '0 0 0.5rem 0',
        letterSpacing: '-0.01em',
        lineHeight: 1.3
      }}>
        {title}
      </h3>
      
      <p style={{
        fontSize: '12.5px',
        color: 'var(--stripe-body)',
        marginBottom: '1.5rem',
        lineHeight: 1.5,
        maxWidth: '340px'
      }}>
        {subtitle}
      </p>

      {/* Summary Checklist Inventory Card */}
      {features && features.length > 0 && (
        <div style={{
          width: '100%',
          backgroundColor: '#f8fafc',
          borderRadius: '6px',
          border: '1px solid var(--stripe-border)',
          padding: '0.85rem 1.1rem',
          marginBottom: '1.75rem',
          textAlign: 'left'
        }}>
          {features.map((feat, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '11.5px',
              color: 'var(--stripe-navy)',
              marginBottom: index === features.length - 1 ? 0 : '0.6rem',
              lineHeight: 1.4
            }}>
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px', marginTop: '-1px' }}>✓</span>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
        <button
          type="button"
          onClick={onCtaClick}
          style={{
            width: '100%',
            padding: '0.65rem 1rem',
            backgroundColor: 'var(--stripe-purple)',
            backgroundImage: 'linear-gradient(135deg, #4caf50, #4f46e5)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.25)',
            transition: 'transform 0.1s ease, filter 0.1s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
        >
          {ctaText}
        </button>

        {secondaryCtaText && onSecondaryClick && (
          <button
            type="button"
            onClick={onSecondaryClick}
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: 'var(--stripe-muted)',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.1s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--stripe-navy)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--stripe-muted)'; }}
          >
            {secondaryCtaText}
          </button>
        )}
      </div>
    </div>
  );
}
