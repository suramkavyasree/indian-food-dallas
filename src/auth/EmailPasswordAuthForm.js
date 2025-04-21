'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useSession } from '@/auth/useSession';
import './EmailPasswordAuthForm.css';

export default function EmailPasswordAuthForm() {
  const { session, loading: sessionLoading } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    if (!email || !password || (isSignup && !username)) {
      setStatus('All fields are required.');
      setLoading(false);
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setStatus('Passwords do not match.');
      setLoading(false);
      return;
    }

    let result;
    if (isSignup) {
      result = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:3000',
          data: { username },
        },
      });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    const { error } = result;
    if (error) {
      setStatus(error.message);
    } else {
      setStatus(
        isSignup
          ? 'Signup successful! Please check your email to verify your account.'
          : 'Login successful. Redirecting...'
      );
      if (!isSignup) {
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setStatus('');
    if (!email) {
      setStatus('Please enter your email.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setStatus(error ? error.message : 'Password reset email sent! Check your inbox.');
  };

  if (sessionLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="auth-background"
      style={{
        backgroundImage: "url('/h2.jpg')",
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="max-w-md mt-10">
        {session ? (
          <div className="text-center">
            <p className="mb-4">You are logged in as {session.user.email}</p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="bg-red-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              {isSignup ? 'Sign Up' : 'Login'}
            </h2>

            {status && (
              <p className="mb-4 text-center text-sm text-gray-700">{status}</p>
            )}

            <form onSubmit={handleAuth}>
              {isSignup && (
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute top-7 right-3 text-blue-600"
                >
                  {passwordVisible ? 'Hide' : 'Show'}
                </button>
              </div>

              {isSignup && (
                <div className="mb-4 relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    className="absolute top-7 right-3 text-blue-600"
                  >
                    {confirmPasswordVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500"
              >
                {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Login'}
              </button>
            </form>

            <div className="mt-4 text-sm text-center">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-600"
              >
                {isSignup ? 'Login here' : 'Sign up here'}
              </button>
            </div>

            {!isSignup && (
              <div className="mt-2 text-sm text-center">
                <button
                  onClick={handleForgotPassword}
                  className="text-blue-600"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
