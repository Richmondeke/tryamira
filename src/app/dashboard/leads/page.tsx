'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';
import { createClient } from '../../../utils/supabase/client';

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Real Data State
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    
    // Check if we are running with a dummy supabase URL
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('Supabase URL not configured. Showing empty state.');
      setAllLeads([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching leads:', error);
        setAllLeads([]); // Fallback to empty state
      } else {
        setAllLeads(data || []);
      }
    } catch (err) {
      console.error('Exception while fetching leads:', err);
      setAllLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeads = allLeads.filter(lead => 
    lead.name?.toLowerCase().includes(search.toLowerCase()) || 
    lead.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setToast({ message: 'CSV Exported Successfully!', type: 'success' });
    }, 1500);
  };

  const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    const { error } = await supabase.from('leads').insert({
      workspace_id: '11111111-1111-1111-1111-111111111111', // Dummy ID for now, usually fetched from context
      name,
      email,
      phone: '',
      status: 'new',
      source: 'manual',
      score: 50
    });

    if (error) {
      setToast({ message: 'Error adding lead. Check Supabase keys.', type: 'error' });
      setShowAddModal(false);
    } else {
      setToast({ message: 'New lead added successfully to Supabase.', type: 'success' });
      setShowAddModal(false);
      fetchLeads(); // Refresh from DB
    }
  };

  const handleUpdateLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLead) return;
    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as string,
    };

    const { error } = await supabase.from('leads').update(updates).eq('id', selectedLead.id);
    if (error) {
      setToast({ message: 'Error updating lead.', type: 'error' });
    } else {
      setToast({ message: 'Lead updated successfully.', type: 'success' });
      setSelectedLead(null);
      fetchLeads();
    }
    setIsUpdating(false);
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) {
      setToast({ message: 'Error deleting lead.', type: 'error' });
    } else {
      setToast({ message: 'Lead deleted.', type: 'success' });
      setSelectedLead(null);
      fetchLeads();
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Lead">
        <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Full Name</label>
            <input name="name" type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Email Address</label>
            <input name="email" type="email" required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
          </div>
          <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Save Lead</button>
        </form>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Leads CRM</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0 }}>Manage and export your captured leads.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleExport} disabled={isExporting} style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}>
            + Add Lead
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--stripe-border)', backgroundColor: '#f6f9fc' }}>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: '400px', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--stripe-border)', fontSize: '12px', outline: 'none' }} 
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
            {isLoading ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--stripe-muted)', fontSize: '12px' }}>
                  Loading leads from database...
                </td>
              </tr>
            ) : filteredLeads.map((lead, i) => (
              <tr key={i} onClick={() => setSelectedLead(lead)} style={{ borderBottom: '1px solid var(--stripe-border)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{lead.name}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-body)' }}>{lead.email}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-body)' }}>{lead.phone || '-'}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    backgroundColor: lead.status?.toLowerCase() === 'hot' ? 'rgba(217,45,32,0.1)' : lead.status?.toLowerCase() === 'warm' ? 'rgba(247,144,9,0.1)' : '#f6f9fc',
                    color: lead.status?.toLowerCase() === 'hot' ? '#d92d20' : lead.status?.toLowerCase() === 'warm' ? '#b54708' : 'var(--stripe-muted)',
                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500, textTransform: 'capitalize'
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-navy)' }}>{lead.score || 0}</td>
              </tr>
            ))}
            {!isLoading && filteredLeads.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--stripe-muted)' }}>No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Side Panel Overlay */}
      {selectedLead && (
        <>
          <div 
            onClick={() => setSelectedLead(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 999 }} 
          />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', backgroundColor: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 1000, padding: '2rem', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--stripe-navy)', fontWeight: 500 }}>Lead Details</h2>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--stripe-muted)' }}>&times;</button>
            </div>

            <form onSubmit={handleUpdateLead} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Full Name</label>
                <input name="name" type="text" defaultValue={selectedLead.name} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Email Address</label>
                <input name="email" type="email" defaultValue={selectedLead.email} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Phone Number</label>
                <input name="phone" type="text" defaultValue={selectedLead.phone || ''} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Status</label>
                <select name="status" defaultValue={selectedLead.status?.toLowerCase()} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="new">New</option>
                  <option value="cold">Cold</option>
                </select>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', borderTop: '1px solid var(--stripe-border)', paddingTop: '1.5rem' }}>
                <button type="submit" disabled={isUpdating} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: isUpdating ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => handleDeleteLead(selectedLead.id)} style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#d92d20', border: '1px solid #d92d20', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>
                  Delete
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
