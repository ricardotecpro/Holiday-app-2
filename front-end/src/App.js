import { useState, useEffect } from 'react';
import { HolidayProvider } from "./contexts/HolidayContext";
import SearchForm from "./components/SearchForm";
import HolidayList from "./components/HolidayList";
import Login from "./components/Login";
import './App.css';


export default function App() {

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthenticated(true);
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  return (
    <>
      {!authenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <HolidayProvider>
          <SearchForm />
          <div className="content">
            <HolidayList />
          </div>
        </HolidayProvider>
      )}
    </>
  );
}
