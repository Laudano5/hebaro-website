import Image from "next/image";
import { BrainCircuit, Database, GraduationCap, Workflow, CodeXml, Building2 } from "lucide-react";

const nodes = [
  { label: "IA", icon: BrainCircuit, x: 24, y: 18 },
  { label: "Software", icon: CodeXml, x: 14, y: 50 },
  { label: "Datos", icon: Database, x: 26, y: 82 },
  { label: "Automatización", icon: Workflow, x: 76, y: 18 },
  { label: "Capacitación", icon: GraduationCap, x: 86, y: 50 },
  { label: "Negocios", icon: Building2, x: 74, y: 82 },
];

export default function ContactNetwork() {
  return (
    <div className="contact-network" aria-hidden="true">
      <svg className="contact-network-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map(({ label, x, y }) => (
          <path key={label} d={`M 50 50 Q ${x} 50 ${x} ${y}`} />
        ))}
        <ellipse cx="50" cy="50" rx="34" ry="35" />
        {[[35, 29], [67, 36], [34, 66], [65, 73], [50, 15], [50, 86]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r=".55" />
        ))}
      </svg>
      <div className="contact-network-core">
        <Image src="/public/images/Blanco sin BG-02.png" alt="" width={2973} height={896} />
      </div>
      {nodes.map(({ label, icon: Icon, x, y }) => (
        <div className="contact-network-node" key={label} style={{ left: `${x}%`, top: `${y}%` }}>
          <span><Icon size={23} strokeWidth={1.5} /></span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}
