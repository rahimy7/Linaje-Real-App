import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, FilterIcon, PlusIcon, CalendarIcon } from "@/lib/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Tipo para los eventos (coincide con la tabla de la BD)
interface Evento {
  id: number;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  hora: string;
  lugar: string | null;
  tipo: string;
  imageUrl: string | null;
  publicado: boolean | null;
  creadoEn: string | null;
  actualizadoEn: string | null;
}

const DEFAULT_FORM = {
  titulo: "",
  descripcion: "",
  fecha: "",
  hora: "",
  lugar: "",
  tipo: "culto",
  imageUrl: "",
  publicado: true,
};

export default function EventosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Evento | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Cargar eventos reales desde el API (all=true para el admin)
  const { data: eventos, isLoading } = useQuery<Evento[]>({
    queryKey: ['/api/eventos'],
    queryFn: async () => {
      const res = await fetch('/api/eventos?all=true');
      if (!res.ok) throw new Error('Error al cargar eventos');
      return res.json();
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: typeof DEFAULT_FORM) => apiRequest("POST", "/api/eventos", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/eventos"] });
      setShowModal(false);
      setForm(DEFAULT_FORM);
      toast({ title: "Evento creado", description: "El evento fue creado exitosamente." });
    },
    onError: () => toast({ title: "Error", description: "No se pudo crear el evento.", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof DEFAULT_FORM }) =>
      apiRequest("PUT", `/api/eventos/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/eventos"] });
      setShowModal(false);
      setEditando(null);
      setForm(DEFAULT_FORM);
      toast({ title: "Evento actualizado" });
    },
    onError: () => toast({ title: "Error", description: "No se pudo actualizar el evento.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/eventos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/eventos"] });
      toast({ title: "Evento eliminado" });
    },
    onError: () => toast({ title: "Error", description: "No se pudo eliminar el evento.", variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/eventos/${id}/toggle-publicado`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/eventos"] }),
  });

  const filteredEventos = eventos?.filter(evento => {
    const matchesSearch = 
      evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evento.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evento.lugar || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "todos") return matchesSearch;
    if (activeTab === "cultos") return matchesSearch && evento.tipo === "culto";
    if (activeTab === "estudios") return matchesSearch && evento.tipo === "estudio";
    if (activeTab === "jovenes") return matchesSearch && evento.tipo === "jovenes";
    if (activeTab === "especiales") return matchesSearch && (evento.tipo === "especial" || evento.tipo === "retiro");
    
    return matchesSearch;
  });

  const openCreate = () => {
    setEditando(null);
    setForm(DEFAULT_FORM);
    setShowModal(true);
  };

  const openEdit = (evento: Evento) => {
    setEditando(evento);
    setForm({
      titulo: evento.titulo,
      descripcion: evento.descripcion || "",
      fecha: evento.fecha ? new Date(evento.fecha).toISOString().slice(0, 16) : "",
      hora: evento.hora,
      lugar: evento.lugar || "",
      tipo: evento.tipo,
      imageUrl: evento.imageUrl || "",
      publicado: evento.publicado ?? true,
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.titulo || !form.fecha || !form.hora) {
      toast({ title: "Campos requeridos", description: "Título, fecha y hora son obligatorios.", variant: "destructive" });
      return;
    }
    if (editando) {
      updateMutation.mutate({ id: editando.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const formatFecha = (fechaStr: string) => {
    try {
      return new Date(fechaStr).toLocaleDateString("es-ES", {
        day: "numeric", month: "long", year: "numeric"
      });
    } catch { return fechaStr; }
  };

  return (
    <>
      <Helmet>
        <title>Eventos - Iglesia Admin</title>
        <meta name="description" content="Gestión de eventos para la iglesia - Ver, buscar y administrar todos los eventos y actividades" />
      </Helmet>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Eventos</h1>
            <p className="text-neutral-500">Gestión de eventos y actividades de la iglesia</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-primary text-white" onClick={openCreate}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Añadir Evento
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <Input
                  placeholder="Buscar eventos..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="todos" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="cultos">Cultos</TabsTrigger>
            <TabsTrigger value="estudios">Estudios</TabsTrigger>
            <TabsTrigger value="jovenes">Jóvenes</TabsTrigger>
            <TabsTrigger value="especiales">Especiales</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-40 w-full rounded-md" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredEventos && filteredEventos.length > 0 ? (
              filteredEventos.map((evento) => (
                <Card key={evento.id} className={`overflow-hidden ${!evento.publicado ? 'opacity-60' : ''}`}>
                  <div className="relative">
                    {evento.imageUrl ? (
                      <img 
                        src={evento.imageUrl}
                        alt={evento.titulo}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <CalendarIcon className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="bg-primary/90 text-white px-2 py-1 rounded text-xs font-medium">
                        {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                      </span>
                      {!evento.publicado && (
                        <span className="bg-yellow-500/90 text-white px-2 py-1 rounded text-xs font-medium">
                          Borrador
                        </span>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-neutral-800 mb-1">{evento.titulo}</h3>
                    <p className="text-sm text-neutral-600 mb-3">{evento.descripcion}</p>
                    
                    <div className="flex items-center text-sm text-neutral-500 mb-2">
                      <CalendarIcon className="h-4 w-4 mr-2 text-neutral-400" />
                      <span>{formatFecha(evento.fecha)} • {evento.hora}</span>
                    </div>
                    
                    {evento.lugar && (
                      <div className="flex items-center text-sm text-neutral-500">
                        <i className="ri-map-pin-line mr-2 text-neutral-400"></i>
                        <span>{evento.lugar}</span>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => toggleMutation.mutate(evento.id)}
                      >
                        {evento.publicado ? "Despublicar" : "Publicar"}
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => openEdit(evento)}>
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs"
                        onClick={() => deleteMutation.mutate(evento.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-sm text-neutral-500">
                No se encontraron eventos
              </div>
            )
          )}
        </div>
      </div>

      {/* Modal crear/editar evento */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Evento" : "Crear Evento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha y Hora *</Label>
                <Input type="datetime-local" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
              </div>
              <div>
                <Label>Hora (texto) *</Label>
                <Input placeholder="10:00 AM" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Lugar</Label>
              <Input value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })} />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="culto">Culto</SelectItem>
                  <SelectItem value="estudio">Estudio</SelectItem>
                  <SelectItem value="retiro">Retiro</SelectItem>
                  <SelectItem value="jovenes">Jóvenes</SelectItem>
                  <SelectItem value="especial">Especial</SelectItem>
                  <SelectItem value="capacitacion">Capacitación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>URL de Imagen</Label>
              <Input placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editando ? "Guardar Cambios" : "Crear Evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}