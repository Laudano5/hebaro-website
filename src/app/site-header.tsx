"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, Search, X } from "lucide-react";

const logo = "/public/images/Blanco sin BG-02.png";

export function Brand({ footer = false, homeHref = "#inicio" }: { footer?: boolean; homeHref?: string }) {
  return (
    <a className={`brand${footer ? " brand-footer" : ""}`} href={homeHref} aria-label="HEBARO, inicio">
      <Image className="brand-logo" src={logo} alt="HEBARO" width={2973} height={896} priority={!footer} />
      {footer && <span className="brand-tagline">TECNOLOGÍA · PERSONAS · COMUNIDADES</span>}
    </a>
  );
}

const links = [
  ["Marketplace", "https://hebaro.com/marketplace"],
  ["Soluciones", "/soluciones"],
  ["Capacitación", "/capacitacion"],
  ["Nosotros", "/nosotros"],
  ["Contacto", "/contacto"],
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className={`site-header wrap${scrolled ? " is-scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
      <Brand homeHref={pathname === "/" ? "#inicio" : "/"} />
      <nav className="main-nav" aria-label="Navegación principal">
        {links.map(([label, href]) => <a href={href} key={href} aria-current={pathname === href ? "page" : undefined}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <button className="search-button" aria-label="Buscar" type="button"><Search size={20} /></button>
        <a className="login-button" href="/contacto">Contáctanos</a>
        <button
          className="menu-button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" id="mobile-navigation" aria-label="Navegación móvil">
          {links.map(([label, href]) => <a href={href} key={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="mobile-login" href="/contacto" onClick={() => setMenuOpen(false)}>Contáctanos</a>
        </nav>
      )}
    </header>
  );
}
