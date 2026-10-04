import { Cpu, Code2, Workflow, Store, Users, Handshake, Network } from "lucide-react";
import { islandPaths } from "./puerto-rico-paths";

const nodes = [[105, 193], [162, 152], [225, 186], [292, 140], [335, 202], [404, 159], [451, 202], [519, 230], [554, 166]];

export function PuertoRicoNetwork() {
  return <div className="pr-network">
    <svg viewBox="60 38 520 325" focusable="false">
      <defs>
        <radialGradient id="pr-light"><stop stopColor="#65C5CC" stopOpacity=".26"/><stop offset="1" stopColor="#65C5CC" stopOpacity="0"/></radialGradient>
        <linearGradient id="pr-land" x2="0" y2="1"><stop stopColor="#103C42"/><stop offset="1" stopColor="#031F24"/></linearGradient>
        <pattern id="pr-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#65C5CC" strokeOpacity=".08" strokeWidth=".7"/></pattern>
        <filter id="pr-glow"><feGaussianBlur stdDeviation="3"/></filter>
        <clipPath id="pr-clip">{islandPaths.map(d => <path key={d} d={d}/>)}</clipPath>
      </defs>
      <ellipse cx="320" cy="202" rx="310" ry="180" fill="url(#pr-light)"/>
      <path d="M25 290H602M45 100H600M95 65V320M550 80V315" fill="none" stroke="#65C5CC" strokeOpacity=".12" strokeDasharray="3 7"/>
      <ellipse cx="320" cy="215" rx="285" ry="126" fill="none" stroke="#65C5CC" strokeOpacity=".1"/>
      <g transform="translate(0 8)" opacity=".45">{islandPaths.map(d => <path key={d} d={d} fill="#031F24" stroke="#29454F" strokeWidth="2"/>)}</g>
      {islandPaths.map(d => <path key={d} d={d} fill="url(#pr-land)" stroke="#D6BF9F" strokeWidth="1.5"/>)}
      <rect width="640" height="400" fill="url(#pr-grid)" clipPath="url(#pr-clip)"/>
      <g fill="none" stroke="#65C5CC" strokeWidth="1.1" strokeOpacity=".85"><path d="M105 193 162 152 225 186 292 140 404 159 451 202 519 230M105 193 225 186 335 202 404 159 554 166M162 152 292 140 335 202 451 202M225 186 404 159M335 202 519 230"/></g>
      <path d="M292 140V79H373M105 193 69 258H35M451 202V298H530" fill="none" stroke="#D6BF9F" strokeWidth=".8" strokeOpacity=".55"/>
      <g filter="url(#pr-glow)" opacity=".8">{nodes.map(([x,y],i) => <circle key={x} cx={x} cy={y} r={i===3 ? 10 : 8} fill={i===3 ? "#D6BF9F" : "#65C5CC"}/>)}</g>
      {nodes.map(([x,y],i) => <g key={x}><circle cx={x} cy={y} r="8" fill="#031F24" stroke={i===3 ? "#D6BF9F" : "#65C5CC"} strokeOpacity=".6" strokeWidth=".7"/><circle cx={x} cy={y} r={i===3 ? 4 : 3.5} fill={i===3 ? "#D6BF9F" : "#8EDCE0"}/></g>)}
      <g className="pr-label"><text x="382" y="82">TALENTO LOCAL</text><text x="65" y="278">TECNOLOGÍA CON PROPÓSITO</text><text x="405" y="320">CONEXIONES QUE CRECEN</text></g>
    </svg>
    <p className="pr-network-caption"><span/>Desde Puerto Rico, conectamos posibilidades.</p>
  </div>;
}

export function ConnectionMotif() {
  return <div className="about-connection" aria-hidden="true"><svg viewBox="0 0 300 300" focusable="false"><circle cx="150" cy="150" r="120"/><circle cx="150" cy="150" r="94" strokeDasharray="2 9"/><path d="M150 30V106M46 210 112 173M254 210 188 173M68 62 122 116M232 62 178 116M150 194V270"/>{[[150,30],[46,210],[254,210],[68,62],[232,62],[150,270]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" className="connection-node"/>)}</svg><div className="connection-core"><Network size={28} strokeWidth={1.2}/><strong>PR</strong><span>TALENTO · CONEXIÓN</span></div></div>;
}

export function PathDiagram({ variant }: { variant: "solutions" | "marketplace" }) {
  const steps = variant === "solutions" ? [[Code2, "Software"], [Cpu, "Tecnología"], [Workflow, "Procesos"]] as const : [[Store, "Negocios"], [Users, "Conexiones"], [Handshake, "Colaboración"]] as const;
  return <div className={`about-diagram about-diagram--${variant}`} aria-hidden="true">{steps.map(([Icon,label]) => <div className="about-diagram-node" key={label}><span><Icon size={26} strokeWidth={1.3}/></span><small>{label}</small></div>)}</div>;
}
