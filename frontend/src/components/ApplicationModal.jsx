import React, { useState, useMemo } from 'react';
import { useApplications } from '../context/useApplications';

const statuses = ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const defaultFormData = { company: '', title: '', status: 'Applied', salary: '', notes: '' };

const ApplicationModal = ({ isOpen, onClose, applicationToEdit }) => {
  const { addApplication, updateApplication } = useApplications();

  const initialData = useMemo(
    () => applicationToEdit ?? defaultFormData,
    [applicationToEdit]
  );

  const [formData, setFormData] = useState(initialData);

  // Reset form data when the modal opens or the edit target changes
  if (isOpen && formData !== initialData && formData._syncKey !== initialData) {
    setFormData({ ...initialData, _syncKey: initialData });
  }

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _syncKey, ...submissionData } = formData;
    if (applicationToEdit) {
      await updateApplication(applicationToEdit.id, submissionData);
    } else {
      await addApplication(submissionData);
    }
    onClose();
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 
    }}>
      <div style={{ 
        background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--border-radius)', 
        width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-md)' 
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          {applicationToEdit ? 'Edit Application' : 'Add New Application'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input required placeholder="Company Name" value={formData.company || ''} onChange={e => setFormData({...formData, company: e.target.value})} style={inputStyle} />
          <input required placeholder="Job Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} style={inputStyle} />
          <select value={formData.status || 'Applied'} onChange={e => setFormData({...formData, status: e.target.value})} style={inputStyle}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input placeholder="Salary / Comp (e.g. $80k - $100k)" value={formData.salary || ''} onChange={e => setFormData({...formData, salary: e.target.value})} style={inputStyle} />
          <textarea placeholder="Notes / Links" value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} style={{...inputStyle, minHeight: '100px'}} />
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', color: 'var(--text-secondary)' }}>Cancel</button>
            <button type="submit" style={{ background: 'var(--color-primary)', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: 'var(--border-radius)' }}>
              {applicationToEdit ? 'Save Changes' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)',
  border: '1px solid var(--border-color)', background: 'var(--bg-base)',
  color: 'var(--text-primary)', outline: 'none'
};

export default ApplicationModal;
