import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import InterviewPage from './pages/interviewPage'
import History from './pages/History'
import ReportPage from './pages/ReportPage'
import { useDispatch } from 'react-redux';
import { setCurrentUser, clearCurrentUser } from './redux/userSlice.js';

export const ServerURL = "http://localhost:5001";

function App() {
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(ServerURL + "/api/user/current-user", { credentials: "include" });

        const data = await res.json();
        if (res.status === 200) {
          dispatch(setCurrentUser(data.user));
        } else {
          dispatch(clearCurrentUser());
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        dispatch(clearCurrentUser());
      } finally {
        setAuthLoading(false);
      }
    }
    getUser();

  }, [dispatch])

  // Show nothing (or a loading screen) until we know the auth state
  if (authLoading) {
    return (
      <div className='fixed inset-0 bg-neutral-950 flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-10 h-10 border-3 border-cyan-800 border-t-cyan-400 rounded-full animate-spin' />
          <p className='text-gray-500 text-sm'>Loading...</p>
        </div>
      </div>
    )
  }

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
