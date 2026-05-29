'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

export default function Page() {
  const router = useRouter();
  
  const [forms, setForms] = useState([
    { id: 1, name: 'Real Estate Inquiry', views: 4521, submissions: 892, conversion: '19.7%' },
    { id: 2, name: 'Contact Us Support', views: 1204, submissions: 154, conversion: '12.8%' }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleCreateForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const newId = Date.now();
    
    setForms([
      { id: newId, name, views: 0, submissions: 0, conversion: '0%' },
      ...forms
    ]);
    
    setShowModal(false);
    router.push(`/dashboard/forms/${newId}`);
  };

  const openShareModal = (form: any) => {
    setSelectedForm(form);
    setShowShareModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast('Copied to clipboard!');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Form">
        <form onSubmit={handleCreateForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '6px' }}>Form Name</label>
            <input required type="text" name="name" style={{ width: '100%', padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }} placeholder="e.g., General Inquiry" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '6px' }}>Template</label>
            <select style={{ width: '100%', padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }}>
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

      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title={`Share "${selectedForm?.name}"`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '6px' }}>Direct Link</label>
            <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '8px' }}>Share this link directly with your customers.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input readOnly type="text" value={`https://heyamira.com/f/${selectedForm?.id || 'demo'}`} style={{ flex: 1, padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', backgroundColor: '#f9fafb', color: '#4b5563' }} />
              <button type="button" onClick={() => copyToClipboard(`https://heyamira.com/f/${selectedForm?.id || 'demo'}`)} style={{ padding: '0 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, transition: 'background 0.2s' }}
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
              <textarea readOnly value={`<iframe src="https://heyamira.com/f/${selectedForm?.id || 'demo'}?embed=true" width="100%" height="500px" frameborder="0"></iframe>`} style={{ flex: 1, padding: '0.65rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', backgroundColor: '#f9fafb', color: '#4b5563', resize: 'none', height: '80px', fontFamily: 'monospace' }} />
              <button type="button" onClick={() => copyToClipboard(`<iframe src="https://heyamira.com/f/${selectedForm?.id || 'demo'}?embed=true" width="100%" height="500px" frameborder="0"></iframe>`)} style={{ padding: '0.65rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}>
                Copy
              </button>
            </div>
          </div>
        </div>
      </Modal>

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
              {forms.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    No forms created yet. Build your first form to capture more leads.
                  </td>
                </tr>
              ) : (
                forms.map((form) => (
                  <tr key={form.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 0', fontSize: '13px', color: '#0f172a', fontWeight: 500 }}>{form.name}</td>
                    <td style={{ padding: '1.25rem 0', fontSize: '13px', color: '#64748b' }}>{form.views.toLocaleString()}</td>
                    <td style={{ padding: '1.25rem 0', fontSize: '13px', color: '#64748b' }}>{form.submissions.toLocaleString()}</td>
                    <td style={{ padding: '1.25rem 0', fontSize: '13px', color: '#15be53' }}>{form.conversion}</td>
                    <td style={{ padding: '1.25rem 0', fontSize: '13px' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }} onClick={() => router.push(`/dashboard/forms/${form.id}`)} onMouseOver={(e) => e.currentTarget.style.color = '#4f46e5'} onMouseOut={(e) => e.currentTarget.style.color = '#6366f1'}>Edit</span>
                        <span style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }} onClick={() => openShareModal(form)} onMouseOver={(e) => e.currentTarget.style.color = '#4f46e5'} onMouseOut={(e) => e.currentTarget.style.color = '#6366f1'}>Share</span>
                        <span style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }} onClick={() => setToast(`Viewing ${form.submissions} submissions for ${form.name}`)} onMouseOver={(e) => e.currentTarget.style.color = '#4f46e5'} onMouseOut={(e) => e.currentTarget.style.color = '#6366f1'}>Results</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
