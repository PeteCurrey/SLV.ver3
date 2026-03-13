'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Lead {
  id: number
  date: string
  name: string
  phone: string
  email: string
  vehicle: string
  service: string
  notes: string
  status: 'new' | 'contacted' | 'booked' | 'completed'
}

export interface ImageConfig {
  id: string
  label: string
  section: string
  url: string
}

// ─── IMAGE REGISTRY ───────────────────────────────────────────────────────────
// Single source of truth for every image slot on the site.
// page.tsx reads from localStorage first, falling back to these URLs.

export const DEFAULT_IMAGES: ImageConfig[] = [
  {
    id: 'hero',
    label: 'Hero — Full Background',
    section: 'Hero',
    url: 'https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  },
  {
    id: 'about1',
    label: 'About — Main Portrait',
    section: 'About',
    url: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=900&h=1125&fit=crop',
  },
  {
    id: 'about2',
    label: 'About — Accent Inset',
    section: 'About',
    url: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  },
  {
    id: 'gallery1',
    label: 'Gallery — Slot 1 (Large Anchor)',
    section: 'Gallery',
    url: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=1000&q=85&fit=crop',
  },
  {
    id: 'gallery2',
    label: 'Gallery — Slot 2 (Foam Wash)',
    section: 'Gallery',
    url: 'https://images.pexels.com/photos/6873171/pexels-photo-6873171.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  },
  {
    id: 'gallery3',
    label: 'Gallery — Slot 3 (Interior)',
    section: 'Gallery',
    url: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  },
  {
    id: 'gallery4',
    label: 'Gallery — Slot 4 (Wheels)',
    section: 'Gallery',
    url: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  },
  {
    id: 'gallery5',
    label: 'Gallery — Slot 5 (Ceramic Coating)',
    section: 'Gallery',
    url: 'https://images.pexels.com/photos/6873053/pexels-photo-6873053.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  },
]

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────

const LS_LEADS  = 'slvc_leads'
const LS_IMAGES = 'slvc_images'
const MONTHS    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function loadLeads(): Lead[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(LS_LEADS) || '[]') } catch { return [] }
}
function persistLeads(l: Lead[]) { localStorage.setItem(LS_LEADS, JSON.stringify(l)) }

function loadImages(): ImageConfig[] {
  if (typeof window === 'undefined') return DEFAULT_IMAGES
  try {
    const raw = localStorage.getItem(LS_IMAGES)
    if (!raw) return DEFAULT_IMAGES
    const saved: ImageConfig[] = JSON.parse(raw)
    // Keep defaults for any slot not yet in localStorage
    return DEFAULT_IMAGES.map(d => saved.find(s => s.id === d.id) ?? d)
  } catch { return DEFAULT_IMAGES }
}
function persistImages(imgs: ImageConfig[]) {
  localStorage.setItem(LS_IMAGES, JSON.stringify(imgs))
  // Signal the page to re-render with new image URLs
  window.dispatchEvent(new CustomEvent('slvc_images_updated', { detail: imgs }))
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [open, setOpen]           = useState(false)
  const [tab, setTab]             = useState<'dashboard' | 'leads' | 'images' | 'analytics'>('dashboard')
  const [leads, setLeads]         = useState<Lead[]>([])
  const [images, setImages]       = useState<ImageConfig[]>(DEFAULT_IMAGES)

  // Image editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftUrl, setDraftUrl]   = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewStatus, setPreviewStatus] = useState<'idle' | 'ok' | 'error'>('idle')

  const refresh = useCallback(() => {
    setLeads(loadLeads())
    setImages(loadImages())
  }, [])

  useEffect(() => { if (open) refresh() }, [open, refresh])

  // ── Metrics ───────────────────────────────────────────────────────────────
  const total   = leads.length
  const newL    = leads.filter(l => l.status === 'new').length
  const booked  = leads.filter(l => l.status === 'booked' || l.status === 'completed').length
  const conv    = total > 0 ? Math.round((booked / total) * 100) + '%' : '—'

  const svcMap: Record<string,number> = {}
  leads.forEach(l => { svcMap[l.service] = (svcMap[l.service] || 0) + 1 })
  const maxSvc = Math.max(...Object.values(svcMap), 1)

  const monthData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i))
    return { label: MONTHS[d.getMonth()], yr: d.getFullYear(), mo: d.getMonth(), count: 0 }
  })
  leads.forEach(l => {
    const d = new Date(l.id)
    const slot = monthData.find(m => m.yr === d.getFullYear() && m.mo === d.getMonth())
    if (slot) slot.count++
  })
  const maxMo = Math.max(...monthData.map(m => m.count), 1)

  // ── Lead helpers ─────────────────────────────────────────────────────────
  const updateStatus = (id: number, status: Lead['status']) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l)
    persistLeads(updated); setLeads(updated)
  }

  // ── Image helpers ─────────────────────────────────────────────────────────
  const startEdit = (img: ImageConfig) => {
    setEditingId(img.id)
    setDraftUrl(img.url)
    setPreviewUrl(img.url)
    setPreviewStatus('idle')
  }
  const cancelEdit = () => {
    setEditingId(null); setDraftUrl(''); setPreviewUrl(''); setPreviewStatus('idle')
  }
  const triggerPreview = () => {
    if (!draftUrl.trim()) return
    setPreviewUrl(draftUrl.trim())
    setPreviewStatus('idle')
  }
  const saveImage = (id: string) => {
    if (!draftUrl.trim() || previewStatus === 'error') return
    const updated = images.map(img => img.id === id ? { ...img, url: draftUrl.trim() } : img)
    persistImages(updated); setImages(updated); cancelEdit()
  }
  const resetImage = (id: string) => {
    const def = DEFAULT_IMAGES.find(d => d.id === id)
    if (!def) return
    const updated = images.map(img => img.id === id ? { ...img, url: def.url } : img)
    persistImages(updated); setImages(updated)
    if (editingId === id) cancelEdit()
  }
  const isCustom = (img: ImageConfig) => DEFAULT_IMAGES.find(d => d.id === img.id)?.url !== img.url
  const customCount = images.filter(isCustom).length

  const sections = Array.from(new Set(DEFAULT_IMAGES.map(i => i.section)))

  // ── Trigger button (always visible) ──────────────────────────────────────
  const TriggerBtn = () => (
    <button className="admin-trigger" onClick={() => setOpen(true)} title="Admin Panel">
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
    </button>
  )

  if (!open) return <TriggerBtn />

  return (
    <>
      <TriggerBtn />
      <div className="admin-overlay open" onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
        <div className="admin-panel">

          {/* Header */}
          <div className="admin-header">
            <div>
              <h2>SLVC — Admin Panel</h2>
              <p>Dashboard · Leads · Images · Analytics</p>
            </div>
            <button className="admin-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            {(['dashboard','leads','images','analytics'] as const).map(t => (
              <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t === 'images' ? `Images${customCount > 0 ? ` (${customCount})` : ''}` : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="admin-body">

            {/* ══════════ DASHBOARD ══════════ */}
            {tab === 'dashboard' && (
              <div className="admin-section active">
                <div className="metrics-grid">
                  <div className="metric-card"><div className="metric-value">{total}</div><div className="metric-label">Total Enquiries</div><div className="metric-change up">↑ All time</div></div>
                  <div className="metric-card"><div className="metric-value">{newL}</div><div className="metric-label">New This Week</div><div className="metric-change up">↑ Awaiting reply</div></div>
                  <div className="metric-card"><div className="metric-value">{booked}</div><div className="metric-label">Bookings</div><div className="metric-change up">↑ Confirmed</div></div>
                  <div className="metric-card"><div className="metric-value">{conv}</div><div className="metric-label">Conversion Rate</div><div className="metric-change neutral">Enquiry → Booked</div></div>
                </div>

                <div style={{marginBottom:'1.5rem'}}>
                  <div style={{fontFamily:'var(--font-outfit)',fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--mid)',marginBottom:'0.8rem'}}>Enquiries by Service</div>
                  {Object.keys(svcMap).length === 0
                    ? <p style={{fontSize:'0.82rem',color:'var(--mid)',fontWeight:300}}>Breakdowns appear as enquiries come in.</p>
                    : <div className="service-breakdown">
                        {Object.entries(svcMap).sort((a,b)=>b[1]-a[1]).map(([s,n]) => (
                          <div key={s} className="breakdown-item">
                            <div className="breakdown-header">
                              <span className="breakdown-name">{s}</span>
                              <span className="breakdown-pct">{n} ({Math.round((n/total)*100)}%)</span>
                            </div>
                            <div className="breakdown-bar"><div className="breakdown-fill" style={{width:`${(n/maxSvc)*100}%`}}/></div>
                          </div>
                        ))}
                      </div>
                  }
                </div>

                <div>
                  <div style={{fontFamily:'var(--font-outfit)',fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--mid)',marginBottom:'0.8rem'}}>Recent Enquiries</div>
                  {leads.length === 0
                    ? <div className="no-leads"><span className="no-leads-icon">📋</span>No enquiries yet.</div>
                    : <table className="leads-table">
                        <thead><tr><th>Date</th><th>Name</th><th>Service</th><th>Status</th></tr></thead>
                        <tbody>
                          {leads.slice(0,5).map(l => (
                            <tr key={l.id}>
                              <td>{l.date}</td>
                              <td style={{fontWeight:500}}>{l.name}</td>
                              <td>{l.service}</td>
                              <td><span className={`status-badge status-${l.status}`}>{l.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  }
                </div>

                {/* Image status quick-link */}
                <div style={{marginTop:'2rem',padding:'1.25rem',background:'var(--pearl)',borderLeft:'3px solid var(--gold)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontFamily:'var(--font-cormorant)',fontSize:'1rem',fontWeight:500,color:'var(--navy)',marginBottom:'0.2rem'}}>Site Images</div>
                    <p style={{fontSize:'0.78rem',color:'var(--mid)',fontWeight:300,margin:0}}>
                      {images.length} slots · {customCount > 0 ? `${customCount} customised` : 'all using defaults'}
                    </p>
                  </div>
                  <button onClick={() => setTab('images')} style={{fontFamily:'var(--font-outfit)',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--gold)',background:'none',border:'none',cursor:'pointer'}}>
                    Manage →
                  </button>
                </div>
              </div>
            )}

            {/* ══════════ LEADS ══════════ */}
            {tab === 'leads' && (
              <div className="admin-section active">
                <div className="leads-header">
                  <h3>All Enquiries</h3>
                  <span className="leads-count">{total} {total === 1 ? 'lead' : 'leads'}</span>
                </div>
                <div style={{overflowX:'auto'}}>
                  {leads.length === 0
                    ? <div className="no-leads"><span className="no-leads-icon">📋</span>No enquiries yet.</div>
                    : <table className="leads-table">
                        <thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>Service</th><th>Vehicle</th><th>Status</th></tr></thead>
                        <tbody>
                          {leads.map(l => (
                            <tr key={l.id}>
                              <td>{l.date}</td>
                              <td style={{fontWeight:500}}>{l.name}<br/><span style={{color:'var(--mid)',fontWeight:300,fontSize:'0.72rem'}}>{l.email}</span></td>
                              <td>{l.phone}</td>
                              <td>{l.service}</td>
                              <td>{l.vehicle}</td>
                              <td>
                                <select className="status-select" value={l.status} onChange={e => updateStatus(l.id, e.target.value as Lead['status'])}>
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="booked">Booked</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  }
                </div>
              </div>
            )}

            {/* ══════════ IMAGES ══════════ */}
            {tab === 'images' && (
              <div className="admin-section active">
                <div className="leads-header">
                  <h3>Image Manager</h3>
                  <span className="leads-count">{images.length} slots · {customCount} custom</span>
                </div>

                <p style={{fontSize:'0.82rem',color:'var(--mid)',fontWeight:300,lineHeight:1.7,marginBottom:'2rem'}}>
                  Every image on the site is listed below, grouped by section. Paste any direct image URL — Unsplash, Pexels, Cloudinary, or your own CDN — preview it, then hit <strong style={{fontWeight:600,color:'var(--navy)'}}>Save &amp; Apply</strong>. Changes take effect immediately without redeploying.
                </p>

                {sections.map(section => (
                  <div key={section} style={{marginBottom:'2.5rem'}}>
                    {/* Section heading */}
                    <div style={{fontFamily:'var(--font-outfit)',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem',paddingBottom:'0.5rem',borderBottom:'1px solid var(--border)'}}>
                      {section}
                    </div>

                    {images.filter(img => img.section === section).map(img => {
                      const custom   = isCustom(img)
                      const editing  = editingId === img.id

                      return (
                        <div key={img.id} style={{background:'var(--pearl)',marginBottom:'1rem',overflow:'hidden',border:'1px solid var(--border)'}}>

                          {/* ── Slot row ── */}
                          <div style={{display:'flex',alignItems:'stretch'}}>
                            {/* Thumbnail */}
                            <div style={{width:'110px',minHeight:'80px',flexShrink:0,background:'var(--light)',overflow:'hidden',position:'relative'}}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.url}
                                alt={img.label}
                                style={{width:'100%',height:'100%',objectFit:'cover',display:'block',minHeight:'80px'}}
                                onError={e => { (e.target as HTMLImageElement).style.opacity='0.15' }}
                              />
                              {custom && (
                                <div style={{position:'absolute',top:4,right:4,background:'var(--gold)',color:'#fff',fontSize:'0.52rem',fontWeight:700,letterSpacing:'0.08em',padding:'2px 5px',textTransform:'uppercase'}}>
                                  Custom
                                </div>
                              )}
                            </div>

                            {/* Info + actions */}
                            <div style={{flex:1,padding:'0.85rem 1.1rem',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                              <div>
                                <div style={{fontFamily:'var(--font-outfit)',fontSize:'0.82rem',fontWeight:600,color:'var(--navy)',marginBottom:'0.25rem'}}>{img.label}</div>
                                <div style={{fontFamily:'monospace',fontSize:'0.65rem',color:'var(--mid)',wordBreak:'break-all',lineHeight:1.5}}>
                                  {img.url.length > 90 ? img.url.slice(0,90)+'…' : img.url}
                                </div>
                              </div>
                              {!editing && (
                                <div style={{display:'flex',gap:'0.5rem',marginTop:'0.65rem',flexWrap:'wrap'}}>
                                  <button onClick={() => startEdit(img)} style={{fontFamily:'var(--font-outfit)',fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--white)',background:'var(--navy)',border:'none',padding:'0.35rem 0.85rem',cursor:'pointer'}}>
                                    Change Image
                                  </button>
                                  {custom && (
                                    <button onClick={() => resetImage(img.id)} style={{fontFamily:'var(--font-outfit)',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--mid)',background:'none',border:'1px solid var(--border)',padding:'0.35rem 0.85rem',cursor:'pointer'}}>
                                      Reset Default
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* ── Edit panel (expands inline) ── */}
                          {editing && (
                            <div style={{borderTop:'1px solid var(--border)',padding:'1.25rem',background:'var(--white)'}}>
                              <div style={{fontFamily:'var(--font-outfit)',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--navy)',marginBottom:'0.5rem'}}>New Image URL</div>

                              {/* URL input row */}
                              <div style={{display:'flex',gap:'0.5rem',marginBottom:'0.8rem'}}>
                                <input
                                  type="url"
                                  value={draftUrl}
                                  onChange={e => setDraftUrl(e.target.value)}
                                  placeholder="https://images.unsplash.com/photo-... or https://images.pexels.com/photos/..."
                                  style={{flex:1,border:'1.5px solid var(--light)',padding:'0.6rem 0.8rem',fontFamily:'monospace',fontSize:'0.75rem',color:'var(--navy)',outline:'none',background:'var(--white)',borderRadius:0}}
                                  onKeyDown={e => { if (e.key === 'Enter') triggerPreview() }}
                                />
                                <button onClick={triggerPreview} style={{fontFamily:'var(--font-outfit)',fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--white)',background:'var(--mid)',border:'none',padding:'0 1rem',cursor:'pointer',whiteSpace:'nowrap'}}>
                                  Preview
                                </button>
                              </div>

                              {/* Live preview panel */}
                              {previewUrl && (
                                <div style={{marginBottom:'1rem'}}>
                                  <div style={{fontFamily:'var(--font-outfit)',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--mid)',marginBottom:'0.4rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                                    Preview
                                    {previewStatus === 'ok'    && <span style={{color:'#22A06B'}}>✓ Image loaded</span>}
                                    {previewStatus === 'error' && <span style={{color:'#E34935'}}>✗ Could not load — check URL</span>}
                                  </div>
                                  <div style={{width:'100%',height:'200px',background:'var(--light)',overflow:'hidden'}}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={previewUrl}
                                      alt="Preview"
                                      onLoad={() => setPreviewStatus('ok')}
                                      onError={() => setPreviewStatus('error')}
                                      style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Tips */}
                              <div style={{fontSize:'0.72rem',color:'var(--mid)',fontWeight:300,lineHeight:1.7,marginBottom:'1rem',padding:'0.75rem 0.9rem',background:'var(--pearl)',borderLeft:'3px solid var(--gold)'}}>
                                <strong style={{fontWeight:600,color:'var(--navy)'}}>Good sources:</strong>{' '}
                                Unsplash (<code>images.unsplash.com</code>), Pexels (<code>images.pexels.com</code>), or upload to Cloudinary / ImgBB and paste the direct link. Make sure the URL ends in a recognised image extension or includes image query params.
                              </div>

                              {/* Action buttons */}
                              <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                                <button
                                  onClick={() => saveImage(img.id)}
                                  disabled={!draftUrl.trim() || previewStatus === 'error'}
                                  style={{fontFamily:'var(--font-outfit)',fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--white)',background:(!draftUrl.trim()||previewStatus==='error')?'var(--light)':'var(--gold)',border:'none',padding:'0.6rem 1.5rem',cursor:(!draftUrl.trim()||previewStatus==='error')?'not-allowed':'pointer',transition:'background 0.2s'}}
                                >
                                  Save &amp; Apply
                                </button>
                                <button onClick={cancelEdit} style={{fontFamily:'var(--font-outfit)',fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--mid)',background:'none',border:'1px solid var(--border)',padding:'0.6rem 1.2rem',cursor:'pointer'}}>
                                  Cancel
                                </button>
                                {custom && (
                                  <button onClick={() => resetImage(img.id)} style={{fontFamily:'var(--font-outfit)',fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#E34935',background:'none',border:'1px solid rgba(227,73,53,0.3)',padding:'0.6rem 1.2rem',cursor:'pointer'}}>
                                    Reset to Default
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* ══════════ ANALYTICS ══════════ */}
            {tab === 'analytics' && (
              <div className="admin-section active">
                <div style={{marginBottom:'2rem'}}>
                  <div style={{fontFamily:'var(--font-outfit)',fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--mid)',marginBottom:'0.8rem'}}>Monthly Enquiry Volume</div>
                  <div className="chart-container">
                    {monthData.map((m,i) => (
                      <div key={i} className="chart-bar-wrap">
                        <div className="chart-bar" style={{height:`${Math.max((m.count/maxMo)*140,4)}px`}}/>
                        <div className="chart-label">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="metrics-grid">
                  <div className="metric-card"><div className="metric-value">—</div><div className="metric-label">Page Views</div><div className="metric-change neutral">Connect GA4</div></div>
                  <div className="metric-card"><div className="metric-value">—</div><div className="metric-label">Avg. Session</div><div className="metric-change neutral">Connect GA4</div></div>
                  <div className="metric-card"><div className="metric-value">—</div><div className="metric-label">Mobile %</div><div className="metric-change neutral">Connect GA4</div></div>
                  <div className="metric-card"><div className="metric-value">{total}</div><div className="metric-label">Form Submissions</div><div className="metric-change up">↑ This site</div></div>
                </div>
                <div style={{marginTop:'2rem',padding:'1.5rem',background:'var(--pearl)',borderLeft:'3px solid var(--gold)'}}>
                  <div style={{fontFamily:'var(--font-cormorant)',fontSize:'1.1rem',fontWeight:500,color:'var(--navy)',marginBottom:'0.5rem'}}>Connect Full Analytics</div>
                  <p style={{fontSize:'0.82rem',color:'var(--mid)',fontWeight:300,lineHeight:1.7}}>
                    Add your Google Analytics 4 tracking snippet to <code>app/layout.tsx</code> for full page views, traffic sources, and user journey data.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
