import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Workflow, Store } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "../site-header";
import SiteFooter from "../site-footer";
import HeraWidget from "../hera-widget";
import { InternalPageHero, ConsultationLink } from "../internal-page-components";
import { PuertoRicoNetwork } from "./about-visuals";
import "./about.css";

export const metadata: Metadata = {
  title: "Nosotros | HEBARO",
  description: "HEBARO LLC: tecnología, automatización y conexiones desde Caguas, Puerto Rico.",
};

export default function AboutPage() {
  return (
    <>
      <div className="internal-header-band"><SiteHeader /></div>
      <main className="about-page about-page-compact">
        <InternalPageHero variant="about" eyebrow="HEBARO LLC · CAGUAS, PUERTO RICO"
          title={<>Tecnología con propósito.<br /><em>Construida desde Puerto Rico.</em></>}
          description="Ayudamos a negocios y organizaciones a simplificar su trabajo con automatización, software, integración de sistemas y capacitación. También conectamos oportunidades a través de nuestro Marketplace."
          visual={<PuertoRicoNetwork />}>
          <ConsultationLink />
        </InternalPageHero>

        <section className="about-compact-vision" aria-labelledby="about-vision-title">
          <div className="wrap">
            <div className="about-circuit" aria-hidden="true">
              <svg viewBox="0 0 360 120" focusable="false">
                <defs><linearGradient id="about-signal"><stop stopColor="#65c5cc"/><stop offset="1" stopColor="#d6bf9f"/></linearGradient></defs>
                <g fill="none" stroke="url(#about-signal)" strokeWidth="1.5"><path d="M0 30H85L115 60H150M0 90H85L115 60M210 60H245L275 30H360M245 60L275 90H360M180 0V35M180 85V120"/></g>
                <rect x="150" y="30" width="60" height="60" rx="14" fill="#031f24" stroke="#d6bf9f"/>
                <path d="M166 45V75M194 45V75M166 60H194" fill="none" stroke="#d6bf9f" strokeWidth="4"/>
                <g fill="#8edce0"><circle cx="85" cy="30" r="4"/><circle cx="85" cy="90" r="4"/><circle cx="275" cy="30" r="4"/><circle cx="275" cy="90" r="4"/></g>
              </svg>
            </div>
            <div><p className="internal-eyebrow"><span />NUESTRA VISIÓN</p><h2 id="about-vision-title">Que más negocios puedan aprovechar la tecnología que se construye en Puerto Rico.</h2></div>
          </div>
        </section>

        <section className="about-compact-paths" aria-label="Cómo podemos ayudarte">
          <div className="wrap">
            <article><Workflow size={28} aria-hidden="true"/><div><h2>Simplifica tu operación.</h2><p>Automatización, software e integraciones para atender necesidades concretas de tu negocio.</p><Link href="/soluciones">Explorar soluciones <ArrowRight size={17} aria-hidden="true"/></Link></div></article>
            <article><Store size={28} aria-hidden="true"/><div><h2>Conecta con oportunidades.</h2><p>Un espacio digital para productos, servicios, talento y negocios.</p><a href="https://marketplace.hebaro.com">Ir al Marketplace <ArrowRight size={17} aria-hidden="true"/></a></div></article>
          </div>
        </section>

        <section className="about-local-section" aria-labelledby="about-local-title">
          <div className="wrap about-local-grid">
            <div className="about-local-card">
              <p className="internal-eyebrow"><span />CERCA DE TU NEGOCIO</p>
              <h2 id="about-local-title">Hablemos desde Caguas.</h2>
              <p>Estamos en el Centro de Bellas Artes de Caguas, Puerto Rico.</p>
              <a href="mailto:info@hebaro.com">info@hebaro.com <ArrowRight size={17} aria-hidden="true" /></a>
              <a href="tel:+19399388323">(939) 938-8323 <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
            <div className="about-approach">
              <p className="internal-eyebrow"><span />NUESTRO ENFOQUE</p>
              <h2>Primero el proceso.<br />Después, la tecnología.</h2>
              <p>Tecnología útil, innovación con propósito y relaciones que puedan crecer contigo.</p>
              <ol>
                <li><span>01</span><div><h3>Entender tu operación</h3><p>Qué haces hoy y dónde se repite el trabajo.</p></div></li>
                <li><span>02</span><div><h3>Identificar qué simplificar</h3><p>Elegir herramientas según la necesidad, no la tendencia.</p></div></li>
                <li><span>03</span><div><h3>Definir el siguiente paso</h3><p>Conversar sobre necesidades y alcance antes de avanzar.</p></div></li>
              </ol>
              <ConsultationLink />
            </div>
          </div>
        </section>

        <section className="internal-final-cta about-business-identity" aria-labelledby="business-identity-title">
          <div className="wrap internal-final-cta-inner">
            <div>
              <p className="internal-eyebrow"><span />HEBARO · IDENTIDAD EMPRESARIAL</p>
              <h2 id="business-identity-title">Service-Disabled Veteran-Owned<br /><em>Small Business.</em></h2>
              <p>HEBARO combina experiencia, tecnología y ejecución<br className="identity-desktop-break" /> para crear soluciones con impacto real.</p>
            </div>
            <Image className="about-certification-logo" src="/public/images/sba-sdvosb-certified.png" alt="SBA, U.S. Small Business Administration: Service-Disabled Veteran-Owned Certified" width={876} height={1092} sizes="(max-width: 800px) 100px, 130px" />
          </div>
        </section>
      </main>
      <SiteFooter businessIdentity="Service-Disabled Veteran-Owned Small Business (SDVOSB)" />
      <HeraWidget />
    </>
  );
}
