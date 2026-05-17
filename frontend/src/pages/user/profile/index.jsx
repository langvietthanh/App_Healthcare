/**
 * Tác dụng của file: Điều phối và sắp xếp bố cục chính cho trang Profile cá nhân của người dùng
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/user/index.js)
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ProfileAvatar from './ProfileAvatar';
import ProfileStats from './ProfileStats';
import HealthIndexes from './HealthIndexes';
import ProfileGoals from './ProfileGoals';
import MacronutrientGoals from './MacronutrientGoals';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full pb-10 text-white bg-transparent">
      {/* Header */}
      <ProfileHeader onBack={() => navigate(-1)} />

      {/* Avatar & Info */}
      <ProfileAvatar />

      {/* Basic Stats */}
      <ProfileStats />

      {/* Advanced Health Indexes (BMI, BMR, TDEE) */}
      <HealthIndexes />

      {/* Goal Category */}
      <ProfileGoals />

      {/* Macronutrient Goals */}
      <MacronutrientGoals />
    </div>
  );
};

export default Profile;
