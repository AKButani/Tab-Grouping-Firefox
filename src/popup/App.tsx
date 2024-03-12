import React, { useEffect, useState } from 'react';
import GroupList from './GroupList';

import './App.css';

interface DarkModeContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const DarkModeContext = React.createContext<DarkModeContextProps>({
  darkMode: false,
  toggleDarkMode: () => {},
});

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const darkModefunc = async () => {
      const mode  = await browser.storage.local.get('mode');
      console.log(mode);
      if (mode === undefined || Object.keys(mode).length === 0 || mode.mode === 'light') {
        setDarkMode(false);
      } else {
        setDarkMode(true);
      }
    };
    darkModefunc();
    console.log("Darkmode: " + darkMode);
  });

  useEffect(() => {
    console.log("in dark mode effect");
    const body = document.querySelector('body');
    if (body) {
      if (darkMode) {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
      } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
      }
    }
  }, [darkMode]);


  console.log("in App");

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <GroupList />
    </DarkModeContext.Provider>
  );
}

export default App;
