import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import InterviewPage from './pages/interviewPage'
import History from './pages/History'
import ReportPage from './pages/ReportPage'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser, clearCurrentUser } from './redux/userSlice.js';

export const ServerURL = "http://localhost:5001";

function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(ServerURL + "/api/user/current-user", { credentials: "include" });

        const data = await res.json();
        if (res.status === 200) {
          dispatch(setCurrentUser(data.user));
        } else {
          dispatch(clearCurrentUser());
          console.error("Failed to fetch current user:", data.message);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }
    getUser();

  }, [dispatch])

  return (

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/interview' element={<InterviewPage />} />
      <Route path='/history' element={<History />} />
      <Route path='/report/:id' element={<ReportPage />} />
    </Routes>
  )
}

export default App
