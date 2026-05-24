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
  <div className="flex items-center justify-between px-6 pt-6 pb-4">
    <button onClick={handlePrev} className="text-[#c8f31d] hover:text-[#aee018]">
      <ChevronLeft size={32} />
    </button>

    <div className="flex flex-col items-center">
      <span className="text-xs text-zinc-500 font-medium tracking-widest uppercase">
        Bước {step} / {totalSteps}
      </span>
    </div>

    <button onClick={handleSkip} className="text-[#c8f31d] font-bold text-sm hover:text-[#aee018]">
      Bỏ qua
    </button>
  </div>
);

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(2); // Start from 2 to match Figma labels
  const totalSteps = 7;

  const [formData, setFormData] = useState({
    age: 50,
    weight: '88',
    goalWeight: '65',
    height: '185',
    fitnessLevel: 'Mới bắt đầu',
    goal: 'Cải thiện thể lực'
  });

  const [weightUnit, setWeightUnit] = useState('KG');
  const [heightUnit, setHeightUnit] = useState('CM');

  const handleNumpad = (val, field) => {
    if (val === 'back') {
      setFormData((prev) => ({ ...prev, [field]: prev[field].slice(0, -1) }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: prev[field] + val }));
    }
  };

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
    // Tương lai: Gọi API PUT /api/user/physical-detail và PUT /api/user/goals ở đây
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
          />
        );
      case 3:
        return (
          <StepWeightCurrent
            weight={formData.weight}
            weightUnit={weightUnit}
            setWeightUnit={setWeightUnit}
            onNumpadClick={(val) => handleNumpad(val, 'weight')}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <StepWeightGoal
            goalWeight={formData.goalWeight}
            weightUnit={weightUnit}
            setWeightUnit={setWeightUnit}
            onNumpadClick={(val) => handleNumpad(val, 'goalWeight')}
            onNext={handleNext}
          />
        );
      case 5:
        return (
          <StepHeight
            height={formData.height}
            heightUnit={heightUnit}
            setHeightUnit={setHeightUnit}
            onNumpadClick={(val) => handleNumpad(val, 'height')}
            onNext={handleNext}
          />
        );
      case 6:
        return (
          <StepFitnessLevel
            fitnessLevel={formData.fitnessLevel}
            setFitnessLevel={(level) => setFormData({ ...formData, fitnessLevel: level })}
            onNext={handleNext}
          />
        );
      case 7:
        return (
          <StepGoal
            goal={formData.goal}
            setGoal={(goal) => setFormData({ ...formData, goal })}
            onNext={handleNext}
          />
        );
      case 8:
        return <StepFinish onSubmit={submitMetrics} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {step < 8 && (
        <OnboardingHeader 
          step={step} 
          totalSteps={totalSteps} 
          handlePrev={handlePrev} 
          handleSkip={handleSkip} 
          ChevronLeft={ChevronLeft} 
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-4">{renderStepContent()}</div>
    </div>
  );
};

export default Onboarding;
