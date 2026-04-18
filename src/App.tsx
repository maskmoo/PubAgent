import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Editor } from "./pages/Editor";
import { Platforms } from "./pages/Platforms";
import { Workflows } from "./pages/Workflows";
import { Settings } from "./pages/Settings";
import { useEffect, useState } from "react";

function App() {
  const [isDark, setIsDark] = useState(() => {
    // Check local storage first
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    // Otherwise check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <BrowserRouter>
      <AppLayout isDark={isDark} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/platforms" element={<Platforms />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
