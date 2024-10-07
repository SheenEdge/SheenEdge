// src/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Replace with your API URL
    const apiUrl = 'http://localhost:5800/api/user/register';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Sign Up failed');
      }

      const data = await response.json();
      setSuccess('Sign Up successful!'); // Show success message
      console.log('Sign Up successful:', data);

      // Now fetch user data
      fetchUserData(data.userId); // Assuming the response includes userId
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchUserData = async (userId) => {
    // Replace with your API URL for retrieving user data
    const userDataUrl = `http://localhost:5800/api/user/current${userId}`;

    try {
      const response = await fetch(userDataUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      console.log('User data retrieved:', userData);

      // Navigate to the home page after successfully fetching user data
      navigate('/home'); // Redirect to the home page
    } catch (error) {
      setError(error.message); // Display the error message
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1" htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 rounded hover:bg-blue-500 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
