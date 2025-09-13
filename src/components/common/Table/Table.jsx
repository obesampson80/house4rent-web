import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const Table = ({ children, className }) => {
    return (
        <div className="overflow-hidden shadow-soft ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className={clsx('min-w-full divide-y divide-gray-300 dark:divide-gray-600', className)}>
                {children}
            </table>
        </div>
    )
}

const TableHeader = ({ children, className }) => {
    return (
        <thead className={clsx('bg-gray-50 dark:bg-gray-700', className)}>
            {children}
        </thead>
    )
}

const TableBody = ({ children, className }) => {
    return (
        <tbody className={clsx('bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700', className)}>
            {children}
        </tbody>
    )
}

const TableRow = ({ children, className, hover = true }) => {
    return (
        <tr className={clsx(hover && 'hover:bg-gray-50 dark:hover:bg-gray-700', className)}>
            {children}
        </tr>
    )
}

const TableHead = ({ children, sortable = false, onSort, sortDirection, className }) => {
    const handleSort = () => {
        if (sortable && onSort) {
            onSort()
        }
    }

    return (
        <th
            className={clsx(
                'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none',
                className
            )}
            onClick={handleSort}
        >
            <div className="flex items-center space-x-1">
                <span>{children}</span>
                {sortable && (
                    <span className="ml-1">
                        {sortDirection === 'asc' ? (
                            <ChevronUpIcon className="h-4 w-4" />
                        ) : sortDirection === 'desc' ? (
                            <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                            <div className="h-4 w-4" />
                        )}
                    </span>
                )}
            </div>
        </th>
    )
}

const TableCell = ({ children, className }) => {
    return (
        <td className={clsx('px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100', className)}>
            {children}
        </td>
    )
}

Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.Head = TableHead
Table.Cell = TableCell

export default Table