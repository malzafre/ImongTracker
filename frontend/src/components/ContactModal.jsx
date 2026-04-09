import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useContacts } from '../context/useContacts';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const defaultFormData = {
  name: '',
  role: '',
  company: '',
  email: '',
  phone: '',
  notes: '',
};

const ContactModalForm = ({ onClose, contactToEdit, onSaved, defaultCompany = '' }) => {
  const { addContact, updateContact } = useContacts();
  const [submitError, setSubmitError] = useState('');

  const initialData = useMemo(() => {
    if (contactToEdit) {
      return {
        name: contactToEdit.name ?? '',
        role: contactToEdit.role ?? '',
        company: contactToEdit.company ?? '',
        email: contactToEdit.email ?? '',
        phone: contactToEdit.phone ?? '',
        notes: contactToEdit.notes ?? '',
      };
    }

    return {
      ...defaultFormData,
      company: defaultCompany,
    };
  }, [contactToEdit, defaultCompany]);

  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const payload = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      company: formData.company.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      notes: formData.notes.trim(),
    };

    try {
      let saved;
      if (contactToEdit) {
        await updateContact(contactToEdit.id, payload);
        saved = { ...contactToEdit, ...payload };
      } else {
        saved = await addContact(payload);
      }

      onSaved?.(saved);
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Unable to save contact.');
    }
  };

  return (
    <div className="w-full max-w-xl animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-md sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {contactToEdit ? 'Edit Contact' : 'Add Contact'}
          </h3>
          <p className="mt-1 text-sm text-foreground-muted">Keep your hiring network clean and actionable.</p>
        </div>
        <Button
          type="button"
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          aria-label="Close contact modal"
        >
          <X size={15} />
        </Button>
      </div>

      {submitError ? (
        <div className="mb-3 rounded-xl border border-red-300/50 bg-red-100/60 px-3 py-2 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          required
          placeholder="Full name"
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            placeholder="Role"
            value={formData.role}
            onChange={(event) => setFormData({ ...formData, role: event.target.value })}
          />
          <Input
            placeholder="Company"
            value={formData.company}
            onChange={(event) => setFormData({ ...formData, company: event.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
          />
          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
          />
        </div>

        <Textarea
          placeholder="Notes"
          className="min-h-24"
          value={formData.notes}
          onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
        />

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button type="button" onClick={onClose} variant="ghost" className="rounded-xl">
            Cancel
          </Button>
          <Button type="submit" className="rounded-xl px-5">
            {contactToEdit ? 'Save contact' : 'Create contact'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const ContactModal = ({ isOpen, onClose, contactToEdit, onSaved, defaultCompany }) => {
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <ContactModalForm
        key={contactToEdit?.id ?? 'new-contact'}
        onClose={onClose}
        contactToEdit={contactToEdit}
        onSaved={onSaved}
        defaultCompany={defaultCompany}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ContactModal;
