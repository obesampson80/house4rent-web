// src/components/common/AdvancedFilter/AdvancedFilter.jsx
import { useState, useEffect } from 'react'
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon,
    CalendarIcon,
    ChevronDownIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Card from '@components/common/Card/Card'
import Badge from '@components/common/Badge/Badge'

const AdvancedFilter = ({
    searchFields = [],
    filters = [],
    onFiltersChange,
    placeholder = "Search...",
    data = [],
    className = ""
}) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState({})
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [dateRange, setDateRange] = useState({ from: '', to: '' })
    const [sortConfig, setSortConfig] = useState({ field: '', direction: 'asc' })

    // Debounced search to prevent excessive filtering
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Apply filters whenever any filter changes
    useEffect(() => {
        const filteredData = applyFilters(data)
        onFiltersChange?.(filteredData, {
            search: debouncedSearch,
            filters: activeFilters,
            dateRange,
            sort: sortConfig
        })
    }, [debouncedSearch, activeFilters, dateRange, sortConfig, data])

    const applyFilters = (data) => {
        let filtered = [...data]

        // Text search across multiple fields
        if (debouncedSearch) {
            const searchLower = debouncedSearch.toLowerCase()
            filtered = filtered.filter(item =>
                searchFields.some(field => {
                    const value = getNestedValue(item, field)
                    return value && value.toString().toLowerCase().includes(searchLower)
                })
            )
        }

        // Apply category filters
        Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
            if (filterValue && filterValue !== 'all') {
                filtered = filtered.filter(item => {
                    const itemValue = getNestedValue(item, filterKey)
                    if (Array.isArray(itemValue)) {
                        return itemValue.some(val =>
                            val.toString().toLowerCase().includes(filterValue.toLowerCase())
                        )
                    }
                    return itemValue?.toString().toLowerCase() === filterValue.toLowerCase()
                })
            }
        })

        // Apply date range filter
        if (dateRange.from || dateRange.to) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(getNestedValue(item, 'createdAt') || getNestedValue(item, 'submittedAt') || getNestedValue(item, 'joinedAt'))
                const fromDate = dateRange.from ? new Date(dateRange.from) : new Date('1900-01-01')
                const toDate = dateRange.to ? new Date(dateRange.to) : new Date('2100-01-01')
                return itemDate >= fromDate && itemDate <= toDate
            })
        }

        // Apply sorting
        if (sortConfig.field) {
            filtered.sort((a, b) => {
                const aValue = getNestedValue(a, sortConfig.field)
                const bValue = getNestedValue(b, sortConfig.field)

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        return filtered
    }

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => current?.[key], obj)
    }

    const handleFilterChange = (filterKey, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterKey]: value
        }))
    }

    const clearFilter = (filterKey) => {
        setActiveFilters(prev => {
            const updated = { ...prev }
            delete updated[filterKey]
            return updated
        })
    }

    const clearAllFilters = () => {
        setActiveFilters({})
        setSearchQuery('')
        setDateRange({ from: '', to: '' })
        setSortConfig({ field: '', direction: 'asc' })
    }

    const activeFilterCount = Object.keys(activeFilters).filter(key =>
        activeFilters[key] && activeFilters[key] !== 'all'
    ).length + (dateRange.from || dateRange.to ? 1 : 0)

    return (
        <Card className={className}>
            <div className="p-6">
                {/* Basic Search and Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder={placeholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {activeFilterCount > 0 && (
                            <Badge variant="info">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}</Badge>
                        )}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center"
                        >
                            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                            Advanced
                            <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Category Filters */}
                            {filters.map((filter) => (
                                <div key={filter.key}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {filter.label}
                                    </label>
                                    <select
                                        value={activeFilters[filter.key] || 'all'}
                                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    >
                                        <option value="all">All {filter.label}</option>
                                        {filter.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}

                            {/* Date Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                            </div>

                            {/* Sort Options */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Sort By
                                </label>
                                <select
                                    value={sortConfig.field}
                                    onChange={(e) => setSortConfig(prev => ({ ...prev, field: e.target.value }))}
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                >
                                    <option value="">No sorting</option>
                                    <option value="name">Name</option>
                                    <option value="createdAt">Date Created</option>
                                    <option value="price.amount">Price</option>
                                    <option value="performance.rating">Rating</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Direction
                                </label>
                                <select
                                    value={sortConfig.direction}
                                    onChange={(e) => setSortConfig(prev => ({ ...prev, direction: e.target.value }))}
                                    disabled={!sortConfig.field}
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:opacity-50"
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {activeFilterCount > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>

                                    {Object.entries(activeFilters).map(([key, value]) => {
                                        if (!value || value === 'all') return null
                                        const filter = filters.find(f => f.key === key)
                                        const option = filter?.options.find(o => o.value === value)
                                        return (
                                            <Badge
                                                key={key}
                                                variant="info"
                                                className="flex items-center gap-1"
                                            >
                                                {filter?.label}: {option?.label || value}
                                                <button
                                                    onClick={() => clearFilter(key)}
                                                    className="ml-1 hover:text-red-600"
                                                >
                                                    <XMarkIcon className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        )
                                    })}

                                    {(dateRange.from || dateRange.to) && (
                                        <Badge variant="info" className="flex items-center gap-1">
                                            Date: {dateRange.from || 'Any'} - {dateRange.to || 'Any'}
                                            <button
                                                onClick={() => setDateRange({ from: '', to: '' })}
                                                className="ml-1 hover:text-red-600"
                                            >
                                                <XMarkIcon className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={clearAllFilters}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Clear all
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    )
}

export default AdvancedFilter