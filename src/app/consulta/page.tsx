import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
          <p>Cuéntanos sobre tu necesidad o proyecto. Nuestro equipo revisará la información y se comunicará contigo para conocer más.</p>
        </section>
        <section className="consultation-card" aria-label="Formulario de consulta">
          <ConsultationForm />
        </section>
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
