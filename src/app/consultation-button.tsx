import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ConsultationButton() {
  return (
    <Link className="button" href="/consulta">
      Solicita una consulta gratuita
      <ArrowRight size={17} strokeWidth={1.8} />
    </Link>
  );
}
