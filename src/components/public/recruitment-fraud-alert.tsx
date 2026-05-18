"use client";

import { AlertTriangle, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { buttonClassName } from "@/components/ui/button";

const STORAGE_KEY = "teknos-recruitment-fraud-alert-dismissed";

const warningPoints = [
  "Teknos tidak memungut biaya dalam bentuk apa pun selama proses rekrutmen.",
  "Lamaran resmi hanya diproses melalui portal career.teknos.id atau kanal resmi perusahaan.",
  "Abaikan pihak yang meminta transfer, OTP, PIN, atau akses akun pribadi atas nama Teknos.",
];

export function RecruitmentFraudAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  const dismissAlert = useCallback(() => {
    window.sessionStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY) !== "true") {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    primaryButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissAlert();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dismissAlert, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[3px]" />
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="animate-rise-in relative w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-paper shadow-[0_28px_90px_rgba(15,23,42,0.28)]"
        role="dialog"
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand via-accent to-fresh" />
        <button
          aria-label="Tutup peringatan penipuan rekrutmen"
          className="absolute right-4 top-4 rounded-full border border-line bg-white/85 p-2 text-slate-500 shadow-sm transition hover:border-brand/30 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          onClick={dismissAlert}
          type="button"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4 pr-10">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
              <AlertTriangle className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
                Pengumuman Resmi
              </p>
              <h2
                className="text-2xl font-bold tracking-tight text-brand sm:text-3xl"
                id={titleId}
              >
                Waspada Penipuan Rekrutmen
              </h2>
            </div>
          </div>

          <p
            className="mt-5 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base"
            id={descriptionId}
          >
            Seluruh proses seleksi kandidat Teknos dilakukan secara transparan.
            Jangan melanjutkan komunikasi bila ada pihak yang meminta biaya,
            data sensitif, atau transaksi di luar kanal resmi.
          </p>

          <div className="mt-6 space-y-3">
            {warningPoints.map((point) => (
              <div
                className="flex gap-3 rounded-2xl border border-line/80 bg-white/75 p-4"
                key={point}
              >
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-fresh"
                  aria-hidden="true"
                />
                <p className="text-sm leading-6 text-slate-700">{point}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-brand/10 bg-brand/[0.04] p-4">
            <div className="flex gap-3">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                aria-hidden="true"
              />
              <p className="text-sm leading-6 text-slate-700">
                Jika ragu, hentikan komunikasi dan verifikasi kembali informasi
                lowongan melalui portal ini atau kanal resmi Teknos.
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              Peringatan ini ditampilkan sekali per sesi browser.
            </p>
            <button
              className={buttonClassName({ className: "w-full sm:w-auto" })}
              onClick={dismissAlert}
              ref={primaryButtonRef}
              type="button"
            >
              Saya mengerti
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
