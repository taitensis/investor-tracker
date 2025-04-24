import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import PositionPage from '@/pages/PositionPage';

export default function PerformanceSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Summary</CardTitle>
      </CardHeader>

      <CardContent>
        <PositionPage filterByAccount={null} />
      </CardContent>
    </Card>
  );
}
