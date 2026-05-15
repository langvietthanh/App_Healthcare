import { useState } from 'react';
import { Plus, Coffee, Sun, Moon, Cookie, ChevronRight, Search, ChevronLeft, Heart } from 'lucide-react';
import { mockFoods } from './admin/AdminFoods';

const MealCard = ({ id, title, icon: Icon, currentKcal, targetKcal, items = [], onAddFood }) => {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-[24px] p-6 mb-6 shadow-xl transition-all hover:bg-zinc-900/80 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-[#c8f31d] shadow-inner">
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-zinc-500 text-sm font-medium">Khuyến nghị: {targetKcal} kcal</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white">{currentKcal}</span>
          <span className="text-sm text-zinc-500 ml-1">kcal</span>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="space-y-3 mt-6 mb-6">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center px-4 py-3 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
              <div className="flex flex-col">
                <span className="font-semibold text-white">{item.name}</span>
                <span className="text-xs text-zinc-400">{item.amount}</span>
              </div>
              <span className="font-bold text-[#c8f31d]">{item.kcal} kcal</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-zinc-600 text-sm font-medium">
          Chưa có món ăn nào được thêm
        </div>
      )}

      <button
        onClick={() => onAddFood(id, title)}
        className="w-full mt-2 bg-transparent border-2 border-zinc-700 text-white font-bold py-3.5 rounded-xl hover:border-[#c8f31d] hover:text-[#c8f31d] transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} strokeWidth={3} />
        Nhập món ăn
      </button>
    </div>
  );
};

