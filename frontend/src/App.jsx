import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Diary from './pages/Diary';
import MealPlan from './pages/MealPlan';
import Workouts from './pages/Workouts';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các Route Public (Không cần đăng nhập) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Các Route Protected (BẮT BUỘC phải đăng nhập mới được vào) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Route có Layout chính */}
          <Route path="/" element={<MainLayout />}>
            {/* Mặc định vào / sẽ chuyển hướng sang /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="diary" element={<Diary />} />
            <Route path="meals" element={<MealPlan />} />
            
            <Route path="workouts" element={<Workouts />} />
            
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
