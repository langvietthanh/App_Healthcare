import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, ChevronDown, Plus, History, BookmarkCheck, Dumbbell, Loader } from 'lucide-react';
import { useWorkout } from '../../../store';

// Helper: so sánh ngày (bỏ phần giờ)
const toMidnight = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getDateType = (selectedDate) => {
  const today = toMidnight(new Date());
  const sel = toMidnight(selectedDate);
  if (sel < today) return 'past';
  if (sel.getTime() === today.getTime()) return 'today';
  return 'future';
};

const ScheduleHeader = ({ dateType }) => {
  const labels = {
    past: 'Lịch sử tập luyện',
    today: 'Lên lịch bài tập',
    future: 'Lên lịch bài tập',
  };
  return (
    <div className="flex items-center justify-between px-6 pt-8 pb-4">
      <h1 className="text-3xl font-medium tracking-wide">{labels[dateType]}</h1>
      {dateType === 'today' && (
        <span className="text-xs font-bold bg-[#c8f31d] text-black px-3 py-1 rounded-full uppercase tracking-wider">
          Hôm nay
        </span>
      )}
      {dateType === 'past' && (
        <span className="text-xs font-bold bg-zinc-700 text-zinc-400 px-3 py-1 rounded-full uppercase tracking-wider">
          Đã qua
        </span>
      )}
      {dateType === 'future' && (
        <span className="text-xs font-bold bg-blue-900/60 text-blue-300 px-3 py-1 rounded-full uppercase tracking-wider">
          Sắp tới
        </span>
      )}
    </div>
  );
};

