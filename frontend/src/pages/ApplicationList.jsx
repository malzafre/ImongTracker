import React, { useState } from 'react';
import { useApplications } from '../context/useApplications';
import { Plus, Trash2, Edit } from 'lucide-react';
import ApplicationModal from '../components/ApplicationModal';

const statuses = ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const ApplicationList = () => {
  const { applications, loading, updateApplication, deleteApplication } = useApplications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  if (loading) return <div style={{ padding: '2rem' }}>Loading applications...</div>;

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>All Applications</h2>
        <button 
          onClick={() => handleOpenModal()}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            background: 'var(--color-primary)', color: '#fff', 
            padding: '0.5rem 1rem', borderRadius: 'var(--border-radius)', fontWeight: 'bold'
          }}
        >
          <Plus size={18} /> New Application
        </button>
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Company</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Role</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Date Applied</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No applications found. Add one!</td>
              </tr>
            ) : applications.map(app => (
              <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{app.company}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{app.title}</td>
                <td style={{ padding: '1rem' }}>
                  <select 
                    value={app.status} 
                    onChange={(e) => updateApplication(app.id, { status: e.target.value })}
                    style={{ 
                      padding: '0.4rem', borderRadius: '4px', background: 'var(--bg-base)', 
                      border: '1px solid var(--border-color)', color: 'var(--text-primary)' 
                    }}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                  {app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenModal(app)} style={{ color: 'var(--color-primary)', padding: '0.25rem', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '4px' }}>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteApplication(app.id)} style={{ color: '#dc2626', padding: '0.25rem', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '4px' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        applicationToEdit={editingApp} 
      />
    </div>
  );
};

export default ApplicationList;
