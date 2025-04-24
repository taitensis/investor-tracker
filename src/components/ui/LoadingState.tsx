// src/components/ui/LoadingState.jsx
import Spinner from './Spinner';

export default function LoadingState({ message = "Loading..." }) {
    return (
        <div className="flex items-center justify-center gap-2 py-12 text-gray-500 dark:text-gray-400">
            <Spinner />
            <span className="text-sm">{message}</span>
        </div>
    );
}
