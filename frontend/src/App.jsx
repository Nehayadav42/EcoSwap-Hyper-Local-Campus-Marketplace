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
import ArtisanDashboard from './pages/ArtisanDashboard';
import FindArtisans from './pages/FindArtisans';

function App() {
  return (
    <Router>
  <Routes>

    {/* 🌍 PUBLIC */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Landing />} />
    </Route>

    {/* 🔓 AUTH (only non-logged users) */}
    <Route element={<PublicRoute />}>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Route>

    {/* 🔒 PROTECTED (logged-in only) */}
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>

        {/* 👤 USER ONLY */}
        <Route element={<ProtectedRoute allowedRole="user" />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>

<Route element={<ProtectedRoute allowedRole="artisan" />}>
  <Route path="/artisan-dashboard" element={<ArtisanDashboard />} />
</Route>

        {/* 🔨 ARTISAN ONLY */}
        <Route 
          path="/artisan-dashboard" 
          element={
            <ProtectedRoute allowedRole="artisan">
              <ArtisanDashboard />
            </ProtectedRoute>
          } 
        />

        {/* ✅ COMMON ROUTES */}
        <Route path="/swaps" element={<MySwaps />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/artisan" element={<Artisan />} />
        <Route path="/explore" element={<FindArtisans />} />

      </Route>
    </Route>

  </Routes>
</Router>
  );
}

export default App;