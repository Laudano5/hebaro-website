"use client";

import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { HERA_SERVICES } from "@/lib/hera/types";

type ConsultationFields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  serviceInterest: string;
  description: string;
  consent: boolean;
};

const EMPTY_FORM: ConsultationFields = {
  name: "",
  company: "",
  email: "",
  phone: "",
  serviceInterest: "",
  description: "",
  consent: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+\d().\s-]+$/;

export default function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [fields, setFields] = useState(EMPTY_FORM);
  const [attempted, setAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function updateField<K extends keyof ConsultationFields>(key: K, value: ConsultationFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function submitConsultation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    setSubmitError("");

    const name = fields.name.trim();
    const company = fields.company.trim();
    const email = fields.email.trim();
    const phone = fields.phone.trim();
    const description = fields.description.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    if (!name || !description || (!email && !phone) || (email && !EMAIL_PATTERN.test(email))
      || (phone && (!PHONE_PATTERN.test(phone) || phoneDigits.length < 7)) || !fields.consent) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company: company || null,
          email: email || null,
          phone: phone || null,
          service_interest: fields.serviceInterest === "No estoy seguro" ? null : fields.serviceInterest || null,
          description,
          consent: fields.consent,
        }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || "No pudimos enviar tu solicitud ahora.");
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No pudimos enviar tu solicitud ahora.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="consultation-success" role="status" aria-live="polite">
        <span className="consultation-success-icon"><Check size={23} /></span>
        <h2>¡Gracias! Recibimos tu solicitud.</h2>
        <p>El equipo de HEBARO revisará la información y se comunicará contigo.</p>
        <Link className="consultation-back-link" href="/">Volver al inicio<ArrowRight size={17} /></Link>
      </section>
    );
  }

  return (
    <form className="consultation-form" onSubmit={submitConsultation} noValidate>
      <div className="consultation-fields">
        <label>Nombre <span>*</span>
          <input autoComplete="name" value={fields.name} maxLength={120} onChange={(event) => updateField("name", event.target.value)} />
          {attempted && !fields.name.trim() && <small>Escribe tu nombre.</small>}
        </label>
        <label>Empresa <em>(opcional)</em>
          <input autoComplete="organization" value={fields.company} maxLength={200} onChange={(event) => updateField("company", event.target.value)} />
        </label>
        <label>Email
          <input autoComplete="email" type="email" value={fields.email} maxLength={254} onChange={(event) => updateField("email", event.target.value)} />
          {attempted && fields.email.trim() && !EMAIL_PATTERN.test(fields.email.trim()) && <small>Revisa el email.</small>}
        </label>
        <label>Teléfono
          <input autoComplete="tel" type="tel" value={fields.phone} maxLength={40} onChange={(event) => updateField("phone", event.target.value)} />
          {attempted && fields.phone.trim() && (!PHONE_PATTERN.test(fields.phone.trim()) || fields.phone.replace(/\D/g, "").length < 7) && <small>Revisa el teléfono.</small>}
        </label>
        <label className="consultation-service">¿En qué podemos ayudarte?
          <select value={fields.serviceInterest} onChange={(event) => updateField("serviceInterest", event.target.value)}>
            <option value="">Selecciona un área (opcional)</option>
            {HERA_SERVICES.map((service) => <option key={service} value={service}>{service}</option>)}
            <option value="No estoy seguro">No estoy seguro</option>
          </select>
        </label>
        <label className="consultation-description">Cuéntanos brevemente qué necesitas <span>*</span>
          <textarea value={fields.description} maxLength={2_000} rows={4} onChange={(event) => updateField("description", event.target.value)} />
          <small className="consultation-hint">{fields.description.length}/2000</small>
          {attempted && !fields.description.trim() && <small>Describe brevemente tu consulta.</small>}
        </label>
      </div>
      {attempted && !fields.email.trim() && !fields.phone.trim() && <p className="consultation-error" role="alert">Incluye un email o teléfono para poder contactarte.</p>}
      <label className="consultation-consent">
        <input type="checkbox" checked={fields.consent} onChange={(event) => updateField("consent", event.target.checked)} />
        <span>Al enviar esta solicitud, autorizas a HEBARO a comunicarse contigo sobre tu consulta.</span>
      </label>
      {attempted && !fields.consent && <p className="consultation-error" role="alert">Confirma el consentimiento para continuar.</p>}
      {submitError && <p className="consultation-error" role="alert">{submitError}</p>}
      <button className="consultation-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <><LoaderCircle className="consultation-spinner" size={17} /> Enviando…</> : <>Solicitar consulta <ArrowRight size={17} /></>}
      </button>
      <p className="consultation-required-note">* Campos requeridos. Necesitamos un email o un teléfono.</p>
    </form>
  );
}
