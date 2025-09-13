import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({
    label,
    error,
    helper,
    required = false,
    className,
    ...props
}, ref) => {
    const inputClasses = clsx(
        'block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm',
        error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
        className
    )

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                ref={ref}
                className={inputClasses}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            {helper && !error && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helper}</p>
            )}
        </div>
    )
})

Input.displayName = 'Input'
export default Input