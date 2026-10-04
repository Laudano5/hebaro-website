"use client";

import Image from "next/image";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, CircleHelp, Code2, GraduationCap, LoaderCircle, Network, Send, Workflow, X } from "lucide-react";
import { createLeadSubmission } from "@/lib/hera/lead-extraction";
import { HERA_SERVICES, type HeraService, type HeraTurn } from "@/lib/hera/types";

const HERA_AVATAR = "/public/images/hera-avatar.png.png";
const OPENING_MESSAGE = "Hola, soy HERA.\n\nCuéntame qué quieres mejorar, automatizar o desarrollar y te ayudo a identificar cómo HEBARO puede ayudarte.";
const QUICK_ACTIONS: Array<{ label: string; service: HeraService | null }> = [
  { label: "Quiero automatizar un proceso", service: HERA_SERVICES[0] },
  { label: "Necesito desarrollar un sistema", service: HERA_SERVICES[1] },
  { label: "Quiero conectar mis sistemas", service: HERA_SERVICES[2] },
  { label: "Busco capacitación", service: HERA_SERVICES[3] },
  { label: "No sé qué necesito", service: null },
];
const QUICK_ACTION_ICONS = [Workflow, Code2, Network, GraduationCap, CircleHelp];

type LeadFields = { name: string; company: string; email: string; phone: string; consent: boolean; website: string };
type WidgetMode = "conversation" | "lead" | "sent";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+\d().\s-]+$/;
const MAX_VISITOR_TURNS = 25;
const MAX_MESSAGE_CHARS = 1_800;

function createTurn(role: HeraTurn["role"], content: string): HeraTurn {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, role, content };
}

export function HeraTypingIndicator() {
  return <div className="hera-typing" role="status"><span className="hera-thinking-copy">HERA está pensando</span><span className="hera-thinking-dot"/><span className="hera-thinking-dot"/><span className="hera-thinking-dot"/></div>;
}

