"use client";

import { FunctionComponent, useState, useEffect } from 'react';
import { AnalyticsData } from '../../types';
import { useGuides } from '../../contexts/GuidesContext';
import { Users, BookOpen, Eye, TrendingUp } from 'lucide-react';

/**
 * Admin dashboard component showing analytics and overview
 */
const AdminDashboard: FunctionComponent = () => {
    const { guides } = useGuides();
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalUsers: 0,
        totalGuides: 0,
        pageViews: 0,
        popularGuides: [],
        userGrowth: [],
        recentActivity: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching analytics data
        const fetchAnalytics = async () => {
            // In a real app, this would be an API call
            setTimeout(() => {
                // Get popular guides from actual guides data
                const popularGuidesData = guides
                    .slice(0, 3)
                    .map((guide, index) => ({
                        id: guide.id,
                        title: guide.title,
                        views: 2500 - (index * 300), // Mock view counts
                    }));

                setAnalytics({
                    totalUsers: 1247,
                    totalGuides: guides.length,
                    pageViews: 15893,
                    popularGuides: popularGuidesData,
                    userGrowth: [
                        { date: '2025-09-24', count: 1180 },
                        { date: '2025-09-25', count: 1195 },
                        { date: '2025-09-26', count: 1210 },
                        { date: '2025-09-27', count: 1225 },
                        { date: '2025-09-28', count: 1235 },
                        { date: '2025-09-29', count: 1240 },
                        { date: '2025-09-30', count: 1247 },
                    ],
                    recentActivity: [
                        {
                            id: '1',
                            type: 'user_signup',
                            description: 'New user registered: john@example.com',
                            timestamp: new Date().toISOString(),
                        },
                        {
                            id: '2',
                            type: 'guide_view',
                            description: 'Guide viewed: Complete Guide to Sajek Valley',
                            timestamp: new Date(Date.now() - 300000).toISOString(),
                        },
                        {
                            id: '3',
                            type: 'guide_created',
                            description: 'New guide created: Bandarban Hill Tracks',
                            timestamp: new Date(Date.now() - 600000).toISOString(),
                        },
                    ],
                });
                setLoading(false);
            }, 500);
        };

        fetchAnalytics();
    }, [guides]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-xl text-[#1b3c44]">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1b3c44]">Dashboard Overview</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={analytics.totalUsers}
                    trend="+12.5%"
                    trendUp={true}
                />
                <StatCard
                    icon={BookOpen}
                    label="Total Guides"
                    value={analytics.totalGuides}
                    trend="+3"
                    trendUp={true}
                />
                <StatCard
                    icon={Eye}
                    label="Page Views"
                    value={analytics.pageViews}
                    trend="+8.2%"
                    trendUp={true}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Growth Rate"
                    value="12.5%"
                    trend="This month"
                    trendUp={true}
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Popular Guides */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1b3c44] mb-4">
                        Popular Guides
                    </h2>
                    <div className="space-y-3">
                        {analytics.popularGuides.map((guide, index) => (
                            <div
                                key={guide.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-full bg-[#cd8453] flex items-center justify-center text-white font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-[#1b3c44] truncate">
                                        {guide.title}
                                    </span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 ml-2 whitespace-nowrap">
                                    {guide.views.toLocaleString()} views
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1b3c44] mb-4">
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {analytics.recentActivity.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                                <div
                                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                        activity.type === 'user_signup'
                                            ? 'bg-green-500'
                                            : activity.type === 'guide_created'
                                            ? 'bg-blue-500'
                                            : 'bg-yellow-500'
                                    }`}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-[#1b3c44] break-words">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#1b3c44] mb-4">
                    User Growth (Last 7 Days)
                </h2>
                <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2">
                    {analytics.userGrowth.map((data, index) => {
                        const maxCount = Math.max(...analytics.userGrowth.map(d => d.count));
                        const height = (data.count / maxCount) * 100;
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-[#cd8453] rounded-t-lg transition-all hover:bg-[#1b3c44]"
                                    style={{ height: `${height}%` }}
                                    title={`${data.count} users`}
                                />
                                <span className="text-[10px] sm:text-xs text-gray-600 text-center">
                                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
interface StatCardProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: number | string;
    trend: string;
    trendUp: boolean;
}

const StatCard: FunctionComponent<StatCardProps> = ({
    icon: Icon,
    label,
    value,
    trend,
    trendUp,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#1b3c44] truncate">{value}</p>
                    <p
                        className={`text-xs sm:text-sm mt-2 ${
                            trendUp ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {trend}
                    </p>
                </div>
                <div className="p-2 sm:p-3 bg-[#cd8453]/10 rounded-lg flex-shrink-0">
                    <Icon size={20} className="text-[#cd8453] sm:w-6 sm:h-6" />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
