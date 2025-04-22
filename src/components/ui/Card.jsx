// src/components/ui/Card.jsx
import clsx from 'clsx';

export default function Card({
  title,
  children,
  footer,
  className,
  variant = 'shadow',
  hoverable = false,
  onClick,
}) {
  const variants = {
    shadow: 'bg-white dark:bg-gray-800 shadow',
    outline: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    transparent: 'bg-transparent',
  };

  const base = clsx(
    'rounded-xl p-4 transition-all',
    variants[variant],
    hoverable && 'hover:shadow-lg hover:scale-[1.01] cursor-pointer',
    onClick && 'cursor-pointer',
    className
  );

  return (
    <div className={base} onClick={onClick}>
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      <div>{children}</div>
      {footer && <div className="mt-4 border-t pt-3 text-sm text-gray-500 dark:text-gray-400">{footer}</div>}
    </div>
  );
}
