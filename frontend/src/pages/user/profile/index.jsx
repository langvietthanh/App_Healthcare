/**
 * Tác dụng của file: Điều phối và sắp xếp bố cục chính cho trang Profile cá nhân của người dùng
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/user/index.js)
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ProfileAvatar from './ProfileAvatar';
import ProfileStats from './ProfileStats';
import HealthIndexes from './HealthIndexes';
import ProfileGoals from './ProfileGoals';
import MacronutrientGoals from './MacronutrientGoals';
import { useDailyLog } from '../../../context/DailyLogContext';

const Profile = () => {
  const navigate = useNavigate();
  const { state, fetchUserTarget } = useDailyLog();
  const { user } = state;

  useEffect(() => {
    // Tự động tải thông tin User từ Context lên nếu chưa có
    if (!user) {
      fetchUserTarget();
    }
  }, [user]);
  return (
    <div className="flex flex-col min-h-full pb-10 text-white bg-transparent">
      {/* Header */}
      <ProfileHeader onBack={() => navigate(-1)} />

      {/* Avatar & Info */}
      <ProfileAvatar user={user} />

      {/* Basic Stats */}
      <ProfileStats user={user} />

      {/* Advanced Health Indexes (BMI, BMR, TDEE) */}
      <HealthIndexes user={user} />

      {/* Goal Category */}
      <ProfileGoals />

      {/* Macronutrient Goals */}
      <MacronutrientGoals user={user} />
    </div>
  );
};

export default Profile;
