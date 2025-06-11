import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
  NavLink,
} from 'react-router-dom';
import './App.css';

import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/client/ProductList';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  DollarSign,
  LayoutDashboard,
  LogOut,
  Power,
  PowerCircle,
} from 'lucide-react';

function Navigation() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='bg-primary shadow-md'>
      <div className='container mx-auto px-4 sm:px-10 md:px-32'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <Link to='/' className='text-xl font-bold text-white'>
              JSHOP
            </Link>
          </div>
          <div className='flex gap-4'>
            {isAuthenticated() ? (
              <div className='flex items-center gap-3'>
                <p className='text-white'>{user.username}</p>
                <button
                  onClick={handleLogout}
                  className='flex p-2 rounded-full items-center gap-1 text-red-400 hover:text-red-500 transition-colors'
                >
                  <PowerCircle size={30} className='stroke-current' />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to='/login'
                  className='text-white hover:text-gray-200 transition-colors'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='text-white hover:text-gray-200 transition-colors'
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function SectionNav() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated()) return null;

  return (
    <div className='bg-white shadow-sm'>
      <section className='container mx-auto px-4 sm:px-10 md:px-32 py-4'>
        <div className='flex gap-6'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `flex items-center gap-2 transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-gray-600'
              }`
            }
          >
            <LayoutDashboard size={20} />
            <p>Products</p>
          </NavLink>

          <NavLink
            to='/dashboard'
            className={({ isActive }) =>
              `flex items-center gap-2 transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-gray-600'
              }`
            }
          >
            <DollarSign size={20} />
            <p>Adjustment Transaction</p>
          </NavLink>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className='min-h-screen bg-gray-50'>
            <Navigation />
            <SectionNav />
            <main className='container mx-auto px-4 sm:px-10 md:px-32 py-6 pb-32'>
              <Routes>
                <Route path='/' element={<ProductList />} />
                <Route
                  path='/dashboard'
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='*' element={<Navigate to='/' replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
