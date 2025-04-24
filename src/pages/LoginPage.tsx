// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { supabase } from '@/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

import {Input} from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { session } = useAuth();

  // 🔄 Redirect when session is active (user is logged in)
  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session]);

  // 🔐 Handles both login and signup
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

      const { data, error } = result;

      if (error) {
        setError(error.message);
        return;
      }

      toast.success(type === 'LOGIN' ? 'Login successful!' : 'Sign up successful!');
      // Session will sync via useAuth/AuthContext
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAuth('LOGIN');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white tracking-tight">
          Login / Sign Up
        </h2>


        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleAuth('SIGNUP')}
            disabled={loading}
          >
            {loading ? 'Signing up…' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
}
