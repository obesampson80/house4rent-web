import clsx from 'clsx'

const Card = ({ children, className, padding = true, hover = false, ...props }) => {
    const classes = clsx(
        'bg-white dark:bg-gray-800 shadow-soft rounded-xl border border-gray-200 dark:border-gray-700',
        padding && 'p-6',
        hover && 'hover:shadow-medium transition-shadow duration-200 cursor-pointer',
        className
    )

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    )
}

const CardHeader = ({ children, className }) => {
    return (
        <div className={clsx('pb-4 border-b border-gray-200 dark:border-gray-700', className)}>
            {children}
        </div>
    )
}

const CardTitle = ({ children, className }) => {
    return (
        <h3 className={clsx('text-lg font-semibold text-gray-900 dark:text-white', className)}>
            {children}
        </h3>
    )
}

const CardContent = ({ children, className }) => {
    return (
        <div className={clsx('pt-4', className)}>
            {children}
        </div>
    )
}

Card.Header = CardHeader
Card.Title = CardTitle
Card.Content = CardContent

export default Card