import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';
import { login } from '../features/auth/authSlice';
import axios from 'axios';

function CombinedLoginPage() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialId, setSpecialId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic client validation
    if (!email || !password) {
      setError('Please fill in all the required fields.');
      return;
    }
    if (loginType === 'admin' && !specialId) {
      setError('Please enter the special ID for admin login.');
      return;
    }

    try {
      let response;
      if (loginType === 'user') {
        // Call user login endpoint
        response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/user/login`, {
          email,
          password,
        });

        if (response.data.message === 'Login successful') {
          setSuccess('Login successful! Redirecting...');
          dispatch(login({
            username: response.data.user.username,
            userId: response.data.user.userId,
            role: response.data.user.role,
            token: response.data.token,
          }));
          setTimeout(() => {
            navigate('/');
          }, 1200);
        } else {
          setError('Unexpected response from server.');
        }
      } else {
        // Call admin login endpoint
        response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/admin/login`, {
          email: email,
          password,
          specialId,
        });

        if (response.data.message === 'Login successful') {
          setSuccess('Login successful! Redirecting...');
          dispatch(login({
            username: response.data.username,
            userId: response.data.userId,
            role: 'admin', // AdminUser is always admin
          }));
          setTimeout(() => {
            navigate('/');
          }, 1200);
        } else {
          setError('Unexpected response from server.');
        }
      }
    } catch (err) {
      // Show backend error message or generic error
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  const getInputClasses = (inputName) => {
    const baseClasses = `shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 ${
      theme === 'dark' ? 'bg-gray-700 text-white' : 'text-gray-700'
    }`;
    const highlightClasses = 'border-blue-500 ring-2 ring-blue-500';
    const borderColor =
      theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
    return `${baseClasses} ${
      focusedInput === inputName ? highlightClasses : borderColor
    }`;
  };

  return (
    <div
      className={`flex items-center justify-center min-h-[calc(100vh-64px)] p-4 transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div
        className={`p-8 rounded-xl shadow-xl w-full max-w-md transition-colors duration-500 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        {/* Login Type Toggle */}
        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={() => setLoginType('user')}
            className={`px-4 py-2 rounded-l-lg transition-colors ${
              loginType === 'user'
                ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                : theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-700'
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`px-4 py-2 rounded-r-lg transition-colors ${
              loginType === 'admin'
                ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                : theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-700'
            }`}
          >
            Admin
          </button>
        </div>

        {error && (
          <div
            className={`border px-4 py-3 rounded relative mb-4 ${
              theme === 'dark'
                ? 'bg-red-900 border-red-500 text-red-300'
                : 'bg-red-100 border-red-400 text-red-700'
            }`}
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div
            className={`border px-4 py-3 rounded relative mb-4 ${
              theme === 'dark'
                ? 'bg-green-900 border-green-500 text-green-300'
                : 'bg-green-100 border-green-400 text-green-700'
            }`}
            role="alert"
          >
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className={getInputClasses('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-bold mb-2">Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className={`${getInputClasses('password')} pr-20`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              placeholder="******************"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pt-7">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-blue-600 font-bold text-sm select-none"
              >
                {showPassword ? 'Hide' : 'View'}
              </button>
            </div>
          </div>

          {/* Special ID for Admin */}
          {loginType === 'admin' && (
            <div className="mb-4">
              <label htmlFor="specialId" className="block text-sm font-bold mb-2">
                Special ID:
              </label>
              <input
                type="text"
                id="specialId"
                className={getInputClasses('specialId')}
                value={specialId}
                onChange={(e) => setSpecialId(e.target.value)}
                onFocus={() => setFocusedInput('specialId')}
                onBlur={() => setFocusedInput(null)}
                placeholder="Enter special ID"
                required={loginType === 'admin'}
              />
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 w-full ${
                theme === 'dark'
                  ? 'bg-blue-400 text-gray-900'
                  : 'bg-blue-700 text-white'
              }`}
            >
              Login as {loginType === 'user' ? 'User' : 'Admin'}
            </button>
          </div>
        </form>

        {/* Register button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate(loginType === 'user' ? '/user-register' : '/admin-register')}
            className="text-blue-600 hover:underline font-semibold"
          >
            Register as {loginType === 'user' ? 'User' : 'Admin'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CombinedLoginPage;
