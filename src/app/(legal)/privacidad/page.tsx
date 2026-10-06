import type { Metadata } from "next";
import LegalDocument from "../legal-document";
import content from "../legal-content.json";

export const metadata: Metadata = { title: "Política de Privacidad | HEBARO" };

export default function Page() {
  return <LegalDocument title="Política de Privacidad" sections={content.privacy} />;
}
