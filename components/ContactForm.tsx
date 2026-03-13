'use client'

import { useState } from 'react'

interface Lead {
  id: number; date: string; name: string; phone: string; email: string;
  vehicle: string; service: string; notes: string; status: string;
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    fname: '', lname: '', phone: '', email: '',
    vehicle: '', vehicleDetail: '', service: '', notes: ''
  })

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const submit = () => {
    if (!form.fname || !form.lname || !form.phone || !form.vehicle || !form.service) {
      alert('Please fill in all required fields (marked with *).')
      return
    }
    const lead: Lead = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      name: `${form.fname} ${form.lname}`,
      phone: form.phone,
      email: form.email,
      vehicle: form.vehicle + (form.vehicleDetail ? ` · ${form.vehicleDetail}` : ''),
      service: form.service,
      notes: form.notes,
      status: 'new',
    }
    try {
      const existing = JSON.parse(localStorage.getItem('slvc_leads') || '[]')
      localStorage.setItem('slvc_leads', JSON.stringify([lead, ...existing]))
    } catch {}
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="booking-form">
        <div className="form-success" style={{ display: 'block' }}>
          <div className="success-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#B8843A"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
          <h3>Enquiry Sent</h3>
          <p>Thank you! We'll be in touch within 24 hours to discuss your vehicle.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-form">
      <h3 className="form-title">Request a Quote</h3>
      <p className="form-subtitle">Fill in the form and we'll be in touch within 24 hours.</p>

      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input name="fname" placeholder="John" value={form.fname} onChange={handle} />
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input name="lname" placeholder="Smith" value={form.lname} onChange={handle} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Phone Number *</label>
          <input name="phone" type="tel" placeholder="07xxx xxxxxx" value={form.phone} onChange={handle} />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handle} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Vehicle Make & Model *</label>
          <input name="vehicle" placeholder="e.g. BMW 3 Series" value={form.vehicle} onChange={handle} />
        </div>
        <div className="form-group">
          <label>Year / Colour</label>
          <input name="vehicleDetail" placeholder="e.g. 2021 · Mineral White" value={form.vehicleDetail} onChange={handle} />
        </div>
      </div>
      <div className="form-group">
        <label>Service Required *</label>
        <select name="service" value={form.service} onChange={handle}>
          <option value="">— Select a service —</option>
          <option>Full Valet</option>
          <option>Auto Detailing</option>
          <option>Paint Correction</option>
          <option>Ceramic Coating (System X)</option>
          <option>Wheel Restoration / Refurbishment</option>
          <option>SMART Repair (Scratch / Chip / Dent)</option>
          <option>Multiple Services</option>
          <option>Not sure — please advise</option>
        </select>
      </div>
      <div className="form-group">
        <label>Additional Notes</label>
        <textarea name="notes" placeholder="Tell us about your vehicle's condition, specific concerns, or preferred dates…" value={form.notes} onChange={handle} />
      </div>
      <button className="btn-primary" onClick={submit} style={{ width: '100%', justifyContent: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        Send Enquiry
      </button>
    </div>
  )
}
