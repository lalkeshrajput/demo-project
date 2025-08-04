import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateStep2()) return;
  setIsLoading(true);

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.status === 409) {
      // 🔴 Show friendly message to user
      setErrors({ general: data.message || 'User already exists. Please login.' });
      return;
    }

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    // ✅ Success
    localStorage.setItem('token', data.token);
    navigate('/home');
  } catch (error) {
    setErrors({ general: error.message });
  } finally {
    setIsLoading(false);
  }
};



  const steps = [
    { number: 1, title: 'Basic Info', description: 'Name and email' },
    { number: 2, title: 'Complete Profile', description: 'Password and details' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-neutral-200 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neutral-300 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-100 rounded-full opacity-30"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-2xl mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Account</h1>
          <p className="text-neutral-600">Join RentKart and start renting today</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep >= step.number
                    ? 'bg-neutral-900 border-neutral-900 text-white'
                    : 'border-neutral-300 text-neutral-400'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-2 transition-all ${
                    currentStep > step.number ? 'bg-neutral-900' : 'bg-neutral-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h3 className="font-medium text-neutral-900">{steps[currentStep - 1].title}</h3>
            <p className="text-sm text-neutral-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-neutral-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
                        errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
                        errors.address ? 'border-red-300 bg-red-50' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 border border-neutral-200 text-neutral-700 py-3 px-4 rounded-xl font-medium hover:bg-neutral-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-neutral-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link
                to="/"
                className="text-neutral-900 font-medium hover:underline transition-all"
              >
                Login in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="hover:text-neutral-700 transition-colors">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="hover:text-neutral-700 transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
