import { createContext, useContext } from 'react';

export const ApplicationContext = createContext();

export const useApplications = () => useContext(ApplicationContext);
