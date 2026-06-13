import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import axiosClient from '../../../config/axiosClient';
import RegisterForm from './RegisterForm';

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        username: fullName,
        email: email,
        password: password,
        phone: phone, // Gửi kèm số điện thoại
        // --- Giá trị giả định để tránh bị lỗi 400 Bad Request từ server ---
        height: 170,
        weight: 60,
        gender: 'male',
        birthDate: '2000-01-01'
      };

      await axiosClient.post('/auth/register', payload);

      // Đăng ký thành công -> Tự động gọi API Đăng nhập để lấy Token
      const loginResponse = await axiosClient.post('/auth/login', {
        email: email,
        password: password
      });

      const token = loginResponse.token || loginResponse.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-8 flex flex-col relative font-sans">
      {/* Nút Back */}
      <div className="mb-6 mt-4">
        <button onClick={() => navigate(-1)} className="text-[#c8f31d] hover:text-[#aee018]">
          <ChevronLeft size={32} />
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tạo Tài Khoản</h1>
        <p className="text-gray-400 text-sm">Nhập thông tin của bạn để bắt đầu</p>
      </div>

      {/* Form */}
      <RegisterForm
        fullName={fullName}
        setFullName={setFullName}
        phone={phone}
        setPhone={setPhone}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        loading={loading}
        onSubmit={handleRegister}
      />

      {/* Footer */}
      <div className="text-center mt-2 text-sm text-gray-400 pb-4">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-[#c8f31d] font-medium hover:underline">
          Đăng nhập!
        </Link>
      </div>
    </div>
  );
};

export default Register;
