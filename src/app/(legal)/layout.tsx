import type { ReactNode } from "react";
import { SiteHeader } from "../site-header";
import SiteFooter from "../site-footer";
import "./legal.css";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return <>
    <div className="internal-header-band"><SiteHeader /></div>
    {children}
    <SiteFooter />
  </>;
}
