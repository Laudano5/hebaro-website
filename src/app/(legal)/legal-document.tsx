import Link from "next/link";

type Section = {
  heading: string;
  blocks: Array<{ type: string; text?: string; items?: string[] }>;
};

function Paragraph({ text }: { text: string }) {
  const phrase = "Política de Privacidad";
  const parts = text.split(phrase);
  return <p>{parts.map((part, index) => <span key={index}>
    {index > 0 && <Link href="/privacidad">{phrase}</Link>}{part}
  </span>)}</p>;
}

export default function LegalDocument({ title, sections }: { title: string; sections: Section[] }) {
  return <main className="legal-page">
    <article className="legal-document" aria-labelledby="legal-title">
      <header className="legal-document-header">
        <p className="legal-brand">HEBARO LLC</p>
        <h1 id="legal-title">{title}</h1>
        <p className="legal-updated">Última actualización: <time dateTime="2026-10-06">6 de octubre de 2026</time></p>
      </header>
      {sections.map((section, index) => <section key={section.heading} aria-labelledby={`legal-section-${index}`}>
        <h2 id={`legal-section-${index}`}>{section.heading}</h2>
        {section.blocks.map((block, blockIndex) => block.type === "list"
          ? <ul key={blockIndex}>{block.items?.map(item => <li key={item}>{item}</li>)}</ul>
          : <Paragraph key={blockIndex} text={block.text ?? ""} />)}
      </section>)}
    </article>
  </main>;
}
