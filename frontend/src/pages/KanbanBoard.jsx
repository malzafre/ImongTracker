import React, { useState } from 'react';
import { useApplications } from '../context/useApplications';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import ApplicationModal from '../components/ApplicationModal';

const statuses = ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const KanbanBoard = () => {
  const { applications, loading, updateApplication, deleteApplication } = useApplications();
  const [draggedAppId, setDraggedAppId] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  if (loading) return <div style={{ padding: '2rem' }}>Loading board...</div>;

  const handleDragStart = (e, id) => {
    setDraggedAppId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (draggedAppId) {
      const app = applications.find(a => a.id === draggedAppId);
      if (app && app.status !== newStatus) {
        await updateApplication(draggedAppId, { status: newStatus });
      }
      setDraggedAppId(null);
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <h2>Kanban Board</h2>
      
      <div style={{ 
        display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', 
        height: 'calc(100vh - 200px)', minHeight: '500px'
      }}>
        {statuses.map(status => (
          <div 
            key={status}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
            style={{ 
              background: 'var(--bg-surface)', borderRadius: 'var(--border-radius)', 
              minWidth: '300px', width: '300px', display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)',
              overflow: 'hidden'
            }}
          >
            <div style={{ 
              padding: '1rem', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-color)',
              fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              {status}
              <span style={{ 
                background: 'var(--color-primary)', color: '#fff', fontSize: '0.8rem', 
                padding: '0.2rem 0.6rem', borderRadius: '1rem' 
              }}>
                {applications.filter(a => a.status === status).length}
              </span>
            </div>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
              {applications.filter(app => app.status === status).map(app => (
                <div 
                  key={app.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, app.id)}
                  style={{
                    background: 'var(--bg-base)', padding: '1rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', cursor: 'grab',
                    transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', wordBreak: 'break-word', paddingRight: '1rem' }}>{app.title}</h4>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button onClick={(e) => { e.stopPropagation(); handleOpenModal(app); }} style={{ color: 'var(--color-primary)', padding: '0', background: 'none' }}>
                        <Edit size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteApplication(app.id); }} style={{ color: '#dc2626', padding: '0', background: 'none' }}>
                        <Trash2 size={16} />
                      </button>
                      <GripVertical size={16} color="var(--text-secondary)" style={{ cursor: 'grab', marginLeft: '0.25rem' }} />
                    </div>
                  </div>
                  <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem' }}>{app.company}</p>
                  
                  {app.salary && (
                    <div style={{ display: 'inline-block', padding: '0.2rem 0.5rem', background: 'rgba(52, 211, 153, 0.1)', color: 'var(--color-primary)', borderRadius: '4px', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      {app.salary}
                    </div>
                  )}
                  
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'right' }}>
                    {app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        applicationToEdit={editingApp} 
      />
    </div>
  );
};

export default KanbanBoard;
