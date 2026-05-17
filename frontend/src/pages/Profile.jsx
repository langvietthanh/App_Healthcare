import { ChevronLeft, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import iconProtein from '../assets/icons/icon_protein.png'
import iconCarb from '../assets/icons/icon_carb.png'
import iconFat from '../assets/icons/icon_fat.png'

const Profile = () => {
  const navigate = useNavigate();
  const macros = [
    { label: 'Protein', value: 130, img: iconProtein },
    { label: 'Carbs', value: 235, img: iconCarb },
    { label: 'Fat', value: 60, img: iconFat },
  ];
  return (
    <div className="flex flex-col min-h-full pb-10 text-white bg-transparent">

      {/* Header */}
      <div className="flex justify-between items-center px-8 py-10">
        <button onClick={() => navigate(-1)} className="text-[#c8f31d] hover:text-[#aee018] transition-colors">
          <ChevronLeft size={32} strokeWidth={2.5} />
        </button>
        <h1 className="text-2xl font-bold tracking-wide">Profile</h1>
        <button className="text-[#c8f31d] hover:text-[#aee018] transition-colors">
          <Edit size={26} strokeWidth={2.5} />
        </button>
      </div>

      {/* Avatar & Info */}
      <div className="flex flex-col items-center mt-2 mb-12">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-transparent shadow-[0_0_30px_rgba(200,243,29,0.15)] mb-5">
          <img src="../../public/Avatar.png" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-3xl font-semibold mb-2">LangThanh!</h2>
        <p className="text-zinc-400 font-medium text-sm">Basic Member</p>
      </div>

      {/* Basic Stats */}
      <div className="flex justify-center items-cen ter gap-10 mb-8 px-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-[#c8f31d] mb-1">58 <span className="text-base text-white font-medium">kg</span></p>
          <p className="text-xs text-zinc-400 font-medium">Weight</p>
        </div>
        <div className="h-10 w-px bg-zinc-700"></div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[#c8f31d] mb-1">170 <span className="text-base text-white font-medium">cm</span></p>
          <p className="text-xs text-zinc-400 font-medium">Height</p>
        </div>
        <div className="h-10 w-px bg-zinc-700"></div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[#c8f31d] mb-1">24 <span className="text-base text-white font-medium">year</span></p>
          <p className="text-xs text-zinc-400 font-medium">Age</p>
        </div>
      </div>

      {/* Advanced Health Indexes (BMI, BMR, TDEE) */}
      <div className="px-8 mb-14">
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 flex justify-between items-center shadow-lg">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-[#c8f31d] mb-1">20.1</p>
            <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">BMI</p>
            <p className="text-[10px] text-emerald-500 mt-1">Bình thường</p>
          </div>
          <div className="h-12 w-px bg-zinc-700"></div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-[#c8f31d] mb-1">1,450</p>
            <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">BMR</p>
            <p className="text-[10px] text-zinc-500 mt-1">kcal / ngày</p>
          </div>
          <div className="h-12 w-px bg-zinc-700"></div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-[#c8f31d] mb-1">2,200</p>
            <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">TDEE</p>
            <p className="text-[10px] text-zinc-500 mt-1">kcal / ngày</p>
          </div>
        </div>
      </div>

      {/* Goal Category */}
      <div className="px-8 mb-12">
        <h3 className="text-xl font-bold mb-6">Goal</h3>
        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none' }}>
          {['Yoga', 'Gym', 'Cardio', 'Stretch', 'Full Body'].map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-3 min-w-[80px]">
              <div className="w-[80px] h-[80px] rounded-full overflow-hidden bg-zinc-800 shadow-md">
                <img src={`https://picsum.photos/seed/${i + 20}/100/100`} alt={cat} className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform" />
              </div>
              <span className="text-sm font-bold text-zinc-200">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Macronutrient Goals */}
      <div className="px-8">
        <h3 className="text-xl font-bold mb-6">Macronutrient Goals</h3>
        <div className="grid grid-cols-3 gap-6">
          {macros.map((macro, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-[150px] h-[150px] rounded-2xl overflow-hidden mb-3 bg-zinc-800 shadow-lg mx-auto">
                <img src={macro.img} alt={macro.label} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
              </div>
              <p className="font-bold text-[15px] mb-1 text-zinc-100 text-center">{macro.label}</p>
              <p className="text-[#c8f31d] font-bold text-lg mb-1">{macro.value}</p>
              <p className="text-[11px] text-zinc-400 font-medium">Grams per day</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Profile;
