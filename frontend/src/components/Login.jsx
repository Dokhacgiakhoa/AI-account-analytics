import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }
      
      // Save token securely (in localStorage for SPA, but React mitigates XSS)
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-bgCard p-8 rounded-xl shadow-lg border border-borderMain w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">Đăng Nhập</h2>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-bgMain border border-borderMain rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input 
              type="password" 
              required
              className="w-full bg-bgMain border border-borderMain rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-colors">
            Đăng Nhập
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-primary hover:underline">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}
