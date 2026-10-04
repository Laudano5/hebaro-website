import type { Metadata } from "next";
import "./contact.css";

import {
  ArrowRight,
  BrainCircuit,
  GraduationCap,
  Lightbulb,
  Rocket,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";

import Link from "next/link";

import { SiteHeader } from "../site-header";
import SiteFooter from "../site-footer";
import HeraWidget from "../hera-widget";
import ContactGeneralForm from "../contact-general-form";

import {
  InternalPageHero,
  SectionHeading,
} from "../internal-page-components";

import OpenHeraButton from "../open-hera-button";
import ContactNetwork from "../contact-network";

export const metadata: Metadata = {
  title: "Contacto | HEBARO",
  description:
    "Comunícate con HEBARO para compartir una idea, pregunta u oportunidad de colaboración.",
};

const contactPaths = [
  {
    icon: Workflow,
    eyebrow: "PROYECTO O SOLUCIÓN TECNOLÓGICA",
    title: "Hablemos de lo que quieres resolver.",
    description:
      "¿Tienes un proceso que quieres automatizar, una plataforma que necesitas desarrollar o un reto tecnológico?",
    link: "/consulta",
    action: "Solicita una consulta",
    type: "technology",
  },
  {
    icon: GraduationCap,
    eyebrow: "CAPACITACIÓN",
    title: "Desarrolla capacidades en tu equipo.",
    description:
      "¿Quieres desarrollar nuevas capacidades dentro de tu equipo u organización?",
    link: "/consulta",
    action: "Conversemos sobre capacitación",
    type: "training",
  },
];

function TechnologyFlow() {
  return (
    <div
      className="contact-mini-flow"
      aria-hidden="true"
    >
      <div className="mini-flow-item">
        <span>
          <Lightbulb size={14} />
        </span>
        <small>IDEA</small>
      </div>

      <i />

      <div className="mini-flow-item">
        <span>
          <Wrench size={14} />
        </span>
        <small>DISEÑO</small>
      </div>

      <i />

      <div className="mini-flow-item">
        <span>
          <BrainCircuit size={14} />
        </span>
        <small>DESARROLLO</small>
      </div>

      <i />

      <div className="mini-flow-item">
        <span>
          <Rocket size={14} />
        </span>
        <small>LANZAMIENTO</small>
      </div>
    </div>
  );
}

function TrainingFlow() {
  return (
    <div
      className="contact-mini-flow"
      aria-hidden="true"
    >
      <div className="mini-flow-item">
        <span>
          <Users size={14} />
        </span>
        <small>EQUIPO</small>
      </div>

      <i />

      <div className="mini-flow-item">
        <span>
          <GraduationCap size={14} />
        </span>
        <small>APRENDIZAJE</small>
      </div>

      <i />

      <div className="mini-flow-item">
        <span>
          <BrainCircuit size={14} />
        </span>
        <small>CAPACIDAD</small>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <div className="internal-header-band">
        <SiteHeader />
      </div>

      <main className="contact-page">

        <InternalPageHero
          variant="contact"
          eyebrow="CONTACTO"
          title="¿POR DÓNDE EMPEZAMOS?"
          description="Cuéntanos sobre tu proyecto, necesidad o idea. Estamos aquí para escucharte y ayudarte a identificar el mejor camino para avanzar."
          visual={<ContactNetwork />}
        />

        <section className="internal-section contact-paths-section">
          <div className="wrap">

            <SectionHeading
              eyebrow="¿POR DÓNDE EMPEZAMOS?"
              title="Elige el mejor camino para empezar."
            />

            <div className="contact-path-grid">

              {contactPaths.map(
                ({
                  icon: Icon,
                  eyebrow,
                  title,
                  description,
                  link,
                  action,
                  type,
                }) => (
                  <article
                    className="contact-path-card"
                    key={eyebrow}
                  >
                    <div className="contact-card-top">

                      <div className="contact-path-icon">
                        <Icon
                          size={22}
                          strokeWidth={1.7}
                          aria-hidden="true"
                        />
                      </div>

                      {type === "technology" ? (
                        <TechnologyFlow />
                      ) : (
                        <TrainingFlow />
                      )}

                    </div>

                    <p className="internal-eyebrow">
                      <span />
                      {eyebrow}
                    </p>

                    <h3>{title}</h3>

                    <p>{description}</p>

                    <Link href={link}>
                      {action}
                      <ArrowRight size={17} />
                    </Link>

                  </article>
                )
              )}

            </div>
          </div>
        </section>

        <section
          className="general-contact-section"
          id="mensaje-general"
        >
          <div className="wrap general-contact-layout">

            <div className="general-contact-intro">

              <p className="internal-eyebrow">
                <span />
                CONSULTA GENERAL
              </p>

              <h2>
                ¿Tienes una pregunta o una oportunidad?
              </h2>

              <p>
                Comparte un mensaje general para iniciar la
                conversación con HEBARO.
              </p>

              <div className="general-contact-note">
                <span>
                  Para necesidades de tecnología o capacitación,
                  utiliza la ruta de consulta correspondiente.
                </span>
              </div>

            </div>

            <div className="general-contact-card">
              <ContactGeneralForm />
            </div>

          </div>
        </section>

        <section className="contact-hera-section">
          <div className="wrap contact-hera-inner">

            <div>
              <p className="internal-eyebrow">
                <span />
                ASISTENTE HEBARO
              </p>

              <h2>
                ¿No sabes por dónde empezar?
              </h2>

              <p>
                Habla con HERA y te ayudamos a identificar qué tipo
                de solución puede tener sentido para tu necesidad.
              </p>
            </div>

            <OpenHeraButton />

          </div>
        </section>

      </main>

      <SiteFooter />

      <HeraWidget />
    </>
  );
}