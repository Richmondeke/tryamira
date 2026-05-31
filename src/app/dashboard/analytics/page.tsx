import { createClient } from '@/utils/supabase/server';
import { getCurrentUserProfile, isAdmin } from '@/utils/auth';
import CallLogsTable from '@/components/layout/CallLogsTable';

function SVGBarChart({ data, labels, color = '#533afd' }: { data: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...data, 1);
  const width = 600;
  const height = 160;
  const barWidth = Math.floor((width - (data.length - 1) * 8) / data.length);
  const bottomPad = 28;
  const chartH = height - bottomPad;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
      {[0.25, 0.5, 0.75, 1].map((r, i) => (
        <line key={i} x1={0} y1={chartH * (1 - r)} x2={width} y2={chartH * (1 - r)} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
      ))}
      {data.map((v, i) => {
        const barH = Math.max(4, (v / max) * chartH);
        const x = i * (barWidth + 8);
        const y = chartH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} rx={3} fill={color} opacity={0.85} />
            {v > 0 && <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fontSize="10" fill="#64748b">{v}</text>}
            <text x={x + barWidth / 2} y={height - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ value, color = '#533afd', label }: { value: number; color?: string; label: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(value / 100, 1) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
          strokeLinecap="round" transform="rotate(-90 45 45)" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        <text x="45" y="49" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1e293b">{value}%</text>
      </svg>
      <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

async function getVapiCallsForUser(adminView: boolean, assistantIds: string[]) {
  const apiKey = process.env.VAPI_PRIVATE_API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') return [];

  try {
    // Build URL — admin sees all, regular users filter by their assistant IDs
    let url = 'https://api.vapi.ai/call?limit=100';
    if (!adminView && assistantIds.length > 0) {
      url += `&assistantId=${assistantIds[0]}`; // VAPI supports single assistantId filter
    } else if (!adminView && assistantIds.length === 0) {
      return []; // User has no agents yet
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`VAPI ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (err) {
    console.error('[analytics] VAPI fetch error:', err);
    return [];
  }
}

export default async function AnalyticsPage() {
  const profile = await getCurrentUserProfile();
  const adminView = profile?.role === 'admin';

  // Fetch this user's agent assistant IDs from Supabase
  let assistantIds: string[] = [];
  try {
    const supabase = await createClient();
    const { data: agents } = await supabase
      .from('workspace_agents')
      .select('vapi_assistant_id')
      .eq('workspace_id', profile?.workspace_id || profile?.id || '');
    assistantIds = (agents || []).map((a: any) => a.vapi_assistant_id).filter(Boolean);
  } catch { /* no agents yet */ }

  const calls = await getVapiCallsForUser(adminView, assistantIds);
  const totalCalls = calls.length;

  // --- Metrics ---
  const totalSpend = calls.reduce((acc: number, c: any) => acc + (c.cost || 0), 0);
  const validDurations = calls
    .filter((c: any) => c.endedAt && c.startedAt)
    .map((c: any) => new Date(c.endedAt).getTime() - new Date(c.startedAt).getTime());
  const avgDurationMs = validDurations.length
    ? validDurations.reduce((a: number, b: number) => a + b, 0) / validDurations.length
    : 0;
  const avgDurationSec = Math.round(avgDurationMs / 1000);
  const avgDurationFormatted = `${Math.floor(avgDurationSec / 60)}m ${avgDurationSec % 60}s`;
  const successCalls = calls.filter((c: any) => c.analysis?.successEvaluation === true).length;
  const successRate = totalCalls > 0 ? Math.round((successCalls / totalCalls) * 100) : 0;
  const costPerCall = totalCalls > 0 ? totalSpend / totalCalls : 0;

  const endReasonCounts: Record<string, number> = {};
  calls.forEach((c: any) => {
    const r = c.endedReason || c.endReason || 'unknown';
    endReasonCounts[r] = (endReasonCounts[r] || 0) + 1;
  });

  const dayLabels: string[] = [];
  const callsByDay: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dayLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    const count = calls.filter((c: any) => {
      const cd = new Date(c.createdAt || c.startedAt);
      return cd.toDateString() === d.toDateString();
    }).length;
    callsByDay.push(count);
  }

  const durationBuckets = { 'Under 1m': 0, '1–3m': 0, '3–5m': 0, 'Over 5m': 0 };
  validDurations.forEach((ms: number) => {
    const s = ms / 1000;
    if (s < 60) durationBuckets['Under 1m']++;
    else if (s < 180) durationBuckets['1–3m']++;
    else if (s < 300) durationBuckets['3–5m']++;
    else durationBuckets['Over 5m']++;
  });

  const metricCards = [
    { label: 'Total Calls', value: totalCalls.toString(), sub: 'All time via Vapi', color: '#533afd' },
    { label: 'Call Success Rate', value: `${successRate}%`, sub: `${successCalls} of ${totalCalls} succeeded`, color: '#10b981' },
    { label: 'Avg Call Duration', value: totalCalls > 0 ? avgDurationFormatted : '—', sub: 'Per completed call', color: '#f59e0b' },
    { label: 'Total Spend', value: `$${totalSpend.toFixed(2)}`, sub: totalCalls > 0 ? `~$${costPerCall.toFixed(3)} per call` : 'No calls yet', color: '#ef4444' },
  ];

  const hasNoCalls = totalCalls === 0;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 400, color: 'var(--stripe-navy)', margin: '0 0 0.35rem 0', letterSpacing: '-0.5px' }}>
            Is your AI performing well?
          </h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>
            {hasNoCalls
              ? 'No calls recorded yet. Make a test call or configure your AI Agent to see live data.'
              : `Live call performance from your Vapi AI Agents${adminView ? ' (Admin: all workspaces)' : ''}.`}
          </p>
        </div>
        {adminView && (
          <span style={{
            backgroundColor: '#6366f118', color: '#6366f1', fontSize: '11px',
            fontWeight: 600, padding: '4px 10px', borderRadius: '999px',
            border: '1px solid #6366f130'
          }}>
            Admin View — All Agents
          </span>
        )}
      </div>

      {/* Empty state */}
      {hasNoCalls ? (
        <div style={{
          backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px',
          padding: '4rem 2rem', textAlign: 'center', boxShadow: 'var(--stripe-shadow-ambient)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📞</div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>
            No calls yet
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--stripe-body)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Once your AI Agent starts receiving or making calls, all performance data, transcripts, and analytics will appear here automatically.
          </p>
          <a href="/dashboard/ai-agent" style={{
            display: 'inline-block', backgroundColor: '#533afd', color: '#fff',
            padding: '0.6rem 1.25rem', borderRadius: '6px', fontSize: '13px',
            fontWeight: 500, textDecoration: 'none',
          }}>
            Configure AI Agent →
          </a>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {metricCards.map((m, i) => (
              <div key={i} style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
                <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '0.5rem' }}>{m.label}</div>
                <div style={{ fontSize: '26px', fontWeight: 300, color: m.color, letterSpacing: '-1px', marginBottom: '0.4rem', lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Calls Per Day */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 1.25rem 0', fontWeight: 600 }}>Calls Per Day</h3>
            <p style={{ fontSize: '12px', color: 'var(--stripe-muted)', margin: '0 0 1rem 0' }}>Last 7 days — {callsByDay.reduce((a, b) => a + b, 0)} total calls</p>
            <SVGBarChart data={callsByDay} labels={dayLabels} color="#533afd" />
          </div>

          {/* Bottom Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
              <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 1.25rem 0', fontWeight: 600 }}>Call Duration</h3>
              <SVGBarChart data={Object.values(durationBuckets)} labels={Object.keys(durationBuckets)} color="#10b981" />
            </div>
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 600, alignSelf: 'flex-start' }}>Success Rate</h3>
              <DonutChart value={successRate} color="#533afd" label="of calls achieved their goal" />
              <div style={{ display: 'flex', gap: '1rem', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#533afd' }} />
                  <span style={{ color: 'var(--stripe-muted)' }}>Succeeded ({successCalls})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#e2e8f0' }} />
                  <span style={{ color: 'var(--stripe-muted)' }}>Failed ({totalCalls - successCalls})</span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
              <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 1.25rem 0', fontWeight: 600 }}>Why Calls Ended</h3>
              {Object.keys(endReasonCounts).length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--stripe-muted)', textAlign: 'center', paddingTop: '2rem' }}>No data yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(endReasonCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([reason, count]) => {
                    const pct = totalCalls > 0 ? Math.round((count / totalCalls) * 100) : 0;
                    return (
                      <div key={reason}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--stripe-navy)', textTransform: 'capitalize' }}>{reason.replace(/-/g, ' ')}</span>
                          <span style={{ color: 'var(--stripe-muted)', fontWeight: 500 }}>{pct}%</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}>
                          <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#533afd', borderRadius: '3px', opacity: 0.7 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Call Logs Table */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--stripe-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 600 }}>Recent Call Logs</h3>
              <span style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>Showing last {Math.min(calls.length, 20)} of {calls.length}</span>
            </div>
            <CallLogsTable initialCalls={calls} />
          </div>
        </>
      )}
    </div>
  );
}
