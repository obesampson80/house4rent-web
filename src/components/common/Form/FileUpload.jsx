// src/components/common/Form/FileUpload.jsx
import { useState, useRef } from 'react'
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { FormField } from './FormField'  // Add this import

export const FileUpload = ({
    label,
    name,
    required = false,
    error,
    helpText,
    className,
    accept,
    multiple = false,
    maxSize = 5 * 1024 * 1024, // 5MB default
    onFileChange,
    ...props
}) => {
    const [files, setFiles] = useState([])
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef(null)

    const handleFileChange = (selectedFiles) => {
        const fileList = Array.from(selectedFiles)
        const validFiles = fileList.filter(file => {
            if (maxSize && file.size > maxSize) {
                alert(`File "${file.name}" is too large. Maximum size is ${maxSize / 1024 / 1024}MB.`)
                return false
            }
            return true
        })

        setFiles(multiple ? [...files, ...validFiles] : validFiles)
        onFileChange && onFileChange(multiple ? [...files, ...validFiles] : validFiles)
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files)
        }
    }

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        onFileChange && onFileChange(newFiles)
    }

    return (
        <FormField
            label={label}
            name={name}
            required={required}
            error={error}
            helpText={helpText}
            className={className}
        >
            <div className="space-y-4">
                <div
                    className={`
                        relative border-2 border-dashed rounded-lg p-6 transition-colors
                        ${dragActive
                            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                        }
                        hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...props}
                    />
                    <div className="text-center">
                        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                <button
                                    type="button"
                                    className="font-medium text-primary-600 hover:text-primary-500"
                                    onClick={() => inputRef.current?.click()}
                                >
                                    Upload files
                                </button>
                                {' '}or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {accept || 'Any file type'} up to {maxSize / 1024 / 1024}MB
                            </p>
                        </div>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="space-y-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center space-x-2">
                                    <DocumentArrowUpIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="p-1 text-gray-400 hover:text-red-500"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </FormField>
    )
}