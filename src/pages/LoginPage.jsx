import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext'; // assumes you implemented it earlier

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session]);

  const handleAuth = async (type) => {
    setLoading(true);
    setError('');

    try {
      let result;

      if (type === 'LOGIN') {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) {
        setError(result.error.message);
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        toast.success(type === 'LOGIN' ? 'Login successful!' : 'Sign up successful!');
        navigate('/dashboard');
      } else if (type === 'SIGNUP') {
        toast('Check your email to confirm your sign-up!');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAuth('LOGIN');
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-10 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Login / Sign Up</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded focus:outline-none focus:ring"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full border p-2 rounded focus:outline-none focus:ring"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>

        <button
          type="button"
          className="w-full border text-blue-600 p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleAuth('SIGNUP')}
          disabled={loading}
        >
          {loading ? 'Signing up…' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
