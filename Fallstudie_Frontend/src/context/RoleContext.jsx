import React, { createContext, useContext, useState } from 'react';

// Erstelle den Kontext für die Rolle
const RoleContext = createContext();

// Custom Hook zum Zugriff auf den RoleContext
export const useRole = () => useContext(RoleContext);

// RoleProvider-Komponente
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("Admin"); // Beispiel: Admin, kann dynamisch geändert werden

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
