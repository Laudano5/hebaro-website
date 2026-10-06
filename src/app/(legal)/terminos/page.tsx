import type { Metadata } from "next";
import LegalDocument from "../legal-document";
import content from "../legal-content.json";

export const metadata: Metadata = { title: "Términos y Condiciones de Uso | HEBARO" };

export default function Page() {
  return <LegalDocument title="Términos y Condiciones de Uso" sections={content.terms} />;
}
