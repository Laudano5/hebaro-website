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
  { icon: Settings, title: "Automatización", copy: <>Solicitudes, recordatorios<br />y reportes con menos pasos manuales.</> },
  { icon: Laptop, title: "Software Personalizado", copy: <>Organiza clientes, documentos<br />y tareas en una herramienta propia.</> },
  { icon: Network, title: "Integración de Sistemas", copy: <>Conecta herramientas para evitar<br />registrar la misma información dos veces.</> },
  { icon: UsersRound, title: "Experiencias Digitales", copy: <>Portales y formularios claros<br />para tus clientes y tu equipo.</> },
];
const methodology = [
  { title: "Entendemos", copy: "Tu operación, tus procesos y lo que necesitas resolver." },
  { title: "Diseñamos", copy: "La solución adecuada para tu necesidad." },
  { title: "Construimos", copy: "Desarrollamos, integramos y ponemos la solución en marcha." },
];
const applications = [
  { title: "Automatización", image: "/public/images/Flujo Digital de Procesos Completo.png", alt: "Flujo digital de solicitud, revisión, aprobación y proceso completado.", scenario: "¿Las solicitudes se pierden entre mensajes y correos?", copy: "Un flujo puede reunir cada solicitud, asignar responsables y mostrar su estado sin revisar varias conversaciones.", example: "Ejemplo: solicitud → revisión → seguimiento." },
  { title: "Software Personalizado", image: "/public/images/Dashboard SaaS oscuro HEBARO.png", alt: "Dashboard HEBARO con indicadores y herramientas de gestión.", scenario: "¿Cada oficina lleva su propia hoja de cálculo?", copy: "Una plataforma a la medida puede reunir clientes, documentos y tareas, con acceso según las funciones de cada equipo.", example: "Ejemplo: un expediente compartido entre localidades." },
  { title: "Integración de Sistemas", image: "/public/images/HEBARO Systems Integration Hub.png", alt: "HEBARO conecta plataformas y servicios en un ecosistema integrado.", scenario: "¿Tu equipo copia datos de una herramienta a otra?", copy: "Una integración puede transferir información entre sistemas compatibles. Revisamos las opciones de conexión y los permisos necesarios.", example: "Ejemplo: formulario → registro de cliente → aviso al equipo." },
];

export default function SolutionsPage() {
  return <>
    <div className="internal-header-band"><SiteHeader /></div>
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="solutions-title">
        <div className={styles.heroPhoto}><Image src="/public/images/Modern Corporate Conference Interior.png" alt="Sala de conferencias moderna de HEBARO con vista de la ciudad y pantallas tecnológicas." fill priority quality={90} sizes="(max-width: 700px) 100vw, 60vw" /></div>
        <div className={`${styles.wrap} ${styles.heroInner}`}><div className={styles.heroCopy}>
          <p className={styles.eyebrow}>SOLUCIONES TECNOLÓGICAS</p>
          <h1 id="solutions-title">Haz más simple<br /><em>el trabajo diario.</em></h1>
          <p className={styles.heroDescription}>Desde una tarea repetitiva hasta una operación con varias localidades: identifica qué puedes automatizar, conectar o desarrollar con HEBARO.</p>
          <div className={styles.heroActions}><ConsultationLink>Solicita una consulta gratuita</ConsultationLink><a className={styles.examplesLink} href="#ejemplos">Ver ejemplos <ArrowRight size={17} aria-hidden="true" /></a></div>
          <p className={styles.signature}>AUTOMATIZACIÓN · SOFTWARE · INTEGRACIONES</p>
        </div></div>
      </section>
      <section className={styles.services} id="capacidades" aria-labelledby="services-title"><div className={styles.wrap}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>LO QUE HACEMOS</p><h2 id="services-title">Soluciones para<br />transformar cómo trabajas.</h2></div><p>Trabajamos con negocios de Puerto Rico para entender su operación y elegir una solución que responda a sus necesidades.</p></div>
        <div className={styles.serviceColumns}>{services.map(({ icon: Icon, title, copy }, index) => <article className={styles.service} key={title}><div className={styles.serviceSymbol}><Icon size={42} strokeWidth={1.6} aria-hidden="true" /><span>0{index + 1}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>
      <section className={styles.method} aria-labelledby="method-title"><div className={`${styles.wrap} ${styles.methodInner}`}>
        <div className={styles.methodCopy}><p className={styles.eyebrow}>NUESTRA METODOLOGÍA</p><h2 id="method-title">De tu proceso actual<br />a <em>una solución clara.</em></h2><p>La tecnología correcta comienza entendiendo lo que realmente necesitas resolver.</p></div>
        <ol className={styles.steps}>{methodology.map(({ title, copy }, index) => <li key={title}><span className={styles.stepNumber}>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div></section>
      <section className={styles.portfolio} id="ejemplos" aria-labelledby="portfolio-title"><div className={styles.wrap}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>EJEMPLOS DE LO QUE PODEMOS EXPLORAR</p><h2 id="portfolio-title">Reconoce el reto. Visualiza la solución.</h2></div><p>Escenarios ilustrativos, no casos de clientes. La solución y su alcance dependen de tu operación y tus herramientas.</p></div>
        <div className={styles.portfolioColumns}>{applications.map(({ title, image, alt, scenario, copy, example }) => <article key={title}><div className={styles.portfolioPhoto}><Image src={image} alt={alt} fill quality={90} sizes="(max-width: 700px) 100vw, (max-width: 1000px) 46vw, (max-width: 1500px) 30vw, 440px" /></div><div className={styles.portfolioCopy}><p className={styles.exampleCategory}>{title}</p><h3>{scenario}</h3><p>{copy}</p><p className={styles.exampleFlow}>{example}</p><a href="/consulta" aria-label={`Consultar sobre ${title}`}>Hablemos de este proceso <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></a></div></article>)}</div>
      </div></section>
      <section className={styles.cta} aria-labelledby="cta-title">
        <Image className={styles.ctaPhoto} src="/public/images/Golden Hour Coastal Cliffs.png" alt="" fill quality={90} sizes="100vw" />
        <div className={`${styles.wrap} ${styles.ctaInner}`}><div><p className={styles.eyebrow}>CONSTRUYAMOS JUNTOS</p><h2 id="cta-title">¿Qué necesitas resolver?</h2><p>Cuéntanos qué tarea te quita tiempo y qué herramientas usas hoy.</p><ConsultationLink>Solicita una consulta gratuita</ConsultationLink></div><p className={styles.ctaSignature}>IDEAS<br />TECNOLOGÍA<br />IMPACTO REAL</p></div>
      </section>
    </main>
    <SiteFooter />
    <HeraWidget />
  </>;
}
