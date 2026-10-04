import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Laptop, Network, Settings, UsersRound } from "lucide-react";
import { SiteHeader } from "../site-header";
import SiteFooter from "../site-footer";
import HeraWidget from "../hera-widget";
import { ConsultationLink } from "../internal-page-components";
import styles from "./solutions.module.css";

export const metadata: Metadata = {
  title: "Soluciones Tecnológicas | HEBARO",
  description: "Automatizamos procesos, desarrollamos software y conectamos sistemas para que tu negocio avance.",
};

const services = [
  { icon: Settings, title: "Automatización", copy: <>Simplificamos procesos<br />y reducimos trabajo manual.</> },
  { icon: Laptop, title: "Software Personalizado", copy: <>Construimos tecnología<br />alrededor de tu operación.</> },
  { icon: Network, title: "Integración de Sistemas", copy: <>Conectamos herramientas,<br />plataformas y datos.</> },
  { icon: UsersRound, title: "Experiencias Digitales", copy: <>Creamos experiencias simples<br />para usuarios y clientes.</> },
];
const methodology = [
  { title: "Entendemos", copy: "Tu operación, tus procesos y lo que necesitas resolver." },
  { title: "Diseñamos", copy: "La solución adecuada para tu necesidad." },
  { title: "Construimos", copy: "Desarrollamos, integramos y ponemos la solución en marcha." },
];
const applications = [
  { title: "Automatización", image: "/public/images/Flujo Digital de Procesos Completo.png", alt: "Flujo digital de solicitud, revisión, aprobación y proceso completado.", copy: <>Procesos más simples.<br />Equipos más productivos.</> },
  { title: "Software Personalizado", image: "/public/images/Dashboard SaaS oscuro HEBARO.png", alt: "Dashboard HEBARO con indicadores y herramientas de gestión.", copy: <>Herramientas hechas para tu negocio.<br />Sin limitaciones.</> },
  { title: "Integración de Sistemas", image: "/public/images/HEBARO Systems Integration Hub.png", alt: "HEBARO conecta plataformas y servicios en un ecosistema integrado.", copy: <>Todo tu ecosistema trabajando junto.</> },
];

export default function SolutionsPage() {
  return <>
    <div className="internal-header-band"><SiteHeader /></div>
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="solutions-title">
        <div className={styles.heroPhoto}><Image src="/public/images/Modern Corporate Conference Interior.png" alt="Sala de conferencias moderna de HEBARO con vista de la ciudad y pantallas tecnológicas." fill priority quality={90} sizes="(max-width: 700px) 100vw, 60vw" /></div>
        <div className={`${styles.wrap} ${styles.heroInner}`}><div className={styles.heroCopy}>
          <p className={styles.eyebrow}>SOLUCIONES TECNOLÓGICAS</p>
          <h1 id="solutions-title">Tecnología diseñada<br />alrededor de <em>tu<br className={styles.desktopBreak} /> negocio.</em></h1>
          <p className={styles.heroDescription}>Automatizamos procesos, desarrollamos software<br className={styles.desktopBreak} /> y conectamos sistemas para que tu negocio avance.</p>
          <a className="button" href="#capacidades">Explora nuestras soluciones <ArrowRight size={17} aria-hidden="true" /></a>
          <p className={styles.signature}>IDEAS · TECNOLOGÍA · RESULTADOS</p>
        </div></div>
      </section>
      <section className={styles.services} id="capacidades" aria-labelledby="services-title"><div className={styles.wrap}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>LO QUE HACEMOS</p><h2 id="services-title">Soluciones para<br />transformar cómo trabajas.</h2></div><p>Combinamos estrategia, tecnología y experiencia para crear soluciones que generan impacto real en tu negocio.</p></div>
        <div className={styles.serviceColumns}>{services.map(({ icon: Icon, title, copy }, index) => <article className={styles.service} key={title}><div className={styles.serviceSymbol}><Icon size={42} strokeWidth={1.6} aria-hidden="true" /><span>0{index + 1}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>
      <section className={styles.method} aria-labelledby="method-title"><div className={`${styles.wrap} ${styles.methodInner}`}>
        <div className={styles.methodCopy}><p className={styles.eyebrow}>NUESTRA METODOLOGÍA</p><h2 id="method-title">No empezamos con la tecnología. <em>Empezamos con el problema.</em></h2><p>La tecnología correcta comienza entendiendo lo que realmente necesitas resolver.</p></div>
        <ol className={styles.steps}>{methodology.map(({ title, copy }, index) => <li key={title}><span className={styles.stepNumber}>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>
      <section className={styles.portfolio} aria-labelledby="portfolio-title"><div className={styles.wrap}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>TECNOLOGÍA EN ACCIÓN</p><h2 id="portfolio-title">Tecnología aplicada a necesidades reales.</h2></div><p>Soluciones que simplifican, conectan y generan oportunidades.</p></div>
        <div className={styles.portfolioColumns}>{applications.map(({ title, image, alt, copy }) => <article key={title}><div className={styles.portfolioPhoto}><Image src={image} alt={alt} fill quality={90} sizes="(max-width: 700px) 100vw, (max-width: 1000px) 46vw, (max-width: 1500px) 30vw, 440px" /></div><div className={styles.portfolioCopy}><h3>{title}</h3><p>{copy}</p><a href="/consulta" aria-label={`Consultar sobre ${title}`}><ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></a></div></article>)}</div>
      </div></section>
      <section className={styles.cta} aria-labelledby="cta-title">
        <Image className={styles.ctaPhoto} src="/public/images/Golden Hour Coastal Cliffs.png" alt="" fill quality={90} sizes="100vw" />
        <div className={`${styles.wrap} ${styles.ctaInner}`}><div><p className={styles.eyebrow}>CONSTRUYAMOS JUNTOS</p><h2 id="cta-title">¿Qué necesitas resolver?</h2><p>Cuéntanos tu reto. Construyamos la solución.</p><ConsultationLink>Solicita una consulta</ConsultationLink></div><p className={styles.ctaSignature}>IDEAS<br />TECNOLOGÍA<br />IMPACTO REAL</p></div>
      </section>
    </main>
    <SiteFooter />
    <HeraWidget />
  </>;
}
