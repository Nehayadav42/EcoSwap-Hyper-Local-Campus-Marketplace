import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MySwaps from './pages/MySwaps';
import Chats from './pages/Chats';
import Profile from './pages/Profile';
import Artisan from './pages/Artisan';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route - Landing Page (Sab dekh sakte hain) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>

        {/* Auth Routes - Sirf bina login wale dekh sakte hain */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* Protected Routes - Sirf logged-in users dekh sakte hain */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/swaps" element={<MySwaps />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/artisan" element={<Artisan />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;