import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  title?: string;
};

export default function RetroPanel({ title, className = "", children, ...props }: Props) {
  return (
    <div {...props} className={`retro-panel rounded-2xl p-4 ${className}`}>
      {title ? <div className="retro-title mb-3 text-lg text-amber-900">{title}</div> : null}
      {children}
    </div>
  );
}
