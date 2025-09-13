// src/components/common/Layout/Layout.jsx
import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useTheme } from '@contexts/ThemeContext'
import { useAuth } from '@contexts/AuthContext'
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    UsersIcon,
    BuildingOfficeIcon,
    CreditCardIcon,
    ChartBarIcon,
    CogIcon,
    BellIcon,
    UserCircleIcon,
    SunIcon,
    MoonIcon,
    DocumentCheckIcon,
    UserGroupIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Users', href: '/users', icon: UsersIcon },
    { name: 'KYC Verification', href: '/kyc', icon: DocumentCheckIcon },
    { name: 'Properties', href: '/properties', icon: BuildingOfficeIcon },
    { name: 'Agents', href: '/agents', icon: UserGroupIcon },
    { name: 'Payments', href: '/payments', icon: CreditCardIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Communications', href: '/communications', icon: ChatBubbleLeftRightIcon },
    { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
]

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const { user, logout } = useAuth()
    const location = useLocation()

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <XMarkIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="flex-shrink-0 flex items-center px-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <BuildingOfficeIcon className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-3">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">PropAdmin</h1>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 space-y-1">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`${isActive
                                                ? 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                                                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                                            } group flex items-center px-2 py-2 text-sm font-medium rounded-md border-l-4`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 shadow-lg">
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            <div className="flex items-center flex-shrink-0 px-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                                        <BuildingOfficeIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-3">
                                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">PropAdmin</h1>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Property Management</p>
                                    </div>
                                </div>
                            </div>
                            <nav className="mt-8 flex-1 px-2 space-y-2">
                                {navigation.map((item) => {
                                    const isActive = location.pathname === item.href
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`${isActive
                                                    ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/50 dark:text-primary-200 shadow-sm'
                                                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                                                } group flex items-center px-3 py-2 text-sm font-medium rounded-lg border-l-4 transition-all duration-200`}
                                        >
                                            <item.icon className="mr-3 h-5 w-5 transition-colors" />
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center w-full">
                                <div className="flex-shrink-0">
                                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user?.name || 'Admin User'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user?.email || 'admin@example.com'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Top header */}
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between items-center">
                        <div className="flex-1 flex">
                            <div className="w-full flex md:ml-0">
                                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                        {/* Search icon could go here */}
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                                    </h2>
                                </div>
                            </div>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6 space-x-3">
                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                {theme === 'dark' ? (
                                    <SunIcon className="h-5 w-5" />
                                ) : (
                                    <MoonIcon className="h-5 w-5" />
                                )}
                            </button>

                            {/* Notifications */}
                            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                                <BellIcon className="h-5 w-5" />
                                <span className="absolute -mt-2 -mr-1 h-3 w-3 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Profile dropdown */}
                            <div className="relative">
                                <button className="max-w-xs bg-white dark:bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                </button>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={logout}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content area */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout