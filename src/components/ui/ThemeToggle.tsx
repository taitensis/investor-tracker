import { Button } from '@/components/ui/button';

export default function ThemeToggle(): JSX.Element {
    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <Button variant="default" size="lg" onClick={toggleTheme}>
            Toggle Theme
        </Button>
    );
}
