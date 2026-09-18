import React from 'react';

const DatePicker = ({ daysOfWeek, selectedDate, setSelectedDate }) => (
  // GIAO DIỆN DATE PICKER
  <div className="flex justify-between items-center px-10 mb-10 text-xl font-bold">
    {daysOfWeek.map((day, i) => {
      const isSelected = day.toDateString() === selectedDate.toDateString();
      return (
        // GIAO DIỆN DATE PICKER
        <button
          key={i}
          onClick={() => setSelectedDate(day)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isSelected
            ? 'bg-[#c8f31d] text-black shadow-[0_0_15px_rgba(200,243,29,0.4)] scale-110 font-black'
            : 'text-zinc-500 hover:text-white hover:bg-zinc-800/40'
            }`}
        >
          {day.getDate()}
        </button>
      );
    })}
  </div>
);

export default DatePicker;
