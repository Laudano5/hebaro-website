"use client";

import { useRef, type RefObject } from "react";
import { useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  PlugZap,
  ReceiptText,
  UsersRound,
  Workflow,
} from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { BackgroundBeams } from "@/components/ui/background-beams";

type ElementRef = RefObject<HTMLDivElement | null>;

function FlowBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reduced,
}: {
  containerRef: ElementRef;
  fromRef: ElementRef;
  toRef: ElementRef;
  curvature?: number;
  reduced: boolean | null;
}) {
  return (
    <AnimatedBeam
      className="application-beam"
      containerRef={containerRef}
      fromRef={fromRef}
      toRef={toRef}
      curvature={curvature}
      duration={8}
      repeat={reduced ? 0 : Infinity}
      repeatDelay={1.2}
      pathColor="#29454F"
      pathOpacity={0.24}
      pathWidth={1.5}
      gradientStartColor="#65bac1"
      gradientStopColor="#91d2d3"
    />
  );
}

export function SolutionsHeroVisual() {
  return (
    <div
      className="business-system-visual"
      role="img"
      aria-label="Una capa tecnológica HEBARO conecta los sistemas de una operación"
    >
      <BackgroundBeams className="solution-background-beams" />
      <svg className="hero-connection-map" viewBox="0 0 560 380" aria-hidden="true">
        <path d="M52 78h95l62 79m-157 86h95l62-45m297-120h-95l-62 79m157 86h-95l-62-45" />
        <circle cx="52" cy="78" r="4" /><circle cx="52" cy="243" r="4" />
        <circle cx="508" cy="78" r="4" /><circle cx="508" cy="243" r="4" />
      </svg>
      <div className="hero-tech-core" aria-hidden="true">
        <svg viewBox="0 0 240 240">
          <defs>
            <linearGradient id="heroGlassTop" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#8ad0d1" stopOpacity=".48" /><stop offset="1" stopColor="#173b43" stopOpacity=".84" /></linearGradient>
            <linearGradient id="heroGlassFace" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#315b63" /><stop offset="1" stopColor="#09262d" /></linearGradient>
          </defs>
          <path d="m120 26 85 48-85 49-85-49z" fill="url(#heroGlassTop)" stroke="#8bc9cd" strokeOpacity=".72" />
          <path d="m35 74 85 49v94l-85-48z" fill="url(#heroGlassFace)" stroke="#77bbc0" strokeOpacity=".48" />
          <path d="m205 74-85 49v94l85-48z" fill="#12353d" stroke="#77bbc0" strokeOpacity=".62" />
          <path d="m120 47 48 27-48 28-48-28z" fill="#0c2c33" stroke="#d1ae76" strokeOpacity=".82" />
          <path d="M120 102v90m-36-68v47m72-47v47M84 137l36 21 36-21" fill="none" stroke="#c9a36d" strokeOpacity=".92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m49 87 61 35v70m81-105-61 35v70" fill="none" stroke="#8bc9cd" strokeOpacity=".35" />
          <path d="m120 212 85-48" fill="none" stroke="#d1ae76" strokeOpacity=".7" strokeWidth="2" />
        </svg>
      </div>
      <span className="hero-core-halo" aria-hidden="true" />
    </div>
  );
}

function AutomationVisual() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const taskRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  return (
    <div className="application-art automation-visual" ref={containerRef} role="img" aria-label="Solicitud, documento y tarea se procesan mediante automatización y se completan">
      <FlowBeam containerRef={containerRef} fromRef={requestRef} toRef={engineRef} curvature={40} reduced={reduced} />
      <FlowBeam containerRef={containerRef} fromRef={documentRef} toRef={engineRef} reduced={reduced} />
      <FlowBeam containerRef={containerRef} fromRef={taskRef} toRef={engineRef} curvature={-40} reduced={reduced} />
      <FlowBeam containerRef={containerRef} fromRef={engineRef} toRef={resultRef} reduced={reduced} />
      <div className="automation-input automation-input-request" ref={requestRef}><ClipboardList /><span>Solicitud</span></div>
      <div className="automation-input automation-input-document" ref={documentRef}><FileText /><span>Documento</span></div>
      <div className="automation-input automation-input-task" ref={taskRef}><ListChecks /><span>Tarea</span></div>
      <div className="automation-hub" ref={engineRef}><Workflow size={38} strokeWidth={1.5} /><b>Automatización</b></div>
      <div className="automation-result" ref={resultRef}><CheckCircle2 size={34} strokeWidth={1.5} /><span>Completado</span></div>
    </div>
  );
}

