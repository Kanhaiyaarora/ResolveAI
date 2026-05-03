import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useAuth } from '../features/auth/hook/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading } from '../features/auth/state/auth.slice'
import './App.css'

const App = () => {
  const { handleGetMe } = useAuth();
  const dispatch = useDispatch();
  const { loading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        await handleGetMe();
      } else {
        // If no token, immediately stop loading
        dispatch(setLoading(false));
      }
    };
    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">Initializing workspace...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
