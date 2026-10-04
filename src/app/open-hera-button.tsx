"use client";

import { ArrowRight } from "lucide-react";

export default function OpenHeraButton() {
  return (
    <button
      className="button button-outline"
      type="button"
      onClick={() => document.querySelector<HTMLButtonElement>(".hera-launcher")?.click()}
    >
      Habla con HERA <ArrowRight size={17} />
    </button>
  );
}
