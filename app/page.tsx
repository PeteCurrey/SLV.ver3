'use client'

import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import ContactForm from '@/components/ContactForm'
import AdminPanel, { DEFAULT_IMAGES, type ImageConfig } from '@/components/AdminPanel'

// ─── SVG ICONS ───────────────────────────────────────────────────────────────

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
  </svg>
)

// ─── IMAGE HOOK ───────────────────────────────────────────────────────────────
// Reads from localStorage on mount (falls back to defaults).
// Re-renders instantly whenever the admin saves a change.
function useImages(): Record<string, string> {
  const buildMap = (list: ImageConfig[]) =>
    Object.fromEntries(list.map(i => [i.id, i.url]))

  const loadFromStorage = (): Record<string, string> => {
    if (typeof window === 'undefined') return buildMap(DEFAULT_IMAGES)
    try {
      const raw = localStorage.getItem('slvc_images')
      if (!raw) return buildMap(DEFAULT_IMAGES)
      const saved: ImageConfig[] = JSON.parse(raw)
      const merged = DEFAULT_IMAGES.map(d => saved.find(s => s.id === d.id) ?? d)
      return buildMap(merged)
    } catch {
      return buildMap(DEFAULT_IMAGES)
    }
  }

  const [images, setImages] = useState<Record<string, string>>(buildMap(DEFAULT_IMAGES))

  useEffect(() => {
    setImages(loadFromStorage())
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ImageConfig[]>).detail
      if (detail) setImages(buildMap(detail))
      else setImages(loadFromStorage())
    }
    window.addEventListener('slvc_images_updated', handler)
    return () => window.removeEventListener('slvc_images_updated', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return images
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Home() {
  const IMAGES = useImages()

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Nav />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <img src={IMAGES.hero} alt="Professional car detailing" loading="eager" />
          <div className="hero-gradient" />
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="eline" />
            <span>Chesterfield&rsquo;s Premier Detailing Centre</span>
          </div>
          <h1>Your car deserves<br />to be <em>extraordinary.</em></h1>
          <p className="hero-sub">
            From a pristine interior valet to multi-stage paint correction and 
            ceramic protection — we restore, protect and perfect, every time.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              Request a Quote
            </a>
            <a href="tel:07804649030" className="btn-outline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              07804 649030
            </a>
          </div>
        </div>

        <div className="hero-stats">
          {[['18+','Years Experience'],['5★','Trustpilot Rating'],['100%','Satisfaction']].map(([n,l]) => (
            <div key={l} className="hero-stat"><div className="num">{n}</div><div className="label">{l}</div></div>
          ))}
        </div>

        <div className="scroll-hint">
          <span>Explore</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        {[
          ['Showroom-Quality Results','Guaranteed every time','M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
          ['System X Certified','Professional ceramic coatings','M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z'],
          ['Chesterfield, Derbyshire','Unit 9, Vanguard Trading Estate','M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'],
          ['No Hidden Costs','Transparent pricing, always','M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z'],
          ['Trusted by 100s','5-star Trustpilot reviews','M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'],
        ].map(([title, sub, path]) => (
          <div key={title} className="trust-item">
            <div className="trust-icon"><svg viewBox="0 0 24 24"><path d={path}/></svg></div>
            <div className="trust-text"><strong>{title}</strong>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── SERVICES ── */}
      <section id="services" className="services">
        <div className="section-header reveal">
          <div className="section-eyebrow"><div className="dash"/><span>What We Do</span><div className="dash"/></div>
          <h2 className="section-title">Services tailored to<br />every <em>standard of care</em></h2>
          <p className="section-lead">From a fresh exterior wash to a full multi-stage paint correction — showroom results at every level.</p>
        </div>

        <div className="services-grid">
          {[
            { n:'01', title:'Full Valet', body:'A thorough interior and exterior clean to restore your vehicle to its best. Ideal for routine maintenance or before a sale. We cover every surface, seal and stitch.',
              icon: <svg className="service-icon" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#B8843A" strokeWidth="1.5"/><path d="M14 28 Q24 18 34 28" stroke="#B8843A" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M10 32 L38 32" stroke="#B8843A" strokeWidth="1.5" strokeLinecap="round"/><circle cx="16" cy="35" r="2.5" stroke="#B8843A" strokeWidth="1.5" fill="none"/><circle cx="32" cy="35" r="2.5" stroke="#B8843A" strokeWidth="1.5" fill="none"/></svg> },
            { n:'02', title:'Auto Detailing', body:'Deep-level cleaning and conditioning of every surface. Clay bar treatment, machine-applied compounds and hand-applied sealants — your car protected inside and out.',
              icon: <svg className="service-icon" viewBox="0 0 48 48" fill="none"><path d="M12 36 L12 20 Q12 12 24 12 Q36 12 36 20 L36 36" stroke="#B8843A" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M8 36 L40 36" stroke="#B8843A" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 24 Q24 20 30 24" stroke="#B8843A" strokeWidth="1.2" strokeLinecap="round" fill="none"/></svg> },
            { n:'03', title:'Paint Correction', body:'Multi-stage machine polishing to remove swirl marks, scratches and oxidation. We restore paint to better-than-new condition — the foundation of all great detailing.',
              icon: <svg className="service-icon" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="#B8843A" strokeWidth="1.5" fill="none"/><circle cx="24" cy="24" r="9" stroke="#B8843A" strokeWidth="1" fill="none" strokeDasharray="2 3"/><path d="M24 8 L24 4 M24 44 L24 40 M8 24 L4 24 M44 24 L40 24" stroke="#B8843A" strokeWidth="1.5" strokeLinecap="round"/><circle cx="24" cy="24" r="3" fill="#B8843A" opacity="0.6"/></svg> },
            { n:'04', title:'Ceramic Coating', body:'System X professional-grade ceramic coatings provide unrivalled gloss, hydrophobic protection and lasting durability. Applied over corrected paint for the ultimate finish.',
              icon: <svg className="service-icon" viewBox="0 0 48 48" fill="none"><path d="M10 38 Q10 30 18 28 Q24 26 30 28 Q38 30 38 38" stroke="#B8843A" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M24 10 L24 28 M16 14 L32 14" stroke="#B8843A" strokeWidth="1.5" strokeLinecap="round"/><circle cx="24" cy="10" r="3" stroke="#B8843A" strokeWidth="1.5" fill="none"/></svg> },
            { n:'05', title:'Wheel Restoration', body:'Diamond cutting, powder coating and full refurbishment of alloy wheels. We also repair kerbing damage, cracked alloys and restore faded or corroded wheels to factory standard.',
              icon: <svg className="service-icon" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="#B8843A" strokeWidth="1.5" fill="none"/><circle cx="24" cy="24" r="8" stroke="#B8843A" strokeWidth="1" fill="none"/><circle cx="24" cy="24" r="3" stroke="#B8843A" strokeWidth="1.5" fill="none"/><path d="M24 8 L24 16 M24 32 L24 40 M8 24 L16 24 M32 24 L40 24" stroke="#B8843A" strokeWidth="1" strokeLinecap="round"/></svg> },
            { n:'06', title:'SMART Repair', body:'Scratch, scuff, stone chip, dent and bumper repairs using app-based colour matching technology. Efficient, cost-effective repairs — only the damaged area, saving you time and money.',
              icon: <svg className="service-icon" viewBox="0 0 48 48" fill="none"><rect x="10" y="16" width="28" height="20" rx="2" stroke="#B8843A" strokeWidth="1.5" fill="none"/><path d="M16 16 L20 10 L28 10 L32 16" stroke="#B8843A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="18" cy="30" r="4" stroke="#B8843A" strokeWidth="1.2" fill="none"/><circle cx="30" cy="30" r="4" stroke="#B8843A" strokeWidth="1.2" fill="none"/></svg> },
          ].map((s, i) => (
            <div key={s.n} className={`service-card reveal delay-${(i%3)+1}`}>
              <div className="service-num">{s.n}</div>
              {s.icon}
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <a href="#contact" className="service-link">Enquire now <ArrowIcon /></a>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about">
        <div className="about-section">
          <div className="about-visual reveal">
            <img className="about-img-main" src={IMAGES.about1} alt="Car detailing professional" />
            <img className="about-img-accent" src={IMAGES.about2} alt="Interior valeting" />
            <div className="about-badge">
              <span className="badge-num">18+</span>
              <span className="badge-text">Years of<br/>Excellence</span>
            </div>
          </div>
          <div className="about-content">
            <div className="section-header reveal">
              <div className="section-eyebrow"><div className="dash"/><span>About SLVC</span></div>
              <h2 className="section-title">A passion for<br/><em>perfection</em></h2>
            </div>
            <p className="about-body reveal">
              At Storforth Lane Valeting Centre, we&rsquo;ve spent over 18 years building a reputation on one thing: 
              results that surpass expectations. Based at the Vanguard Trading Estate in Chesterfield, our team of 
              specialists delivers premium vehicle care to all makes and models — from daily drivers to prestige and classic vehicles.
            </p>
            <p className="about-body reveal">
              We use only the finest professional-grade products and techniques, from System X ceramic coatings to 
              state-of-the-art colour matching technology. No hidden costs, no cutting corners — just meticulous workmanship 
              and a genuine love for the craft.
            </p>
            <div className="about-pillars reveal">
              {['Multi-stage paint correction','System X ceramic coatings','Diamond cut wheel refurb','Interior deep detailing','SMART paint repairs','No hidden costs, ever'].map(p => (
                <div key={p} className="pillar"><div className="pillar-dot"/><span>{p}</span></div>
              ))}
            </div>
            <a href="#contact" className="btn-primary reveal" style={{display:'inline-flex'}}>Book Your Vehicle In</a>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="process">
        <div className="section-header reveal">
          <div className="section-eyebrow">
            <div className="dash" style={{background:'var(--gold)'}}/>
            <span>How It Works</span>
            <div className="dash" style={{background:'var(--gold)'}}/>
          </div>
          <h2 className="section-title">Simple, <em>stress-free</em> booking</h2>
          <p className="section-lead">Getting your vehicle booked in with us is straightforward.</p>
        </div>
        <div className="process-steps">
          {[
            ['1','Get in Touch','Use our enquiry form or call 07804 649030. Tell us what you need and we\'ll advise on the right service.'],
            ['2','Assessment & Quote','We\'ll assess your vehicle\'s condition and provide a clear, itemised quote — no surprises, no hidden extras.'],
            ['3','Work Carried Out','Your vehicle is in expert hands. We work methodically to the highest standard using professional products and techniques.'],
            ['4','Collected, Impressed','Collect a car that looks better than you remember it. We guarantee you\'ll be fully satisfied — or we\'ll make it right.'],
          ].map(([n,h,p], i) => (
            <div key={n} className={`process-step reveal delay-${i+1}`}>
              <div className="step-num">{n}</div>
              <h4>{h}</h4>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="testimonials">
        <div className="section-header reveal">
          <div className="section-eyebrow"><div className="dash"/><span>Customer Reviews</span><div className="dash"/></div>
          <h2 className="section-title">What our customers<br/>say about <em>SLVC</em></h2>
          <p className="section-lead">Don&rsquo;t take our word for it — here&rsquo;s what people who&rsquo;ve trusted us with their vehicles say.</p>
        </div>

        <div className="testimonials-grid">
          {[
            { q: '"Took my car down to SLVC, it came back looking brand new. Very professional — best detailer in Chesterfield by a clear mile. 10/10, wouldn\'t hesitate to recommend."', name: 'James H.', init: 'J' },
            { q: '"What an excellent experience. The ceramic coat was applied in two days and the difference is remarkable. I\'ll be back to have the wheels refurbished — would recommend to anyone."', name: 'Sarah T.', init: 'S' },
            { q: '"Matt did a fantastic job on my Alfa Giulia — the car looks better than when it left the showroom. Brilliant team, brilliant service. Attention to detail makes it all worthwhile."', name: 'Ron W.', init: 'R' },
            { q: '"Very friendly team with excellent communication. If you want a better-than-showroom valet, come here. It will cost, but every single penny is absolutely worth it."', name: 'Karen B.', init: 'K' },
            { q: '"Absolutely blown away. My car was a mess — it now looks brand new. Great friendly service, would definitely use again and recommend to anyone in the Chesterfield area."', name: 'Michelle D.', init: 'M' },
            { q: '"Quick turnaround on a cracked alloy repair after an MOT failure. The chaps couldn\'t have been more helpful — squeezed the fix in despite a busy schedule. Highly recommend."', name: 'Phil A.', init: 'P' },
          ].map((t, i) => (
            <div key={t.name} className={`testimonial-card reveal delay-${(i%3)+1}`}>
              <div className="stars">{Array(5).fill(0).map((_,j) => <StarIcon key={j}/>)}</div>
              <blockquote>{t.q}</blockquote>
              <div className="testimonial-author">
                <div className="author-avatar">{t.init}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-tag">Verified Trustpilot Review</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="trustpilot-bar reveal">
          <span style={{fontFamily:'var(--font-outfit)',fontSize:'0.8rem',fontWeight:600,color:'var(--mid)',letterSpacing:'0.05em'}}>Trustpilot</span>
          <div className="stars" style={{gap:'4px'}}>
            {Array(5).fill(0).map((_,i) => (
              <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#00B67A"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
          </div>
          <div>
            <div className="tp-score">5.0</div>
            <div className="tp-label">Based on 32+ verified reviews</div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className="gallery-section">
        <div className="section-header reveal">
          <div className="section-eyebrow"><div className="dash"/><span>Our Work</span><div className="dash"/></div>
          <h2 className="section-title">Results that<br/>speak for <em>themselves</em></h2>
        </div>
        <div className="gallery-grid reveal">
          {[
            [IMAGES.gallery1, 'Paint Correction'],
            [IMAGES.gallery2, 'Full Valet'],
            [IMAGES.gallery3, 'Interior Detail'],
            [IMAGES.gallery4, 'Wheel Restoration'],
            [IMAGES.gallery5, 'Ceramic Coating'],
          ].map(([src, label]) => (
            <div key={label} className="gallery-item">
              <img src={src} alt={label} />
              <div className="gallery-overlay"><div className="gallery-label">{label}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact-section">
        <div className="contact-info">
          <div className="section-header">
            <div className="section-eyebrow" style={{justifyContent:'flex-start'}}>
              <div className="dash"/>
              <span>Book Your Vehicle In</span>
            </div>
            <h2 className="section-title">Ready to see<br/>the <em>difference?</em></h2>
          </div>

          {[
            { icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              label: 'Find Us', content: <>Unit 9, Vanguard Trading Estate<br/>Britannia Road, Chesterfield<br/>Derbyshire, S40 2TZ</> },
            { icon: 'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z',
              label: 'Call Us', content: <a href="tel:07804649030">07804 649030</a> },
            { icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
              label: 'Email', content: <a href="mailto:info@storforthlanevaleting.com">info@storforthlanevaleting.com</a> },
          ].map(d => (
            <div key={d.label} className="contact-detail reveal">
              <div className="contact-detail-icon"><svg viewBox="0 0 24 24"><path d={d.icon}/></svg></div>
              <div className="contact-detail-text"><strong>{d.label}</strong>{d.content}</div>
            </div>
          ))}

          <div className="opening-hours reveal">
            <h4>Opening Hours</h4>
            {[['Monday – Friday','8:00am – 5:30pm'],['Saturday','9:00am – 3:00pm'],['Sunday','Closed']].map(([d,h]) => (
              <div key={d} className="hours-row"><span>{d}</span><span>{h}</span></div>
            ))}
          </div>
        </div>

        <div className="reveal">
          <ContactForm />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <span className="logo-main">SLVC</span>
            <span className="logo-sub">Storforth Lane Valeting Centre</span>
            <p>Chesterfield&rsquo;s premier auto detailing and valeting centre. 18+ years of showroom-quality results, right here in Derbyshire.</p>
          </div>
          <div className="footer-col">
            <h5>Services</h5>
            {['Full Valet','Auto Detailing','Paint Correction','Ceramic Coating','Wheel Restoration','SMART Repair'].map(s => (
              <a key={s} href="#services">{s}</a>
            ))}
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            {[['About Us','#about'],['Reviews','#testimonials'],['Gallery','#gallery'],['Contact','#contact'],['Gift Vouchers','#']].map(([l,h]) => (
              <a key={l} href={h}>{l}</a>
            ))}
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <a href="tel:07804649030">07804 649030</a>
            <a href="mailto:info@storforthlanevaleting.com">info@storforthlanevaleting.com</a>
            <a href="#">Unit 9, Vanguard Trading Estate<br/>Britannia Road, Chesterfield<br/>S40 2TZ</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Storforth Lane Valeting Centre Ltd · All rights reserved</p>
          <p>
            <a href="#">Privacy Policy</a> &nbsp;·&nbsp;
            <a href="#">Cookie Policy</a> &nbsp;·&nbsp;
            <a href="#">Terms & Conditions</a>
          </p>
        </div>
      </footer>

      <AdminPanel />
    </>
  )
}
