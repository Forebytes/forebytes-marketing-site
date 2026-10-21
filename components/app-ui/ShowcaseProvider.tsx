"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Showcase } from "@/lib/showcase";
import { PLACEHOLDER } from "./placeholder";

type State = { status: "loading" } | { status: "ready"; showcase: Showcase } | { status: "empty" };
const Ctx = createContext<State>({ status: "loading" });

/** Fetches the data for this visitor once, after the page is already on screen. */
export function ShowcaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    fetch("/api/showcase")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: { showcase: Showcase | null }) => {
        if (alive) setState(json.showcase ? { status: "ready", showcase: json.showcase } : { status: "empty" });
      })
      .catch(() => alive && setState({ status: "empty" }));
    return () => {
      alive = false;
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

/** What a phone should render: real data, or the placeholder, flagged as loading while it is on its way. */
export function useScreenData(): { s: Showcase; skeleton: boolean; live: boolean } {
  const state = useContext(Ctx);
  if (state.status === "ready") return { s: state.showcase, skeleton: false, live: true };
  return { s: PLACEHOLDER, skeleton: state.status === "loading", live: false };
}
