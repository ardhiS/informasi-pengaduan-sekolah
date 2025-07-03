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
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import LoginPage from './pages/LoginPage';
import HalamanSiswa from './pages/HalamanSiswa';
import HalamanGuru from './pages/HalamanGuru';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Classes from './pages/Classes';
import Subjects from './pages/Subjects';
import Complaints from './pages/Complaints';
import Profile from './pages/Profile';
import ApiTesting from './pages/ApiTesting';
import SampleDataGenerator from './pages/SampleDataGenerator';
import ProtectedRoute from './components/ProtectedRoute';
import FlexibleRoute from './components/FlexibleRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApiProvider>
          <DataProvider>
            <Router>
              <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/welcome' element={<Welcome />} />
                {/* Unified Login Routes */}
                <Route path='/login' element={<AdminLogin />} />
                <Route path='/login/siswa' element={<LoginPage />} />
                <Route path='/login/guru' element={<LoginPage />} />
                <Route path='/login/admin' element={<AdminLogin />} />
                {/* Legacy routes for backward compatibility */}
                <Route path='/login-page' element={<LoginPage />} />
                <Route path='/old-login' element={<Login />} />
                <Route path='/halaman-siswa' element={<HalamanSiswa />} />
                <Route path='/halaman-guru' element={<HalamanGuru />} />
                {/* Dashboard and nested routes */}
                <Route
                  path='/dashboard'
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path='complaints' element={<Complaints />} />
                  <Route path='users' element={<Users />} />
                  <Route path='classes' element={<Classes />} />
                  <Route path='subjects' element={<Subjects />} />
                  <Route path='profile' element={<Profile />} />
                  <Route path='api-testing' element={<ApiTesting />} />
                  <Route path='sample-data' element={<SampleDataGenerator />} />
                </Route>
                {/* Direct routes for easier access */}
                <Route
                  path='/complaints'
                  element={
                    <FlexibleRoute allowPublic={true}>
                      <Layout>
                        <Complaints />
                      </Layout>
                    </FlexibleRoute>
                  }
                />
                <Route
                  path='/users'
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Users />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/classes'
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Classes />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/subjects'
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Subjects />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/profile'
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/api-testing'
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ApiTesting />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/sample-data'
                  element={
                    <FlexibleRoute allowPublic={true}>
                      <Layout>
                        <SampleDataGenerator />
                      </Layout>
                    </FlexibleRoute>
                  }
                />
                {/* Keep old welcome as backup */}
                <Route path='/' element={<LandingPage />} />
              </Routes>
            </Router>
          </DataProvider>
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
