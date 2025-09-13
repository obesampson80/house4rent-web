// src/components/common/Form/Select.jsx
import { forwardRef } from 'react'
import { FormField } from './FormField'

export const Select = forwardRef(({
    label,
    name,
    options = [],
    placeholder = 'Select an option',
    required = false,
    error,
    helpText,
    className,
    ...props
}, ref) => {
    return (
        <FormField
            label={label}
            name={name}
            required={required}
            error={error}
            helpText={helpText}
            className={className}
        >
            <select
                id={name}
                name={name}
                required={required}
                ref={ref}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </FormField>
    )
})

Select.displayName = 'Select'