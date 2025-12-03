import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/login', { username, password });
      login(res.data);
      if (res.data.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/input');
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <Card className="w-[400px] z-10 shadow-2xl border-0 bg-white/90 backdrop-blur-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">GiziSync</CardTitle>
          <CardDescription className="text-slate-600">
            Sistem Manajemen & Pelaporan Gizi Nasional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="Enter your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/30" type="submit">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center justify-center text-xs text-slate-500">
          &copy; 2025 Badan Gizi Nasional. All rights reserved.
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
