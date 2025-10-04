"use client";

import { FunctionComponent, useState, useEffect } from 'react';
import { User } from '../../types';
import { Search, UserCheck, UserX, Edit, Trash2, Shield } from 'lucide-react';

/**
 * Users management component for viewing and managing users
 */
const UsersManagement: FunctionComponent = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');

    useEffect(() => {
        // Simulate fetching users
        const fetchUsers = async () => {
            setTimeout(() => {
                setUsers([
                    {
                        id: '1',
                        email: 'admin@travelhosta.com',
                        name: 'Admin User',
                        role: 'admin',
                        createdAt: '2025-01-15T10:00:00Z',
                        lastLogin: '2025-09-30T08:30:00Z',
                    },
                    {
                        id: '2',
                        email: 'john@example.com',
                        name: 'John Doe',
                        role: 'user',
                        createdAt: '2025-08-20T14:30:00Z',
                        lastLogin: '2025-09-29T16:45:00Z',
                    },
                    {
                        id: '3',
                        email: 'jane@example.com',
                        name: 'Jane Smith',
                        role: 'user',
                        createdAt: '2025-09-10T09:15:00Z',
                        lastLogin: '2025-09-30T07:20:00Z',
                    },
                    {
                        id: '4',
                        email: 'bob@example.com',
                        name: 'Bob Johnson',
                        role: 'user',
                        createdAt: '2025-09-15T11:00:00Z',
                        lastLogin: '2025-09-28T19:10:00Z',
                    },
                ]);
                setLoading(false);
            }, 500);
        };

        fetchUsers();
    }, []);

    const handleToggleRole = (userId: string) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId
                    ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' }
                    : user
            )
        );
        alert('User role updated successfully!');
    };

    const handleDeleteUser = (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(prev => prev.filter(user => user.id !== userId));
            alert('User deleted successfully!');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-xl text-[#1b3c44]">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1b3c44]">Users Management</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage user accounts</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl sm:text-3xl font-bold text-[#1b3c44] mt-1">
                                {users.length}
                            </p>
                        </div>
                        <UserCheck size={32} className="text-[#cd8453] flex-shrink-0 sm:w-10 sm:h-10" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600">Admins</p>
                            <p className="text-2xl sm:text-3xl font-bold text-[#1b3c44] mt-1">
                                {users.filter(u => u.role === 'admin').length}
                            </p>
                        </div>
                        <Shield size={32} className="text-[#cd8453] flex-shrink-0 sm:w-10 sm:h-10" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600">Regular Users</p>
                            <p className="text-2xl sm:text-3xl font-bold text-[#1b3c44] mt-1">
                                {users.filter(u => u.role === 'user').length}
                            </p>
                        </div>
                        <UserCheck size={32} className="text-[#cd8453] flex-shrink-0 sm:w-10 sm:h-10" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                        />
                    </div>
                    {/* Role Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterRole('all')}
                            className={`flex-1 md:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                                filterRole === 'all'
                                    ? 'bg-[#cd8453] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterRole('admin')}
                            className={`flex-1 md:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                                filterRole === 'admin'
                                    ? 'bg-[#cd8453] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Admins
                        </button>
                        <button
                            onClick={() => setFilterRole('user')}
                            className={`flex-1 md:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                                filterRole === 'user'
                                    ? 'bg-[#cd8453] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Users
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table - Desktop */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Login
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#cd8453] flex items-center justify-center text-white font-semibold text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-3 lg:ml-4">
                                                <div className="text-sm font-medium text-[#1b3c44]">
                                                    {user.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 lg:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.lastLogin
                                            ? new Date(user.lastLogin).toLocaleDateString()
                                            : 'Never'}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleToggleRole(user.id)}
                                            className="text-[#cd8453] hover:text-[#1b3c44] mr-4"
                                            title={`Make ${user.role === 'admin' ? 'user' : 'admin'}`}
                                        >
                                            <Shield size={16} className="lg:w-[18px] lg:h-[18px]" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Delete user"
                                        >
                                            <Trash2 size={16} className="lg:w-[18px] lg:h-[18px]" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Users Cards - Mobile */}
            <div className="md:hidden space-y-3">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-[#cd8453] flex items-center justify-center text-white font-semibold flex-shrink-0">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-[#1b3c44] truncate">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-gray-600 truncate">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ${
                                    user.role === 'admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-green-100 text-green-800'
                                }`}
                            >
                                {user.role}
                            </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1 mb-3">
                            <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                            <div>
                                Last Login: {user.lastLogin
                                    ? new Date(user.lastLogin).toLocaleDateString()
                                    : 'Never'}
                            </div>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                            <button
                                onClick={() => handleToggleRole(user.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#cd8453] hover:text-[#1b3c44] hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Shield size={16} />
                                Toggle Role
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                    <UserX size={40} className="mx-auto text-gray-400 mb-4 sm:w-12 sm:h-12" />
                    <p className="text-sm sm:text-base text-gray-500">No users found matching your filters.</p>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
