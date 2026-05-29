'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const allLeads = [
    { name: 'Sarah Smith', email: 'sarah.s@example.com', phone: '+1 (555) 0123', status: 'Hot', score: '98' },
    { name: 'Michael Chen', email: 'michael.c@example.com', phone: '+1 (555) 0124', status: 'Warm', score: '74' },
    { name: 'Elena Rodriguez', email: 'elena.r@example.com', phone: '+1 (555) 0125', status: 'Cold', score: '32' },
    { name: 'James Wilson', email: 'j.wilson@example.com', phone: '+1 (555) 0126', status: 'Warm', score: '65' }
  ];

  const filteredLeads = allLeads.filter(lead => 
    lead.name.toLowerCase().includes(search.toLowerCase()) || 
    lead.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setToast({ message: 'CSV Exported Successfully!', type: 'success' });
    }, 1500);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddModal(false);
    setToast({ message: 'New lead added successfully.', type: 'success' });
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Lead">
        <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Full Name</label>
            <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Email Address</label>
            <input type="email" required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
          </div>
          <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Save Lead</button>
        </form>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Leads CRM</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Manage and export your captured leads.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleExport} disabled={isExporting} style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            + Add Lead
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--stripe-border)', backgroundColor: '#f6f9fc' }}>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: '400px', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--stripe-border)', fontSize: '14px', outline: 'none' }} 
          />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFeatureSettings: '"tnum", "ss01"' }}>
          <thead>
            <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--stripe-border)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>NAME</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>EMAIL</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>PHONE</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>STATUS</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>SCORE</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{lead.name}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-body)' }}>{lead.email}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-body)' }}>{lead.phone}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    backgroundColor: lead.status === 'Hot' ? 'rgba(217,45,32,0.1)' : lead.status === 'Warm' ? 'rgba(247,144,9,0.1)' : '#f6f9fc',
                    color: lead.status === 'Hot' ? '#d92d20' : lead.status === 'Warm' ? '#b54708' : 'var(--stripe-muted)',
                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-navy)' }}>{lead.score}</td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--stripe-muted)' }}>No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
