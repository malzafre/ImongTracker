import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useApplications } from '../context/useApplications';
import { statuses } from '../lib/status';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';

const defaultFormData = {
  company: '',
  title: '',
  status: 'Applied',
  salary: '',
  sourceLink: '',
  notes: '',
};

const ApplicationModalForm = ({ onClose, applicationToEdit }) => {
  const { addApplication, updateApplication } = useApplications();

  const initialData = useMemo(() => {
    if (applicationToEdit) {
      return {
        company: applicationToEdit.company ?? '',
        title: applicationToEdit.title ?? '',
        status: applicationToEdit.status ?? 'Applied',
        salary: applicationToEdit.salary ?? '',
        sourceLink: applicationToEdit.sourceLink ?? '',
        notes: applicationToEdit.notes ?? '',
      };
    }

    return defaultFormData;
  }, [applicationToEdit]);

  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submissionData = {
      company: formData.company.trim(),
      title: formData.title.trim(),
      status: formData.status,
      salary: formData.salary.trim(),
      sourceLink: formData.sourceLink.trim(),
      notes: formData.notes.trim(),
    };

    if (applicationToEdit) {
      await updateApplication(applicationToEdit.id, submissionData);
    } else {
      await addApplication(submissionData);
    }

    onClose();
  };

  return (
    <div className="w-full max-w-xl animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-md sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {applicationToEdit ? 'Edit Application' : 'Add New Application'}
          </h3>
          <p className="mt-1 text-sm text-foreground-muted">Keep details concise now, enrich notes later.</p>
        </div>
        <Button
          type="button"
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          aria-label="Close modal"
        >
          <X size={15} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            required
            placeholder="Company"
            value={formData.company}
            onChange={(event) => setFormData({ ...formData, company: event.target.value })}
          />
          <Input
            required
            placeholder="Role / Title"
            value={formData.title}
            onChange={(event) => setFormData({ ...formData, title: event.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Select
            value={formData.status}
            onChange={(event) => setFormData({ ...formData, status: event.target.value })}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>

          <Input
            placeholder="Salary / Comp"
            value={formData.salary}
            onChange={(event) => setFormData({ ...formData, salary: event.target.value })}
          />
        </div>

        <Input
          placeholder="Source link (job posting URL)"
          value={formData.sourceLink}
          onChange={(event) => setFormData({ ...formData, sourceLink: event.target.value })}
        />

        <Textarea
          placeholder="Notes, links, prep reminders"
          value={formData.notes}
          onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
          className="min-h-28"
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" onClick={onClose} variant="ghost" className="rounded-xl">
            Cancel
          </Button>
          <Button type="submit" className="rounded-xl px-5">
            {applicationToEdit ? 'Save changes' : 'Save application'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const ApplicationModal = ({ isOpen, onClose, applicationToEdit }) => {
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <ApplicationModalForm
        key={applicationToEdit?.id ?? 'new'}
        onClose={onClose}
        applicationToEdit={applicationToEdit}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ApplicationModal;
