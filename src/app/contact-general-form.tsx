"use client";

import { FormEvent } from "react";

export default function ContactGeneralForm() {
  function keepLocalUntilStorageIsConfigured(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className="general-contact-form" onSubmit={keepLocalUntilStorageIsConfigured}>
      <label>Nombre <span>*</span><input name="name" autoComplete="name" maxLength={120} required /></label>
      <label>Empresa <em>(opcional)</em><input name="company" autoComplete="organization" maxLength={200} /></label>
      <label>Email <span>*</span><input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label>Asunto <span>*</span><input name="subject" maxLength={200} required /></label>
      <label className="general-contact-message">Mensaje <span>*</span><textarea name="message" rows={5} maxLength={5_000} required /></label>
      <button className="button" type="submit" disabled aria-describedby="general-contact-status">Enviar mensaje</button>
      <p className="general-contact-status" id="general-contact-status" role="status">El envío de mensajes generales estará disponible cuando se habilite su almacenamiento seguro.</p>
    </form>
  );
}
