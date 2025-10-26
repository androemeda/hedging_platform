import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Farmer Pages
import FarmerDashboard from './pages/farmer/Dashboard';
import FarmerProducts from './pages/farmer/Products';
import FarmerTrade from './pages/farmer/Trade';
import FarmerForecasts from './pages/farmer/Forecasts';

// Trader Pages
import TraderDashboard from './pages/trader/Dashboard';
import TraderBrowse from './pages/trader/Browse';
import TraderTrade from './pages/trader/Trade';
import TraderForecasts from './pages/trader/Forecasts';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 ml-64 mt-16">
            <Routes>
              {user.type === 'farmer' ? (
                <>
                  <Route path="/dashboard" element={<FarmerDashboard />} />
                  <Route path="/products" element={<FarmerProducts />} />
                  <Route path="/trade" element={<FarmerTrade />} />
                  <Route path="/forecasts" element={<FarmerForecasts />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
              ) : (
                <>
                  <Route path="/dashboard" element={<TraderDashboard />} />
                  <Route path="/browse" element={<TraderBrowse />} />
                  <Route path="/trade" element={<TraderTrade />} />
                  <Route path="/forecasts" element={<TraderForecasts />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
