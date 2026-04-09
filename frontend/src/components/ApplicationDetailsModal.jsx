import { createPortal } from 'react-dom';
import { CalendarDays, CircleDollarSign, Link2, NotebookText, PencilLine, Trash2, UserRound, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getStatusStyle } from '../lib/status';

const ApplicationDetailsModal = ({ isOpen, onClose, application, onEdit, onDelete }) => {
  if (!isOpen || !application) {
    return null;
  }

  const palette = getStatusStyle(application.status);
  const readableDate = application.dateApplied
    ? new Date(application.dateApplied).toLocaleDateString()
    : 'N/A';

  const sourceLink = application.sourceLink?.trim();
  const normalizedLink = sourceLink && !/^https?:\/\//i.test(sourceLink)
    ? `https://${sourceLink}`
    : sourceLink;

  const modalContent = (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-md sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="page-eyebrow">Application Details</p>
            <h3 className="text-xl font-extrabold tracking-tight text-foreground">{application.title}</h3>
            <p className="mt-1 text-sm font-medium text-foreground-muted">{application.company}</p>
          </div>
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            aria-label="Close details modal"
          >
            <X size={15} />
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="rounded-full border px-3 py-1 text-xs font-semibold"
            style={{ borderColor: `${palette.accent}42`, background: palette.soft, color: palette.accent }}
          >
            {application.status}
          </Badge>
          <Badge variant="outline" className="rounded-full border px-3 py-1 text-xs font-semibold">
            <CalendarDays size={12} /> Applied: {readableDate}
          </Badge>
          {application.salary ? (
            <Badge variant="outline" className="rounded-full border px-3 py-1 text-xs font-semibold">
              <CircleDollarSign size={12} /> {application.salary}
            </Badge>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-foreground-subtle">Source Link</p>
            {normalizedLink ? (
              <a
                href={normalizedLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover"
              >
                <Link2 size={14} /> Open source posting
              </a>
            ) : (
              <p className="text-sm text-foreground-muted">No source link added.</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-background p-3">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-foreground-subtle">Linked Contact</p>
            {application.contactName?.trim() ? (
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted">
                <UserRound size={13} /> {application.contactName}
              </p>
            ) : (
              <p className="text-sm text-foreground-muted">No contact linked.</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-background p-3">
            <p className="mb-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground-subtle">
              <NotebookText size={12} /> Notes
            </p>
            <p className="whitespace-pre-wrap text-sm text-foreground-muted">
              {application.notes?.trim() ? application.notes : 'No notes yet.'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => onEdit?.(application)}
          >
            <PencilLine size={14} /> Edit
          </Button>
          <Button
            type="button"
            variant="soft"
            className="rounded-xl text-danger hover:text-danger"
            onClick={() => onDelete?.(application)}
          >
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ApplicationDetailsModal;
