// src/components/common/Form/Checkbox.jsx
import { forwardRef } from 'react'
import { clsx } from 'clsx'

export const Checkbox = forwardRef(({
    label,
    name,
    required = false,
    error,
    helpText,
    className,
    ...props
}, ref) => {
    return (
        <div className={className}>
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id={name}
                        name={name}
                        type="checkbox"
                        required={required}
                        ref={ref}
                        className={clsx(
                            'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700',
                            error && 'border-red-300 dark:border-red-600'
                        )}
                        {...props}
                    />
                </div>
                <div className="ml-3 text-sm">
                    {label && (
                        <label
                            htmlFor={name}
                            className={clsx(
                                'font-medium',
                                error ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                            )}
                        >
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    )}
                    {helpText && (
                        <p className="text-gray-500 dark:text-gray-400">
                            {helpText}
                        </p>
                    )}
                </div>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    )
})

Checkbox.displayName = 'Checkbox'