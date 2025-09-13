// src/components/common/Form/FormField.jsx
import { forwardRef } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

export const FormField = forwardRef(({
    label,
    name,
    type = 'text',
    placeholder,
    required = false,
    error,
    helpText,
    className,
    labelClassName,
    inputClassName,
    disabled = false,
    children,
    ...props
}, ref) => {
    const baseInputClasses = clsx(
        'block w-full rounded-lg border shadow-sm transition-colors',
        'focus:border-primary-500 focus:ring-primary-500',
        'dark:bg-gray-700 dark:text-white',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error
            ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600',
        inputClassName
    )

    const inputProps = {
        id: name,
        name,
        type,
        placeholder,
        required,
        disabled,
        className: baseInputClasses,
        ref,
        ...props
    }

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={name}
                    className={clsx(
                        'block text-sm font-medium mb-1',
                        error ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300',
                        labelClassName
                    )}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {children ? children : <input {...inputProps} />}

                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}

            {helpText && !error && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {helpText}
                </p>
            )}
        </div>
    )
})

FormField.displayName = 'FormField'
