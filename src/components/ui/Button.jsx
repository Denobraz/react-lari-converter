/**
 * Universal button with theme and style variant support
 * @param {string} variant - Button variant: 'primary' (default), 'delete' or 'icon'
 * @param {boolean} isLoading - Show loading state
 */
export function Button({
  children,
  isLoading,
  variant = "primary",
  className = "",
  ...props
}) {
  const variantStyles = {
    primary:
      "bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-medium px-4 py-2 rounded",
    delete:
      "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300",
    icon: "p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800",
  }

  const baseStyles =
    "cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

  return (
    <button
      className={`${variantStyles[variant]} ${baseStyles} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Загрузка..." : children}
    </button>
  )
}
