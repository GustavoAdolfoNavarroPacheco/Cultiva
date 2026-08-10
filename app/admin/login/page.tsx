"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-deep/40 px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-2xl font-semibold text-ink">
          Cultiva
        </Link>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
          Panel administrativo
        </p>

        <form
          action={formAction}
          className="mt-8 space-y-5 rounded-2xl border border-paper-line bg-paper p-7 shadow-[4px_4px_0_0_rgba(36,29,18,0.06)]"
        >
          <div>
            <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-paper-line bg-paper px-4 py-3 text-ink focus:border-clay"
              placeholder="admin@cultiva.demo"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-paper-line bg-paper px-4 py-3 text-ink focus:border-clay"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p className="rounded-lg bg-clay/10 px-3 py-2 text-[13px] text-clay-deep" role="alert">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-clay px-6 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-paper shadow-[3px_3px_0_0_var(--color-clay-deep)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