const MealPlan = () => {
  const [activeMeal, setActiveMeal] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('100');
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');
  const [isCreatingFood, setIsCreatingFood] = useState(false);

  const handleAddFood = (id, title) => {
    setActiveMeal({ id, title });
    setSelectedFood(null);
    setIsCreatingFood(false);
  };

  const handleCloseSearch = () => {
    if (isCreatingFood) {
      setIsCreatingFood(false);
    } else if (selectedFood) {
      setSelectedFood(null);
    } else {
      setActiveMeal(null);
    }
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setAmount('100');
    setIsFavorite(false);
  };

  return (
    <div className="h-full bg-[#111] text-white relative font-sans overflow-hidden flex flex-col">

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto pt-10 pb-20 scrollbar-hide">
        {/* Header */}
        <div className="px-8 mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Thực đơn <span className="text-[#c8f31d]">Hôm nay</span></h1>
            <p className="text-zinc-400 font-medium">Ghi chép các bữa ăn để theo dõi lượng calo</p>
          </div>
          <div className="w-16 h-16 rounded-[20px] bg-zinc-800 flex flex-col items-center justify-center border border-zinc-700 shadow-lg">
            <span className="text-xs font-bold text-zinc-400 uppercase">Tháng 5</span>
            <span className="text-xl font-black text-[#c8f31d]">14</span>
          </div>
        </div>

        {/* Summary Banner */}
        <div className="px-8 mb-8">
          <div className="bg-gradient-to-r from-[#c8f31d]/20 to-transparent border border-[#c8f31d]/30 rounded-2xl p-6 flex justify-between items-center">
            <div>
              <p className="text-zinc-300 text-sm font-medium mb-1">Tổng lượng Calo đã nạp</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#c8f31d]">593</span>
                <span className="text-zinc-500 font-bold">/ 2000 kcal</span>
              </div>
            </div>
            <button className="w-10 h-10 bg-[#c8f31d] text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Meals List */}
        <div className="px-8">
          <MealCard
            id="breakfast"
            title="Bữa sáng"
            icon={Coffee}
            currentKcal={320}
            targetKcal={500}
            items={[
              { name: "Phở bò", amount: "1 bát vừa", kcal: 320 }
            ]}
            onAddFood={handleAddFood}
          />

          <MealCard
            id="lunch"
            title="Bữa trưa"
            icon={Sun}
            currentKcal={273}
            targetKcal={700}
            items={[
              { name: "Cơm tấm", amount: "1 đĩa", kcal: 273 }
            ]}
            onAddFood={handleAddFood}
          />

          <MealCard
            id="dinner"
            title="Bữa tối"
            icon={Moon}
            currentKcal={0}
            targetKcal={600}
            items={[]}
            onAddFood={handleAddFood}
          />

          <MealCard
            id="snack"
            title="Bữa phụ"
            icon={Cookie}
            currentKcal={0}
            targetKcal={200}
            items={[]}
            onAddFood={handleAddFood}
          />
        </div>
      </div>

      {/* Tầng Overlay Thêm Món Ăn (Search Food / Portion Form) */}
      {activeMeal && (
        <div className="absolute inset-0 bg-[#111] z-50 flex flex-col h-full animate-[slideIn_0.3s_ease-out]">
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>

          {/* Header Overlay */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-[#1a1a1a]">
            <button onClick={handleCloseSearch} className="text-zinc-400 hover:text-white transition-colors bg-zinc-800 p-2 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-white">
              {isCreatingFood ? 'Tạo món cá nhân' : selectedFood ? 'Chi tiết món ăn' : `Thêm món - ${activeMeal.title}`}
            </h2>
            {selectedFood && !isCreatingFood ? (
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-rose-500/20 text-rose-500' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            ) : (
              <div className="w-10"></div>
            )}
          </div>

          {isCreatingFood ? (
            /* Form Tạo Món Cá Nhân */
            <div className="flex-1 overflow-y-auto p-6 bg-[#111] scrollbar-hide">
              {/* Ảnh món ăn (Avatar/Icon) */}
              <div className="flex justify-center mb-8 mt-2">
                <div className="w-24 h-24 bg-zinc-800 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-600 cursor-pointer hover:border-[#c8f31d] hover:text-[#c8f31d] transition-colors relative group">
                  <Plus size={28} className="text-zinc-500 group-hover:text-[#c8f31d] mb-1" strokeWidth={3} />
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider group-hover:text-[#c8f31d]">Thêm ảnh</span>
                </div>
              </div>

              {/* Tên món ăn */}
              <div className="mb-6">
                <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Tên món ăn <span className="text-rose-500">*</span></label>
                <input type="text" placeholder="Ví dụ: Sinh tố bơ chuối..." className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-bold focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none transition-all shadow-inner" />
              </div>

              {/* Định lượng 1 phần ăn */}
              <div className="mb-6 flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Định lượng 1 phần <span className="text-rose-500">*</span></label>
                  <input type="number" placeholder="100" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-bold focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none transition-all shadow-inner" />
                </div>
                <div className="w-1/3">
                  <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Đơn vị</label>
                  <div className="relative">
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-bold focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none appearance-none transition-all shadow-inner cursor-pointer">
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="lb">lb</option>
                      <option value="oz">oz</option>
                      <option value="portion">phần</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronRight size={16} className="text-zinc-500 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Calo */}
              <div className="mb-8">
                <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Năng lượng <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input type="number" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pl-6 text-white font-black text-2xl focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none text-[#c8f31d] transition-all shadow-inner" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">kcal</span>
                </div>
              </div>

              {/* Macros */}
              <div className="mb-10">
                <label className="text-xs font-bold text-zinc-400 mb-3 block uppercase tracking-widest">Thông tin dinh dưỡng (Tuỳ chọn)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-amber-400 font-bold mb-1 block text-center uppercase tracking-wider">Carbs</label>
                    <div className="relative">
                      <input type="number" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-bold text-center focus:border-amber-400 focus:outline-none shadow-inner" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-bold">g</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-rose-400 font-bold mb-1 block text-center uppercase tracking-wider">Protein</label>
                    <div className="relative">
                      <input type="number" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-bold text-center focus:border-rose-400 focus:outline-none shadow-inner" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-bold">g</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-green-400 font-bold mb-1 block text-center uppercase tracking-wider">Fat</label>
                    <div className="relative">
                      <input type="number" placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-bold text-center focus:border-green-400 focus:outline-none shadow-inner" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-bold">g</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsCreatingFood(false)}
                className="w-full bg-[#c8f31d] text-black font-black py-4 rounded-2xl text-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.2)] mb-4"
              >
                Lưu món ăn
              </button>
            </div>
          ) : !selectedFood ? (
            <>
              {/* Thanh tìm kiếm */}
              <div className="p-6 bg-[#1a1a1a]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Tìm kiếm thực phẩm..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Tabs phân loại */}
              <div className="flex px-6 bg-[#1a1a1a] border-b border-zinc-800">
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`flex-1 pb-4 text-sm tracking-wide uppercase transition-colors font-bold ${activeTab === 'recent' ? 'text-[#c8f31d] border-b-2 border-[#c8f31d]' : 'text-zinc-500 hover:text-white'}`}
                >Gần đây</button>
                <button
                  onClick={() => setActiveTab('favorite')}
                  className={`flex-1 pb-4 text-sm tracking-wide uppercase transition-colors font-bold ${activeTab === 'favorite' ? 'text-[#c8f31d] border-b-2 border-[#c8f31d]' : 'text-zinc-500 hover:text-white'}`}
                >Yêu thích</button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`flex-1 pb-4 text-sm tracking-wide uppercase transition-colors font-bold ${activeTab === 'custom' ? 'text-[#c8f31d] border-b-2 border-[#c8f31d]' : 'text-zinc-500 hover:text-white'}`}
                >Của tôi</button>
              </div>

              {/* Danh sách món ăn gợi ý */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#111] scrollbar-hide">
                {activeTab === 'custom' && (
                  <button
                    onClick={() => setIsCreatingFood(true)}
                    className="w-full mb-4 bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 font-bold py-5 rounded-2xl hover:border-[#c8f31d] hover:text-[#c8f31d] hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-inner"
                  >
                    <Plus size={22} strokeWidth={3} />
                    Tạo món cá nhân mới
                  </button>
                )}

                {/* Sử dụng dữ liệu mockFoods */}
                {(activeTab === 'recent' || activeTab === 'favorite' || activeTab === 'custom') && mockFoods.map((food, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectFood(food)}
                    className="flex justify-between items-center p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                        {food.image ? (
                          <img src={food.image} alt={food.name} className="w-full h-full object-cover opacity-80" />
                        ) : (
                          <img src="/icon_protein.png" alt={food.name} className="w-full h-full object-cover opacity-80" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base">{food.name}</h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-zinc-500 text-xs font-medium">{food.amount}{food.unit}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                          <span className="text-[#c8f31d] text-sm font-extrabold">{food.calories} kcal</span>
                        </div>
                        <p className="text-zinc-400 text-[10px] mt-1 max-w-[200px] truncate">{food.description}</p>
                      </div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#c8f31d] group-hover:bg-[#c8f31d] group-hover:text-black transition-colors shadow-lg">
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Form nhập định lượng chi tiết */
            <div className="flex-1 flex flex-col p-5 bg-[#111] overflow-y-auto">
              <div className="flex flex-col items-center mb-6 pt-2">
                <div className="w-24 h-24 bg-zinc-800 rounded-[20px] overflow-hidden border border-zinc-700 mb-4 shadow-xl">
                  <img src={selectedFood.image || "/icon_protein.png"} alt={selectedFood.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black text-white text-center mb-1">{selectedFood.name}</h3>
                <p className="text-[#c8f31d] font-bold text-lg">{selectedFood.calories} kcal <span className="text-zinc-500 text-xs font-medium">/ {selectedFood.amount}{selectedFood.unit}</span></p>
              </div>

              {/* Macro breakdown */}
              <div className="flex justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 shadow-lg">
                <div className="text-center flex-1 border-r border-zinc-800">
                  <p className="text-amber-400 font-black text-xl mb-1">{selectedFood.carbs}g</p>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Carbs</p>
                </div>
                <div className="text-center flex-1 border-r border-zinc-800">
                  <p className="text-rose-400 font-black text-xl mb-1">{selectedFood.protein}g</p>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Protein</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-green-400 font-black text-xl mb-1">{selectedFood.fat}g</p>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Fat</p>
                </div>
              </div>

              {/* Input lượng */}
              <div className="mb-4">
                <label className="text-zinc-400 font-bold text-sm mb-4 block uppercase tracking-wide">Nhập định lượng</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl py-4 px-5 text-white text-2xl font-black focus:outline-none focus:border-[#c8f31d] text-center shadow-inner"
                    />
                  </div>
                  <div className="w-32 relative">
                    <select className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl py-4 px-4 text-white text-lg font-bold focus:outline-none focus:border-[#c8f31d] appearance-none cursor-pointer">
                      <option value="g">gram</option>
                      <option value="ml">ml</option>
                      <option value="lb">lb</option>
                      <option value="oz">oz</option>
                      <option value="portion">phần</option>
                      <option value="bowl">bát</option>
                    </select>
                    {/* Fake dropdown arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronRight size={16} className="text-zinc-500 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button
                  onClick={handleCloseSearch}
                  className="w-full bg-[#c8f31d] text-black font-black py-4 rounded-2xl text-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.2)]"
                >
                  Thêm vào bữa ăn
                </button>
              </div>
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default MealPlan;
