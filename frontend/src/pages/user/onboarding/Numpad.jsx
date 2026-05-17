/**
 * Tác dụng của file: Bàn phím số tự thiết kế (numpad) giúp người dùng nhập nhanh cân nặng, chiều cao.
 * File này dùng cho component cha nào là chính: StepWeightCurrent, StepWeightGoal, StepHeight (src/pages/user/onboarding/)
 */
import React from 'react';
import { Delete } from 'lucide-react';

const Numpad = ({ onClick }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'];
  return (
    <div className="grid grid-cols-3 w-full border-t border-zinc-800">
      {keys.map((k, i) => (
        <button
          key={i}
          onClick={() => onClick(k)}
          className="h-16 flex items-center justify-center text-2xl font-medium border-b border-r border-zinc-800 hover:bg-zinc-900 active:bg-zinc-800 transition-colors text-white"
          style={{ borderRightWidth: (i + 1) % 3 === 0 ? 0 : '1px' }}
        >
          {k === 'back' ? <Delete size={28} className="text-white" /> : k}
        </button>
      ))}
    </div>
  );
};

export default Numpad;
