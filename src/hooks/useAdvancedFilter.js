// src/hooks/useAdvancedFilter.js
import { useState, useMemo } from 'react'

export const useAdvancedFilter = (data, searchFields = []) => {
    const [filteredData, setFilteredData] = useState(data)
    const [filterState, setFilterState] = useState({})

    const handleFiltersChange = (filtered, state) => {
        setFilteredData(filtered)
        setFilterState(state)
    }

    // Stats about filtered data
    const stats = useMemo(() => ({
        total: data.length,
        filtered: filteredData.length,
        hasFilters: Object.keys(filterState.filters || {}).length > 0 ||
            filterState.search ||
            filterState.dateRange?.from ||
            filterState.dateRange?.to
    }), [data, filteredData, filterState])

    return {
        filteredData,
        filterState,
        handleFiltersChange,
        stats
    }
}