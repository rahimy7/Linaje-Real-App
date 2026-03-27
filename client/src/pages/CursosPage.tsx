import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SearchIcon, PlusIcon, EditIcon, TrashIcon, EyeIcon, DownloadIcon } from "@/lib/icons";
import { apiRequest } from "@/lib/queryClient";
import { generateProgramaPdf } from "@/lib/generateProgramaPdf";

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface Programa {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  imagenUrl: string | null;
  color: string | null;
  categoria: string | null;
  version: string | null;
  totalDias: number | null;
  duracion: string | null;
  nivel: string | null;
  publicado: boolean | null;
  creadoEn: string | null;
  actualizadoEn: string | null;
}

const CATEGORIAS = [
  { id: "todos", label: "Todos", color: "#6366F1", icono: "📋" },
  { id: "formacion-cristiana", label: "Formación", color: "#3478F6", icono: "📖" },
  { id: "liderazgo", label: "Liderazgo", color: "#8B5CF6", icono: "🎯" },
  { id: "oracion", label: "Oración", color: "#EC4899", icono: "🙏" },
  { id: "familia", label: "Familia", color: "#F59E0B", icono: "👨‍👩‍👧" },
  { id: "mision", label: "Misión", color: "#14B8A6", icono: "🌍" },
];

const NIVELES = ["Básico", "Intermedio", "Avanzado"];

const COLOR_OPTS = [
  { VALUE: "#3478F6", label: "Azul" },
  { VALUE: "#8B5CF6", label: "Violeta" },
  { VALUE: "#EC4899", label: "Rosa" },
  { VALUE: "#F59E0B", label: "Amber" },
  { VALUE: "#14B8A6", label: "Teal" },
  { VALUE: "#10B981", label: "Esmeralda" },
  { VALUE: "#EF4444", label: "Rojo" },
];

const ICONOS = ["📖", "🎯", "🙏", "👨‍👩‍👧", "🌍", "✝️", "💡", "🏛️", "🌟", "🔑", "❤️", "🕊️"];

const DEFAULT_FORM: Partial<Programa> = {
  nombre: "",
  slug: "",
  descripcion: "",
  icono: "📖",
  color: "#3478F6",
  categoria: "formacion-cristiana",
  nivel: "Básico",
  duracion: "",
  version: "1.0.0",
  publicado: false,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ── Componente Stats ───────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: string; color: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: color + "18" }}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-neutral-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-neutral-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Componente Card de Programa ───────────────────────────────────────────────
