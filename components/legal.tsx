import type { ReactNode } from "react";

/** A labelled item inside a legal section (e.g. one kind of data we collect). */
export function Item({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <h3>{title}</h3>
      {children}
    </>
  );
}