function OperationsVisual() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const tasksRef = useRef<HTMLDivElement>(null);
  const inventoryRef = useRef<HTMLDivElement>(null);
  const documentsRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLDivElement>(null);

  return (
    <div className="application-art operations-visual" ref={containerRef} role="img" aria-label="Proyectos, tareas, inventario y documentos organizados en un sistema operacional">
      <FlowBeam containerRef={containerRef} fromRef={projectsRef} toRef={systemRef} curvature={36} reduced={reduced} />
      <FlowBeam containerRef={containerRef} fromRef={tasksRef} toRef={systemRef} curvature={-36} reduced={reduced} />
      <FlowBeam containerRef={containerRef} fromRef={inventoryRef} toRef={systemRef} curvature={-36} reduced={reduced} />
      <FlowBeam containerRef={containerRef} fromRef={documentsRef} toRef={systemRef} curvature={36} reduced={reduced} />
      <div className="operations-source operations-projects" ref={projectsRef}><FolderKanban /><span>Proyectos</span></div>
      <div className="operations-source operations-tasks" ref={tasksRef}><ListChecks /><span>Tareas</span></div>
      <div className="operations-source operations-inventory" ref={inventoryRef}><Database /><span>Inventario</span></div>
      <div className="operations-source operations-documents" ref={documentsRef}><FileText /><span>Documentos</span></div>
      <div className="operations-system" ref={systemRef}><LayoutDashboard size={40} strokeWidth={1.4} /><b>Sistema operacional</b></div>
    </div>
  );
}

function DigitalExperienceVisual() {
  return (
    <div className="application-art digital-experience-visual" role="img" aria-label="Vista de una experiencia digital en computadora y móvil">
      <div className="experience-screen">
        <div className="experience-nav"><b>Portal</b><span>Inicio</span><span>Servicios</span><span>Contacto</span></div>
        <div className="experience-content"><small>EXPERIENCIA DIGITAL</small><b>Servicios en un solo lugar</b><i /><i /><div>Explorar <ArrowRight size={14} /></div></div>
      </div>
      <div className="experience-phone"><i /><b /><span /><span /><em /></div>
    </div>
  );
}

function IntegrationVisual() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const crmRef = useRef<HTMLDivElement>(null);
  const operationsRef = useRef<HTMLDivElement>(null);
  const billingRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);

  return (
    <div className="application-art integration-visual" ref={containerRef} role="img" aria-label="CRM, operaciones, facturación y portal conectados a un centro de integración">
      <FlowBeam containerRef={containerRef} fromRef={crmRef} toRef={hubRef} curvature={38} reduced={reduced} />
      <FlowBeam containerRef={containerRef} fromRef={operationsRef} toRef={hubRef} curvature={-38} reduced={reduced} />
      <FlowBeam containerRef={containerRef} fromRef={billingRef} toRef={hubRef} curvature={-38} reduced={reduced} />
      <FlowBeam containerRef={containerRef} fromRef={portalRef} toRef={hubRef} curvature={38} reduced={reduced} />
      <div className="integration-endpoint endpoint-crm" ref={crmRef}><UsersRound /><span>CRM</span></div>
      <div className="integration-endpoint endpoint-operations" ref={operationsRef}><LayoutDashboard /><span>Operaciones</span></div>
      <div className="integration-endpoint endpoint-billing" ref={billingRef}><ReceiptText /><span>Facturación</span></div>
      <div className="integration-endpoint endpoint-portal" ref={portalRef}><LayoutDashboard /><span>Portal</span></div>
      <div className="integration-hub" ref={hubRef}><PlugZap size={34} strokeWidth={1.45} /><b>Integración</b></div>
    </div>
  );
}

export function ApplicationVisual({ index }: { index: number }) {
  switch (index) {
    case 0: return <AutomationVisual />;
    case 1: return <OperationsVisual />;
    case 2: return <DigitalExperienceVisual />;
    default: return <IntegrationVisual />;
  }
}
