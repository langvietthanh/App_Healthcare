/**
 * Tác dụng của file: Hiển thị danh mục các mục tiêu tập luyện của người dùng (Yoga, Gym, Cardio...)
 * File này dùng cho component cha nào là chính: Profile (src/pages/user/profile/index.jsx)
 */
import React from 'react';

const ProfileGoals = () => {
  return (
    <div className="px-8 mb-12">
      <h3 className="text-xl font-bold mb-6">Goal</h3>
      <div
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {['Yoga', 'Gym', 'Cardio', 'Stretch', 'Full Body'].map((cat, i) => (
          <div key={i} className="flex flex-col items-center gap-3 min-w-[80px]">
            <div className="w-[80px] h-[80px] rounded-full overflow-hidden bg-zinc-800 shadow-md">
              <img
                src={`https://picsum.photos/seed/${i + 20}/100/100`}
                alt={cat}
                className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-sm font-bold text-zinc-200">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileGoals;
