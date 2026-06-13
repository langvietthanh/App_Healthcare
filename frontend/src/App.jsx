import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import {
  Login,
  Register,
  Onboarding,
  Dashboard,
  Profile,
  Diary,
  MealPlan,
  Workouts
} from './pages/user';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import {
  AdminDashboard,
  AdminUsers,
  AdminFoods,
  AdminExercises
} from './pages/admin';
import DailyLogProvider from './providers/user/dailyLog';
import MealPlanProvider from './providers/user/mealplan';
import WorkoutProvider from './providers/user/workout';

function App() {
  localStorage.clear();
  return (
    <WorkoutProvider>
      <MealPlanProvider>
        <DailyLogProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="foods" element={<AdminFoods />} />
                  <Route path="exercises" element={<AdminExercises />} />
                </Route>
              </Route>

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="diary" element={<Diary />} />
                  <Route path="meals" element={<MealPlan />} />
                  <Route path="workouts" element={<Workouts />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </DailyLogProvider>
      </MealPlanProvider>
    </WorkoutProvider>
  );
}

export default App;
