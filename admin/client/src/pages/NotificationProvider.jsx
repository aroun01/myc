import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const triggerNotification = (type, message, description) => {
    setNotification({ type, message, description });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ notification, triggerNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
