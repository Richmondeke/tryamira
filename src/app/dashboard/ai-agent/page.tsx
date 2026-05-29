'use client';

import { useState } from 'react';
import Toast from '../../../components/ui/Toast';

export default function AIAgentPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<string[]>(['Pricing.pdf']);

  const handleSave = () => {
    setToast('Agent persona updated successfully.');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles([...files, e.dataTransfer.files[0].name]);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>AI Agent Setup</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Configure how your agent behaves and what it knows.</p>
        </div>
        <button onClick={handleSave} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Save Changes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>System Prompt</h3>
            <p style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>Tell the AI who it is and how it should respond.</p>
            <textarea 
              style={{ width: '100%', height: '150px', padding: '1rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '14px', color: 'var(--stripe-navy)', outline: 'none', resize: 'vertical' }}
              defaultValue="You are Amira, a helpful real estate assistant. Always be polite, ask for the user's budget, and try to schedule a viewing."
            />
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Knowledge Base</h3>
            <p style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>Upload PDFs, TXTs, or link your website for the AI to learn from.</p>
            
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{ 
                border: isDragging ? '2px dashed var(--stripe-purple)' : '1px dashed var(--stripe-border)', 
                backgroundColor: isDragging ? 'rgba(83,58,253,0.05)' : '#f9fafb', 
                borderRadius: '6px', 
                padding: '3rem', 
                textAlign: 'center', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ color: 'var(--stripe-purple)', fontSize: '24px', marginBottom: '0.5rem' }}>+</div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Click or drag file to upload</div>
              <div style={{ fontSize: '12px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>PDF, DOCX, TXT (Max 10MB)</div>
            </div>

            {files.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                {files.map((file, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#f6f9fc', borderRadius: '4px', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--stripe-purple)' }}>📄</span>
                    <span style={{ fontSize: '13px', color: 'var(--stripe-navy)', flex: 1 }}>{file}</span>
                    <span style={{ fontSize: '12px', color: 'var(--stripe-success-text)', backgroundColor: 'rgba(21,190,83,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Ready</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Personality</h3>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--stripe-purple)' }} />
              <span style={{ fontSize: '14px', color: 'var(--stripe-navy)' }}>Use emojis naturally 😊</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: 'var(--stripe-purple)' }} />
              <span style={{ fontSize: '14px', color: 'var(--stripe-navy)' }}>Keep responses under 2 sentences</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--stripe-purple)' }} />
              <span style={{ fontSize: '14px', color: 'var(--stripe-navy)' }}>Always capture email first</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
