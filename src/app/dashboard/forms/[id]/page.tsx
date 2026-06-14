'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';
import { getAgents } from '@/app/actions/agent';
import { getFormById, saveForm } from '@/app/actions/forms';

type CustomField = {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file';
  label: string;
  required: boolean;
  options: string[];
};

export default function FormBuilderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  const [formName, setFormName] = useState('Contact Us');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originUrl, setOriginUrl] = useState('https://heyamira.com');
  
  const [formConfig, setFormConfig] = useState({
    title: 'Contact Us',
    description: 'Please fill out the form below and we will get back to you shortly.',
    buttonText: 'Submit Inquiry',
    color: '#4caf50',
    fields: {
      firstName: true,
      lastName: true,
      email: true,
      phone: false,
      company: false,
    },
    customFields: [] as CustomField[],
    successMessage: 'Thank you for your inquiry! We will be in touch soon.',
    agentTriggerId: '',
    integrationSequence: '',
  });

  const [agents, setAgents] = useState<any[]>([]);
  
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashSearch, setSlashSearch] = useState('');
  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0 });
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const availableIntegrations = [
    { id: 'hubspot', name: 'HubSpot', active: true, icon: '🧲' },
    { id: 'salesforce', name: 'Salesforce', active: false, icon: '☁️' },
    { id: 'zendesk', name: 'Zendesk', active: true, icon: '🎧' },
    { id: 'make', name: 'Make.com', active: true, icon: '⚙️' },
    { id: 'zapier', name: 'Zapier', active: false, icon: '⚡' },
    { id: 'slack', name: 'Slack', active: true, icon: '💬' },
  ];

  const handleSequenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setFormConfig({ ...formConfig, integrationSequence: val });

    const cursorIdx = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursorIdx);
    
    // Check if we are currently typing a slash command
    const slashIndex = textBeforeCursor.lastIndexOf('/');
    if (slashIndex !== -1 && !textBeforeCursor.slice(slashIndex).includes(' ') && !textBeforeCursor.slice(slashIndex).includes('\\n')) {
      const search = textBeforeCursor.slice(slashIndex + 1).toLowerCase();
      setSlashSearch(search);
      setSlashMenuOpen(true);

      // Rough approximation for cursor position (could be improved with a library like get-caret-coordinates)
      if (textareaRef.current) {
        setCursorPos({ top: 20, left: 10 }); 
      }
    } else {
      setSlashMenuOpen(false);
    }
  };

  const insertIntegration = (integrationName: string, active: boolean) => {
    if (!active) {
      setToast(`Integration '${integrationName}' is not connected. Please connect it first.`);
      setSlashMenuOpen(false);
      return;
    }

    const val = formConfig.integrationSequence;
    const cursorIdx = textareaRef.current?.selectionStart || val.length;
    const textBeforeCursor = val.slice(0, cursorIdx);
    const textAfterCursor = val.slice(cursorIdx);
    
    const slashIndex = textBeforeCursor.lastIndexOf('/');
    if (slashIndex !== -1) {
      const newBefore = textBeforeCursor.slice(0, slashIndex);
      const newText = `${newBefore}[${integrationName}] ${textAfterCursor}`;
      setFormConfig({ ...formConfig, integrationSequence: newText });
      
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = newBefore.length + integrationName.length + 3;
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          textareaRef.current.focus();
        }
      }, 0);
    }
    
    setSlashMenuOpen(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
    }
    
    async function loadData() {
      try {
        const [formRes, agentsRes] = await Promise.all([
          getFormById(params.id),
          getAgents()
        ]);
        
        if (formRes.success && formRes.data) {
          setFormName(formRes.data.name);
          if (formRes.data.config) {
            setFormConfig(prev => ({
              ...prev,
              ...formRes.data.config
            }));
          }
        }
        
        if (agentsRes.success && agentsRes.data) {
          setAgents(agentsRes.data);
        }
      } catch (err) {
        console.error('Failed to load builder data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [params.id]);

  const [showShareModal, setShowShareModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New Custom Field State
  const [showNewField, setShowNewField] = useState(false);
  const [newField, setNewField] = useState<Partial<CustomField>>({ type: 'text', label: '', required: false, options: [] });
  const [newOption, setNewOption] = useState('');

  const toggleField = (field: keyof typeof formConfig.fields) => {
    setFormConfig({
      ...formConfig,
      fields: {
        ...formConfig.fields,
        [field]: !formConfig.fields[field]
      }
    });
  };

  const addCustomField = () => {
    if (!newField.label) return;
    const fieldToAdd: CustomField = {
      id: Date.now().toString(),
      type: newField.type as any,
      label: newField.label,
      required: !!newField.required,
      options: newField.options || []
    };
    
    setFormConfig({
      ...formConfig,
      customFields: [...formConfig.customFields, fieldToAdd]
    });
    
    // Reset
    setShowNewField(false);
    setNewField({ type: 'text', label: '', required: false, options: [] });
    setNewOption('');
  };

  const removeCustomField = (id: string) => {
    setFormConfig({
      ...formConfig,
      customFields: formConfig.customFields.filter(f => f.id !== id)
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await saveForm(params.id, formName, formConfig);
      if (res.success) {
        setToast('Form saved and published successfully!');
        setShowShareModal(true);
      } else {
        setToast((res as any).error || 'Failed to save form config.');
      }
    } catch (err: any) {
      setToast('Connection error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast('Copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)', width: '100%', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #4caf50', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ color: '#475569', fontSize: '14px', fontWeight: 500, marginTop: '12px' }}>Loading form builder...</div>
        </div>
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', margin: '-2rem', overflow: 'hidden' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => { setShowShareModal(false); router.push('/dashboard/forms'); }} title={`Share Form`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '6px' }}>Direct Link</label>
            <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '8px' }}>Share this link directly with your customers.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input readOnly type="text" value={`${originUrl}/f/${params.id}`} style={{ flex: 1, padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', backgroundColor: '#f9fafb', color: '#4b5563' }} />
              <button type="button" onClick={() => copyToClipboard(`${originUrl}/f/${params.id}`)} style={{ padding: '0 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Copy</button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '6px' }}>Embed Code</label>
            <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '8px' }}>Paste this iframe snippet into your website's HTML.</p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <textarea readOnly value={`<iframe src="${originUrl}/f/${params.id}?embed=true" width="100%" height="500px" frameborder="0"></iframe>`} style={{ flex: 1, padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', backgroundColor: '#f9fafb', color: '#4b5563', resize: 'none', height: '80px', fontFamily: 'monospace' }} />
              <button type="button" onClick={() => copyToClipboard(`<iframe src="${originUrl}/f/${params.id}?embed=true" width="100%" height="500px" frameborder="0"></iframe>`)} style={{ padding: '0.65rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Copy</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Left Panel - Controls */}
      <div style={{ width: '360px', backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <button onClick={() => router.push('/dashboard/forms')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', padding: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ← Back to Forms
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#0f172a', margin: 0 }}>Form Builder</h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0 0' }}>Customize your lead capture form.</p>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* General Settings */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#334155', margin: '0 0 1rem 0' }}>General</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 500, marginBottom: '4px' }}>Internal Form Name</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} placeholder="e.g. Real Estate Inquiry" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 500, marginBottom: '4px' }}>Form Title</label>
                <input type="text" value={formConfig.title} onChange={(e) => setFormConfig({ ...formConfig, title: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 500, marginBottom: '4px' }}>Description</label>
                <textarea value={formConfig.description} onChange={(e) => setFormConfig({ ...formConfig, description: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', resize: 'vertical' }} rows={2} />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: 0 }} />

          {/* Standard Fields */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#334155', margin: '0 0 1rem 0' }}>Standard Fields</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { key: 'firstName', label: 'First Name' },
                { key: 'lastName', label: 'Last Name' },
                { key: 'email', label: 'Email Address' },
                { key: 'phone', label: 'Phone Number' },
                { key: 'company', label: 'Company Name' },
              ].map((field) => (
                <label key={field.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formConfig.fields[field.key as keyof typeof formConfig.fields]} onChange={() => toggleField(field.key as keyof typeof formConfig.fields)} style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '13px', color: '#475569' }}>{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: 0 }} />

          {/* Custom Fields */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#334155', margin: 0 }}>Custom Fields</h3>
              {!showNewField && (
                <button onClick={() => setShowNewField(true)} style={{ background: 'none', border: 'none', color: formConfig.color, fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>+ Add Field</button>
              )}
            </div>

            {formConfig.customFields.map(field => (
              <div key={field.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>{field.label} {field.required && '*'}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>{field.type}</div>
                </div>
                <button onClick={() => removeCustomField(field.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer' }}>&times;</button>
              </div>
            ))}

            {showNewField && (
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '2px' }}>Field Label</label>
                  <input type="text" value={newField.label} onChange={(e) => setNewField({...newField, label: e.target.value})} style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="e.g. What is your role?" />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '2px' }}>Field Type</label>
                  <select value={newField.type} onChange={(e) => setNewField({...newField, type: e.target.value as any})} style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }}>
                    <option value="text">Short Text</option>
                    <option value="textarea">Paragraph</option>
                    <option value="select">Dropdown</option>
                    <option value="radio">Multiple Choice (Single Answer)</option>
                    <option value="checkbox">Checkboxes (Multiple Answers)</option>
                    <option value="date">Date Picker</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>

                {['select', 'radio', 'checkbox'].includes(newField.type || '') && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '2px' }}>Options</label>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      <input type="text" value={newOption} onChange={(e) => setNewOption(e.target.value)} style={{ flex: 1, padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="Add option" />
                      <button onClick={() => { if(newOption) { setNewField({...newField, options: [...(newField.options||[]), newOption]}); setNewOption(''); } }} style={{ padding: '0 0.5rem', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Add</button>
                    </div>
                    {newField.options && newField.options.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {newField.options.map((opt, i) => (
                          <span key={i} style={{ fontSize: '10px', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {opt} <button onClick={() => setNewField({...newField, options: newField.options!.filter((_, idx) => idx !== i)})} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '12px', lineHeight: 1 }}>&times;</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginTop: '4px' }}>
                  <input type="checkbox" checked={newField.required} onChange={(e) => setNewField({...newField, required: e.target.checked})} />
                  <span style={{ fontSize: '11px', color: '#475569' }}>Required Field</span>
                </label>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={addCustomField} style={{ flex: 1, backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem', fontSize: '12px', cursor: 'pointer' }}>Add</button>
                  <button onClick={() => setShowNewField(false)} style={{ flex: 1, backgroundColor: 'transparent', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.5rem', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: 0 }} />

          {/* Styling */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#334155', margin: '0 0 1rem 0' }}>Styling & Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 500, marginBottom: '4px' }}>Button Text</label>
                <input type="text" value={formConfig.buttonText} onChange={(e) => setFormConfig({ ...formConfig, buttonText: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 500, marginBottom: '4px' }}>Brand Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="color" value={formConfig.color} onChange={(e) => setFormConfig({ ...formConfig, color: e.target.value })} style={{ width: '36px', height: '36px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                  <span style={{ fontSize: '13px', color: '#475569' }}>{formConfig.color}</span>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: 0 }} />

          {/* Automations */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#334155', margin: '0 0 1rem 0' }}>Automations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 500, marginBottom: '4px' }}>Trigger Agent on Submit</label>
                <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>Select an AI agent to automatically reach out to leads when they submit this form.</p>
                <select 
                  value={formConfig.agentTriggerId} 
                  onChange={(e) => setFormConfig({ ...formConfig, agentTriggerId: e.target.value })} 
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff' }}
                >
                  <option value="">None (Just collect lead)</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 500, marginBottom: '4px' }}>Integration Sequence (Prompt)</label>
                <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>Describe what should happen when the form is submitted. Type <strong style={{color: '#4caf50'}}>/</strong> to reference your connected apps.</p>
                <div style={{ position: 'relative' }}>
                  <textarea 
                    ref={textareaRef}
                    value={formConfig.integrationSequence} 
                    onChange={handleSequenceChange} 
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', resize: 'vertical', minHeight: '100px', backgroundColor: '#fff', color: '#0f172a' }} 
                    placeholder="e.g. When the form is submitted, send the lead to /HubSpot and alert the team on /Slack..."
                  />
                  {slashMenuOpen && (
                    <div style={{ 
                      position: 'absolute', top: '100%', left: 0, marginTop: '4px',
                      width: '100%', maxHeight: '200px', overflowY: 'auto',
                      backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', zIndex: 50 
                    }}>
                      <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#64748b', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>AVAILABLE APPS</div>
                      {availableIntegrations.filter(i => i.name.toLowerCase().includes(slashSearch)).map(integration => (
                        <div 
                          key={integration.id}
                          onClick={() => insertIntegration(integration.name, integration.active)}
                          style={{ 
                            padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                            backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', opacity: integration.active ? 1 : 0.6
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>{integration.icon}</span>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{integration.name}</span>
                          </div>
                          {!integration.active && <span style={{ fontSize: '10px', color: '#ef4444', backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '12px', fontWeight: 500 }}>Disconnected</span>}
                        </div>
                      ))}
                      {availableIntegrations.filter(i => i.name.toLowerCase().includes(slashSearch)).length === 0 && (
                        <div style={{ padding: '8px 12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>No apps match "{slashSearch}"</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div style={{ flex: 1, backgroundColor: '#f8fafc', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Live Preview</span>
          <button onClick={handleSave} disabled={isSaving} style={{ backgroundColor: '#4caf50', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.6rem 1.25rem', fontSize: '13px', fontWeight: 500, cursor: isSaving ? 'wait' : 'pointer', opacity: isSaving ? 0.75 : 1 }}>
            {isSaving ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          {/* The Form Preview */}
          <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0f172a', margin: '0 0 0.5rem 0' }}>{formConfig.title}</h2>
            {formConfig.description && (
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>{formConfig.description}</p>
            )}

            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={(e) => e.preventDefault()}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {formConfig.fields.firstName && (
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>First Name <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} placeholder="Jane" />
                  </div>
                )}
                {formConfig.fields.lastName && (
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>Last Name</label>
                    <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} placeholder="Smith" />
                  </div>
                )}
              </div>

              {formConfig.fields.email && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>Email Address <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="email" style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} placeholder="jane@example.com" />
                </div>
              )}

              {formConfig.fields.phone && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>Phone Number</label>
                  <input type="tel" style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} placeholder="(555) 000-0000" />
                </div>
              )}

              {formConfig.fields.company && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>Company</label>
                  <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} placeholder="Acme Inc." />
                </div>
              )}

              {/* Render Custom Fields */}
              {formConfig.customFields.map((field) => (
                <div key={field.id}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>
                    {field.label} {field.required && <span style={{color: '#ef4444'}}>*</span>}
                  </label>
                  
                  {field.type === 'text' && (
                    <input type="text" required={field.required} style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
                  )}
                  
                  {field.type === 'textarea' && (
                    <textarea required={field.required} rows={3} style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
                  )}

                  {field.type === 'select' && (
                    <select required={field.required} style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#fff' }}>
                      <option value="">Select an option...</option>
                      {field.options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}

                  {field.type === 'radio' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {field.options.map((opt, i) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', color: '#334155', cursor: 'pointer' }}>
                          <input type="radio" name={field.id} required={field.required} value={opt} style={{ cursor: 'pointer' }} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'checkbox' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {field.options.map((opt, i) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', color: '#334155', cursor: 'pointer' }}>
                          <input type="checkbox" value={opt} style={{ cursor: 'pointer' }} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'date' && (
                    <input type="date" required={field.required} style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#fff', color: '#334155' }} />
                  )}

                  {field.type === 'file' && (
                    <div style={{ border: '2px dashed #cbd5e1', borderRadius: '6px', padding: '1.5rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                      <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '13px', color: '#4caf50', fontWeight: 500 }}>Upload a file</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>PNG, JPG, PDF up to 10MB</span>
                        <input type="file" required={field.required} style={{ display: 'none' }} />
                      </label>
                    </div>
                  )}
                </div>
              ))}

              <button type="button" style={{ marginTop: '0.5rem', width: '100%', padding: '0.85rem', backgroundColor: formConfig.color, color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                {formConfig.buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
