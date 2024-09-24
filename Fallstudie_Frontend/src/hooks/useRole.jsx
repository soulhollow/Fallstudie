import { useState, useEffect } from 'react';

export const useRole = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Dies könnte von einer API kommen oder in LocalStorage gespeichert sein
    const savedRole = localStorage.getItem('userRole');
    setRole(savedRole || 'Guest');
  }, []);

  return { role };
};
