import React from 'react';

const DiaryHeader = ({ selectedDate, loading, setSelectedDate }) => {
  const isToday = new Date().toDateString() === selectedDate.toDateString();
  const displayMonth = `Tháng ${selectedDate.getMonth() + 1}`;
  const displayDay = selectedDate.getDate();

  return (
    // GIAO DIỆN DIARY HEADER
    <div className="px-8 pt-8 mb-10 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">
          Nhật ký <span className="text-[#c8f31d]">{isToday ? 'Hôm nay' : 'Dinh dưỡng'}</span>
        </h1>
        <p className="text-zinc-400 font-medium">
          {loading ? 'Đang cập nhật chỉ số...' : 'Ghi nhận và theo dõi tiến trình của bạn'}
        </p>
      </div>
      <button
        onClick={() => setSelectedDate(new Date())}
        className="w-16 h-16 rounded-[20px] bg-zinc-800 flex flex-col items-center justify-center border border-zinc-700 shadow-lg hover:bg-zinc-700 transition-colors"
        title="Trở về Hôm nay"
      >
        <span className="text-xs font-bold text-zinc-400 uppercase">{displayMonth}</span>
        <span className="text-xl font-black text-[#c8f31d]">{displayDay}</span>
      </button>
    </div>
  );
};

export default DiaryHeader;
