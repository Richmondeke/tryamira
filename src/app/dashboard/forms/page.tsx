'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';
import { getForms, createForm, getFormSubmissions, publishForm } from '@/app/actions/forms';


export default function Page() {
  const router = useRouter();
  
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showResultsSidebar, setShowResultsSidebar] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  
  // Results details states
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [originUrl, setOriginUrl] = useState('https://heyamira.com');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
    }
    
    async function loadForms() {
      try {
        const res = await getForms();
        if (res.success && res.data) {
          setForms(res.data);
        } else {
          setToast('Failed to fetch forms from database.');
        }
      } catch (err) {
        console.error('loadForms client exception:', err);
        setToast('Database exception occurred. Fallback in play.');
      } finally {
        setLoading(false);
      }
    }
    loadForms();
  }, []);

  const handleCreateForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    
    setLoading(true);
    try {
      const res = await createForm(name);
      if (res.success && res.data) {
        setShowModal(false);
        setToast('Form created as Draft. Publish it when ready.');
        setForms(prev => [res.data, ...prev]);
      } else {
        setToast(res.error || 'Failed to create form.');
      }
    } catch (err) {
      console.error('handleCreateForm client exception:', err);
      setToast('Failed to connect to form service.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (formId: string) => {
    try {
      const res = await publishForm(formId);
      if (res.success) {
        setForms(prev => prev.map(f => f.id === formId ? { ...f, status: 'published', published_at: new Date().toISOString() } : f));
        setToast('Form published! The public link is now live.');
      } else {
        setToast('Failed to publish form.');
      }
    } catch {
      setToast('Error publishing form.');
    }
  };


  const openShareModal = (form: any) => {
    setSelectedForm(form);
    setShowShareModal(true);
  };

  const openResultsModal = async (form: any) => {
    setSelectedForm(form);
    setShowResultsSidebar(true);
    setSelectedSubmission(null);
    setLoadingSubmissions(true);
    
    const res = await getFormSubmissions(form.id);
    if (res.success && res.data) {
      setSubmissions(res.data);
    } else {
      setToast('Failed to query submissions.');
    }
    setLoadingSubmissions(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast('Copied to clipboard!');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      {/* Create Form Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Form">
        <form onSubmit={handleCreateForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '6px' }}>Form Name</label>
            <input required type="text" name="name" style={{ width: '100%', padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} placeholder="e.g., General Inquiry" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '6px' }}>Template</label>
            <select style={{ width: '100%', padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff' }}>
              <option value="standard">Standard Lead Capture</option>
              <option value="real_estate">Real Estate Qualification</option>
              <option value="booking">Meeting Booking</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '13px', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}>
            Create & Edit Fields
          </button>
        </form>
      </Modal>

      {/* Share Link Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title={`Share "${selectedForm?.name}"`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '6px' }}>Direct Link</label>
            <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '8px' }}>Share this link directly with your customers.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input readOnly type="text" value={`${originUrl}/f/${selectedForm?.id || 'demo'}`} style={{ flex: 1, padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', backgroundColor: '#f9fafb', color: '#4b5563' }} />
              <button type="button" onClick={() => copyToClipboard(`${originUrl}/f/${selectedForm?.id || 'demo'}`)} style={{ padding: '0 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}>
                Copy
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '6px' }}>Embed Code</label>
            <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '8px' }}>Paste this iframe snippet into your website's HTML.</p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <textarea readOnly value={`<iframe src="${originUrl}/f/${selectedForm?.id || 'demo'}?embed=true" width="100%" height="500px" frameborder="0"></iframe>`} style={{ flex: 1, padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', backgroundColor: '#f9fafb', color: '#4b5563', resize: 'none', height: '80px', fontFamily: 'monospace' }} />
              <button type="button" onClick={() => copyToClipboard(`<iframe src="${originUrl}/f/${selectedForm?.id || 'demo'}?embed=true" width="100%" height="500px" frameborder="0"></iframe>`)} style={{ padding: '0.65rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}>
                Copy
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Right Slide-over Sidebar Backdrop */}
      {showResultsSidebar && (
        <div 
          onClick={() => setShowResultsSidebar(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(4px)',
            zIndex: 99,
            transition: 'opacity 0.2s ease'
          }}
        />
      )}

      {/* Right Slide-over Sidebar Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: showResultsSidebar ? 0 : '-500px',
        width: '500px',
        height: '100vh',
        backgroundColor: '#ffffff',
        boxShadow: '-4px 0 25px rgba(0,0,0,0.08)',
        borderLeft: '1px solid #e2e8f0',
        zIndex: 100,
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              {selectedSubmission ? 'Submission Details' : `Submissions: ${selectedForm?.name || ''}`}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
              {selectedSubmission 
                ? `Response submitted on ${new Date(selectedSubmission.created_at).toLocaleString()}`
                : `Captured ${submissions.length} active responses`
              }
            </p>
          </div>
          <button 
            onClick={() => {
              if (selectedSubmission) {
                setSelectedSubmission(null);
              } else {
                setShowResultsSidebar(false);
              }
            }}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '18px', cursor: 'pointer', padding: '4px' }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {loadingSubmissions ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
              <div style={{ color: '#64748b', fontSize: '13px' }}>Loading submissions database...</div>
            </div>
          ) : submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: '#94a3b8' }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>📋</span>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>No responses captured yet</div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '6px 0 20px 0', lineHeight: 1.5 }}>
                Share your public link to start automatically capturing customer submissions.
              </p>
              <button 
                onClick={() => { setShowResultsSidebar(false); openShareModal(selectedForm); }} 
                style={{ backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
              >
                Get Share Link
              </button>
            </div>
          ) : selectedSubmission ? (
            /* Submission Detail Viewer */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Back CTA */}
              <button 
                onClick={() => setSelectedSubmission(null)}
                style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#6366f1', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                ← Back to submissions list
              </button>

              {/* Answers Grid */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                  SUBMITTED FORM DATA
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {Object.entries(selectedSubmission.answers || {}).map(([key, val]: any, idx) => {
                    let label = key;
                    if (key === 'firstName') label = 'First Name';
                    else if (key === 'lastName') label = 'Last Name';
                    else if (key === 'email') label = 'Email Address';
                    else if (key === 'phone') label = 'Phone Number';
                    else if (key === 'company') label = 'Company';

                    let renderVal = val;
                    if (Array.isArray(val)) renderVal = val.join(', ');
                    else if (typeof val === 'object') renderVal = JSON.stringify(val);

                    return (
                      <div key={key} style={{ padding: '1rem', borderTop: idx > 0 ? '1px solid #f1f5f9' : 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                        <span style={{ fontSize: '13.5px', color: '#0f172a', fontWeight: 500 }}>{renderVal?.toString() || '—'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Automated AI Follow-up Trigger Ingestion Logs */}
              {selectedSubmission.answers?.phone && (
                <div style={{
                  padding: '1.25rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📞</span>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Automated AI Outbound Call</div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    An outbound telephone call is initiated to **{selectedSubmission.answers.phone}** to follow up and qualify this lead.
                  </p>
                  <button 
                    onClick={() => {
                      const leadName = `${selectedSubmission.answers.firstName || ''} ${selectedSubmission.answers.lastName || ''}`.trim() || selectedSubmission.answers.phone;
                      router.push(`/dashboard/chat/inbox?search=${encodeURIComponent(leadName)}`);
                    }}
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: '#6366f1',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '8px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
                  >
                    View Call Transcript & Logs →
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Submissions List View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '0.25rem' }}>
                Select a submission card below to drill down into detailed responses and follow-up call telemetry.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {submissions.map((sub, i) => {
                  const answers = sub.answers || {};
                  const dateStr = new Date(sub.created_at).toLocaleString();
                  const displayName = `${answers.firstName || ''} ${answers.lastName || ''}`.trim() || answers.email || answers.phone || 'Anonymous Submission';
                  return (
                    <div 
                      key={sub.id || i} 
                      onClick={() => setSelectedSubmission(sub)}
                      style={{ 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px', 
                        padding: '1.25rem', 
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#6366f1' }}>Response #{submissions.length - i}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{dateStr}</span>
                      </div>
                      
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{displayName}</div>
                      
                      {answers.email && (
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>✉</span> {answers.email}
                        </div>
                      )}
                      {answers.phone && (
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <span>📞</span> {answers.phone}
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                        <span style={{ fontSize: '11.5px', color: '#6366f1', fontWeight: 600 }}>View Details →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px', fontFeatureSettings: '"ss01"' }}>Lead Capture Forms</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: 400, fontFeatureSettings: '"ss01"' }}>Create high-converting forms for your AI to share.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.6rem 1.25rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}>
          + Create Form
        </button>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '14px', color: '#334155', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Active Forms</h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
            <div style={{ color: '#64748b', fontSize: '13px' }}>Loading forms database...</div>
          </div>
        ) : forms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📋</div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 0.5rem 0' }}>No active lead capture forms</h4>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 1.5rem 0', maxWidth: '360px', lineHeight: 1.5 }}>
              Create a custom form and share the link with your clients. Submitted responses will be automatically captured as leads in your CRM.
            </p>
            <button onClick={() => setShowModal(true)} style={{ backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.6rem 1.25rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}>
              + Create Your First Form
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFeatureSettings: '"tnum"' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '0 0 1rem 0', fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>FORM NAME</th>
                  <th style={{ padding: '0 0 1rem 0', fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>VIEWS</th>
                  <th style={{ padding: '0 0 1rem 0', fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>SUBMISSIONS</th>
                  <th style={{ padding: '0 0 1rem 0', fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>CONVERSION</th>
                  <th style={{ padding: '0 0 1rem 0', fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => {
                  const views = form.views || 0;
                  const subCount = form.submissions || 0;
                  const convRate = form.conversion_rate !== undefined ? `${form.conversion_rate}%` : (views > 0 ? `${((subCount / views) * 100).toFixed(1)}%` : '0%');
                  const status = form.status || 'published';
                  const statusColor = status === 'draft' ? '#f59e0b' : status === 'archived' ? '#94a3b8' : '#10b981';
                  const statusBg = status === 'draft' ? '#fff7ed' : status === 'archived' ? '#f8fafc' : '#f0fdf4';
                  return (
                    <tr key={form.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1.25rem 0', fontSize: '13px', color: '#0f172a', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {form.name}
                          <span style={{
                            fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '999px',
                            color: statusColor, backgroundColor: statusBg,
                            border: `1px solid ${statusColor}40`,
                          }}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 0', fontSize: '13px', color: '#64748b' }}>{views.toLocaleString()}</td>
                      <td style={{ padding: '1.25rem 0', fontSize: '13px', color: '#64748b' }}>{subCount.toLocaleString()}</td>
                      <td style={{ padding: '1.25rem 0', fontSize: '13px', color: '#15be53', fontWeight: 500 }}>{convRate}</td>
                      <td style={{ padding: '1.25rem 0', fontSize: '13px' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 500 }} onClick={() => router.push(`/dashboard/forms/${form.id}`)}>Edit</span>
                          {status === 'draft' && (
                            <span style={{ color: '#10b981', cursor: 'pointer', fontWeight: 500 }} onClick={() => handlePublish(form.id)}>Publish</span>
                          )}
                          <span style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 500 }} onClick={() => openShareModal(form)}>Share</span>
                          <span style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 500 }} onClick={() => openResultsModal(form)}>Results</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
