import { createContext, useContext } from 'react';

export const ContactsContext = createContext();

export const useContacts = () => useContext(ContactsContext);
