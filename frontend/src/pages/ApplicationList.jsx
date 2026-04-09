import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, PencilLine, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApplications } from '../context/useApplications';
import ApplicationModal from '../components/ApplicationModal';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';
import BrandEmptyState from '../components/BrandEmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import { statuses, getStatusStyle } from '../lib/status';

const getRowsPerPage = (height) => {
  if (height >= 1050) return 14;
  if (height >= 920) return 12;
  if (height >= 780) return 10;
  return 8;
};

const ApplicationList = () => {
  const { applications, loading, updateApplication, deleteApplication } = useApplications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight);

  const summary = useMemo(() => {
    const byStatus = statuses.reduce((acc, status) => {
      acc[status] = applications.filter((app) => app.status === status).length;
      return acc;
    }, {});
    return byStatus;
  }, [applications]);

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const pageSize = getRowsPerPage(viewportHeight);
  const totalPages = Math.max(1, Math.ceil(applications.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedApplications = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return applications.slice(startIndex, startIndex + pageSize);
  }, [applications, safeCurrentPage, pageSize]);

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

  const handleOpenDetails = (app) => {
    setSelectedApp(app);
  };

  const handleCloseDetails = () => {
    setSelectedApp(null);
  };

  const handleEditFromDetails = (app) => {
    setSelectedApp(null);
    handleOpenModal(app);
  };

  const requestDelete = (app, closeDetails = false) => {
    setDeleteCandidate(app);
    if (closeDetails) {
      setSelectedApp(null);
    }
  };

  const cancelDelete = () => {
    setDeleteCandidate(null);
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) {
      return;
    }

    await deleteApplication(deleteCandidate.id);
    setDeleteCandidate(null);
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

      <section className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const palette = getStatusStyle(status);
            return (
              <div
                key={status}
                className="status-chip"
                style={{ borderColor: `${palette.accent}42`, background: palette.soft }}
              >
                <span className="status-chip-dot" style={{ background: palette.accent }} />
                <span className="status-chip-label" style={{ color: palette.accent }}>{status}</span>
                <span className="status-chip-count">{summary[status] ?? 0}</span>
              </div>
            );
          })}
        </div>

        {applications.length > pageSize ? (
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-xl px-3"
              onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
              disabled={safeCurrentPage === 1}
            >
              <ChevronLeft size={14} /> Prev
            </Button>
            <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground-muted">
              {safeCurrentPage}/{totalPages} • {pageSize}/page
            </span>
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-xl px-3"
              onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
              disabled={safeCurrentPage === totalPages}
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        ) : null}
      </section>

      <div className="table-shell laptop-table-shell overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left lg:min-w-0">
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
                <td colSpan="5" className="px-4 py-8">
                  <BrandEmptyState
                    title="No applications yet"
                    description="Start with one focused opportunity and build your pipeline from there."
                    actionLabel="Add first application"
                    onAction={() => handleOpenModal()}
                  />
                </td>
              </tr>
            ) : (
               paginatedApplications.map((app, idx) => {
                 const palette = getStatusStyle(app.status);
                 return (
                  <tr
                    key={app.id}
                    className="table-row animate-fade-up cursor-pointer border-b border-border"
                    style={{ animationDelay: `${idx * 45}ms` }}
                    onClick={() => handleOpenDetails(app)}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">{app.company}</td>
                    <td className="px-4 py-3 text-foreground-muted">{app.title}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={app.status}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(e) => updateApplication(app.id, { status: e.target.value })}
                        className="h-9 w-[128px] rounded-lg text-xs font-semibold sm:w-[148px]"
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
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenModal(app);
                          }}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          aria-label="Edit application"
                        >
                          <PencilLine size={15} />
                        </Button>
                        <Button
                          onClick={(event) => {
                            event.stopPropagation();
                            requestDelete(app);
                          }}
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
      <ApplicationDetailsModal
        isOpen={Boolean(selectedApp)}
        onClose={handleCloseDetails}
        application={selectedApp}
        onEdit={handleEditFromDetails}
        onDelete={(app) => requestDelete(app, true)}
      />
      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete application?"
        description={deleteCandidate
          ? `This will permanently remove ${deleteCandidate.title} at ${deleteCandidate.company}.`
          : 'This action cannot be undone.'}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default ApplicationList;
