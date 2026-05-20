import { Card, CardContent } from '@carefully-built/ui';
import { Skeleton } from '@carefully-built/ui';

export function FileCardSkeleton(): React.ReactElement {
  return (
    <Card
      size="sm"
      className="gap-0 overflow-hidden py-0 data-[size=sm]:py-0"
    >
      <Skeleton className="aspect-[4/3]" />
      <CardContent className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  );
}
