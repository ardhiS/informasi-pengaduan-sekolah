import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApiProvider } from './context/ApiContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import LoginPage from './pages/LoginPage';
import Complaints from './pages/Complaints';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApiProvider>
          <DataProvider>
            <Router>
              <Routes>
                <Route path='/' element={<LandingPage />} />
                {/* Login Routes */}
                <Route path='/login/siswa' element={<LoginPage />} />
                <Route path='/login/guru' element={<LoginPage />} />
                <Route path='/login/admin' element={<AdminLogin />} />
                {/* Complaints Route */}
                <Route
                  path='/complaints'
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Complaints />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                {/* Redirect all other paths to complaints */}

                <Route path='*' element={<LandingPage />} />
              </Routes>
            </Router>
          </DataProvider>
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
