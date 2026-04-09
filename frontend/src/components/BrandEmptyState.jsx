import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';

const BrandEmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm sm:p-8">
      <Illustration />
      <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-foreground-muted">{description}</p>

      <div className="mt-4 flex justify-center gap-2">
        {actionLabel && onAction ? (
          <Button onClick={onAction} className="rounded-xl px-5">
            {actionLabel}
          </Button>
        ) : null}
      </div>

      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground-subtle">
        <Sparkles size={12} />
        Small systems create big momentum.
      </div>
    </div>
  );
};

const Illustration = () => {
  return (
    <div className="mx-auto w-full max-w-[360px]">
      <svg viewBox="0 0 360 180" className="h-auto w-full" aria-hidden="true">
        <defs>
          <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--bg-surface)" />
            <stop offset="100%" stopColor="var(--bg-muted)" />
          </linearGradient>
        </defs>
        <rect x="32" y="24" width="296" height="132" rx="18" fill="url(#panel)" stroke="var(--border-color)" />
        <rect x="52" y="44" width="112" height="18" rx="9" fill="var(--color-primary-soft)" />
        <rect x="176" y="44" width="132" height="18" rx="9" fill="var(--bg-base)" stroke="var(--border-color)" />
        <rect x="52" y="74" width="256" height="14" rx="7" fill="var(--bg-base)" stroke="var(--border-color)" />
        <rect x="52" y="98" width="180" height="14" rx="7" fill="var(--bg-base)" stroke="var(--border-color)" />
        <rect x="52" y="122" width="148" height="14" rx="7" fill="var(--bg-base)" stroke="var(--border-color)" />
        <rect x="240" y="94" width="68" height="42" rx="12" fill="var(--color-primary-soft)" stroke="var(--color-primary-faint)" />
        <circle cx="274" cy="114" r="10" fill="var(--color-primary)" opacity="0.92" />
      </svg>
    </div>
  );
};

export default BrandEmptyState;
