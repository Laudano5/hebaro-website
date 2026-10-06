import { ArrowRight, BrainCircuit, CodeXml, GraduationCap, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "./site-header";
import SiteFooter from "./site-footer";
import HeraWidget from "./hera-widget";
import { ConsultationLink } from "./internal-page-components";
import styles from "./home.module.css";

const marketplaceUrl = "https://marketplace.hebaro.com/";
const capabilities = [
  { icon: BrainCircuit, title: "IA y Automatización", text: "Ahorra tiempo, reduce costos\ny aumenta tu productividad." },
  { icon: CodeXml, title: "Software Personalizado", text: "Plataformas a la medida,\nsin limitarte a las existentes." },
  { icon: Share2, title: "Integración de Sistemas", text: "Conecta tus herramientas,\ndatos y procesos." },
  { icon: GraduationCap, title: "Capacitación & Upskilling", text: "Desarrolla nuevas habilidades\npara tu futuro." },
];

export default function Home() {
  return (
    <>
      <div className="internal-header-band"><SiteHeader /></div>
      <main className={styles.page}>
        <section className={styles.hero} id="inicio" aria-labelledby="home-title">
          <div className={styles.heroPhoto}>
            <Image src="/public/images/Sunset Dashboard Over Caguas Arts Center.png" alt="Centro de Bellas Artes de Caguas al atardecer, con un dashboard HEBARO en una computadora portátil." fill priority quality={90} sizes="(max-width: 700px) 100vw, 60vw" />
          </div>
          <div className={`${styles.wrap} ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>TECNOLOGÍA PARA CRECER</p>
              <h1 id="home-title">Un ecosistema<br />para conectar<br /><em>tu negocio.</em></h1>
              <p className={styles.heroDescription}>Automatizamos, integramos y desarrollamos soluciones que conectan personas, procesos y oportunidades.</p>
              <div className={styles.heroActions}>
                <Link className="button" href="/soluciones">Conoce nuestras soluciones <ArrowRight size={17} aria-hidden="true" /></Link>
                <a className={`button ${styles.outline}`} href={marketplaceUrl}>Explora el Marketplace <ArrowRight size={17} aria-hidden="true" /></a>
              </div>
              <p className={styles.signature}>IDEAS · TECNOLOGÍA · IMPACTO REAL</p>
            </div>
          </div>
        </section>

        <section className={styles.pathways} id="soluciones" aria-labelledby="pathways-title">
          <div className={styles.wrap}>
            <div className={styles.sectionHeading} id="nosotros">
              <div><p className={styles.eyebrow}>HEBARO ES</p><h2 id="pathways-title">Una empresa.<br />Dos formas de ayudarte.</h2></div>
              <p>Conectamos tecnología y oportunidades para ayudar a personas, negocios y organizaciones a crecer.</p>
            </div>
            <div className={styles.pathwayGrid}>
              <article className={`${styles.pathway} ${styles.technology}`}>
                <div className={styles.pathwayContent}>
                  <p className={styles.eyebrow}>SERVICIOS TECNOLÓGICOS</p>
                  <h3>Digitaliza.<br />Automatiza.<br /><em>Crece.</em></h3>
                  <p>Soluciones de automatización, software, integración de sistemas y tecnología diseñadas alrededor de tu operación.</p>
                  <Link className={styles.pathwayLink} href="/soluciones">Explora nuestras soluciones <ArrowRight size={19} aria-hidden="true" /></Link>
                </div>
              </article>
              <article className={`${styles.pathway} ${styles.marketPath}`}>
                <Image className={styles.pathwayPhoto} src="/public/images/marketplace background.jpg" alt="" fill quality={90} sizes="(max-width: 850px) 100vw, (max-width: 1600px) 45vw, 690px" />
                <div className={styles.pathwayContent}>
                  <p className={styles.eyebrow}>HEBARO MARKETPLACE</p>
                  <h3>Compra.<br />Vende.<br /><em>Conecta.</em></h3>
                  <p>Productos, servicios, talento<br />y oportunidades en un solo lugar.</p>
                  <a className={styles.pathwayLink} href={marketplaceUrl}>Explora el Marketplace <ArrowRight size={19} aria-hidden="true" /></a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.capabilities} id="capacidades" aria-labelledby="capabilities-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>NUESTRAS CAPACIDADES</p>
            <h2 id="capabilities-title">Tecnología aplicada a necesidades reales.</h2>
            <div className={styles.capabilityColumns}>
              {capabilities.map(({ icon: Icon, title, text }, index) => <article className={styles.capability} key={title}>
                <div className={styles.capabilitySymbol}><Icon size={48} strokeWidth={1.4} aria-hidden="true" /><span>0{index + 1}</span></div>
                <h3>{title}</h3><p>{text}</p>
              </article>)}
            </div>
          </div>
        </section>

        <section className={styles.marketplace} id="productos" aria-labelledby="marketplace-title">
          <div className={`${styles.wrap} ${styles.marketplaceInner}`}>
            <div className={styles.marketplaceIntro}>
              <p className={styles.eyebrow}>HEBARO ECOSYSTEM</p>
              <h2 id="marketplace-title">Explora el ecosistema de HEBARO.</h2>
              <p>Plataformas creadas para conectar personas, productos, servicios y oportunidades.</p>
              <a className="button" href={marketplaceUrl}>Explorar el ecosistema <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
            <div className={styles.marketplaceCards}>
              <a className={styles.feature} href="https://www.artesenpr.com" target="_blank" rel="noopener noreferrer">
                <div className={styles.featurePhoto}><Image src="/public/images/artesenpr card.png" alt="ArtesenPR: artesanías puertorriqueñas hechas a mano." fill quality={90} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 45vw, 28vw" /></div>
                <div className={styles.featureCopy}><h3>ArtesenPR</h3><p>Descubre productos de artesanos de Puerto Rico.</p><ArrowRight size={19} aria-hidden="true" /></div>
              </a>
              <a className={styles.feature} href={marketplaceUrl}>
                <div className={styles.featurePhoto}><Image src="/public/images/marketplace background.jpg" alt="Productos, servicios y negocios del Marketplace HEBARO." fill quality={90} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 45vw, 28vw" /></div>
                <div className={styles.featureCopy}><h3>HEBARO Marketplace</h3><p>Compra, vende y conecta en un solo lugar.</p><ArrowRight size={19} aria-hidden="true" /></div>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.cta} id="contacto" aria-labelledby="cta-title">
          <Image className={styles.ctaPhoto} src="/public/images/Hebaro imagen fondo.png" alt="" fill quality={90} sizes="100vw" />
          <div className={`${styles.wrap} ${styles.ctaInner}`}><div className={styles.ctaCopy}>
            <p className={styles.eyebrow}>CONSTRUYAMOS JUNTOS</p>
            <h2 id="cta-title">¿Qué podemos<br />construir juntos?</h2>
            <p>Hablemos de tu proyecto y llevemos<br />tu negocio al próximo nivel.</p>
            <ConsultationLink>Solicita una consulta</ConsultationLink>
          </div></div>
        </section>
      </main>
      <SiteFooter />
      <HeraWidget />
    </>
  );
}
