"use client";

import { FunctionComponent, useState, useEffect } from 'react';
import { User } from '../../types';
import { Search, UserCheck, UserX, Trash2, Shield, Crown, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService, type UserProfile } from '../../services/authService';

/**
 * Users management component for viewing and managing users
 * Superadmins can promote/demote users and admins
 * Regular admins can only view users
 */
const UsersManagement: FunctionComponent = () => {
    const { profile: currentUserProfile, isSuperAdmin } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user' | 'superadmin'>('all');
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const userProfiles = await authService.getAllUserProfiles();
            setUsers(userProfiles);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePromoteToAdmin = async (userId: string) => {
        if (!isSuperAdmin) {
            alert('Only superadmins can promote users to admin.');
            return;
        }

        if (confirm('Are you sure you want to promote this user to admin?')) {
            const result = await authService.promoteToAdmin(userId);
            if (result.success) {
                alert('User promoted to admin successfully!');
                fetchUsers();
            } else {
                alert(`Failed to promote user: ${result.error}`);
            }
        }
        setActionMenuOpen(null);
    };

    const handleDemoteToUser = async (userId: string) => {
        if (!isSuperAdmin) {
            alert('Only superadmins can demote users.');
            return;
        }

        if (confirm('Are you sure you want to demote this admin to user?')) {
            const result = await authService.demoteToUser(userId);
            if (result.success) {
                alert('Admin demoted to user successfully!');
                fetchUsers();
            } else {
                alert(`Failed to demote user: ${result.error}`);
            }
        }
        setActionMenuOpen(null);
    };

    const handlePromoteToSuperAdmin = async (userId: string) => {
        if (!isSuperAdmin) {
            alert('Only superadmins can promote admins to superadmin.');
            return;
        }

        if (confirm('⚠️ WARNING: You are about to grant superadmin privileges. This user will have full control over the system. Are you sure?')) {
            const result = await authService.promoteToSuperAdmin(userId);
            if (result.success) {
                alert('Admin promoted to superadmin successfully!');
                fetchUsers();
            } else {
                alert(`Failed to promote to superadmin: ${result.error}`);
            }
        }
        setActionMenuOpen(null);
    };

    const handleDemoteSuperAdminToAdmin = async (userId: string) => {
        if (!isSuperAdmin) {
            alert('Only superadmins can demote other superadmins.');
            return;
        }

        if (confirm('Are you sure you want to demote this superadmin to admin?')) {
            const result = await authService.demoteSuperAdminToAdmin(userId);
            if (result.success) {
                alert('Superadmin demoted to admin successfully!');
                fetchUsers();
            } else {
                alert(`Failed to demote superadmin: ${result.error}`);
            }
        }
        setActionMenuOpen(null);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!isSuperAdmin) {
            alert('Only superadmins can delete users.');
            return;
        }

        if (confirm('⚠️ WARNING: This action cannot be undone. Are you sure you want to delete this user?')) {
            const result = await authService.deleteUser(userId);
            if (result.success) {
                alert('User deleted successfully!');
                fetchUsers();
            } else {
                alert(`Failed to delete user: ${result.error}`);
            }
        }
        setActionMenuOpen(null);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'bg-red-100 text-red-800';
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'superadmin':
                return <Crown size={14} className="inline mr-1" />;
            case 'admin':
                return <Shield size={14} className="inline mr-1" />;
            default:
                return <UserCheck size={14} className="inline mr-1" />;
        }
    };

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
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {isSuperAdmin ? 'Manage user accounts and permissions' : 'View user accounts'}
                </p>
                {!isSuperAdmin && (
                    <p className="text-xs text-amber-600 mt-2">
                        ℹ️ Only superadmins can modify user roles and permissions
                    </p>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
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
                            <p className="text-xs sm:text-sm text-gray-600">Superadmins</p>
                            <p className="text-2xl sm:text-3xl font-bold text-[#1b3c44] mt-1">
                                {users.filter(u => u.role === 'superadmin').length}
                            </p>
                        </div>
                        <Crown size={32} className="text-red-500 flex-shrink-0 sm:w-10 sm:h-10" />
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
                    <div className="flex gap-2 flex-wrap">
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
                            onClick={() => setFilterRole('superadmin')}
                            className={`flex-1 md:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                                filterRole === 'superadmin'
                                    ? 'bg-[#cd8453] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Superadmins
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
                                {isSuperAdmin && (
                                    <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#cd8453] flex items-center justify-center text-white font-semibold text-sm">
                                                {(user.username || user.email).charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-3 lg:ml-4">
                                                <div className="text-sm font-medium text-[#1b3c44]">
                                                    {user.username || 'No username'}
                                                    {user.id === currentUserProfile?.id && (
                                                        <span className="ml-2 text-xs text-gray-500">(You)</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 lg:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                            {getRoleIcon(user.role)}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.last_sign_in_at
                                            ? new Date(user.last_sign_in_at).toLocaleDateString()
                                            : 'Never'}
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                                                    disabled={user.id === currentUserProfile?.id}
                                                    className={`inline-flex items-center px-3 py-1 rounded-lg transition-colors ${
                                                        user.id === currentUserProfile?.id
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-[#cd8453] text-white hover:bg-[#1b3c44]'
                                                    }`}
                                                >
                                                    Actions
                                                    <ChevronDown size={16} className="ml-1" />
                                                </button>
                                                
                                                {actionMenuOpen === user.id && user.id !== currentUserProfile?.id && (
                                                    <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                        <div className="py-1">
                                                            {user.role === 'user' && (
                                                                <button
                                                                    onClick={() => handlePromoteToAdmin(user.id)}
                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                                >
                                                                    <Shield size={16} className="mr-2" />
                                                                    Promote to Admin
                                                                </button>
                                                            )}
                                                            {user.role === 'admin' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleDemoteToUser(user.id)}
                                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                                    >
                                                                        <UserCheck size={16} className="mr-2" />
                                                                        Demote to User
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handlePromoteToSuperAdmin(user.id)}
                                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                                    >
                                                                        <Crown size={16} className="mr-2" />
                                                                        Promote to Superadmin
                                                                    </button>
                                                                </>
                                                            )}
                                                            {user.role === 'superadmin' && (
                                                                <button
                                                                    onClick={() => handleDemoteSuperAdminToAdmin(user.id)}
                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                                >
                                                                    <Shield size={16} className="mr-2" />
                                                                    Demote to Admin
                                                                </button>
                                                            )}
                                                            <hr className="my-1" />
                                                            <button
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                                            >
                                                                <Trash2 size={16} className="mr-2" />
                                                                Delete User
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    )}
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
                                    {(user.username || user.email).charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-[#1b3c44] truncate">
                                        {user.username || 'No username'}
                                        {user.id === currentUserProfile?.id && (
                                            <span className="ml-2 text-xs text-gray-500">(You)</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-600 truncate">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ${getRoleBadgeColor(user.role)}`}>
                                {getRoleIcon(user.role)}
                                {user.role}
                            </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1 mb-3">
                            <div>Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                            <div>
                                Last Login: {user.last_sign_in_at
                                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                                    : 'Never'}
                            </div>
                        </div>
                        {isSuperAdmin && user.id !== currentUserProfile?.id && (
                            <div className="pt-3 border-t border-gray-200">
                                <button
                                    onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                                >
                                    Actions
                                    <ChevronDown size={16} />
                                </button>
                                
                                {actionMenuOpen === user.id && (
                                    <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50">
                                        <div className="py-1">
                                            {user.role === 'user' && (
                                                <button
                                                    onClick={() => handlePromoteToAdmin(user.id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <Shield size={16} className="mr-2" />
                                                    Promote to Admin
                                                </button>
                                            )}
                                            {user.role === 'admin' && (
                                                <>
                                                    <button
                                                        onClick={() => handleDemoteToUser(user.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <UserCheck size={16} className="mr-2" />
                                                        Demote to User
                                                    </button>
                                                    <button
                                                        onClick={() => handlePromoteToSuperAdmin(user.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <Crown size={16} className="mr-2" />
                                                        Promote to Superadmin
                                                    </button>
                                                </>
                                            )}
                                            {user.role === 'superadmin' && (
                                                <button
                                                    onClick={() => handleDemoteSuperAdminToAdmin(user.id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <Shield size={16} className="mr-2" />
                                                    Demote to Admin
                                                </button>
                                            )}
                                            <hr className="my-1" />
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                            >
                                                <Trash2 size={16} className="mr-2" />
                                                Delete User
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
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
