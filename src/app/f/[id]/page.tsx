'use client';

import React, { useState, useEffect } from 'react';
import { getFormById, submitFormAnswer, incrementFormViews } from '@/app/actions/forms';

export default function PublicFormPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Detect if embedded in an iframe to remove backgrounds and margins
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      setIsEmbed(search.get('embed') === 'true');
    }
  }, []);

  useEffect(() => {
    async function loadForm() {
      // 1. Fetch form config
      const res = await getFormById(params.id);
      if (res.success && res.data) {
        setForm(res.data);
        // 2. Increment views securely in background
        incrementFormViews(params.id);
      } else {
        setError(res.error || 'Failed to locate lead capture form.');
      }
      setLoading(false);
    }
    loadForm();
  }, [params.id]);

  const handleInputChange = (field: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    const current = answers[fieldId] || [];
    let updated;
    if (checked) {
      updated = [...current, option];
    } else {
      updated = current.filter((o: string) => o !== option);
    }
    handleInputChange(fieldId, updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const res = await submitFormAnswer(params.id, answers);
    setSubmitting(false);
    
    if (res.success) {
      setSubmitted(true);
    } else {
      alert(`Error submitting form: ${res.error || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ color: '#475569', fontSize: '14px', fontWeight: 500, marginTop: '12px' }}>Loading form...</div>
        </div>
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f8fafc', padding: '1.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ maxWidth: '400px', width: '100%', backgroundColor: '#ffffff', borderRadius: '12px', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '40px' }}>⚠️</span>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: '12px 0 6px 0' }}>Form Unavailable</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.5 }}>{error || 'This form does not exist or has been deactivated.'}</p>
          <a href="/" style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}>Powered by Amira Voice AI</a>
        </div>
      </div>
    );
  }

  const config = form.config || {};
  const brandColor = config.color || '#6366f1';

  if (submitted) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: isEmbed ? '100%' : '100vh', 
        backgroundColor: isEmbed ? 'transparent' : '#f8fafc', 
        padding: isEmbed ? '1rem' : '1.5rem',
        fontFamily: 'Inter, system-ui, sans-serif' 
      }}>
        <div style={{ 
          maxWidth: '440px', 
          width: '100%', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          padding: '3rem 2rem', 
          textAlign: 'center', 
          boxShadow: isEmbed ? 'none' : '0 10px 30px rgba(0,0,0,0.04)', 
          border: isEmbed ? 'none' : '1px solid #e2e8f0',
          animation: 'fadeUp 0.4s ease-out'
        }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 1.5rem auto' }}>
            ✓
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px 0' }}>Submission Successful</h2>
          <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            {config.successMessage || 'Thank you for your response! We have captured your inquiry.'}
          </p>
          <a href="#" onClick={(e) => { e.preventDefault(); setSubmitted(false); setAnswers({}); }} style={{ fontSize: '12.5px', color: brandColor, textDecoration: 'none', fontWeight: 600 }}>
            Submit Another Response
          </a>
        </div>
        <style jsx global>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: isEmbed ? '100%' : '100vh', 
      backgroundColor: isEmbed ? 'transparent' : '#f8fafc', 
      padding: isEmbed ? '0.25rem' : '2.5rem 1.5rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '460px', 
        backgroundColor: '#ffffff', 
        borderRadius: isEmbed ? '0' : '12px', 
        padding: isEmbed ? '1rem 0.5rem' : '2.5rem', 
        boxShadow: isEmbed ? 'none' : '0 8px 30px rgba(0,0,0,0.03)', 
        border: isEmbed ? 'none' : '1px solid #e2e8f0' 
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>{config.title || form.name}</h1>
        {config.description && (
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 2rem 0', lineHeight: 1.5 }}>{config.description}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Standard Fields Group */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {config.fields?.firstName && (
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>
                  First Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  value={answers.firstName || ''} 
                  onChange={(e) => handleInputChange('firstName', e.target.value)} 
                  style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px', outline: 'none' }} 
                  placeholder="Jane" 
                />
              </div>
            )}
            
            {config.fields?.lastName && (
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>
                  Last Name
                </label>
                <input 
                  type="text" 
                  value={answers.lastName || ''} 
                  onChange={(e) => handleInputChange('lastName', e.target.value)} 
                  style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px', outline: 'none' }} 
                  placeholder="Smith" 
                />
              </div>
            )}
          </div>

          {config.fields?.email && (
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input 
                required 
                type="email" 
                value={answers.email || ''} 
                onChange={(e) => handleInputChange('email', e.target.value)} 
                style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px', outline: 'none' }} 
                placeholder="jane@example.com" 
              />
            </div>
          )}

          {config.fields?.phone && (
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>
                Phone Number <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input 
                required 
                type="tel" 
                value={answers.phone || ''} 
                onChange={(e) => handleInputChange('phone', e.target.value)} 
                style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px', outline: 'none' }} 
                placeholder="+234 803 000 0000" 
              />
            </div>
          )}

          {config.fields?.company && (
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>
                Company Name
              </label>
              <input 
                type="text" 
                value={answers.company || ''} 
                onChange={(e) => handleInputChange('company', e.target.value)} 
                style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px', outline: 'none' }} 
                placeholder="Acme Corp" 
              />
            </div>
          )}

          {/* Render Custom Fields */}
          {config.customFields?.map((field: any) => (
            <div key={field.id}>
              <label style={{ display: 'block', fontSize: '12.5px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>
                {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
              </label>
              
              {field.type === 'text' && (
                <input 
                  required={field.required} 
                  type="text" 
                  value={answers[field.id] || ''} 
                  onChange={(e) => handleInputChange(field.id, e.target.value)} 
                  style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px', outline: 'none' }} 
                />
              )}
              
              {field.type === 'textarea' && (
                <textarea 
                  required={field.required} 
                  rows={3} 
                  value={answers[field.id] || ''} 
                  onChange={(e) => handleInputChange(field.id, e.target.value)} 
                  style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px', outline: 'none', resize: 'vertical' }} 
                />
              )}

              {field.type === 'select' && (
                <select 
                  required={field.required} 
                  value={answers[field.id] || ''} 
                  onChange={(e) => handleInputChange(field.id, e.target.value)} 
                  style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px', outline: 'none', backgroundColor: '#ffffff' }}
                >
                  <option value="">Select an option...</option>
                  {field.options?.map((opt: string, i: number) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {field.type === 'radio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {field.options?.map((opt: string, i: number) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13.5px', color: '#334155', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name={field.id} 
                        required={field.required} 
                        checked={answers[field.id] === opt} 
                        onChange={() => handleInputChange(field.id, opt)} 
                        style={{ cursor: 'pointer' }} 
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {field.options?.map((opt: string, i: number) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13.5px', color: '#334155', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={(answers[field.id] || []).includes(opt)} 
                        onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)} 
                        style={{ cursor: 'pointer' }} 
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'date' && (
                <input 
                  required={field.required} 
                  type="date" 
                  value={answers[field.id] || ''} 
                  onChange={(e) => handleInputChange(field.id, e.target.value)} 
                  style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px', outline: 'none', backgroundColor: '#ffffff' }} 
                />
              )}

              {field.type === 'file' && (
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '6px', padding: '1.25rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '13px', color: brandColor, fontWeight: 600 }}>Click to upload file</span>
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>PDF, PNG, JPG up to 10MB</span>
                    <input 
                      type="file" 
                      required={field.required} 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleInputChange(field.id, file.name);
                      }} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                  {answers[field.id] && (
                    <div style={{ fontSize: '11px', color: '#10b981', marginTop: '6px', fontWeight: 500 }}>✓ Uploaded: {answers[field.id]}</div>
                  )}
                </div>
              )}
            </div>
          ))}

          <button 
            type="submit" 
            disabled={submitting}
            style={{ 
              marginTop: '0.75rem', 
              width: '100%', 
              padding: '0.8rem', 
              backgroundColor: brandColor, 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: submitting ? 'wait' : 'pointer', 
              boxShadow: `0 4px 12px ${brandColor}25`,
              transition: 'opacity 0.2s',
              opacity: submitting ? 0.75 : 1
            }}
          >
            {submitting ? 'Submitting Responses...' : config.buttonText || 'Submit'}
          </button>
        </form>
        
        {!isEmbed && (
          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <a href="/" style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
              Powered by Amira Voice AI
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
