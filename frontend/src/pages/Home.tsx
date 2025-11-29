import { useState, useEffect } from 'react';
import { logout } from '../api/clientApi';
import { Link } from 'react-router-dom';

export default function Home() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const authUser = localStorage.getItem('auth-user');
    if (authUser) {
      const stored = JSON.parse(authUser)
      Promise.resolve().then(() => setUser(stored.name));
    } 
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('auth-user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* App Title */}
            <div className="shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Authentication</h1>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Welcome, {user}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Welcome to Authentication App
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              This is a simple authentication application demonstrating user registration, 
              login, and OTP verification features.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature Cards */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Secure Registration</h3>
              <p className="text-gray-600">
                Create your account with our secure registration process that protects your personal information.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Easy Login</h3>
              <p className="text-gray-600">
                Sign in quickly and securely with your email and password. We keep your data safe.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">OTP Verification</h3>
              <p className="text-gray-600">
                Enhanced security with one-time password verification for important account actions.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get Started Today
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of users who trust our authentication system for their security needs. 
                Whether you're building a new application or enhancing an existing one, our solution 
                provides the reliability and security you need.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-200"
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-md font-medium transition duration-200"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg">Footer</p>
          <p className="mt-2 text-gray-400 text-sm">
            © 2024 Authentication App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}