const ProfileGoals = () => {
  return (
    // GIAO DIỆN PROFILE GOALS
    <div className="px-8 mb-12">
      <h3 className="text-xl font-bold mb-6">Sở thích tập luyện</h3>
      <div
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {['Yoga', 'Gym', 'Cardio', 'Giãn cơ', 'Toàn thân'].map((cat, i) => (
          // GIAO DIỆN PROFILE GOALS
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
