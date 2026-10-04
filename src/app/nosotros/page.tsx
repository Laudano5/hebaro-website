import type { Metadata } from "next";
import { ArrowRight, Compass, HeartHandshake, Lightbulb, Puzzle, Zap, Code2, Workflow, GraduationCap, Eye, Users, Handshake, TrendingUp, Network } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "../site-header";
import SiteFooter from "../site-footer";
import HeraWidget from "../hera-widget";
import { ConsultationLink, InternalPageHero, SectionHeading } from "../internal-page-components";

import { PuertoRicoNetwork, ConnectionMotif, PathDiagram } from "./about-visuals";
import "./about.css";

export const metadata: Metadata = {
  title: "Nosotros | HEBARO",
  description: "Conoce la visión de HEBARO: tecnología con propósito, capacitación y conexiones construidas desde Puerto Rico.",
};

const principles = [
  [Puzzle, "Tecnología útil", "La tecnología debe resolver problemas reales."],
  [Lightbulb, "Innovación con propósito", "Adoptamos nuevas ideas cuando crean valor, no simplemente porque son nuevas."],
  [Compass, "Desarrollo local", "Creemos en fortalecer capacidades, negocios y oportunidades desde Puerto Rico."],
  [HeartHandshake, "Relaciones a largo plazo", "Buscamos construir soluciones y relaciones que puedan evolucionar junto a nuestros clientes."],
] as const;

export default function AboutPage() {
  return (
    <>
      <div className="internal-header-band"><SiteHeader /></div>
      <main className="about-page">
        <InternalPageHero
          variant="about"
          eyebrow="HEBARO LLC"
          title={<>Tecnología con propósito.<br /><em>Construida desde Puerto Rico.</em></>}
          description="HEBARO es una empresa puertorriqueña de tecnología creada para ayudar a personas, negocios y organizaciones a crecer mediante tecnología, conocimiento y nuevas oportunidades."
          visual={<PuertoRicoNetwork />}
        />

        <section className="about-intro-section">
          <div className="wrap about-intro-grid">
            <div className="about-statement"><p className="internal-eyebrow"><span />QUIÉNES SOMOS</p><h2>Construimos tecnología.<br /><em>Creamos conexiones.</em></h2></div>
            <div className="about-intro-copy">
              <p>HEBARO combina soluciones tecnológicas, capacitación y una plataforma digital diseñada para conectar oportunidades.</p>
              <p>Trabajamos para que empresas y organizaciones puedan utilizar la tecnología de forma práctica, mientras construimos herramientas que fortalecen el ecosistema empresarial.</p>
            </div>
          </div>
        </section>

        <section className="about-vision-section">
          <div className="wrap about-vision-inner">
            <ConnectionMotif />
            <div><p className="internal-eyebrow"><span />NUESTRA VISIÓN</p><h2>Creemos en lo que Puerto Rico puede construir.</h2><p>Creemos que Puerto Rico puede desarrollar, adoptar y exportar tecnología capaz de transformar la manera en que trabajamos, emprendemos y hacemos negocios.</p><ul className="about-vision-ideas">{([[Lightbulb, "Más innovación"], [TrendingUp, "Más oportunidades"], [GraduationCap, "Más talento local"], [Network, "Más impacto regional"]] as const).map(([Icon, label]) => <li key={label}><Icon size={19} strokeWidth={1.5} aria-hidden="true" />{label}</li>)}</ul></div>
          </div>
        </section>

        <section className="about-paths-section">
          <div className="wrap">
            <SectionHeading eyebrow="HEBARO LLC" title="Una empresa. Dos formas de ayudarte." />
            <div className="about-path-grid">
              <article className="about-path about-path-tech">
                <p className="internal-eyebrow"><span />SOLUCIONES TECNOLÓGICAS</p>
                <PathDiagram variant="solutions" /><h3>Transforma cómo trabajas.</h3>
                <p>IA, automatización, software, integración de sistemas y capacitación para organizaciones que quieren transformar cómo trabajan.</p>
                <ul className="about-capabilities">{([[Zap, "Automatización"], [Code2, "Software a la medida"], [Workflow, "Integración de sistemas"], [GraduationCap, "Capacitación"]] as const).map(([Icon, label]) => <li key={label}><Icon size={18} aria-hidden="true" />{label}</li>)}</ul>
                <Link href="/soluciones">Explorar soluciones <ArrowRight size={17} /></Link>
              </article>
              <article className="about-path about-path-market">
                <p className="internal-eyebrow"><span />HEBARO MARKETPLACE</p>
                <PathDiagram variant="marketplace" /><h3>Conecta con oportunidades.</h3>
                <p>Un espacio digital para conectar productos, servicios, talento y negocios.</p>
                <ul className="about-capabilities">{([[Eye, "Visibilidad para tu negocio"], [Users, "Conexiones con clientes y aliados"], [Handshake, "Oportunidades de colaboración"], [TrendingUp, "Crecimiento de Puerto Rico"]] as const).map(([Icon, label]) => <li key={label}><Icon size={18} aria-hidden="true" />{label}</li>)}</ul>
                <a href="https://hebaro.com/marketplace">Entrar al Marketplace <ArrowRight size={17} /></a>
              </article>
            </div>
          </div>
        </section>

        <section className="internal-section principles-section">
          <div className="wrap">
            <SectionHeading eyebrow="NUESTROS PRINCIPIOS" title="Lo que guía nuestro trabajo." />
            <div className="principles-grid">
              {principles.map(([Icon, title, description], index) => (
                <article className="principle-card" key={title}><span className="principle-number">0{index + 1}</span><Icon size={22} strokeWidth={1.8} aria-hidden="true"/><h3>{title}</h3><p>{description}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="company-identity-section">
          <div className="wrap company-identity-inner">
            <div><p className="internal-eyebrow"><span />IDENTIDAD EMPRESARIAL</p><h2>Propiedad de veteranos y personas con discapacidades.</h2></div>
            <div className="identity-statements"><p>Veteran-Owned Business</p><p>Disabled-Owned Business</p></div>
          </div>
        </section>

        <section className="internal-final-cta">
          <div className="wrap internal-final-cta-inner">
            <div><p className="internal-eyebrow"><span />HEBARO · PUERTO RICO</p><h2>Construyamos lo próximo.</h2><p>Si tienes una idea, un proceso que quieres mejorar o un reto tecnológico, queremos conocerlo.</p></div>
            <div className="internal-final-actions"><ConsultationLink /></div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <HeraWidget />
    </>
  );
}
