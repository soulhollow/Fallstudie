import React, { useState } from 'react';
import Header from './Header';

const App = () => {
  // Beispiel: Die Rolle wird vom Backend nach dem Login gesetzt
  const [role, setRole] = useState('owner'); // Die Rolle kann 'owner', 'admin', 'finance', 'management' sein

  return (
    <div className="App">
      <Header role={role} />
      {/* Weitere Komponenten */}
    </div>
  );
};

export default App;
