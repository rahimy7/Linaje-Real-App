import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Plus, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "wouter";

export default function RecentActivity() {
  const { data: activity = [], isLoading } = useQuery({
    queryKey: ["/api/activities/recent"],
    queryFn: async () => {
      const res = await fetch('/api/activities/recent');
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activity && activity.length > 0 ? (
          <div className="divide-y divide-border">
            {activity.map((item: any, index: number) => (
              <div key={`${item.type}-${item.id}-${index}`} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`activity-icon ${item.type === 'post' ? 'comment' : item.type === 'thread' ? 'thread' : 'heart'}`}>
                    {item.type === 'post' ? (
                      <MessageSquare size={14} />
                    ) : item.type === 'thread' ? (
                      <Plus size={14} />
                    ) : (
                      <Heart size={14} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{item.authorName || "Usuario Anónimo"}</span>
                      {item.type === 'post' ? " respondió en " : item.type === 'thread' ? " creó un nuevo tema " : " agradeció por el apoyo en "}
                      <Link href={`/thread/${item.threadId}`}>
                        <span className="text-primary hover:underline cursor-pointer">
                          "{item.threadTitle}"
                        </span>
                      </Link>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.categoryName} • {formatDistanceToNow(new Date(item.timestamp), {
                        addSuffix: true,
                        locale: es
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No hay actividad reciente disponible.</p>
          </div>
        )}

        {activity && activity.length > 0 && (
          <div className="p-4 border-t border-border text-center">
            <Button variant="ghost" className="text-primary hover:underline">
              Ver toda la actividad
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
