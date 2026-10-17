import { Fragment } from 'react';

/** Renders copy, marking any [NEEDS CLIENT: ...] placeholder so it is impossible to miss in review. */
export function Txt({ children }: { children: string }) {
  const parts = children.split(/(\[NEEDS CLIENT:[^\]]*\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('[NEEDS CLIENT') ? (
          <span className="needs" key={i}>
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
