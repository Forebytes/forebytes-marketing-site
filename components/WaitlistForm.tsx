"use client";

import { useState, type FormEvent } from "react";

type State = "idle" | "loading" | "done" | "error";

export default function WaitlistForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), company: form.get("company") }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "done") {
    return <div role="status" className="font-heading text-[32px]">You&apos;re on the list. Talk soon.</div>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap justify-center gap-2.5" noValidate={false}>
      <label className="sr-only" htmlFor="wl-email">Email address</label>
      <input id="wl-email" name="email" type="email" required autoComplete="email" placeholder="you@email.com" className="input !text-[17px]" style={{ minWidth: "min(320px,80vw)", width: "auto" }} />
      {/* honeypot */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <button type="submit" disabled={state === "loading"} className="btn !bg-bg !text-accent-900 hover:!bg-accent-100 !px-7 !py-3.5 !text-[17px]">
        {state === "loading" ? "Joining…" : "Join the waitlist"}
      </button>
      {state === "error" && <p role="alert" className="basis-full text-base">{error}</p>}
    </form>
  );
}
