/* ============================================================
   Signature Field signal bus.
   Decouples any UI element (nav links, buttons, form) from the
   background canvas so hovering/clicking can "send a wave of
   energy" through the shared visual system without prop drilling.
   ============================================================ */

export const SIGNATURE_PULSE_EVENT = "signature-field:pulse";

export function pulseSignatureField(strength = 1) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<number>(SIGNATURE_PULSE_EVENT, { detail: strength })
  );
}
