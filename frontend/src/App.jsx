import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
import ArtisanDashboard from './pages/ArtisanDashboard';
import Explore from './pages/Explore';
import AddProduct from './pages/AddProduct';
function App() {
  return (
    <Router>
      <Routes>
        
        {/* 1. PUBLIC ROUTES: Landing page (Using MainLayout with Landing Nav) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
        </Route>

        {/* 2. AUTH ROUTES: Login/Register (Using AuthLayout) */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* 3. PROTECTED & DASHBOARD ZONE: Everything inside DashboardLayout (Sidebar + Dash Nav) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            
            {/* COMMON PROTECTED ROUTES */}
            <Route path="/explore" element={<Explore />} />
            <Route path="/swaps" element={<MySwaps />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/artisan" element={<Artisan />} />
            <Route path="/add-product" element={<AddProduct />} />

            {/* ROLE SPECIFIC DASHBOARDS */}
            <Route element={<ProtectedRoute allowedRole="user" />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRole="artisan" />}>
              <Route path="/artisan-dashboard" element={<ArtisanDashboard />} />
            </Route>

          </Route>
        </Route>

        {/* Fallback: Unknown routes go to Landing or Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;