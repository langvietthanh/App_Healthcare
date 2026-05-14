import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Delete } from 'lucide-react';

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
      setFormData(prev => ({ ...prev, [field]: prev[field].slice(0, -1) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: prev[field] + val }));
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
    console.log("Submitting metrics:", formData);
    navigate('/dashboard');
  };

  const Numpad = ({ field }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'];
    return (
      <div className="grid grid-cols-3 w-full border-t border-zinc-800">
        {keys.map((k, i) => (
          <button 
            key={i} 
            onClick={() => handleNumpad(k, field)}
            className="h-16 flex items-center justify-center text-2xl font-medium border-b border-r border-zinc-800 hover:bg-zinc-900 active:bg-zinc-800 transition-colors"
            style={{ borderRightWidth: (i + 1) % 3 === 0 ? 0 : '1px' }}
          >
            {k === 'back' ? <Delete size={28} /> : k}
          </button>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 2:
        return (
          <div className="flex flex-col flex-1 items-center w-full">
            <h2 className="text-3xl font-bold mb-10 text-center w-full">Bạn bao nhiêu tuổi?</h2>
            
            <div className="flex-1 flex flex-col items-center justify-center w-full relative">
               <div className="absolute top-1/2 -translate-y-1/2 w-48 h-20 border border-[#c8f31d] rounded-lg z-0"></div>
               <div className="z-10 text-center space-y-6">
                 <div className="text-zinc-600 text-2xl font-bold cursor-pointer" onClick={()=>setFormData({...formData, age: formData.age - 2})}>{formData.age - 2}</div>
                 <div className="text-zinc-500 text-3xl font-bold cursor-pointer" onClick={()=>setFormData({...formData, age: formData.age - 1})}>{formData.age - 1}</div>
                 <div className="text-[#c8f31d] text-6xl font-bold my-4">{formData.age}</div>
                 <div className="text-zinc-500 text-3xl font-bold cursor-pointer" onClick={()=>setFormData({...formData, age: formData.age + 1})}>{formData.age + 1}</div>
                 <div className="text-zinc-600 text-2xl font-bold cursor-pointer" onClick={()=>setFormData({...formData, age: formData.age + 2})}>{formData.age + 2}</div>
               </div>
            </div>

            <div className="w-full px-6 pb-8 mt-auto">
              <button onClick={handleNext} className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#b0d815] transition-all">
                Tiếp theo
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col flex-1 items-center w-full">
            <div className="w-full px-6">
              <h2 className="text-3xl font-bold mb-8 text-center">Cân nặng hiện tại?</h2>
              
              <div className="flex justify-center mb-10">
                <div className="bg-zinc-800 rounded-lg p-1 flex">
                  <button onClick={() => setWeightUnit('LBS')} className={`px-6 py-2 rounded-md font-bold transition-colors ${weightUnit === 'LBS' ? 'bg-zinc-200 text-black' : 'text-zinc-400 hover:text-white'}`}>LBS</button>
                  <button onClick={() => setWeightUnit('KG')} className={`px-6 py-2 rounded-md font-bold transition-colors ${weightUnit === 'KG' ? 'bg-zinc-200 text-black' : 'text-zinc-400 hover:text-white'}`}>KG</button>
                </div>
              </div>

              <div className="text-center w-full flex justify-center mb-10">
                <div className="border border-[#c8f31d] rounded-lg py-4 px-8 min-w-[250px] bg-zinc-900/50">
                  <span className="text-4xl font-bold">{formData.weight || '0'}</span>
                  <span className="text-2xl text-zinc-400 ml-2">| {weightUnit.toLowerCase()}</span>
                </div>
              </div>
            </div>

            <div className="w-full mt-auto">
              <div className="px-6 mb-6">
                <button onClick={handleNext} className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#b0d815] transition-all">
                  Tiếp theo
                </button>
              </div>
              <Numpad field="weight" />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col flex-1 items-center w-full">
            <div className="w-full px-6">
              <h2 className="text-3xl font-bold mb-8 text-center">Cân nặng mục tiêu?</h2>
              
              <div className="flex justify-center mb-10">
                <div className="bg-zinc-800 rounded-lg p-1 flex">
                  <button onClick={() => setWeightUnit('LBS')} className={`px-6 py-2 rounded-md font-bold transition-colors ${weightUnit === 'LBS' ? 'bg-zinc-200 text-black' : 'text-zinc-400 hover:text-white'}`}>LBS</button>
                  <button onClick={() => setWeightUnit('KG')} className={`px-6 py-2 rounded-md font-bold transition-colors ${weightUnit === 'KG' ? 'bg-zinc-200 text-black' : 'text-zinc-400 hover:text-white'}`}>KG</button>
                </div>
              </div>

              <div className="text-center w-full flex justify-center mb-10">
                <div className="border border-[#c8f31d] rounded-lg py-4 px-8 min-w-[250px] bg-zinc-900/50">
                  <span className="text-4xl font-bold">{formData.goalWeight || '0'}</span>
                  <span className="text-2xl text-zinc-400 ml-2">| {weightUnit.toLowerCase()}</span>
                </div>
              </div>
            </div>

            <div className="w-full mt-auto">
              <div className="px-6 mb-6">
                <button onClick={handleNext} className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#b0d815] transition-all">
                  Tiếp theo
                </button>
              </div>
              <Numpad field="goalWeight" />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col flex-1 items-center w-full">
            <div className="w-full px-6">
              <h2 className="text-3xl font-bold mb-8 text-center">Chiều cao của bạn?</h2>
              
              <div className="flex justify-center mb-10">
                <div className="bg-zinc-800 rounded-lg p-1 flex">
                  <button onClick={() => setHeightUnit('FEET')} className={`px-6 py-2 rounded-md font-bold transition-colors ${heightUnit === 'FEET' ? 'bg-zinc-200 text-black' : 'text-zinc-400 hover:text-white'}`}>FEET</button>
                  <button onClick={() => setHeightUnit('CM')} className={`px-6 py-2 rounded-md font-bold transition-colors ${heightUnit === 'CM' ? 'bg-zinc-200 text-black' : 'text-zinc-400 hover:text-white'}`}>CM</button>
                </div>
              </div>

              <div className="text-center w-full flex justify-center mb-10">
                <div className="border border-[#c8f31d] rounded-lg py-4 px-8 min-w-[250px] bg-zinc-900/50">
                  <span className="text-4xl font-bold">{formData.height || '0'}</span>
                  <span className="text-2xl text-zinc-400 ml-2">| {heightUnit.toLowerCase()}</span>
                </div>
              </div>
            </div>

            <div className="w-full mt-auto">
              <div className="px-6 mb-6">
                <button onClick={handleNext} className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#b0d815] transition-all">
                  Tiếp theo
                </button>
              </div>
              <Numpad field="height" />
            </div>
          </div>
        );

      case 6: {
        const levels = [
          { id: 'Mới bắt đầu', label: 'MỚI BẮT ĐẦU' },
          { id: 'Trung bình', label: 'TRUNG BÌNH' },
          { id: 'Nâng cao', label: 'NÂNG CAO' }
        ];
        return (
          <div className="flex flex-col flex-1 items-center w-full px-6">
            <h2 className="text-3xl font-bold mb-10 text-center">Mức độ thể lực?</h2>
            
            <div className="w-full space-y-4">
              {levels.map(lvl => (
                <button 
                  key={lvl.id}
                  onClick={() => setFormData({...formData, fitnessLevel: lvl.id})}
                  className={`w-full py-5 rounded-xl font-bold text-lg transition-all border ${
                    formData.fitnessLevel === lvl.id 
                      ? 'bg-[#c8f31d] text-black border-[#c8f31d]' 
                      : 'bg-transparent text-white border-zinc-700 hover:border-[#c8f31d]'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            <div className="w-full mt-auto pb-8">
              <button onClick={handleNext} className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#b0d815] transition-all">
                Tiếp theo
              </button>
            </div>
          </div>
        );
      }

      case 7:
        const goals = [
          { id: 'Giảm cân', label: 'Giảm Cân', icon: '⚖️' },
          { id: 'Tăng cơ', label: 'Tăng Cơ', icon: '💪' },
          { id: 'Cải thiện thể lực', label: 'Cải Thiện Thể Lực', icon: '🏋️' }
        ];
        return (
          <div className="flex flex-col flex-1 items-center w-full px-6">
            <h2 className="text-3xl font-bold mb-10 text-center">Mục tiêu của bạn?</h2>
            
            <div className="w-full space-y-4">
              {goals.map(g => (
                <button 
                  key={g.id}
                  onClick={() => setFormData({...formData, goal: g.id})}
                  className={`w-full py-5 px-6 rounded-xl font-bold text-lg transition-all border flex items-center justify-center gap-3 ${
                    formData.goal === g.id 
                      ? 'bg-[#c8f31d] text-black border-[#c8f31d]' 
                      : 'bg-transparent text-white border-zinc-700 hover:border-[#c8f31d]'
                  }`}
                >
                  <span>{g.icon}</span>
                  {g.label}
                </button>
              ))}
            </div>

            <div className="w-full mt-auto pb-8">
              <button onClick={handleNext} className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#b0d815] transition-all">
                Hoàn tất
              </button>
            </div>
          </div>
        );

      case 8: // Final Screen
        return (
          <div className="flex flex-col flex-1 items-center justify-center w-full px-6 text-center">
            <h2 className="text-4xl font-bold mb-4 mt-10">Bắt đầu nào!</h2>
            <p className="text-zinc-400 mb-10">
              Hãy bắt đầu quá trình luyện tập, chúng tôi sẽ giúp bạn đạt được mục tiêu thể hình của mình.
            </p>
            
            {/* Circle Image Placeholder */}
            <div className="w-64 h-64 rounded-full border-4 border-[#c8f31d] p-1 mb-10 overflow-hidden shadow-[0_0_30px_rgba(200,243,29,0.3)] mx-auto relative group cursor-pointer">
              <div className="w-full h-full rounded-full bg-zinc-800 flex flex-col items-center justify-center overflow-hidden">
                 <span className="text-6xl mb-2 group-hover:scale-110 transition-transform">🏋️‍♂️</span>
                 <span className="text-xs text-zinc-500 font-medium">Sẵn sàng!</span>
              </div>
            </div>

            <p className="text-lg text-zinc-300 font-light mb-10">
              "Kiến tạo <span className="text-[#c8f31d] font-bold">cơ thể mơ ước</span>, giải phóng bản thân, thay đổi cuộc sống"
            </p>

            <div className="w-full mt-auto pb-8">
              <button onClick={submitMetrics} className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#b0d815] transition-all">
                Bắt Đầu Tập Luyện!
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {/* Header */}
      {step < 8 && (
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
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-4">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default Onboarding;
