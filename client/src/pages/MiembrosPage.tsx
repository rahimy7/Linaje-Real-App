import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, FilterIcon, PlusIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";
import { apiRequest } from "@/lib/queryClient";

// Tipo para los miembros de la iglesia (coherente con tabla miembros en BD)
interface Miembro {
  id: number;
  nombre: string;
  iglesia: string;
  estado: "activo" | "inactivo" | "nuevo";
  fechaRegistro: string;
}

export default function MiembrosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const queryClient = useQueryClient();

  // Datos reales de la base de datos
  const { data: miembros, isLoading } = useQuery<Miembro[]>({
    queryKey: ['/api/miembros'],
  });

  // Mutación para eliminar miembro
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/miembros/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/miembros'] });
    },
  });

  const filteredMiembros = miembros?.filter(miembro => {
    const matchesSearch = 
      miembro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      miembro.iglesia.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "todos") return matchesSearch;
    if (activeTab === "activos") return matchesSearch && miembro.estado === "activo";
    if (activeTab === "inactivos") return matchesSearch && miembro.estado === "inactivo";
    if (activeTab === "nuevos") return matchesSearch && miembro.estado === "nuevo";
    
    return matchesSearch;
  });

  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-success bg-opacity-10 text-success";
      case "inactivo":
        return "bg-neutral-200 text-neutral-600";
      case "nuevo":
        return "bg-primary bg-opacity-10 text-primary";
      default:
        return "bg-neutral-200 text-neutral-600";
    }
  };

  return (
    <>
      <Helmet>
        <title>Miembros - Iglesia Admin</title>
        <meta name="description" content="Gestión de miembros de la iglesia - Ver, registrar y administrar todos los miembros de la congregación" />
      </Helmet>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Miembros</h1>
            <p className="text-neutral-500">Miembros identificados desde la app móvil</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <Input
                  placeholder="Buscar miembros..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="bg-white border border-slate-300 text-neutral-700 hover:bg-slate-100">
  <FilterIcon className="h-4 w-4" />
  Filtros
</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="todos" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="activos">Activos</TabsTrigger>
            <TabsTrigger value="inactivos">Inactivos</TabsTrigger>
            <TabsTrigger value="nuevos">Nuevos</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          // Tabla de skeleton para miembros
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-neutral-500">Miembro</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-neutral-500">Iglesia</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-neutral-500">Estado</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-neutral-500">Registro</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-neutral-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-neutral-200">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-32" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-8 w-16 rounded" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredMiembros && filteredMiembros.length > 0 ? (
          <Card>
  <CardContent className="p-0">
    <div className="overflow-x-auto">
      <table className="w-full bg-white text-sm">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-neutral-500">Miembro</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-neutral-500">Iglesia</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-neutral-500">Estado</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-neutral-500">Registro</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-neutral-500">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredMiembros.map((miembro) => (
            <tr
              key={miembro.id}
              className="bg-white even:bg-slate-50 hover:bg-slate-100 transition"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {miembro.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800">{miembro.nombre}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-neutral-800">{miembro.iglesia}</div>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className={`${getEstadoClass(miembro.estado)} border-0`}
                >
                  {miembro.estado.charAt(0).toUpperCase() + miembro.estado.slice(1)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {miembro.fechaRegistro ? new Date(miembro.fechaRegistro).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteMutation.mutate(miembro.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
  <CardFooter className="flex items-center justify-between border-t p-4 bg-white">
    <div className="text-sm text-neutral-500">
      Mostrando <span className="font-medium">{filteredMiembros.length}</span> de{" "}
      <span className="font-medium">{miembros?.length}</span> miembros
    </div>
  </CardFooter>
</Card>

          ) : (
            <div className="py-8 text-center text-sm text-neutral-500 bg-white rounded-lg shadow">
              No se encontraron miembros
            </div>
          )
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas de Miembros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-600">Miembros Activos</span>
                    <span className="font-medium">{miembros?.filter(m => m.estado === "activo").length || 0}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-slate-500 h-2 rounded-full"  
                      style={{ width: `${miembros && miembros.length > 0 ? (miembros.filter(m => m.estado === "activo").length / miembros.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-600">Miembros Inactivos</span>
                    <span className="font-medium">{miembros?.filter(m => m.estado === "inactivo").length || 0}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-slate-500 h-2 rounded-full" 
                      style={{ width: `${miembros && miembros.length > 0 ? (miembros.filter(m => m.estado === "inactivo").length / miembros.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-600">Total Miembros</span>
                    <span className="font-medium">{miembros?.length || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Iglesias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {miembros && miembros.length > 0 && (
                  (() => {
                    const iglesiasCount: Record<string, number> = {};
                    miembros.forEach(miembro => {
                      iglesiasCount[miembro.iglesia] = (iglesiasCount[miembro.iglesia] || 0) + 1;
                    });
                    
                    return Object.entries(iglesiasCount)
                      .sort(([,countA], [,countB]) => countB - countA)
                      .map(([iglesia, count], index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-600">{iglesia}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div 
                              className="bg-slate-500 h-2 rounded-full"
                              style={{ width: `${(count / miembros.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ));
                  })()
                )}
                {(!miembros || miembros.length === 0) && (
                  <p className="text-sm text-neutral-500">Sin datos aún</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Miembros Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24 mt-1" />
                      </div>
                    </div>
                  ))
                ) : (
                  miembros && miembros
                    .slice(0, 5)
                    .map((miembro) => (
                      <div key={miembro.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {miembro.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-neutral-800">{miembro.nombre}</div>
                          <div className="text-xs text-neutral-500">
                            {miembro.fechaRegistro ? new Date(miembro.fechaRegistro).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}