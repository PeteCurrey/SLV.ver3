'use client'

import { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navClass = scrolled ? 'scrolled' : 'over-hero'

  return (
    <>
      <nav className={navClass}>
        {/* Logo links back to top / home — no separate Home nav item */}
        <a href="/" className="nav-logo">
          <span className="logo-main">SLVC</span>
          <span className="logo-sub">Storforth Lane Valeting Centre</span>
        </a>

        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#testimonials">Reviews</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#contact" className="nav-cta">Book Now</a></li>
        </ul>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        {['services','about','testimonials','gallery','contact'].map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            style={{ animationDelay: `${0.08 + i * 0.08}s` }}
            onClick={() => setMenuOpen(false)}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
      </div>
    </>
  )
}
