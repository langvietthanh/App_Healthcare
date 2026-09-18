import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from './components/layout/ProfileHeader';
import ProfileAvatar from './components/layout/ProfileAvatar';
import ProfileStats from './components/stats/ProfileStats';
import HealthIndexes from './components/stats/HealthIndexes';
import ProfileGoals from './components/stats/ProfileGoals';
import MacronutrientGoals from './components/stats/MacronutrientGoals';
import EditProfileModal from './components/modal/EditProfileModal';
import { useDailyLog } from '../../../providers/user';

const Profile = () => {
  const navigate = useNavigate();
  const { state, fetchUserTarget, updateUserInfo, updatePhysicalDetail, changePassword } = useDailyLog();
  const { user } = state;
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    // Tự động tải thông tin User từ Context lên nếu chưa có
    if (!user) {
      fetchUserTarget();
    }
  }, [user]);
  return (
    // GIAO DIỆN PROFILE
    <div className="flex flex-col min-h-full pb-10 text-white bg-transparent">
      {/* Header */}
      <ProfileHeader onBack={() => navigate(-1)} onEdit={() => setIsEditOpen(true)} />

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

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditOpen(false)}
          onUpdateInfo={updateUserInfo}
          onUpdatePhysical={updatePhysicalDetail}
          onChangePassword={changePassword}
        />
      )}
    </div>
  );
};

export default Profile;

