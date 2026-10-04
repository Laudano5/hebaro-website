import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export type HeroVariant = "solutions" | "training" | "about" | "contact";

export function InternalPageHero({
  variant,
  eyebrow,
  title,
  description,
  children,
  visual,
}: {
  variant: HeroVariant;
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
  visual?: ReactNode;
}) {
  return (
    <section className={`internal-hero internal-hero--${variant}`}>
      <div className="internal-hero-pattern" aria-hidden="true" />
      <div className={`wrap internal-hero-layout${visual ? " has-visual" : ""}`}>
       <div className="internal-hero-content">
        <p className="internal-eyebrow"><span />{eyebrow}</p>
        <h1>{title}</h1>
        <p className="internal-hero-copy">{description}</p>
        {children && <div className="internal-hero-actions">{children}</div>}
       </div>
       {visual && <div className="internal-hero-visual" aria-hidden="true">{visual}</div>}
      </div>
      {variant !== "contact" && <span className="internal-hero-index" aria-hidden="true">HEBARO · PUERTO RICO</span>}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className={`internal-section-heading${light ? " is-light" : ""}`}>
      {eyebrow && <p className="internal-eyebrow"><span />{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export function ConsultationLink({ children = "Solicita una consulta gratuita" }: { children?: ReactNode }) {
  return <Link className="button" href="/consulta">{children}<ArrowRight size={17} /></Link>;
}

export function SectionLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="button button-outline" href={href}>{children}<ArrowRight size={17} /></a>;
}
