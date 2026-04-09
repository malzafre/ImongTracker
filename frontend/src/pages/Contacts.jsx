import { useMemo, useState } from 'react';
import { Plus, PencilLine, Trash2, Mail, Phone, Building2, UserRound } from 'lucide-react';
import { useContacts } from '../context/useContacts';
import ContactModal from '../components/ContactModal';
import { Button } from '../components/ui/button';
import BrandEmptyState from '../components/BrandEmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

const Contacts = () => {
  const { contacts, loading, deleteContact, error } = useContacts();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const companyCount = useMemo(() => {
    return new Set(contacts.map((c) => c.company).filter(Boolean)).size;
  }, [contacts]);

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setEditingContact(null);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) {
      return;
    }

    await deleteContact(deleteCandidate.id);
    setDeleteCandidate(null);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center text-foreground-muted shadow-sm">
        Loading contacts...
      </div>
    );
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Network</p>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">Manage recruiters, referrals, and hiring-manager relationships.</p>
        </div>
        <Button
          type="button"
          className="rounded-xl px-5"
          onClick={() => {
            setEditingContact(null);
            setIsContactModalOpen(true);
          }}
        >
          <Plus size={14} /> New contact
        </Button>
      </header>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-300/50 bg-red-100/60 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <InfoCard label="Total Contacts" value={String(contacts.length)} icon={<UserRound size={16} />} />
        <InfoCard label="Companies" value={String(companyCount)} icon={<Building2 size={16} />} />
        <InfoCard
          label="With Email"
          value={String(contacts.filter((c) => c.email?.trim()).length)}
          icon={<Mail size={16} />}
        />
      </section>

      <section className="rounded-2xl border border-border bg-surface p-3 shadow-sm sm:p-4">
          {contacts.length === 0 ? (
            <BrandEmptyState
              title="No contacts yet"
              description="Add your first recruiter or referral contact to keep relationships organized."
              actionLabel="Add contact"
              onAction={() => {
                setEditingContact(null);
                setIsContactModalOpen(true);
              }}
            />
          ) : (
            <div className="space-y-2">
              {contacts.map((contact) => (
                <article key={contact.id} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{contact.name}</h4>
                      <p className="text-xs text-foreground-muted">{contact.role || 'Contact'}{contact.company ? ` • ${contact.company}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => handleEdit(contact)}>
                        <PencilLine size={14} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md text-danger hover:text-danger"
                        onClick={() => setDeleteCandidate(contact)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-foreground-muted">
                    {contact.email ? <span className="inline-flex items-center gap-1"><Mail size={12} /> {contact.email}</span> : null}
                    {contact.phone ? <span className="inline-flex items-center gap-1"><Phone size={12} /> {contact.phone}</span> : null}
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        contactToEdit={editingContact}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={confirmDelete}
        title="Delete contact?"
        description={deleteCandidate ? `This will remove ${deleteCandidate.name} from your contact list.` : 'This action cannot be undone.'}
        confirmLabel="Delete"
      />
    </div>
  );
};

const InfoCard = ({ label, value, icon }) => (
  <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
    <p className="mb-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground-subtle">
      {icon} {label}
    </p>
    <p className="text-2xl font-extrabold leading-none">{value}</p>
  </div>
);

export default Contacts;
