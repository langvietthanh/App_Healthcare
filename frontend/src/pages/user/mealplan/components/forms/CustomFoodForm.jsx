import { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';

const ImageUploader = ({ previewURL, onUpload }) => (
  // GIAO DIỆN IMAGE UPLOADER
  <div className="flex justify-center mb-8 mt-2">
    <label className="w-24 h-24 bg-zinc-800 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-600 cursor-pointer hover:border-[#c8f31d] hover:text-[#c8f31d] transition-colors relative group overflow-hidden">
      {previewURL ? (
        <img src={previewURL} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <>
          <Plus size={28} className="text-zinc-500 group-hover:text-[#c8f31d] mb-1" strokeWidth={3} />
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider group-hover:text-[#c8f31d]">Thêm ảnh</span>
        </>
      )}
      <input type="file" accept="image/*" hidden onChange={onUpload} />
    </label>
  </div>
);

const NameInput = ({ name, setName }) => (
  // GIAO DIỆN NAME INPUT
  <div className="mb-6">
    <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Tên món ăn <span className="text-rose-500">*</span></label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Ví dụ: Sinh tố bơ chuối..."
      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-bold focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none transition-all shadow-inner"
    />
  </div>
);

const PortionInput = ({ amount, setAmount, unit, setUnit }) => (
  // GIAO DIỆN PORTION INPUT
  <div className="mb-6 flex gap-4">
    <div className="flex-1">
      <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Định lượng 1 phần <span className="text-rose-500">*</span></label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="100"
        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-bold focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none transition-all shadow-inner"
      />
    </div>
    <div className="w-1/3">
      <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Đơn vị</label>
      <div className="relative">
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-bold focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none appearance-none transition-all shadow-inner cursor-pointer"
        >
          <option value="g">g</option>
          <option value="ml">ml</option>
          <option value="lb">lb</option>
          <option value="oz">oz</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronRight size={16} className="text-zinc-500 rotate-90" />
        </div>
      </div>
    </div>
  </div>
);

const CaloriesInput = ({ calories, setCalories, protein, carbs, fat }) => (
  // GIAO DIỆN CALORIES INPUT
  <div className="mb-8">
    <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Năng lượng (Tự tính từ macros) <span className="text-rose-500">*</span></label>
    <div className="relative">
      <input
        type="number"
        value={calories || ((+protein || 0) * 4 + (+carbs || 0) * 4 + (+fat || 0) * 9) || ''}
        onChange={(e) => setCalories(e.target.value)}
        disabled
        placeholder="0"
        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pl-6 text-white font-black text-2xl focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none text-[#c8f31d] transition-all shadow-inner opacity-75"
      />
      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">kcal</span>
    </div>
  </div>
);

const MacrosInput = ({ carbs, setCarbs, protein, setProtein, fat, setFat }) => (
  // GIAO DIỆN MACROS INPUT
  <div className="mb-10">
    <label className="text-xs font-bold text-zinc-400 mb-3 block uppercase tracking-widest">Thông tin dinh dưỡng</label>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="text-[10px] text-amber-400 font-bold mb-1 block text-center uppercase tracking-wider">Carbs</label>
        <div className="relative">
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="0"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-bold text-center focus:border-amber-400 focus:outline-none shadow-inner"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-bold">g</span>
        </div>
      </div>
      <div>
        <label className="text-[10px] text-rose-400 font-bold mb-1 block text-center uppercase tracking-wider">Protein</label>
        <div className="relative">
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="0"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-bold text-center focus:border-rose-400 focus:outline-none shadow-inner"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-bold">g</span>
        </div>
      </div>
      <div>
        <label className="text-[10px] text-green-400 font-bold mb-1 block text-center uppercase tracking-wider">Fat</label>
        <div className="relative">
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            placeholder="0"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-bold text-center focus:border-green-400 focus:outline-none shadow-inner"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-bold">g</span>
        </div>
      </div>
    </div>
  </div>
);

const CustomFoodForm = ({ onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [amount, setAmount] = useState(initialData ? String(initialData.amount) : '100');
  const [unit, setUnit] = useState(initialData?.unit || 'g');
  const [calories, setCalories] = useState(initialData ? String(initialData.kcal) : '');
  const [carbs, setCarbs] = useState(initialData ? String(initialData.carbs) : '');
  const [protein, setProtein] = useState(initialData ? String(initialData.protein) : '');
  const [fat, setFat] = useState(initialData ? String(initialData.fat) : '');
  const [previewURL, setPreviewURL] = useState(initialData?.image && initialData.image !== '🍲' ? initialData.image : '');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input để có thể chọn lại cùng 1 file (nếu test nhiều lần)
    e.target.value = null;

    // Lưu file vào state và tạo link hiển thị tạm (chưa upload)
    setImageFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên món ăn');
      return;
    }

    setLoading(true);

    // Đóng gói data bằng FormData để gửi cả chữ lẫn file
    const formData = new FormData();
    formData.append('name', name);
    formData.append('amount', +amount || 100);
    formData.append('unit', unit);
    formData.append('protein', +protein || 0);
    formData.append('carbs', +carbs || 0);
    formData.append('fat', +fat || 0);
    formData.append('isPublic', false);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      let res;
      if (initialData && initialData.id) {
        res = await fetch(`http://localhost:3000/api/foods/${initialData.id}?type=food`, {
          method: 'PATCH',
          headers: {
            'x-auth-token': token
          },
          body: formData
        });
      } else {
        res = await fetch('http://localhost:3000/api/foods?type=food', {
          method: 'POST',
          headers: {
            'x-auth-token': token
          },
          body: formData
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra khi lưu món ăn');
      }

      onSave(); // Reload và đóng form
    } catch (err) {
      console.error('Error creating custom food:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo món ăn');
    } finally {
      setLoading(false);
    }
  };
  return (
    // GIAO DIỆN CUSTOM FOOD FORM
    <div className="flex-1 overflow-y-auto p-6 bg-[#111] scrollbar-hide">
      <ImageUploader previewURL={previewURL} onUpload={handleImageUpload} />

      <NameInput name={name} setName={setName} />

      <PortionInput amount={amount} setAmount={setAmount} unit={unit} setUnit={setUnit} ChevronRight={ChevronRight} />

      <CaloriesInput calories={calories} setCalories={setCalories} protein={protein} carbs={carbs} fat={fat} />

      <MacrosInput carbs={carbs} setCarbs={setCarbs} protein={protein} setProtein={setProtein} fat={fat} setFat={setFat} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#c8f31d] text-black font-black py-4 rounded-2xl text-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.2)] mb-4 disabled:opacity-50"
      >
        {loading ? 'Đang lưu...' : 'Lưu món ăn'}
      </button>
    </div>
  );
};

export default CustomFoodForm;
