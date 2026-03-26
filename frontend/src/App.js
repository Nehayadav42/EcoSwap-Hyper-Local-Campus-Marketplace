import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar  from './components/Navbar';
import TabBar  from './components/TabBar';
import Landing   from './pages/Landing';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Verify    from './pages/Verify';
import Chat      from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Sell from './pages/Sell';
import RequireAuth from './components/RequireAuth';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/verify"    element={<Verify />} />
        <Route path="/chat"      element={<RequireAuth><Chat /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />
        <Route path="/sell" element={<RequireAuth><Sell /></RequireAuth>} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
      <TabBar />
    </BrowserRouter>
  );
}
