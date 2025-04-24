// src/components/ui/EmptyState.jsx
export default function EmptyState({ message = "No data found", icon = null }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-12 text-gray-400 dark:text-gray-500">
            {icon && <div className="mb-3">{icon}</div>}
            <p className="text-sm">{message}</p>
        </div>
    );
}
