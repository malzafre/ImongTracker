import React, { useState, useEffect } from 'react';
import { applicationsApi } from '../api';
import { useAuth } from './useAuth';
import { ApplicationContext } from './useApplications';

export const ApplicationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial fetch — uses promise chaining so no synchronous setState in effect body
  useEffect(() => {
    if (!currentUser) return;

    let active = true;

    applicationsApi.getAll()
      .then(data => {
        if (active) setApplications(data);
      })
      .catch(err => {
        if (active) {
          console.error(err);
          setError(err.message);
        }
      });

    return () => { active = false; };
  }, [currentUser]);

  // Manual refresh — safe to call from event handlers (not inside effects)
  const fetchApplications = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await applicationsApi.getAll();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setLoading(false);
  };

  const addApplication = async (newApp) => {
    const created = await applicationsApi.create({
      ...newApp,
      dateApplied: new Date().toISOString()
    });
    setApplications(prev => [created, ...prev]);
    return created;
  };

  const updateApplication = async (id, updates) => {
    await applicationsApi.update(id, updates);
    setApplications(prev => prev.map(app => app.id === id ? { ...app, ...updates } : app));
  };

  const deleteApplication = async (id) => {
    await applicationsApi.delete(id);
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const value = {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    refresh: fetchApplications
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};
