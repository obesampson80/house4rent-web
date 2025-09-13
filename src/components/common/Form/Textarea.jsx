// src/components/common/Form/Textarea.jsx
import { forwardRef } from 'react'
import { FormField } from './FormField'

export const Textarea = forwardRef(({
    label,
    name,
    placeholder,
    required = false,
    error,
    helpText,
    className,
    rows = 4,
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
            <textarea
                id={name}
                name={name}
                placeholder={placeholder}
                required={required}
                rows={rows}
                ref={ref}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-vertical"
                {...props}
            />
        </FormField>
    )
})

Textarea.displayName = 'Textarea'