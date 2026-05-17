/**
 * Tác dụng của file: Hiển thị lượng mục tiêu hấp thụ các chất dinh dưỡng đa lượng (Protein, Carbs, Fat)
 * File này dùng cho component cha nào là chính: Profile (src/pages/user/profile/index.jsx)
 */
import React from 'react';
import iconProtein from '../../../assets/icons/icon_protein.png';
import iconCarb from '../../../assets/icons/icon_carb.png';
import iconFat from '../../../assets/icons/icon_fat.png';

const MacronutrientGoals = () => {
  const macros = [
    { label: 'Protein', value: 130, img: iconProtein },
    { label: 'Carbs', value: 235, img: iconCarb },
    { label: 'Fat', value: 60, img: iconFat },
  ];

  return (
    <div className="px-8">
      <h3 className="text-xl font-bold mb-6">Macronutrient Goals</h3>
      <div className="grid grid-cols-3 gap-6">
        {macros.map((macro, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-[150px] h-[150px] rounded-2xl overflow-hidden mb-3 bg-zinc-800 shadow-lg mx-auto">
              <img
                src={macro.img}
                alt={macro.label}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="font-bold text-[15px] mb-1 text-zinc-100 text-center">{macro.label}</p>
            <p className="text-[#c8f31d] font-bold text-lg mb-1">{macro.value}</p>
            <p className="text-[11px] text-zinc-400 font-medium">Grams per day</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MacronutrientGoals;
