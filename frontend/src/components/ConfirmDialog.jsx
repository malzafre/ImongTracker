import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm action',
  description,
  confirmLabel = 'Confirm',
}) => {
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-md sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-300/50 bg-red-100/60 text-red-700">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-foreground-muted">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="soft"
            className="rounded-xl text-danger hover:text-danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmDialog;
