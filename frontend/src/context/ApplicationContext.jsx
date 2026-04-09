import React, { useState, useEffect } from 'react';
import { applicationsApi } from '../api';
import { useAuth } from './useAuth';
import { ApplicationContext } from './useApplications';

export const ApplicationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeApplications = (payload) => {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (Array.isArray(payload?.applications)) {
      return payload.applications;
    }

    return [];
  };

  const sortByDateDesc = (items) => {
    return [...items].sort((a, b) => {
      const aDate = a?.dateApplied ? new Date(a.dateApplied).getTime() : 0;
      const bDate = b?.dateApplied ? new Date(b.dateApplied).getTime() : 0;
      return bDate - aDate;
    });
  };

  useEffect(() => {
    let active = true;

    const syncApplications = async () => {
      if (!currentUser) {
        if (active) {
          setApplications([]);
          setError(null);
          setLoading(false);
        }
        return;
      }

      if (active) {
        setLoading(true);
        setError(null);
      }

      try {
        const data = await applicationsApi.getAll();

        if (active) {
          const normalized = normalizeApplications(data);
          setApplications(sortByDateDesc(normalized));
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    syncApplications();

    return () => { active = false; };
  }, [currentUser]);

  // Manual refresh — safe to call from event handlers (not inside effects)
  const fetchApplications = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const data = await applicationsApi.getAll();
      const normalized = normalizeApplications(data);
      setApplications(sortByDateDesc(normalized));
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
    setApplications(prev => sortByDateDesc([created, ...prev]));
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
