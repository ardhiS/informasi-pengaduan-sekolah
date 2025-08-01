import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ComplaintApp from './components/ComplaintApp';
import { ThemeProvider } from './contexts/ThemeContext';
// import "./styles/style.css";
import { AuthProvider } from './contexts/AuthContext';
// ....
export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  function toggleTheme() {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const themeContextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme]
  );

  return (
    <BrowserRouter>
      <ThemeProvider value={themeContextValue}>
        <AuthProvider>
          <ComplaintApp />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
