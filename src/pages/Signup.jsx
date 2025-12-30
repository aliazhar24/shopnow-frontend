import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/api.js';
import { useNavigate, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';




export default function Signup() {
const { register, handleSubmit, formState: { errors } } = useForm();
const navigate = useNavigate();
const { token } = useAuth();

 if ( token ) return <Navigate to="/" replace />;


const onSubmit = async (data) => {
try {
await api.post('/auth/register', data);
navigate('/login');
} catch (err) {
console.error(err.response?.data);
}
};


return (
  <div className='min-h-[80dvh] flex justify-center items-center  px-4'>
<form
  onSubmit={handleSubmit(onSubmit)}
  className="
    w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto
    bg-white px-6 py-6 sm:px-8 sm:py-8
    rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)]
    space-y-4"
>
  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">
    Create Account
  </h2>

  {/* Username */}
  <div>
    <input
      {...register("username", { required: true })}
      placeholder="Username"
      className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
    />
    {errors.username && <p className="text-red-500 text-xs sm:text-sm">Username is required</p>}
  </div>

  {/* Full Name */}
  <div>
    <input
      {...register("fullname", { required: true })}
      placeholder="Full Name"
      className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
    />
    {errors.fullname && <p className="text-red-500 text-xs sm:text-sm">Full name is required</p>}
  </div>

  {/* Email */}
  <div>
    <input
      {...register("email", { required: true })}
      type="email"
      placeholder="Email address"
      className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
    />
    {errors.email && <p className="text-red-500 text-xs sm:text-sm">Email is required</p>}
  </div>

  {/* Password */}
  <div>
    <input
      type="password"
      {...register("password", { required: true })}
      placeholder="Password"
      className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
    />
    {errors.password && <p className="text-red-500 text-xs sm:text-sm">Password is required</p>}
  </div>

  {/* Submit */}
  <button
    type="submit"
    className="w-full bg-black text-white py-2.5 rounded-lg text-sm sm:text-base hover:bg-gray-800 transition"
  >
    Sign Up
  </button>

  {/* Footer */}
  <p className="text-xs sm:text-sm text-center text-gray-600">
    Already have an account?{" "}
    <Link to="/login" className="font-medium text-black hover:underline">Login</Link>
  </p>
</form>
</div>

);
}