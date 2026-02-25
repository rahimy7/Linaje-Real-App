import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { EditIcon, TrashIcon, PlusIcon } from "@/lib/icons";
import { apiRequest } from "@/lib/queryClient";

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface Programa {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  color: string | null;
  categoria: string | null;
  totalDias: number | null;
  duracion: string | null;
  nivel: string | null;
  publicado: boolean | null;
}

interface DiaPrograma {
  id: number;
  programaId: number;
  numero: number;
  titulo: string;
  descripcion: string | null;
  versiculoRef: string | null;
  versiculoTexto: string | null;
  reflexion: string | null;
  actividadTitulo: string | null;
  actividadDescripcion: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  ayunoDescripcion: string | null;
  lecturas: string[] | null;
}

const DEFAULT_DIA: Partial<DiaPrograma> = {
  numero: 1,
  titulo: "",
  descripcion: "",
  versiculoRef: "",
  versiculoTexto: "",
  reflexion: "",
  actividadTitulo: "",
  actividadDescripcion: "",
  audioUrl: "",
  videoUrl: "",
  ayunoDescripcion: "",
};

// ── Página ─────────────────────────────────────────────────────────────────────
export default function ProgramaDetailPage() {
  const [, params] = useRoute("/cursos/:id/dias");
  const [, setLocation] = useLocation();
  const programaId = params?.id ? parseInt(params.id) : 0;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showDiaModal, setShowDiaModal] = useState(false);
  const [editandoDia, setEditandoDia] = useState<DiaPrograma | null>(null);
  const [formDia, setFormDia] = useState<Partial<DiaPrograma>>(DEFAULT_DIA);
  const [deletingDiaId, setDeletingDiaId] = useState<number | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: programa, isLoading: loadingPrograma } = useQuery<Programa>({
    queryKey: [`/api/programas/${programaId}`],
    enabled: programaId > 0,
  });

  const { data: dias = [], isLoading: loadingDias } = useQuery<DiaPrograma[]>({
    queryKey: [`/api/programas/${programaId}/dias`],
    enabled: programaId > 0,
  });

  // ── Mutations ────────────────────────────────────────────────────────────────
  const createDiaMutation = useMutation({
    mutationFn: (data: Partial<DiaPrograma>) =>
      apiRequest("POST", `/api/programas/${programaId}/dias`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/programas/${programaId}/dias`] });
      queryClient.invalidateQueries({ queryKey: ["/api/programas"] });
      setShowDiaModal(false);
      toast({ title: "Día creado" });
    },
    onError: () => toast({ title: "Error al crear el día", variant: "destructive" }),
  });

  const updateDiaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DiaPrograma> }) =>
      apiRequest("PUT", `/api/dias/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/programas/${programaId}/dias`] });
      setShowDiaModal(false);
      toast({ title: "Día actualizado" });
    },
    onError: () => toast({ title: "Error al actualizar el día", variant: "destructive" }),
  });

  const deleteDiaMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/dias/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/programas/${programaId}/dias`] });
      queryClient.invalidateQueries({ queryKey: ["/api/programas"] });
      setDeletingDiaId(null);
      toast({ title: "Día eliminado" });
    },
    onError: () => toast({ title: "Error al eliminar el día", variant: "destructive" }),
  });

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const abrirCrearDia = () => {
    setEditandoDia(null);
    const nextNumero = dias.length > 0 ? Math.max(...dias.map((d) => d.numero)) + 1 : 1;
    setFormDia({ ...DEFAULT_DIA, numero: nextNumero });
    setShowDiaModal(true);
  };

  const abrirEditarDia = (dia: DiaPrograma) => {
    setEditandoDia(dia);
    setFormDia({ ...dia });
    setShowDiaModal(true);
  };

  const handleGuardarDia = () => {
    if (!formDia.titulo?.trim()) {
      toast({ title: "El título es requerido", variant: "destructive" });
      return;
    }
    if (editandoDia) {
      updateDiaMutation.mutate({ id: editandoDia.id, data: formDia });
    } else {
      createDiaMutation.mutate(formDia);
    }
  };

  const isSaving = createDiaMutation.isPending || updateDiaMutation.isPending;
  const accentColor = programa?.color || "#3478F6";
  const isLoading = loadingPrograma || loadingDias;

  return (
    <>
      <Helmet>
        <title>
          {programa ? `${programa.nombre} – Días` : "Programa"} | Admin
        </title>
      </Helmet>
      <div className="p-4 md:p-6 space-y-6">
        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setLocation("/cursos")}>
            ←
          </Button>
          {loadingPrograma ? (
            <div className="space-y-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : programa ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: accentColor + "18" }}
              >
                {programa.icono || "📖"}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-neutral-800 truncate">{programa.nombre}</h1>
                <div className="flex gap-2 items-center mt-0.5">
                  {programa.nivel && (
                    <Badge variant="secondary" className="text-xs">{programa.nivel}</Badge>
                  )}
                  <span className="text-sm text-neutral-400">{programa.duracion}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: programa.publicado ? "#10B98118" : "#F59E0B18",
                      color: programa.publicado ? "#10B981" : "#F59E0B",
                    }}
                  >
                    {programa.publicado ? "Publicado" : "Borrador"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-neutral-400">Programa no encontrado</p>
          )}
          <div className="ml-auto flex-shrink-0">
            <Button onClick={abrirCrearDia}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Añadir Día
            </Button>
          </div>
        </div>

        {/* ── Barra de progreso visual ─────────────────────────────────────────── */}
        {programa && (
          <div
            className="h-1.5 rounded-full w-full"
            style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}44)` }}
          />
        )}

        {/* ── Tabla de días ────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Días del programa
              <span className="ml-2 text-sm font-normal text-neutral-400">
                ({dias.length} {dias.length === 1 ? "día" : "días"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-5 flex-1" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            ) : dias.length === 0 ? (
              <div className="text-center py-14">
                <span className="text-4xl">📅</span>
                <p className="mt-3 text-neutral-500 font-medium">No hay días definidos aún</p>
                <p className="text-sm text-neutral-400 mb-4">
                  Añade el primer día con el botón de arriba
                </p>
                <Button variant="outline" onClick={abrirCrearDia}>
                  <PlusIcon className="h-4 w-4 mr-2" /> Añadir Día 1
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">Día</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead className="hidden md:table-cell">Versículo</TableHead>
                    <TableHead className="hidden lg:table-cell">Actividad</TableHead>
                    <TableHead className="hidden lg:table-cell w-20">Media</TableHead>
                    <TableHead className="w-24 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...dias]
                    .sort((a, b) => a.numero - b.numero)
                    .map((dia) => (
                      <TableRow key={dia.id}>
                        <TableCell className="text-center">
                          <div
                            className="mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: accentColor }}
                          >
                            {dia.numero}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-neutral-800 leading-snug">{dia.titulo}</p>
                          {dia.descripcion && (
                            <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                              {dia.descripcion}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-neutral-500">
                          {dia.versiculoRef || <span className="text-neutral-300">—</span>}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-neutral-500">
                          {dia.actividadTitulo ? (
                            <span className="truncate max-w-[140px] inline-block">
                              {dia.actividadTitulo}
                            </span>
                          ) : (
                            <span className="text-neutral-300">—</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex gap-1.5">
                            {dia.audioUrl && (
                              <span title="Audio" className="text-base">🎵</span>
                            )}
                            {dia.videoUrl && (
                              <span title="Video" className="text-base">🎬</span>
                            )}
                            {dia.ayunoDescripcion && (
                              <span title="Ayuno" className="text-base">🤲</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => abrirEditarDia(dia)}
                            >
                              <EditIcon className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:bg-destructive/10"
                              onClick={() => setDeletingDiaId(dia.id)}
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Modal Crear / Editar Día ─────────────────────────────────────────── */}
      <Dialog open={showDiaModal} onOpenChange={(v) => { if (!isSaving) setShowDiaModal(v); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editandoDia ? `Editar Día ${editandoDia.numero}` : "Añadir Nuevo Día"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Fila: Número + Título */}
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label>Día #</Label>
                <Input
                  type="number"
                  min={1}
                  value={formDia.numero || ""}
                  onChange={(e) =>
                    setFormDia((f) => ({ ...f, numero: parseInt(e.target.value) || 1 }))
                  }
                />
              </div>
              <div className="col-span-3 space-y-1.5">
                <Label>Título *</Label>
                <Input
                  placeholder="Ej. El propósito de la fe"
                  value={formDia.titulo || ""}
                  onChange={(e) => setFormDia((f) => ({ ...f, titulo: e.target.value }))}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <Label>Descripción breve</Label>
              <Textarea
                placeholder="Resumen del día..."
                rows={2}
                value={formDia.descripcion || ""}
                onChange={(e) => setFormDia((f) => ({ ...f, descripcion: e.target.value }))}
              />
            </div>

            {/* Versículo */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Referencia bíblica</Label>
                <Input
                  placeholder="Juan 3:16"
                  value={formDia.versiculoRef || ""}
                  onChange={(e) => setFormDia((f) => ({ ...f, versiculoRef: e.target.value }))}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Texto del versículo</Label>
                <Input
                  placeholder="Porque de tal manera amó Dios..."
                  value={formDia.versiculoTexto || ""}
                  onChange={(e) => setFormDia((f) => ({ ...f, versiculoTexto: e.target.value }))}
                />
              </div>
            </div>

            {/* Reflexión */}
            <div className="space-y-1.5">
              <Label>Reflexión</Label>
              <Textarea
                placeholder="Contenido de reflexión para este día..."
                rows={4}
                value={formDia.reflexion || ""}
                onChange={(e) => setFormDia((f) => ({ ...f, reflexion: e.target.value }))}
              />
            </div>

            {/* Actividad */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Título de actividad</Label>
                <Input
                  placeholder="Ej. Meditación matutina"
                  value={formDia.actividadTitulo || ""}
                  onChange={(e) =>
                    setFormDia((f) => ({ ...f, actividadTitulo: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Descripción de actividad</Label>
                <Input
                  placeholder="Descripción breve..."
                  value={formDia.actividadDescripcion || ""}
                  onChange={(e) =>
                    setFormDia((f) => ({ ...f, actividadDescripcion: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Media */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>URL de audio 🎵</Label>
                <Input
                  placeholder="https://... .mp3"
                  value={formDia.audioUrl || ""}
                  onChange={(e) => setFormDia((f) => ({ ...f, audioUrl: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>URL de video 🎬</Label>
                <Input
                  placeholder="https://youtu.be/..."
                  value={formDia.videoUrl || ""}
                  onChange={(e) => setFormDia((f) => ({ ...f, videoUrl: e.target.value }))}
                />
              </div>
            </div>

            {/* Ayuno e imagen */}
            <div className="space-y-1.5">
              <Label>Actividad de ayuno 🤲</Label>
              <Textarea
                placeholder="Instrucciones o descripción del ayuno para este día..."
                rows={3}
                value={formDia.ayunoDescripcion || ""}
                onChange={(e) => setFormDia((f) => ({ ...f, ayunoDescripcion: e.target.value }))}
              />
            </div>


          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSaving}>Cancelar</Button>
            </DialogClose>
            <Button onClick={handleGuardarDia} disabled={isSaving}>
              {isSaving ? "Guardando..." : editandoDia ? "Guardar cambios" : "Añadir día"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Confirm Delete ───────────────────────────────────────────────────── */}
      <AlertDialog
        open={deletingDiaId !== null}
        onOpenChange={(v) => { if (!v) setDeletingDiaId(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este día?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará el día y todo su contenido. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteDiaMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteDiaMutation.isPending}
              onClick={() =>
                deletingDiaId !== null && deleteDiaMutation.mutate(deletingDiaId)
              }
            >
              {deleteDiaMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
