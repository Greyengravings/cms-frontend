import React, { useContext, useEffect } from 'react';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './features/auth/authSlice';
import useIdleTimeout from './hooks/useIdleTimeout';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ExplorePage from './pages/ExplorePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegister from './pages/AdminRegisterPage';
import CombinedLoginPage from './pages/CombinedLoginPage';
import UserRegisterPage from './pages/UserRegisterPage';
import UserProfilePage from './pages/UserProfilePage';

// Separate component to use ThemeContext
function AppContent() {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useIdleTimeout(isLoggedIn, () => dispatch(logout()));

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  }, [theme]);

  return (
    <Router basename="/">
      <div
        className={`min-h-screen flex flex-col w-full ${
          theme === 'dark' ? 'bg-black-900 text-white' : 'bg-white text-black-900'
        }`}
      >
        <Header />

        {/* Outer full-width background */}
        <main className="w-full flex-grow p-4 md:p-6">
          {/* Inner constrained content area */}
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:postId" element={<PostPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/login" element={<CombinedLoginPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-register" element={<AdminRegister />} />
              <Route path="/user-register" element={<UserRegisterPage />} />
              <Route path="/user-profile" element={<UserProfilePage />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

// App now only provides ThemeContext
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
