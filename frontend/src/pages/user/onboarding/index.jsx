/**
 * Tác dụng của file: Điều phối chính quản lý State điều hướng giữa các bước khảo sát (Bước 2 đến Bước 8) và dữ liệu biểu mẫu khảo sát người dùng.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/user/index.js)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import StepAge from './StepAge';
import StepWeightCurrent from './StepWeightCurrent';
import StepWeightGoal from './StepWeightGoal';
import StepHeight from './StepHeight';
import StepFitnessLevel from './StepFitnessLevel';
import StepGoal from './StepGoal';
import StepFinish from './StepFinish';

const OnboardingHeader = ({ step, totalSteps, handlePrev, handleSkip, ChevronLeft }) => (
  <div className="flex items-center justify-between px-6 pt-6 pb-2">
    <button onClick={handlePrev} className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800">
      <ChevronLeft size={24} />
    </button>

    <div className="flex flex-col items-center md:hidden">
      <span className="text-xs text-zinc-500 font-medium tracking-widest uppercase">
        Bước {step} / {totalSteps}
      </span>
    </div>

    <button 
      onClick={handleSkip} 
      className="text-zinc-500 hover:text-zinc-300 font-medium text-sm transition-colors underline decoration-dotted underline-offset-4"
    >
      Bỏ qua
    </button>
  </div>
);

const getStepIllustration = (step) => {
  switch (step) {
    case 2: // Age
      return (
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#c8f31d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
          <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
          <path d="M12 6v6l4 2" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="2" fill="#c8f31d" />
        </svg>
      );
    case 3: // Current Weight
      return (
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#c8f31d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover:scale-105 transition-transform duration-300">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <circle cx="12" cy="11" r="4" />
          <path d="M12 11l2-2" strokeWidth="2" />
          <path d="M6 18h12" />
        </svg>
      );
    case 4: // Goal Weight
      return (
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#c8f31d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover:scale-105 transition-transform duration-300">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill="#c8f31d" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
      );
    case 5: // Height
      return (
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#c8f31d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover:scale-105 transition-transform duration-300">
          <line x1="6" y1="2" x2="6" y2="22" strokeWidth="2" />
          <line x1="6" y1="5" x2="14" y2="5" />
          <line x1="6" y1="10" x2="18" y2="10" strokeWidth="2" />
          <line x1="6" y1="15" x2="14" y2="15" />
          <line x1="6" y1="20" x2="18" y2="20" />
          <path d="M18 4h2" />
          <path d="M18 7h2" />
          <path d="M18 13h2" />
          <path d="M18 16h2" />
        </svg>
      );
    case 6: // Fitness Level
      return (
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#c8f31d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce" style={{ animationDuration: '3s' }}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 7: // Goal
      return (
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#c8f31d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover:rotate-12 transition-transform duration-300">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
          <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
        </svg>
      );
    default:
      return null;
  }
};

const getStepSlogan = (step) => {
  switch (step) {
    case 2:
      return "Tuổi tác chỉ là con số. Mỗi ngày là một cơ hội mới để bạn trở nên khỏe mạnh và dẻo dai hơn.";
    case 3:
      return "Hiểu rõ cân nặng hiện tại giúp thiết lập kế hoạch dinh dưỡng và tập luyện chuẩn xác nhất.";
    case 4:
      return "Mục tiêu rõ ràng sẽ định hình hướng đi. Hãy kiên định với con số bạn mong muốn đạt được.";
    case 5:
      return "Chiều cao là chỉ số nền tảng để đo lường BMI và cá nhân hóa lộ trình tập luyện của riêng bạn.";
    case 6:
      return "Mỗi cấp độ thể lực đều có lộ trình phát triển riêng. Hãy bước đi vững chắc từ vạch xuất phát.";
    case 7:
      return "Xác định mục tiêu lớn giúp bạn giữ vững động lực trên hành trình rèn luyện bản thân.";
    default:
      return "";
  }
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(2); // Start from 2 to match Figma labels
  const totalSteps = 7;

  const [formData, setFormData] = useState({
    age: 25,
    weight: '70',
    goalWeight: '65',
    height: '170',
    fitnessLevel: 'Mới bắt đầu',
    goal: 'Cải thiện thể lực'
  });

  const [weightUnit, setWeightUnit] = useState('KG');
  const [heightUnit, setHeightUnit] = useState('CM');

  const handleNext = () => {
    if (step <= totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 2) setStep(step - 1);
    else navigate(-1);
  };

  const handleSkip = () => {
    if (step <= totalSteps) setStep(step + 1);
  };

  const submitMetrics = () => {
    console.log('Submitting metrics:', formData);
    window.location.href = '/dashboard';
  };

  const renderStepContent = () => {
    switch (step) {
      case 2:
        return (
          <StepAge
            age={formData.age}
            setAge={(newAge) => setFormData({ ...formData, age: newAge })}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 3:
        return (
          <StepWeightCurrent
            weight={formData.weight}
            setWeight={(val) => setFormData({ ...formData, weight: val })}
            weightUnit={weightUnit}
            setWeightUnit={setWeightUnit}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 4:
        return (
          <StepWeightGoal
            goalWeight={formData.goalWeight}
            setGoalWeight={(val) => setFormData({ ...formData, goalWeight: val })}
            weightUnit={weightUnit}
            setWeightUnit={setWeightUnit}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 5:
        return (
          <StepHeight
            height={formData.height}
            setHeight={(val) => setFormData({ ...formData, height: val })}
            heightUnit={heightUnit}
            setHeightUnit={setHeightUnit}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 6:
        return (
          <StepFitnessLevel
            fitnessLevel={formData.fitnessLevel}
            setFitnessLevel={(level) => setFormData({ ...formData, fitnessLevel: level })}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 7:
        return (
          <StepGoal
            goal={formData.goal}
            setGoal={(goal) => setFormData({ ...formData, goal })}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 8:
        return <StepFinish onSubmit={submitMetrics} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-zinc-900/60 border border-zinc-800/80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row min-h-[600px] backdrop-blur-md">
        
        {/* Left Column - 40% (Illustration + Progress + Slogan) - Desktop only */}
        {step < 8 && (
          <div className="hidden md:flex md:w-[40%] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 flex-col justify-between border-r border-zinc-850 relative overflow-hidden">
            {/* Decorative background gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8f31d]/10 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#c8f31d]/5 rounded-full blur-[40px] pointer-events-none"></div>

            {/* Top: Progress and Step Label */}
            <div className="relative z-10">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold tracking-widest uppercase mb-4">
                <span>TIẾN TRÌNH</span>
                <span>{step - 1} / {totalSteps - 1}</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#c8f31d] to-[#aee018] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((step - 2) / (totalSteps - 2)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Middle: Beautiful SVG Illustration */}
            <div className="relative z-10 my-8 flex items-center justify-center flex-1">
              {getStepIllustration(step)}
            </div>

            {/* Bottom: Slogan / Motivational Quote */}
            <div className="relative z-10 border-t border-zinc-850 pt-6">
              <p className="text-[#c8f31d] text-xs font-semibold uppercase tracking-wider mb-2">Lời khuyên</p>
              <p className="text-zinc-300 text-sm leading-relaxed italic">
                "{getStepSlogan(step)}"
              </p>
            </div>
          </div>
        )}

        {/* Right Column - 60% (or 100% on mobile / step 8) */}
        <div className={`w-full ${step < 8 ? 'md:w-[60%]' : 'md:w-full'} flex flex-col bg-zinc-900/30`}>
          {step < 8 && (
            <OnboardingHeader 
              step={step} 
              totalSteps={totalSteps} 
              handlePrev={handlePrev} 
              handleSkip={handleSkip} 
              ChevronLeft={ChevronLeft} 
            />
          )}
          <div className="flex-1 flex flex-col justify-center p-6 md:p-10 pt-4">
            {renderStepContent()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
