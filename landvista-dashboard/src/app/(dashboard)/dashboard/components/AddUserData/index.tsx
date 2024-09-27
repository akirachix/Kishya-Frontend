'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiCheckCircle, FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import * as yup from 'yup';
import addUser from '../../utils/adduser';
import Layout from '../Layout';
import { useRouter } from 'next/navigation'; 

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof validationSchema>;

const AddUserData = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter(); 

  const submitUser = async (userData: UserData) => {
    setApiError(null); 
    try {
      const response = await addUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      });
      if (response.error) {
        setApiError(response.error);
      } else {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          router.push('/user-profiles'); 
        }, 3000); 
      }
    }
    catch(error) {
      setApiError((error as Error).message);
    }
  };

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  return (
    <Layout>
      <div className="bg-gray-100 flex items-center justify-center mt-12">
        <div className="bg-white p-16 rounded-lg outline outline-teal-500 outline-4 w-full max-w-md ml-8 nest-hub:p-8 nest-hub-max:p-12">
          <h2 className="text-2xl font-bold mb-8 text-center font-poppins nest-hub:text-lg nest-hub-max:text-xl">
            Fill in user details
          </h2>
          <form onSubmit={handleSubmit(submitUser)} className="py-4">
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2 font-poppins nest-hub:text-xs nest-hub-max:text-sm">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter First Name"
                {...register("firstName")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-poppins nest-hub:text-xs nest-hub-max:text-sm"
              />
              {errors.firstName && <p className="text-red-500 text-sm nest-hub:text-xs nest-hub-max:text-sm"> {errors.firstName.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2 font-poppins nest-hub:text-xs nest-hub-max:text-sm">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter Last Name"
                {...register("lastName")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-poppins nest-hub:text-xs nest-hub-max:text-sm"
              />
              {errors.lastName && <p className="text-red-500 text-sm nest-hub:text-xs nest-hub-max:text-sm"> {errors.lastName.message}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 font-poppins nest-hub:text-xs nest-hub-max:text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                {...register("email", {
                  onChange: () => setApiError(null),  
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-poppins nest-hub:text-xs nest-hub-max:text-sm"
              />
              {errors.email && <p className="text-red-500 text-sm nest-hub:text-xs nest-hub-max:text-sm"> {errors.email.message}</p>}
              {apiError && <p className="text-red-500 text-sm nest-hub:text-xs nest-hub-max:text-sm"> {apiError}</p>}
            </div>
            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 font-poppins nest-hub:text-xs nest-hub-max:text-sm">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                {...register("password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-poppins nest-hub:text-xs nest-hub-max:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-8"
              >
                {showPassword ? <FiEye className="text-teal-500" /> : <FiEyeOff className="text-teal-500" />}
              </button>
              {errors.password && <p className="text-red-500 text-sm nest-hub:text-xs nest-hub-max:text-sm"> {errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="w-32 ml-24 mb-4 border-4 border-[#CB6A43] text-teal-500 py-1.5 px-3 rounded-md hover:bg-teal-500 hover:text-white focus:outline-none focus:ring-teal-500 focus:ring-opacity-50 text-sm nest-hub:text-xs nest-hub-max:text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add a user'}
            </button>
          </form>

          {showSuccessPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="relative bg-teal-500 p-8 rounded-lg shadow-lg flex flex-col items-center justify-center space-y-4 w-80 h-48 ml-72 nest-hub:ml-12 nest-hub-max:ml-24">
                <button
                  type="button"
                  onClick={() => setShowSuccessPopup(false)}
                  className="absolute top-2 right-2 text-white"
                >
                  <FiX className="text-white text-2xl" />
                </button>
                <FiCheckCircle className="text-white text-5xl" />
                <p className="text-white text-lg font-semibold font-poppins nest-hub:text-sm nest-hub-max:text-base">
                  User Added Successfully
                </p>
              </div>
            </div>
          )}

          {apiError && (<p className="text-red-500 text-center mt-4 nest-hub:text-xs nest-hub-max:text-sm">{apiError}</p>)}
        </div>
      </div>
    </Layout>
  );
};

export default AddUserData;
