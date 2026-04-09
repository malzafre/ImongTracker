import { useMemo, useState } from 'react';
import { Plus, Trash2, PencilLine } from 'lucide-react';
import { useApplications } from '../context/useApplications';
import ApplicationModal from '../components/ApplicationModal';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select } from '../components/ui/select';
import { statuses, getStatusStyle } from '../lib/status';

const ApplicationList = () => {
  const { applications, loading, updateApplication, deleteApplication } = useApplications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const summary = useMemo(() => {
    const byStatus = statuses.reduce((acc, status) => {
      acc[status] = applications.filter((app) => app.status === status).length;
      return acc;
    }, {});
    return byStatus;
  }, [applications]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center text-foreground-muted shadow-sm">
        Loading applications...
      </div>
    );
  }

  const handleOpenModal = (app = null) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApp(null);
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Tracking</p>
          <h1 className="page-title">Applications Table</h1>
          <p className="page-subtitle">Fast edits, clean overview, no clutter.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-xl px-5">
          <Plus size={16} /> New application
        </Button>
      </header>

      <section className="mb-4 flex flex-wrap gap-2">
        {statuses.map((status) => {
          const palette = getStatusStyle(status);
          return (
            <Badge
              key={status}
              variant="outline"
              className="rounded-full border px-3 py-1 text-xs"
              style={{ borderColor: `${palette.accent}40`, color: palette.accent, background: palette.soft }}
            >
              {status} • {summary[status] ?? 0}
            </Badge>
          );
        })}
      </section>

      <div className="table-shell overflow-x-auto">
        <table className="w-full min-w-[780px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-background text-xs uppercase tracking-wider text-foreground-subtle">
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date Applied</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-12 text-center text-sm text-foreground-muted">
                  No applications yet. Add your first one to build momentum.
                </td>
              </tr>
            ) : (
              applications.map((app, idx) => {
                const palette = getStatusStyle(app.status);
                return (
                  <tr
                    key={app.id}
                    className="table-row animate-fade-up border-b border-border"
                    style={{ animationDelay: `${idx * 45}ms` }}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">{app.company}</td>
                    <td className="px-4 py-3 text-foreground-muted">{app.title}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={app.status}
                        onChange={(e) => updateApplication(app.id, { status: e.target.value })}
                        className="h-9 w-[148px] rounded-lg text-xs font-semibold"
                        style={{ borderColor: `${palette.accent}55` }}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground-muted">
                      {app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleOpenModal(app)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          aria-label="Edit application"
                        >
                          <PencilLine size={15} />
                        </Button>
                        <Button
                          onClick={() => deleteApplication(app.id)}
                          variant="soft"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-danger"
                          aria-label="Delete application"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ApplicationModal isOpen={isModalOpen} onClose={handleCloseModal} applicationToEdit={editingApp} />
    </div>
  );
};

export default ApplicationList;