const DateSection = ({ selectedDate, changeWeek, currentMonth, currentYear, days, setWorkoutSelectedDate }) => {
  const today = toMidnight(new Date());

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 font-bold text-xl">
          <Calendar size={24} className="text-[#c8f31d]" />
          Ngày
        </div>
        <div className="flex items-center gap-4 font-bold">
          <ChevronLeft
            size={24}
            className="text-[#c8f31d] cursor-pointer hover:scale-110 transition-transform"
            onClick={() => changeWeek(-1)}
          />
          <div className="text-center w-20">
            <div className="text-lg">{currentMonth}</div>
            <div className="text-sm text-[#c8f31d]">{currentYear}</div>
          </div>
          <ChevronRight
            size={24}
            className="text-[#c8f31d] cursor-pointer hover:scale-110 transition-transform"
            onClick={() => changeWeek(1)}
          />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {days.map((item, idx) => {
          const isSelected = item.fullDate.toDateString() === selectedDate.toDateString();
          const isPast = toMidnight(item.fullDate) < today;
          const isToday = toMidnight(item.fullDate).getTime() === today.getTime();

          let baseStyle = '';
          if (isSelected) {
            baseStyle = isPast
              ? 'bg-zinc-600 text-zinc-300 shadow-md scale-105 opacity-80'
              : 'bg-[#c8f31d] text-black shadow-lg scale-105';
          } else if (isPast) {
            baseStyle = 'border border-zinc-700 text-zinc-600 bg-transparent opacity-50 cursor-pointer hover:opacity-70';
          } else {
            baseStyle = 'border border-[#c8f31d] text-[#c8f31d] bg-transparent hover:bg-zinc-900 cursor-pointer';
          }

          return (
            <div
              key={idx}
              onClick={() => setWorkoutSelectedDate(item.fullDate)}
              className={`flex flex-col items-center justify-center min-w-[76px] py-4 rounded-[20px] transition-all ${baseStyle}`}
            >
              <span className={`text-base mb-2 ${isSelected ? 'font-medium' : 'font-normal'}`}>
                {item.day}
              </span>
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold relative ${isSelected
                  ? 'bg-white text-black shadow-inner'
                  : isPast
                    ? 'bg-zinc-800 text-zinc-500'
                    : 'bg-white text-black'
                  }`}
              >
                {item.date}
                {isToday && !isSelected && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#c8f31d] rounded-full" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TimePickerModal = ({ isOpen, onClose, onSave }) => {
  const [time, setTime] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 w-80 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Nhập thời gian</h3>
        <div className="flex justify-center mb-6">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-zinc-800 text-white text-3xl font-black p-4 rounded-2xl border border-zinc-600 focus:outline-none focus:border-[#c8f31d] text-center w-full"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-zinc-400 bg-zinc-800 hover:text-white transition-colors border border-zinc-700"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(time)}
            className="flex-1 py-3 rounded-xl font-bold text-black bg-[#c8f31d] hover:scale-105 transition-transform shadow-[0_0_15px_rgba(200,243,29,0.3)]"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

const TimeSection = ({ selectedTime, setWorkoutSelectedTime, dateType }) => {
  const [showModal, setShowModal] = useState(false);

  if (dateType === 'past') return null;

  return (
    <>
      <div className="mt-10 mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3 font-bold text-xl">
          <Clock size={24} className="text-[#c8f31d]" />
          Nhắc tôi tập luyện: 
        </div>
        
        {selectedTime ? (
          <div 
            onClick={() => setShowModal(true)}
            className="border border-[#c8f31d] rounded-2xl px-5 py-3 flex items-center gap-4 cursor-pointer hover:bg-zinc-900 transition-colors"
          >
            <span className="font-bold text-lg tracking-wide">{selectedTime}</span>
            <ChevronDown size={24} className="text-[#c8f31d]" />
          </div>
        ) : (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#c8f31d] text-black font-bold px-5 py-3 rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(200,243,29,0.2)]"
          >
            Đặt giờ
          </button>
        )}
      </div>

      <TimePickerModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={(timeVal) => {
          if (timeVal) {
            if (typeof Notification !== 'undefined' && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
              Notification.requestPermission();
            }
            // timeVal mặc định của input type="time" đã là chuẩn 24h (HH:mm)
            setWorkoutSelectedTime(timeVal);
          }
          setShowModal(false);
        }} 
      />
    </>
  );
};

const TodayButtons = ({ setView, scheduledExercises, selectedDate }) => {
  const { state, fetchExerciseHistory } = useWorkout();
  const { exerciseHistory, historyLoading } = state;
  const [showHistory, setShowHistory] = useState(false);

  const handleViewHistory = async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    const dateString = selectedDate.toISOString().slice(0, 10);
    await fetchExerciseHistory(dateString);
    setShowHistory(true);
  };

  // Reset khi đổi ngày
  useEffect(() => {
    setShowHistory(false);
  }, [selectedDate]);

  return (
    <div className="mt-auto flex flex-col gap-3">
      <div className="flex gap-4">
        <button
          onClick={() => setView('list')}
          className="flex-1 bg-[#c8f31d] text-black font-black py-5 rounded-[20px] text-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.15)] tracking-wide"
        >
          Bắt đầu tập
        </button>
        <button
          onClick={() => setView('search')}
          className="flex-1 bg-transparent border-2 border-zinc-700 text-[#c8f31d] font-black py-5 rounded-[20px] text-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all flex justify-center items-center gap-2"
        >
          <Plus size={24} strokeWidth={3} />
          Thêm bài tập
        </button>
      </div>
      {showHistory && (
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-4">
            <History size={20} className="text-[#c8f31d]" />
            <p className="font-bold text-lg text-white">Lịch sử hôm nay</p>
          </div>

          {historyLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader size={32} className="text-[#c8f31d] animate-spin" />
            </div>
          ) : exerciseHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-600 gap-2">
              <History size={40} className="opacity-40" />
              <p className="font-bold text-base">Chưa có bài tập nào</p>
              <p className="text-sm text-zinc-700">Bạn chưa hoàn thành bài tập nào hôm nay</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exerciseHistory.map((entry, idx) => {
                const img = entry.exerciseId?.imgURL;
                return (
                  <div key={entry._id || idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                      {img && (img.startsWith('http') || img.startsWith('/')) ? (
                        <img src={img} alt={entry.name} className="w-full h-full object-cover" />
                      ) : (
                        img || '🏋️'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{entry.name || 'Bài tập'}</h4>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mt-1 flex-wrap">
                        {entry.sets && <span>{entry.sets} Sets</span>}
                        {entry.reps && (
                          <>
                            <span>•</span>
                            <span>1 Set/{entry.reps} Reps</span>
                          </>
                        )}
                        {entry.durationMinutes && (
                          <>
                            <span>•</span>
                            <span>1 Set{entry.durationMinutes} giây</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-[#c8f31d] rounded-full flex items-center justify-center shrink-0">
                      <span className="text-black text-sm font-bold">✓</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}


      <button
        onClick={handleViewHistory}
        disabled={historyLoading}
        className={`w-full font-bold py-3.5 rounded-[20px] text-base transition-all flex justify-center items-center gap-2 ${historyLoading
          ? 'bg-zinc-900 text-zinc-600 cursor-wait border border-zinc-800'
          : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-600'
          }`}
      >
        {historyLoading ? (
          <Loader size={18} className="animate-spin" />
        ) : (
          <History size={18} />
        )}
        {showHistory ? 'Ẩn lịch sử' : 'Xem lịch sử hôm nay'}
      </button>
    </div>
  );
};

const FutureButtons = ({ setView }) => (
  <div className="mt-auto flex gap-4">
    <button
      className="flex-1 bg-[#c8f31d] text-black font-black py-5 rounded-[20px] text-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.15)] tracking-wide flex justify-center items-center gap-2"
    >
      <BookmarkCheck size={22} />
      Lưu lịch
    </button>
    <button
      onClick={() => setView('search')}
      className="flex-1 bg-transparent border-2 border-zinc-700 text-[#c8f31d] font-black py-5 rounded-[20px] text-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all flex justify-center items-center gap-2"
    >
      <Plus size={24} strokeWidth={3} />
      Thêm bài tập
    </button>
  </div>
);

const PastButtons = ({ selectedDate }) => {
  const { state, fetchExerciseHistory } = useWorkout();
  const { exerciseHistory, historyLoading } = state;
  const [showHistory, setShowHistory] = useState(false);

  const handleViewHistory = async () => {
    const dateString = selectedDate.toISOString().slice(0, 10);
    await fetchExerciseHistory(dateString);
    setShowHistory(true);
  };

  // Reset khi đổi ngày
  useEffect(() => {
    setShowHistory(false);
  }, [selectedDate]);

  return (
    <div className="mt-auto flex flex-col gap-4">
      {showHistory && (
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell size={20} className="text-[#c8f31d]" />
            <p className="font-bold text-lg text-white">Bài tập đã hoàn thành</p>
          </div>

          {historyLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader size={32} className="text-[#c8f31d] animate-spin" />
            </div>
          ) : exerciseHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-600 gap-2">
              <History size={40} className="opacity-40" />
              <p className="font-bold text-base">Không có dữ liệu</p>
              <p className="text-sm text-zinc-700">Ngày này chưa ghi nhận bài tập nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exerciseHistory.map((entry, idx) => {
                const img = entry.exerciseId?.imgURL;
                return (
                  <div key={entry._id || idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                      {img && (img.startsWith('http') || img.startsWith('/')) ? (
                        <img src={img} alt={entry.name} className="w-full h-full object-cover" />
                      ) : (
                        img || '🏋️'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{entry.name || 'Bài tập'}</h4>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mt-1 flex-wrap">
                        {entry.sets && <span>{entry.sets} Sets</span>}
                        {entry.reps && (
                          <>
                            <span>•</span>
                            <span>{entry.reps} Reps</span>
                          </>
                        )}
                        {entry.durationMinutes && (
                          <>
                            <span>•</span>
                            <span>{entry.durationMinutes} phút</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-[#c8f31d] rounded-full flex items-center justify-center shrink-0">
                      <span className="text-black text-sm font-bold">✓</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!showHistory && (
        <div className="flex flex-col items-center justify-center py-8 text-zinc-600 gap-2">
          <History size={40} className="opacity-40" />
          <p className="font-bold text-base">Ngày này đã qua</p>
          <p className="text-sm text-zinc-700">Bấm nút bên dưới để xem lịch sử tập luyện</p>
        </div>
      )}

      <button
        onClick={handleViewHistory}
        disabled={historyLoading}
        className={`w-full font-black py-5 rounded-[20px] text-xl transition-all flex justify-center items-center gap-2 ${historyLoading
          ? 'bg-zinc-900 text-zinc-600 cursor-wait border border-zinc-800'
          : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-600'
          }`}
      >
        {historyLoading ? (
          <Loader size={22} className="animate-spin" />
        ) : (
          <History size={22} />
        )}
        {showHistory ? 'Tải lại lịch sử' : 'Xem lịch sử'}
      </button>
    </div>
  );
};

const WorkoutSchedule = ({ setView, scheduledExercises }) => {
  const { state, setWorkoutSelectedDate, setWorkoutSelectedTime } = useWorkout();
  const { selectedDate, selectedTime } = state;

  const dateType = getDateType(selectedDate);

  // Thêm useEffect để theo dõi thời gian và hiển thị thông báo
  useEffect(() => {
    if (dateType !== 'today' || !selectedTime) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      const hStr = String(now.getHours()).padStart(2, '0');
      const mStr = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hStr}:${mStr}`;

      if (currentTimeStr === selectedTime) {
        // Phát thông báo bằng Browser Notification API
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification('💪 Đến giờ tập luyện rồi!', {
            body: `Đã đến ${selectedTime}, hãy bắt đầu bài tập ngay thôi!`
          });
        } else {
          // Fallback dùng Alert nếu trình duyệt không cấp quyền
          alert(`💪 Đến giờ tập luyện rồi! (${selectedTime})`);
        }
        
        // Xóa thời gian để tránh thông báo lặp lại liên tục trong cùng 1 phút
        setWorkoutSelectedTime('');
      }
    }, 10000); // Kiểm tra mỗi 10 giây

    return () => clearInterval(intervalId);
  }, [selectedTime, dateType, setWorkoutSelectedTime]);

  const getDaysOfWeek = () => {
    const start = new Date(selectedDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diff));

    const days = [];
    const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        day: dayLabels[d.getDay()],
        date: d.getDate(),
        fullDate: d
      });
    }
    return days;
  };

  const days = getDaysOfWeek();
  const currentMonth = `Tháng ${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
  const currentYear = selectedDate.getFullYear();

  const changeWeek = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset * 7);
    setWorkoutSelectedDate(newDate);
  };

  return (
    <div className="h-full bg-[#050505] text-white relative font-sans overflow-hidden flex flex-col">
      <ScheduleHeader dateType={dateType} />

      <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide flex flex-col">
        <DateSection
          selectedDate={selectedDate}
          changeWeek={changeWeek}
          currentMonth={currentMonth}
          currentYear={currentYear}
          days={days}
          setWorkoutSelectedDate={setWorkoutSelectedDate}
        />

        <TimeSection
          selectedTime={selectedTime}
          setWorkoutSelectedTime={setWorkoutSelectedTime}
          dateType={dateType}
        />

        {dateType === 'today' && <TodayButtons setView={setView} scheduledExercises={scheduledExercises} selectedDate={selectedDate} />}
        {dateType === 'future' && <FutureButtons setView={setView} />}
        {dateType === 'past' && <PastButtons selectedDate={selectedDate} />}
      </div>
    </div>
  );
};

export default WorkoutSchedule;
