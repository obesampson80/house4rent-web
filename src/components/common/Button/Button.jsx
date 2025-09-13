import { forwardRef } from 'react'
import clsx from 'clsx'

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'

    const variants = {
        primary: 'text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
        secondary: 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700',
        danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
        success: 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
        warning: 'text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 focus:ring-primary-500',
    }

    const sizes = {
        xs: 'px-2.5 py-1.5 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-4 py-2 text-base',
        xl: 'px-6 py-3 text-base',
    }

    const classes = clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
    )

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={classes}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {children}
        </button>
    )
})

Button.displayName = 'Button'
export default Button
