import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link2, UserPlus, X } from 'lucide-react';
import { useApplications } from '../context/useApplications';
import { useContacts } from '../context/useContacts';
import { statuses } from '../lib/status';
import ContactModal from './ContactModal';
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
  contactId: '',
  contactName: '',
  notes: '',
};

const ApplicationModalForm = ({ onClose, applicationToEdit }) => {
  const { addApplication, updateApplication } = useApplications();
  const { contacts } = useContacts();

  const initialData = useMemo(() => {
    if (applicationToEdit) {
      return {
        company: applicationToEdit.company ?? '',
        title: applicationToEdit.title ?? '',
        status: applicationToEdit.status ?? 'Applied',
        salary: applicationToEdit.salary ?? '',
        sourceLink: applicationToEdit.sourceLink ?? '',
        contactId: applicationToEdit.contactId ?? '',
        contactName: applicationToEdit.contactName ?? '',
        notes: applicationToEdit.notes ?? '',
      };
    }

    return defaultFormData;
  }, [applicationToEdit]);

  const [formData, setFormData] = useState(initialData);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedContact = contacts.find((contact) => contact.id === formData.contactId);

    const submissionData = {
      company: formData.company.trim(),
      title: formData.title.trim(),
      status: formData.status,
      salary: formData.salary.trim(),
      sourceLink: formData.sourceLink.trim(),
      contactId: formData.contactId,
      contactName: selectedContact?.name ?? formData.contactName ?? '',
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            placeholder="Source link (job posting URL)"
            value={formData.sourceLink}
            onChange={(event) => setFormData({ ...formData, sourceLink: event.target.value })}
          />
          <div className="hidden items-center text-xs font-semibold text-foreground-subtle sm:flex">
            <Link2 size={13} />
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-background p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground-subtle">Linked Contact</p>
            <Button
              type="button"
              variant="ghost"
              className="h-8 rounded-lg px-3"
              onClick={() => setIsContactModalOpen(true)}
            >
              <UserPlus size={14} /> Create contact
            </Button>
          </div>

          <Select
            value={formData.contactId || '__none'}
            onChange={(event) => {
              const nextId = event.target.value === '__none' ? '' : event.target.value;
              const selected = contacts.find((contact) => contact.id === nextId);
              setFormData((prev) => ({
                ...prev,
                contactId: nextId,
                contactName: selected?.name ?? '',
              }));
            }}
          >
            <option value="__none">No linked contact</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}{contact.company ? ` - ${contact.company}` : ''}
              </option>
            ))}
          </Select>
        </div>

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

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        defaultCompany={formData.company.trim()}
        onSaved={(contact) => {
          setFormData((prev) => ({
            ...prev,
            contactId: contact.id,
            contactName: contact.name,
          }));
        }}
      />
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
