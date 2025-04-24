import {
    Euro,
    CalendarDays,
    PieChart,
  } from 'lucide-react';
  import { cn } from '@/lib/utils';
  import { ReactNode } from 'react';
  
  const ICONS = {
    euro: Euro,
    calendar: CalendarDays,
    chart: PieChart,
  };
  
  const TONE_CLASSES = {
    primary: {
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-300',
    },
    accent: {
      iconBg: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-300',
    },
    subtle: {
      iconBg: 'bg-muted',
      iconColor: 'text-muted-foreground',
    },
  };
  
  type Props = {
    type?: keyof typeof ICONS;
    label: ReactNode;
    main?: ReactNode;
    sub?: ReactNode;
    tone?: keyof typeof TONE_CLASSES;
    children?: ReactNode;
    className?: string;
    icon?: React.ElementType;
  };
  
  export default function StatCard({
    type = 'euro',
    label,
    main,
    sub,
    tone = 'subtle',
    children,
    className,
    icon: CustomIcon,
  }: Props) {
    const Icon = CustomIcon || ICONS[type] || Euro;
    const toneStyles = TONE_CLASSES[tone] || TONE_CLASSES.subtle;
  
    return (
      <div
        className={cn(
          'rounded-2xl border bg-card text-card-foreground p-5 shadow-sm hover:shadow-md transition-all space-y-4',
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-xl', toneStyles.iconBg)}>
            <Icon className={cn('h-5 w-5', toneStyles.iconColor)} />
          </div>
  
          <div className="flex-1 space-y-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {label}
            </div>
            {main && (
              <div className="text-xl font-bold text-foreground leading-tight">
                {main}
              </div>
            )}
            {sub && (
              <div className="text-sm text-muted-foreground mt-1">
                {sub}
              </div>
            )}
          </div>
        </div>
  
        {children && (
          <div className="pt-3 mt-4 border-t border-border text-sm text-muted-foreground space-y-1">
            {children}
          </div>
        )}
      </div>
    );
  }