export default function HeraWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [chatError, setChatError] = useState(false);
  const [mode, setMode] = useState<WidgetMode>("conversation");
  const [turns, setTurns] = useState<HeraTurn[]>(() => [createTurn("assistant", OPENING_MESSAGE)]);
  const [selectedService, setSelectedService] = useState<HeraService | null>(null);
  const [draft, setDraft] = useState("");
  const [lead, setLead] = useState<LeadFields>({ name: "", company: "", email: "", phone: "", consent: false, website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [contactValidation, setContactValidation] = useState(false);
  const [contactOfferCooldownUntil, setContactOfferCooldownUntil] = useState<number | null>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hasOpenedRef = useRef(false);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visitorTurns = useMemo(() => turns.filter((turn) => turn.role === "user"), [turns]);
  const hasContactMethod = Boolean(
    (lead.email.trim() && EMAIL_PATTERN.test(lead.email.trim()))
    || (lead.phone.trim() && PHONE_PATTERN.test(lead.phone.trim()) && lead.phone.replace(/\D/g, "").length >= 7),
  );
  const quickActionsAvailable = visitorTurns.length === 0;
  const messageLimitReached = visitorTurns.length >= MAX_VISITOR_TURNS;

  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      closeRef.current?.focus();
    } else if (hasOpenedRef.current) {
      launcherRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (mode === "lead") nameRef.current?.focus();
  }, [mode]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (mode === "conversation" && conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [turns, mode]);

  async function requestAssistantReply(conversation: HeraTurn[], suppressContactOffer: boolean) {
    setIsThinking(true);
    setChatError(false);
    try {
      const response = await fetch("/api/hera/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turns: conversation.map(({ role, content }) => ({ role, content })),
          suppressContactOffer,
        }),
      });
      const result = await response.json().catch(() => null) as {
        message?: unknown;
        readyForContact?: unknown;
        serviceInterests?: unknown;
      } | null;
      if (!response.ok || !result || typeof result.message !== "string" || typeof result.readyForContact !== "boolean" || !Array.isArray(result.serviceInterests)) {
        throw new Error("HERA response unavailable");
      }
      setTurns((current) => [...current, {
        ...createTurn("assistant", result.message as string),
        readyForContact: result.readyForContact as boolean,
        serviceInterests: result.serviceInterests as HeraService[],
      }]);
    } catch {
      setChatError(true);
    } finally {
      setIsThinking(false);
    }
  }

  function retryLastMessage() {
    if (!visitorTurns.length || isThinking) return;
    const suppress = contactOfferCooldownUntil !== null && visitorTurns.length < contactOfferCooldownUntil;
    void requestAssistantReply(turns, suppress);
  }

  function addVisitorMessage(message: string, service: HeraService | null) {
    const content = message.trim();
    if (!content || messageLimitReached || isThinking || content.length > MAX_MESSAGE_CHARS) return;
    const nextTurns = [...turns, createTurn("user", content)];
    const nextVisitorCount = visitorTurns.length + 1;
    const suppress = contactOfferCooldownUntil !== null && nextVisitorCount < contactOfferCooldownUntil;
    setTurns(nextTurns);
    if (service) setSelectedService(service);
    setDraft("");
    void requestAssistantReply(nextTurns, suppress);
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addVisitorMessage(draft, null);
  }

  function sendOnEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactValidation(true);
    setSubmitError("");
    if (!hasContactMethod || !lead.name.trim() || !lead.consent) return;

    setSubmitting(true);
    try {
      const leadData = createLeadSubmission({
        turns,
        selectedService,
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
      });
      const response = await fetch("/api/hera/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...leadData, consent: lead.consent, website: lead.website }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error || "No pudimos enviar tu solicitud ahora.");
      }
      setMode("sent");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No pudimos enviar tu solicitud ahora.");
    } finally {
      setSubmitting(false);
    }
  }

  function closePanel() {
    setIsOpen(false);
    setIsClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsRendered(false);
      setIsClosing(false);
    }, 180);
  }

  function openPanel() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsRendered(true);
    setIsClosing(false);
    setIsOpen(true);
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") closePanel();
  }

  return (
    <div className="hera-widget">
      {isRendered && (
        <section
          className={`hera-panel${isClosing ? " is-closing" : ""}`}
          role="dialog"
          aria-modal="false"
          aria-labelledby="hera-title"
          aria-describedby="hera-subtitle"
          onKeyDown={handlePanelKeyDown}
        >
          <header className="hera-panel-header">
            <Image className="hera-avatar hera-avatar-header" src={HERA_AVATAR} alt="" width={54} height={54} sizes="54px" />
            <div className="hera-identity">
              <h2 id="hera-title">HERA <span>by HEBARO</span></h2>
              <p id="hera-subtitle">Asistente inteligente</p>
            </div>
            <button className="hera-close" ref={closeRef} type="button" onClick={closePanel} aria-label="Minimizar HERA">
              <X size={20} />
            </button>
          </header>

          {mode === "conversation" && (
            <>
              <div className="hera-messages" ref={conversationRef} role="log" aria-live="polite" aria-relevant="additions text">
                {turns.map((turn, index) => {
                  const showAvatar = turn.role === "assistant" && (index === 0 || turns[index - 1].role !== "assistant");
                  return (
                    <div className={`hera-message-row ${turn.role}`} key={turn.id}>
                      {turn.role === "assistant" && (showAvatar
                        ? <Image className="hera-avatar hera-avatar-message" src={HERA_AVATAR} alt="HERA" width={32} height={32} sizes="32px" />
                        : <span className="hera-message-avatar-spacer" aria-hidden="true" />)}
                      <article className={`hera-message ${turn.role}`}>
                        {showAvatar && <span className="hera-message-author">HERA</span>}
                        <p>{turn.content}</p>
                      </article>
                    </div>
                  );
                })}

                {quickActionsAvailable && (
                  <div className="hera-quick-actions" aria-label="Temas para empezar">
                    <p>También puedes empezar por aquí:</p>
                    {QUICK_ACTIONS.map(({ label, service }, index) => {
                      const Icon = QUICK_ACTION_ICONS[index];
                      return <button type="button" key={label} disabled={isThinking} onClick={() => addVisitorMessage(label, service)}>
                        <span className="hera-action-label"><Icon size={16} strokeWidth={1.8} />{label}</span><ArrowRight size={14} />
                      </button>
                    })}
                  </div>
                )}

                {isThinking && <div className="hera-thinking-row"><Image className="hera-avatar hera-avatar-message" src={HERA_AVATAR} alt="" width={32} height={32} sizes="32px" /><HeraTypingIndicator /></div>}
                {chatError && <div className="hera-chat-error" role="alert"><p>Estoy teniendo dificultad para responder en este momento. Intenta nuevamente en unos segundos.</p><button type="button" onClick={retryLastMessage}>Reintentar</button></div>}
                {turns.at(-1)?.role === "assistant" && (turns.at(-1)?.readyForContact || messageLimitReached) && !isThinking && (contactOfferCooldownUntil === null || visitorTurns.length >= contactOfferCooldownUntil) && (
                  <div className="hera-follow-up">
                    <p>Si quieres, puedo compartir un resumen de esta conversación con el equipo de HEBARO.</p>
                    <button className="hera-contact-choice" type="button" onClick={() => setMode("lead")}>
                      Solicitar seguimiento<ArrowRight size={15} />
                    </button>
                    <button className="hera-continue" type="button" onClick={() => { setContactOfferCooldownUntil(visitorTurns.length + 4); composerRef.current?.focus(); }}>
                      Seguir conversando
                    </button>
                  </div>
                )}
                {messageLimitReached && <p className="hera-limit-note">Llegaste al límite de mensajes de esta conversación. Puedes solicitar seguimiento cuando quieras.</p>}
              </div>

              <form className="hera-composer" onSubmit={sendMessage}>
                <label className="sr-only" htmlFor="hera-message">Escribe un mensaje para HERA</label>
                <textarea
                  ref={composerRef}
                  id="hera-message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value.slice(0, MAX_MESSAGE_CHARS))}
                  onKeyDown={sendOnEnter}
                  placeholder={messageLimitReached ? "Límite de mensajes alcanzado" : "Cuéntame sobre tu proyecto…"}
                  maxLength={MAX_MESSAGE_CHARS}
                  rows={1}
                  disabled={messageLimitReached || isThinking}
                />
                <button type="submit" disabled={!draft.trim() || messageLimitReached || isThinking} aria-label="Enviar mensaje">
                  <Send size={18} />
                </button>
                <p>Enter para enviar · Shift + Enter para una nueva línea</p>
              </form>
            </>
          )}

          {mode === "lead" && (
            <form className="hera-lead-form" onSubmit={submitLead} noValidate>
              <div className="hera-lead-scroll">
                <div className="hera-honeypot" aria-hidden="true">
                  <label>Website<input name="website" tabIndex={-1} autoComplete="off" value={lead.website} onChange={(event) => setLead((current) => ({ ...current, website: event.target.value }))} /></label>
                </div>
                <button className="hera-back" type="button" onClick={() => setMode("conversation")}>← Volver a la conversación</button>
                <h3>Hablemos de tu proyecto</h3>
                <p className="hera-lead-intro">Comparte tus datos y el equipo de HEBARO podrá revisar lo que nos contaste.</p>
                <div className="hera-summary-preview">
                  <span>Resumen compartido</span>
                  <p>{visitorTurns.map((turn) => turn.content).join("\n\n")}</p>
                </div>

                <label className="hera-field">Nombre <span aria-hidden="true">*</span>
                  <input ref={nameRef} autoComplete="name" name="name" value={lead.name} maxLength={120} required onChange={(event) => setLead((current) => ({ ...current, name: event.target.value }))} />
                </label>
                <label className="hera-field">Empresa u organización <span>(opcional)</span>
                  <input autoComplete="organization" name="company" value={lead.company} maxLength={200} onChange={(event) => setLead((current) => ({ ...current, company: event.target.value }))} />
                </label>
                <label className="hera-field">Email {lead.phone.trim() ? <span>(opcional)</span> : <span aria-hidden="true">*</span>}
                  <input autoComplete="email" type="email" name="email" value={lead.email} maxLength={254} required={!lead.phone.trim()} aria-invalid={contactValidation && Boolean(lead.email.trim()) && !EMAIL_PATTERN.test(lead.email.trim())} onChange={(event) => setLead((current) => ({ ...current, email: event.target.value }))} />
                </label>
                <label className="hera-field">Teléfono {lead.email.trim() ? <span>(opcional)</span> : <span aria-hidden="true">*</span>}
                  <input autoComplete="tel" type="tel" name="phone" value={lead.phone} maxLength={40} required={!lead.email.trim()} aria-invalid={contactValidation && Boolean(lead.phone.trim()) && (!PHONE_PATTERN.test(lead.phone.trim()) || lead.phone.replace(/\D/g, "").length < 7)} onChange={(event) => setLead((current) => ({ ...current, phone: event.target.value }))} />
                </label>
                {contactValidation && !hasContactMethod && <p className="hera-field-error">Incluye un email válido o un teléfono válido.</p>}

                <p className="hera-disclosure">Antes de enviar: tu información de contacto y los mensajes que compartiste se enviarán al equipo de HEBARO para dar seguimiento a esta solicitud.</p>
                <label className="hera-consent">
                  <input type="checkbox" checked={lead.consent} onChange={(event) => setLead((current) => ({ ...current, consent: event.target.checked }))} />
                  <span>Al enviar tu información, autorizas a HEBARO a utilizar estos datos para comunicarse contigo sobre tu solicitud. <a href="/politica-de-privacidad">Política de privacidad</a>.</span>
                </label>
                {contactValidation && !lead.consent && <p className="hera-field-error">Confirma el consentimiento para continuar.</p>}
                {submitError && <p className="hera-submit-error" role="alert">{submitError}</p>}
              </div>
              <div className="hera-form-footer">
                <button className="hera-submit" type="submit" disabled={submitting || !lead.name.trim() || !hasContactMethod || !lead.consent}>
                  {submitting ? <><LoaderCircle size={17} className="hera-spinner"/> Enviando…</> : <>Enviar solicitud<ArrowRight size={17}/></>}
                </button>
                <p>Solo usaremos estos datos para responder a tu solicitud.</p>
              </div>
            </form>
          )}

          {mode === "sent" && (
            <div className="hera-success" role="status">
              <span className="hera-success-icon"><Check size={25} /></span>
              <h3>Solicitud enviada</h3>
              <p>Gracias por compartir tu proyecto. El equipo de HEBARO recibió tu solicitud.</p>
              <button type="button" onClick={closePanel}>Cerrar</button>
            </div>
          )}
        </section>
      )}

      <button
        ref={launcherRef}
        className={`hera-launcher${isRendered ? " active" : ""}`}
        type="button"
        aria-label={isOpen ? "Cerrar asistente HERA" : "Abrir asistente HERA"}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => isOpen ? closePanel() : openPanel()}
      >
        {isOpen ? <X size={21} /> : <Image className="hera-avatar hera-avatar-launcher" src={HERA_AVATAR} alt="" width={68} height={68} sizes="(max-width: 700px) 60px, 68px" />}
        <span>{isOpen ? "Cerrar" : <><small>Habla con</small>HERA</>}</span>
      </button>
    </div>
  );
}
