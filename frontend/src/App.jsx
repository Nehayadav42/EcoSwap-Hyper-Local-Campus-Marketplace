import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route - Landing Page */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} /> {/* Ab yeh asli Landing.jsx dikhayega */}
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected/Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/artisan-dashboard" element={<ArtisanDashboard />} />
          <Route path="/swaps" element={<MySwaps />} />
          <Route path="/myswap" element={<MySwaps />} />
          <Route path="/myswaps" element={<MySwaps />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chat" element={<Chats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/artisan" element={<Artisan />} />
          <Route path="/artisans" element={<Artisan />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;