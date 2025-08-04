import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Camera, Edit3, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [originalUser, setOriginalUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setUser(data);
                setOriginalUser(data);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/users/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(user),
            });
            setOriginalUser(user);
            setIsEditing(false);
            // Show success message instead of alert
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
            successMessage.textContent = 'Profile updated successfully!';
            document.body.appendChild(successMessage);
            setTimeout(() => document.body.removeChild(successMessage), 3000);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setUser(originalUser);
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Picture Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="w-16 h-16 text-gray-400" />
                                    </div>
                                    <button className="absolute bottom-4 right-0 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition-colors shadow-lg">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                <p className="text-gray-500">{user.email}</p>
                                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                                    <Shield className="w-4 h-4" />
                                    <span>Verified Account</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleCancel}
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSaving ? (
                                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={user.name || ''}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                            placeholder="Enter your full name"
                                        />
                                    ) : (
                                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                                            {user.name || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 inline mr-2" />
                                        Email Address
                                    </label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                                        {user.email || 'Not provided'}
                                        <span className="ml-2 text-xs text-gray-400">(Cannot be changed)</span>
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={user.phone || ''}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                            placeholder="Enter your phone number"
                                        />
                                    ) : (
                                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                                            {user.phone || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Address Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-2" />
                                        Address
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            name="address"
                                            value={user.address || ''}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors resize-none"
                                            placeholder="Enter your address"
                                        />
                                    ) : (
                                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[80px]">
                                            {user.address || 'Not provided'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Account Security Section */}
                        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Password</h3>
                                        <p className="text-sm text-gray-500">Last updated 3 months ago</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/change-password')}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        Change Password
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
