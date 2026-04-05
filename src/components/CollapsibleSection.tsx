import { useState, type ReactNode } from 'react';

type Props = {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
};

export default function CollapsibleSection({ title, count, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="collapsible">
      <button className="collapsible-header" onClick={() => setOpen((o) => !o)}>
        <span className="collapsible-arrow">{open ? '▾' : '▸'}</span>
        <span className="collapsible-title">{title}</span>
        <span className="collapsible-count">（{count}件）</span>
      </button>
      {open && <div className="collapsible-body">{children}</div>}
    </div>
  );
}
