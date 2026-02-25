import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Users } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface SubforumListProps {
  categoryId: number;
}

export default function SubforumList({ categoryId }: SubforumListProps) {
  const { data: subforums = [], isLoading } = useQuery({
    queryKey: [`/api/forum/subforums`, { categoryId }],
    queryFn: async () => {
      const res = await fetch(`/api/forum/subforums?categoryId=${categoryId}`);
      if (!res.ok) throw new Error('Error al cargar subforos');
      return res.json();
    },
    enabled: !!categoryId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!subforums || subforums.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No hay subforos disponibles en esta categoría.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Subforos</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {subforums.map((subforum: any) => (
          <Link key={subforum.id} href={`/subforum/${subforum.slug}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="line-clamp-1">{subforum.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {subforum.threadCount || 0} temas
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {subforum.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{subforum.threadCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{subforum.memberCount || 0}</span>
                    </div>
                  </div>
                  
                  {subforum.lastActivity && (
                    <div className="text-xs">
                      Hace {formatDistanceToNow(new Date(subforum.lastActivity), { 
                        locale: es, 
                        addSuffix: false 
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}