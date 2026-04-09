import { useMemo, useState } from 'react';
import { GripVertical, Trash2, PencilLine, Plus } from 'lucide-react';
import { useApplications } from '../context/useApplications';
import ApplicationModal from '../components/ApplicationModal';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { statuses, getStatusStyle } from '../lib/status';

const KanbanBoard = () => {
  const { applications, loading, updateApplication, deleteApplication } = useApplications();
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const grouped = useMemo(
    () =>
      statuses.reduce((acc, status) => {
        acc[status] = applications.filter((application) => application.status === status);
        return acc;
      }, {}),
    [applications]
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center text-foreground-muted shadow-sm">
        Loading board...
      </div>
    );
  }

  const handleDragStart = (event, id) => {
    setDraggedAppId(id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (event, newStatus) => {
    event.preventDefault();
    if (!draggedAppId) {
      return;
    }

    const target = applications.find((app) => app.id === draggedAppId);
    if (target && target.status !== newStatus) {
      await updateApplication(draggedAppId, { status: newStatus });
    }

    setDraggedAppId(null);
  };

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
          <p className="page-eyebrow">Pipeline</p>
          <h1 className="page-title">Kanban Workflow</h1>
          <p className="page-subtitle">Drag cards across stages and keep your pipeline visible.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-xl px-5">
          <Plus size={16} /> Add application
        </Button>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {statuses.map((status, columnIndex) => {
          const palette = getStatusStyle(status);
          const entries = grouped[status] ?? [];

          return (
            <section
              key={status}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, status)}
              className="animate-fade-up"
              style={{ animationDelay: `${columnIndex * 70}ms` }}
            >
              <Card className="h-[calc(100vh-200px)] min-h-[500px] w-[320px] overflow-hidden">
                <CardHeader className="border-b border-border bg-background py-3">
                  <CardTitle className="flex items-center justify-between text-sm font-semibold">
                    <span>{status}</span>
                    <Badge
                      variant="outline"
                      className="rounded-full border px-2.5 py-1"
                      style={{ borderColor: `${palette.accent}45`, color: palette.accent, background: palette.soft }}
                    >
                      {entries.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex h-full flex-col gap-3 overflow-y-auto p-3">
                  {entries.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-background p-4 text-center text-xs text-foreground-subtle">
                      Drop an application here
                    </div>
                  ) : (
                    entries.map((app, rowIndex) => (
                      <article
                        key={app.id}
                        draggable
                        onDragStart={(event) => handleDragStart(event, app.id)}
                        className="group animate-fade-up rounded-xl border border-border bg-background p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lift"
                        style={{ animationDelay: `${rowIndex * 35}ms` }}
                      >
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <h3 className="break-words text-sm font-semibold text-foreground">{app.title}</h3>
                          <div className="flex items-center gap-1 text-foreground-subtle">
                            <Button
                              onClick={(event) => {
                                event.stopPropagation();
                                handleOpenModal(app);
                              }}
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-md"
                              aria-label="Edit application"
                            >
                              <PencilLine size={14} />
                            </Button>
                            <Button
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteApplication(app.id);
                              }}
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-md text-danger hover:text-danger"
                              aria-label="Delete application"
                            >
                              <Trash2 size={14} />
                            </Button>
                            <GripVertical size={14} className="opacity-60" />
                          </div>
                        </div>

                        <p className="text-sm font-medium text-foreground-muted">{app.company}</p>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          {app.salary ? (
                            <Badge
                              variant="outline"
                              className="rounded-full px-2.5 py-1 text-[11px]"
                              style={{ borderColor: `${palette.accent}40`, color: palette.accent, background: palette.soft }}
                            >
                              {app.salary}
                            </Badge>
                          ) : (
                            <span className="text-xs text-foreground-subtle">No salary</span>
                          )}

                          <span className="text-[11px] text-foreground-subtle">
                            {app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </article>
                    ))
                  )}
                </CardContent>
              </Card>
            </section>
          );
        })}
      </div>

      <ApplicationModal isOpen={isModalOpen} onClose={handleCloseModal} applicationToEdit={editingApp} />
    </div>
  );
};

export default KanbanBoard;
