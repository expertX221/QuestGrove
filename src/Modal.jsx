import { useEffect, useRef } from "react";
import { ArrowLeft, X } from "@phosphor-icons/react";
export function Modal({
  title,
  onClose,
  children,
  back = "Back to the grove",
  wide = false,
}) {
  const ref = useRef(null);
  useEffect(() => {
    const prior = document.activeElement,
      old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const handle = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = [
          ...ref.current.querySelectorAll(
            'button:not(:disabled),select,input,textarea,a[href],summary,[tabindex="0"]',
          ),
        ].filter((n) => n.getClientRects().length);
        const first = f[0],
          last = f.at(-1);
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", handle);
      prior?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        ref={ref}
        className={"dialog " + (wide ? "wide" : "")}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className="dialog-top">
          <button className="back-link" onClick={onClose}>
            <ArrowLeft size={18} />
            {back}
          </button>
          <button className="close" aria-label="Close" onClick={onClose}>
            <X size={23} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
