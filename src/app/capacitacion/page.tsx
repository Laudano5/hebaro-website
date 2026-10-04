import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, BookOpen, BrainCircuit, ChartNoAxesColumnIncreasing, FileText, GraduationCap, Laptop, Search, Settings, Target, TrendingUp, UserRoundCheck, UsersRound } from "lucide-react";
import { SiteHeader } from "../site-header";
import SiteFooter from "../site-footer";
import HeraWidget from "../hera-widget";
import { ConsultationLink, SectionHeading, SectionLink } from "../internal-page-components";
import "./training.css";

export const metadata: Metadata = {
  title: "Capacitación & Upskilling | HEBARO",
  description: "Capacitación práctica en tecnología para empresas, organizaciones, equipos y profesionales.",
};

const areas = [
  [UsersRound, "Capacitación para Equipos", "Formación práctica en herramientas y tecnologías para mejorar la productividad y transformar la forma de trabajar."],
  [TrendingUp, "Upskilling & Desarrollo Profesional", "Fortalecemos las habilidades de tu equipo y lo preparamos para nuevas responsabilidades, tecnologías y formas de trabajo."],
  [Target, "Programas a la Medida", "Diseñamos experiencias de capacitación según las necesidades, objetivos y realidad de cada organización."],
  [BrainCircuit, "IA para el Trabajo", "Capacitación práctica para incorporar inteligencia artificial y automatización de forma productiva y responsable."],
] as const;
const approach = [
  [GraduationCap, "Aprender", "Nuevas habilidades."], [Settings, "Aplicar", "En el trabajo real."], [ChartNoAxesColumnIncreasing, "Crecer", "Nuevas capacidades."],
] as const;
const method = [
  [Search, "Entendemos", "Identificamos necesidades y objetivos."],
  [FileText, "Diseñamos", "Creamos una experiencia relevante para tu equipo."],
  [UsersRound, "Capacitamos", "Facilitamos sesiones prácticas y personalizadas."],
  [ChartNoAxesColumnIncreasing, "Aplicamos", "Te apoyamos para llevar lo aprendido al trabajo."],
] as const;
const results = [[BookOpen, "Aprender"], [Laptop, "Practicar"], [Settings, "Aplicar"], [ChartNoAxesColumnIncreasing, "Crecer"]] as const;

export default function TrainingPage() {
  return <>
    <div className="internal-header-band"><SiteHeader /></div>
    <main className="training-page">
      <section className="training-hero">
        <div className="training-hero-scene"><Image src="/public/images/capacitacion2-aplicacion.png" alt="Un instructor presenta frente a un dashboard de tecnología." fill priority sizes="(max-width: 600px) 100vw, 55vw" /></div>
        <div className="wrap training-hero-inner">
          <div className="training-hero-copy">
            <p className="internal-eyebrow"><span />HEBARO CAPACITACIÓN</p>
            <h1>Tecnología que<br className="training-desktop-break" /> tu equipo puede<br className="training-desktop-break" /> <em>llevar a la práctica.</em></h1>
            <p>Desarrollamos capacidades para que tu equipo adopte nuevas tecnologías y las aplique en su trabajo.</p>
            <div className="training-hero-actions">
              <a className="button" href="#areas">Explora nuestras capacitaciones <ArrowRight size={17} aria-hidden="true" /></a>
              <SectionLink href="/consulta">Solicita una propuesta</SectionLink>
            </div>
            <ul className="training-impact">
              {([[UserRoundCheck, "Personas más preparadas"], [UsersRound, "Equipos más productivos"], [ChartNoAxesColumnIncreasing, "Organizaciones que crecen"]] as const).map(([Icon, label]) => <li key={label}><Icon size={34} strokeWidth={1.3} aria-hidden="true" /><span>{label}</span></li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="training-approach">
        <div className="wrap training-approach-inner">
          <div><p className="internal-eyebrow"><span />NUESTRO ENFOQUE</p><h2>Capacitación diseñada<br /><em>para tu organización.</em></h2><p>Creamos experiencias prácticas, relevantes y alineadas a las necesidades de cada equipo.</p></div>
          <ul className="training-approach-ideas">{approach.map(([Icon, title, description]) => <li key={title}><Icon size={58} strokeWidth={1.2} aria-hidden="true" /><h3>{title}.</h3><p>{description}</p></li>)}</ul>
        </div>
      </section>
      <section className="training-areas" id="areas">
        <div className="wrap">
          <SectionHeading eyebrow="ÁREAS DE CAPACITACIÓN" title="Capacidades que se llevan al trabajo." />
          <div className="training-area-columns">{areas.map(([Icon, title, description], index) => <article key={title}><div className="training-area-symbol"><span>0{index + 1}</span><Icon size={48} strokeWidth={1.2} aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>
      <section className="training-method">
        <div className="training-method-photo"><Image src="/public/images/capacitacion1-hero.png" alt="Un equipo aprende con un instructor frente a un dashboard de tecnología." fill quality={90} sizes="(max-width: 900px) 100vw, (max-width: 1200px) 40vw, 42vw" /></div>
        <div className="training-method-copy">
          <p className="internal-eyebrow"><span />CÓMO TRABAJAMOS</p><h2>Del aprendizaje a la aplicación.</h2><p>Un proceso simple, enfocado en resultados reales.</p>
          <ol className="training-method-steps">{method.map(([Icon, title, description], index) => <li key={title}><span className="training-process-icon"><Icon size={27} strokeWidth={1.3} aria-hidden="true" /></span>{index < method.length - 1 && <ArrowRight className="training-step-arrow" size={32} strokeWidth={1} aria-hidden="true" />}<h3>{title}</h3><p>{description}</p></li>)}</ol>
        </div>
      </section>
      <section className="training-result">
        <div className="wrap">
          <SectionHeading eyebrow="EL RESULTADO" title="Aprender es solo el comienzo." description="El objetivo no es solamente entender la tecnología, sino saber cómo utilizarla." />
          <ol className="training-result-journey">{results.map(([Icon, title], index) => <li key={title}><span><Icon size={29} strokeWidth={1.3} aria-hidden="true" /></span><h3>{title}</h3>{index < results.length - 1 && <ArrowRight className="training-result-arrow" size={55} strokeWidth={.8} aria-hidden="true" />}</li>)}</ol>
        </div>
      </section>
      <section className="training-cta">
        <Image className="training-cta-photo" src="/public/images/capacitacion-aplicacion.png" alt="" fill quality={90} sizes="100vw" />
        <div className="wrap"><div className="training-cta-copy"><p className="internal-eyebrow"><span />HEBARO CAPACITACIÓN</p><h2>Desarrolla nuevas capacidades dentro de tu organización.</h2><p>Prepara a tu equipo para aprovechar nuevas tecnologías y convertir conocimiento en resultados.</p><ConsultationLink>Hablemos de las necesidades de tu equipo</ConsultationLink></div></div>
      </section>
    </main>
    <SiteFooter />
    <HeraWidget />
  </>;
}
