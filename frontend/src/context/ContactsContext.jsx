import { useEffect, useState } from 'react';
import { contactsApi } from '../api';
import { useAuth } from './useAuth';
import { ContactsContext } from './useContacts';

export const ContactsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeContacts = (payload) => {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (Array.isArray(payload?.contacts)) {
      return payload.contacts;
    }

    return [];
  };

  const sortContacts = (items) => {
    return [...items].sort((a, b) => {
      const aName = `${a?.name ?? ''}`.toLowerCase();
      const bName = `${b?.name ?? ''}`.toLowerCase();
      return aName.localeCompare(bName);
    });
  };

  const isEndpointMissing = (error) => {
    return `${error?.message ?? ''}`.includes('404');
  };

  const missingEndpointMessage = 'Contacts API unavailable (404). Restart backend so /api/contacts routes are loaded.';

  useEffect(() => {
    let active = true;

    const syncContacts = async () => {
      if (!currentUser) {
        if (active) {
          setContacts([]);
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
        const data = await contactsApi.getAll();
        if (active) {
          setContacts(sortContacts(normalizeContacts(data)));
        }
      } catch (err) {
        if (active) {
          if (isEndpointMissing(err)) {
            setContacts([]);
            setError(missingEndpointMessage);
          } else {
            console.error(err);
            setError(err.message);
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    syncContacts();

    return () => {
      active = false;
    };
  }, [currentUser]);

  const refresh = async () => {
    if (!currentUser) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await contactsApi.getAll();
      setContacts(sortContacts(normalizeContacts(data)));
    } catch (err) {
      if (isEndpointMissing(err)) {
        setContacts([]);
        setError(missingEndpointMessage);
      } else {
        console.error(err);
        setError(err.message);
      }
    }
    setLoading(false);
  };

  const addContact = async (payload) => {
    let created;
    try {
      created = await contactsApi.create(payload);
    } catch (err) {
      if (isEndpointMissing(err)) {
        throw new Error(missingEndpointMessage);
      }
      throw err;
    }
    setContacts((prev) => sortContacts([created, ...prev]));
    return created;
  };

  const updateContact = async (id, updates) => {
    try {
      await contactsApi.update(id, updates);
    } catch (err) {
      if (isEndpointMissing(err)) {
        throw new Error(missingEndpointMessage);
      }
      throw err;
    }
    setContacts((prev) => sortContacts(prev.map((item) => (item.id === id ? { ...item, ...updates } : item))));
  };

  const deleteContact = async (id) => {
    try {
      await contactsApi.delete(id);
    } catch (err) {
      if (isEndpointMissing(err)) {
        throw new Error(missingEndpointMessage);
      }
      throw err;
    }
    setContacts((prev) => prev.filter((item) => item.id !== id));
  };

  const value = {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    refresh,
  };

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
};
