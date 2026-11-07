import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { Brand, SiteHeader } from "../site-header";
import ConsultationForm from "../consultation-form";
import HeraWidget from "../hera-widget";

export const metadata: Metadata = {
  title: "Solicita una consulta gratuita | HEBARO",
  description: "Cuéntanos sobre tu necesidad o proyecto. Nuestro equipo HEBARO se comunicará contigo.",
};

export default function ConsultationPage() {
  return (
    <>
      <div className="consultation-page-header">
        <SiteHeader />
      </div>
      <main className="consultation-page">
        <section className="consultation-page-intro" aria-labelledby="consultation-page-title">
          <p className="consultation-page-eyebrow"><span />HABLEMOS DE TU PROYECTO</p>
          <h1 id="consultation-page-title">Solicita una consulta gratuita</h1>
          <p>Cuéntanos qué proceso quieres mejorar y qué herramientas utilizas hoy. No necesitas tener una solución definida.</p>
        </section>
        <div className="consultation-layout">
          <section className="consultation-card" aria-label="Formulario de consulta">
            <ConsultationForm />
          </section>
          <aside className="consultation-guidance" aria-labelledby="next-steps-title">
            <p className="consultation-guidance-label">EL SIGUIENTE PASO</p>
            <h2 id="next-steps-title">¿Qué ocurre después de enviar?</h2>
            <ol>
              <li><strong>Revisamos tu consulta</strong><p>Leemos lo que necesitas resolver y el contexto de tu negocio.</p></li>
              <li><strong>Te contactamos</strong><p>El equipo de HEBARO se comunica contigo por el email o teléfono que compartas para conocer más.</p></li>
            </ol>
            <div className="consultation-direct">
              <h3>¿Prefieres contactarnos directamente?</h3>
              <a href="mailto:info@hebaro.com"><Mail size={18} aria-hidden="true" /><span>info@hebaro.com</span></a>
              <a href="tel:+19399388323"><Phone size={18} aria-hidden="true" /><span>(939) 938-8323</span></a>
              <p>Centro de Bellas Artes de Caguas, Puerto Rico.</p>
            </div>
          </aside>
        </div>
        <p className="consultation-page-note">HEBARO · TECNOLOGÍA, PERSONAS Y COMUNIDADES</p>
      </main>
      <footer className="consultation-page-footer">
        <div className="consultation-page-footer-inner">
          <Brand footer homeHref="/" />
          <Link href="/">Volver a HEBARO <ArrowUpRight size={15} /></Link>
          <span>PUERTO RICO ES NEGOCIO</span>
        </div>
      </footer>
      <HeraWidget />
    </>
  );
}
