// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center text-center px-6 bg-muted text-gray-800 dark:text-gray-100">
            <h1 className="text-5xl font-bold mb-4">404</h1>
            <p className="text-lg mb-6">Oops! The page you're looking for doesn't exist.</p>
            <Link to="/">
                <Button>Back to Dashboard</Button>
            </Link>
        </div>
    );
}