function ProgramaCard({
  programa,
  onEdit,
  onDelete,
  onTogglePublicado,
  onVerDias,
  onDownloadPdf,
}: {
  programa: Programa;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublicado: () => void;
  onVerDias: () => void;
  onDownloadPdf: () => void;
}) {
  const cat = CATEGORIAS.find((c) => c.id === programa.categoria);
  const accentColor = programa.color || "#3478F6";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {programa.imagenUrl ? (
        <div className="relative h-36 w-full overflow-hidden">
          <img
            src={programa.imagenUrl}
            alt={programa.nombre}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, ${accentColor}cc 0%, transparent 60%)` }}
          />
          <div
            className="absolute bottom-2 left-3 w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow"
            style={{ backgroundColor: accentColor }}
          >
            {programa.icono || "📖"}
          </div>
        </div>
      ) : (
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }}
        />
      )}
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            {!programa.imagenUrl && (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: accentColor + "18" }}
              >
                {programa.icono || "📖"}
              </div>
            )}
            <div className="min-w-0">
              <CardTitle className="text-base leading-tight truncate">{programa.nombre}</CardTitle>
              <div className="flex flex-wrap gap-1 mt-1">
                {cat && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {cat.icono} {cat.label}
                  </Badge>
                )}
                {programa.nivel && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {programa.nivel}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <Switch
              checked={programa.publicado ?? false}
              onCheckedChange={onTogglePublicado}
            />
            <span className="text-[10px] text-neutral-400">
              {programa.publicado ? "Publicado" : "Borrador"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        {programa.descripcion && (
          <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{programa.descripcion}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <span>📅</span> {programa.duracion || "Sin duración"}
          </span>
          <span className="flex items-center gap-1">
            <span>📚</span> {programa.totalDias ?? 0} día{(programa.totalDias ?? 0) !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <span>🏷️</span> v{programa.version}
          </span>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3 pb-3 flex items-center justify-between gap-2">
        <Button size="sm" variant="default" className="flex-1 text-xs" onClick={onVerDias}>
          <EyeIcon className="h-3.5 w-3.5 mr-1" />
          Ver Días ({programa.totalDias ?? 0})
        </Button>
        <div className="flex gap-1">
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={onDownloadPdf} title="Descargar PDF">
            <DownloadIcon className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={onEdit}>
            <EditIcon className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={onDelete}>
            <TrashIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// ── Página principal ───────────────────────────────────────────────────────────
export default function CursosPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Programa | null>(null);
  const [form, setForm] = useState<Partial<Programa>>(DEFAULT_FORM);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: programas = [], isLoading } = useQuery<Programa[]>({
    queryKey: ["/api/programas"],
  });

  // ── Mutations ────────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: Partial<Programa>) => apiRequest("POST", "/api/programas", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programas"] });
      setShowModal(false);
      toast({ title: "Programa creado", description: "El programa fue creado exitosamente." });
    },
    onError: () => toast({ title: "Error", description: "No se pudo crear el programa.", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Programa> }) =>
      apiRequest("PUT", `/api/programas/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programas"] });
      setShowModal(false);
      toast({ title: "Programa actualizado" });
    },
    onError: () => toast({ title: "Error", description: "No se pudo actualizar el programa.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/programas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programas"] });
      setDeletingId(null);
      toast({ title: "Programa eliminado" });
    },
    onError: () => toast({ title: "Error", description: "No se pudo eliminar el programa.", variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/programas/${id}/toggle-publicado`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/programas"] }),
  });

  // ── Filtrado ─────────────────────────────────────────────────────────────────
  const programasFiltrados = programas.filter((p) => {
    const matchSearch =
      !searchTerm ||
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoriaFilter === "todos" || p.categoria === categoriaFilter;
    return matchSearch && matchCat;
  });

  // ── Stats ────────────────────────────────────────────────────────────────────
  const totalDias = programas.reduce((sum, p) => sum + (p.totalDias || 0), 0);
  const publicados = programas.filter((p) => p.publicado).length;
  const borradores = programas.length - publicados;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const abrirCrear = () => {
    setEditando(null);
    setForm(DEFAULT_FORM);
    setShowModal(true);
  };

  const abrirEditar = (p: Programa) => {
    setEditando(p);
    setForm({ ...p });
    setShowModal(true);
  };

  const handleGuardar = () => {
    if (!form.nombre?.trim()) {
      toast({ title: "Nombre requerido", variant: "destructive" });
      return;
    }
    const slug = form.slug?.trim() || slugify(form.nombre);
    const payload = { ...form, slug };

    if (editando) {
      updateMutation.mutate({ id: editando.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleNombreChange = (nombre: string) => {
    setForm((f) => ({
      ...f,
      nombre,
      slug: f.slug && f.slug !== slugify(f.nombre || "") ? f.slug : slugify(nombre),
    }));
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleDownloadPdf = async (programa: Programa) => {
    try {
      toast({ title: "Generando PDF...", description: "Descargando datos del programa." });
      const res = await fetch(`/api/programas/${programa.id}/dias`);
      if (!res.ok) throw new Error("No se pudieron obtener los días");
      const dias = await res.json();
      if (!dias.length) {
        toast({ title: "Sin contenido", description: "Este programa no tiene días creados aún.", variant: "destructive" });
        return;
      }
      await generateProgramaPdf(programa, dias);
      toast({ title: "PDF descargado", description: `${programa.nombre}.pdf generado correctamente.` });
    } catch {
      toast({ title: "Error", description: "No se pudo generar el PDF.", variant: "destructive" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Programas (Cursos) – Iglesia Admin</title>
        <meta name="description" content="Gestión de programas y cursos descargables de la app móvil" />
      </Helmet>
      <div className="p-4 md:p-6 space-y-6">
        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Programas / Cursos</h1>
            <p className="text-neutral-500 text-sm">
              Gestión de cursos descargables para la app móvil
            </p>
          </div>
          <Button onClick={abrirCrear} className="self-start md:self-auto">
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Programa
          </Button>
        </div>

        {/* ── Stats ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Programas" value={programas.length} icon="📚" color="#3478F6" />
          <StatCard label="Publicados" value={publicados} icon="✅" color="#10B981" />
          <StatCard label="Borradores" value={borradores} icon="📝" color="#F59E0B" />
          <StatCard label="Total Días" value={totalDias} icon="📅" color="#8B5CF6" />
        </div>

        {/* ── Filtros ──────────────────────────────────────────────────────────── */}
        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Buscar programas..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Tabs por categoría ───────────────────────────────────────────────── */}
        <Tabs value={categoriaFilter} onValueChange={setCategoriaFilter}>
          <TabsList className="flex-wrap h-auto gap-1">
            {CATEGORIAS.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                {cat.icono} {cat.label}
                {cat.id !== "todos" && (
                  <span className="ml-1 text-[10px] text-neutral-400">
                    ({programas.filter((p) => p.categoria === cat.id).length})
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* ── Grid de programas ────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : programasFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">📭</span>
            <p className="mt-4 text-neutral-500 font-medium">No se encontraron programas</p>
            <p className="text-sm text-neutral-400">
              {searchTerm || categoriaFilter !== "todos"
                ? "Prueba con otro término o categoría"
                : "Crea el primer programa con el botón de arriba"}
            </p>
            {!searchTerm && categoriaFilter === "todos" && (
              <Button className="mt-4" onClick={abrirCrear}>
                <PlusIcon className="h-4 w-4 mr-2" /> Crear Programa
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programasFiltrados.map((programa) => (
              <ProgramaCard
                key={programa.id}
                programa={programa}
                onEdit={() => abrirEditar(programa)}
                onDelete={() => setDeletingId(programa.id)}
                onTogglePublicado={() => toggleMutation.mutate(programa.id)}
                onVerDias={() => setLocation(`/cursos/${programa.id}/dias`)}
                onDownloadPdf={() => handleDownloadPdf(programa)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Crear / Editar ─────────────────────────────────────────────── */}
      <Dialog open={showModal} onOpenChange={(v) => { if (!isSaving) setShowModal(v); }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Programa" : "Nuevo Programa"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Input
                placeholder="Ej. Fundamentos Bíblicos"
                value={form.nombre || ""}
                onChange={(e) => handleNombreChange(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Slug (URL) *</Label>
              <Input
                placeholder="fundamentos-biblicos"
                value={form.slug || ""}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
              />
              <p className="text-xs text-neutral-400">Identificador único en minúsculas y guiones</p>
            </div>

            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea
                placeholder="Breve descripción del programa..."
                rows={3}
                value={form.descripcion || ""}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Ícono</Label>
                <Select
                  value={form.icono || "📖"}
                  onValueChange={(v) => setForm((f) => ({ ...f, icono: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICONOS.map((ic) => (
                      <SelectItem key={ic} value={ic}>
                        {ic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Color de acento</Label>
                <Select
                  value={form.color || "#3478F6"}
                  onValueChange={(v) => setForm((f) => ({ ...f, color: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTS.map((c) => (
                      <SelectItem key={c.VALUE} value={c.VALUE}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ background: c.VALUE }} />
                          {c.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Categoría</Label>
                <Select
                  value={form.categoria || "formacion-cristiana"}
                  onValueChange={(v) => setForm((f) => ({ ...f, categoria: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.filter((c) => c.id !== "todos").map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.icono} {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Nivel</Label>
                <Select
                  value={form.nivel || "Básico"}
                  onValueChange={(v) => setForm((f) => ({ ...f, nivel: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NIVELES.map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Duración</Label>
                <Input
                  placeholder="21 días"
                  value={form.duracion || ""}
                  onChange={(e) => setForm((f) => ({ ...f, duracion: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Versión</Label>
                <Input
                  placeholder="1.0.0"
                  value={form.version || ""}
                  onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>URL de imagen (opcional)</Label>
              <Input
                placeholder="https://..."
                value={form.imagenUrl || ""}
                onChange={(e) => setForm((f) => ({ ...f, imagenUrl: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border">
              <div>
                <p className="text-sm font-medium">Publicado en la app</p>
                <p className="text-xs text-neutral-400">Visible para descargar en la app móvil</p>
              </div>
              <Switch
                checked={form.publicado ?? false}
                onCheckedChange={(v) => setForm((f) => ({ ...f, publicado: v }))}
              />
            </div>

            {(form.nombre || form.icono) && (
              <div className="overflow-hidden rounded-xl">
                {form.imagenUrl && (
                  <div className="relative h-28 w-full">
                    <img src={form.imagenUrl} alt={form.nombre} className="w-full h-full object-cover" />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(to top, ${form.color || "#3478F6"}cc 0%, transparent 60%)` }}
                    />
                  </div>
                )}
                <div
                  className="p-4 flex items-center gap-3 text-white"
                  style={{ background: form.imagenUrl ? (form.color || "#3478F6") : `linear-gradient(135deg, ${form.color || "#3478F6"}, ${(form.color || "#3478F6") + "aa"})` }}
                >
                  <span className="text-3xl">{form.icono || "📖"}</span>
                  <div>
                    <p className="font-bold">{form.nombre || "Nombre del programa"}</p>
                    <p className="text-xs opacity-80">{form.duracion || "Duración"} · {form.nivel || "Nivel"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSaving}>Cancelar</Button>
            </DialogClose>
            <Button onClick={handleGuardar} disabled={isSaving}>
              {isSaving ? "Guardando..." : editando ? "Guardar cambios" : "Crear programa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Confirm Delete ───────────────────────────────────────────────────── */}
      <AlertDialog open={deletingId !== null} onOpenChange={(v) => { if (!v) setDeletingId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar programa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el programa y todos sus días de contenido. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={() => deletingId !== null && deleteMutation.mutate(deletingId)}
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}