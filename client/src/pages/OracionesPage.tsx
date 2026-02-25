import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, PlusIcon, TrashIcon, MoreHorizontalIcon } from "@/lib/icons";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

//  Types 

interface PeticionOracion {
  id: number;
  peticion: string;
  autor: string;
  estado: "pendiente" | "en-oracion" | "respondida";
  contadorOraciones: number;
  privada: boolean;
  categoria: string;
  creadoEn: string;
  actualizadoEn: string;
}

//  Helpers 

const ESTADOS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en-oracion", label: "En Oración" },
  { value: "respondida", label: "Respondida" },
] as const;

const CATEGORIAS = [
  { value: "general", label: "General" },
  { value: "salud", label: "Salud" },
  { value: "familia", label: "Familia" },
  { value: "educacion", label: "Educación" },
  { value: "trabajo", label: "Trabajo" },
  { value: "direccion", label: "Dirección" },
  { value: "finanzas", label: "Finanzas" },
];

function estadoBadge(estado: string) {
  switch (estado) {
    case "pendiente":
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 border hover:bg-amber-100">
          Pendiente
        </Badge>
      );
    case "en-oracion":
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 border hover:bg-blue-100">
          En Oración
        </Badge>
      );
    case "respondida":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border hover:bg-emerald-100">
          Respondida 
        </Badge>
      );
    default:
      return <Badge variant="outline">{estado}</Badge>;
  }
}

function categoriaBadge(cat: string) {
  const colorMap: Record<string, string> = {
    salud: "bg-red-50 text-red-600 border-red-200",
    familia: "bg-purple-50 text-purple-600 border-purple-200",
    educacion: "bg-sky-50 text-sky-600 border-sky-200",
    trabajo: "bg-orange-50 text-orange-600 border-orange-200",
    direccion: "bg-teal-50 text-teal-600 border-teal-200",
    finanzas: "bg-green-50 text-green-600 border-green-200",
    general: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const cls = colorMap[cat] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const label = CATEGORIAS.find((c) => c.value === cat)?.label ?? cat;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

function relativeTime(date: string) {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
  } catch {
    return date;
  }
}

type EdadTier = "hoy" | "semana" | "quincena" | "antigua";

function getEdadTier(date: string): EdadTier {
  try {
    const diff = Date.now() - new Date(date).getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days < 1) return "hoy";
    if (days <= 7) return "semana";
    if (days <= 15) return "quincena";
    return "antigua";
  } catch {
    return "antigua";
  }
}

const EDAD_STYLES: Record<EdadTier, { card: string; chip: string; label: string; dot: string }> = {
  hoy:      { card: "border-blue-300 bg-blue-50/60",   chip: "bg-blue-100 text-blue-700 border-blue-200",   label: "Hoy",          dot: "bg-blue-500"   },
  semana:   { card: "border-emerald-300 bg-emerald-50/60", chip: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Esta semana",  dot: "bg-emerald-500" },
  quincena: { card: "border-amber-300 bg-amber-50/60",  chip: "bg-amber-100 text-amber-700 border-amber-200",   label: "15 días",      dot: "bg-amber-500"  },
  antigua:  { card: "border-rose-300 bg-rose-50/60",    chip: "bg-rose-100 text-rose-700 border-rose-200",     label: "+15 días",     dot: "bg-rose-500"   },
};

//  New Petition Dialog 

interface NuevaPeticionDialogProps {
  onCreated: () => void;
}

function NuevaPeticionDialog({ onCreated }: NuevaPeticionDialogProps) {
  const [open, setOpen] = useState(false);
  const [peticion, setPeticion] = useState("");
  const [autor, setAutor] = useState("");
  const [categoria, setCategoria] = useState("general");
  const [privada, setPrivada] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/oraciones", {
        peticion,
        autor,
        categoria,
        privada,
        estado: "pendiente",
        contadorOraciones: 0,
      });
      return res.json();
    },
    onSuccess: () => {
      setOpen(false);
      setPeticion("");
      setAutor("");
      setCategoria("general");
      setPrivada(false);
      onCreated();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white">
          <PlusIcon className="h-4 w-4 mr-2" />
          Nueva Petición
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Nueva Petición de Oración</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="autor">Nombre del solicitante</Label>
            <Input
              id="autor"
              placeholder="Ej. María Rodríguez"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="peticion">Petición de oración</Label>
            <Textarea
              id="peticion"
              placeholder="Describe la petición..."
              rows={4}
              value={peticion}
              onChange={(e) => setPeticion(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Categoría</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Visibilidad</Label>
              <Select
                value={privada ? "privada" : "publica"}
                onValueChange={(v) => setPrivada(v === "privada")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publica">Pública</SelectItem>
                  <SelectItem value="privada">Privada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            disabled={!peticion.trim() || !autor.trim() || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

//  Peticion Card 

interface PeticionCardProps {
  peticion: PeticionOracion;
  onRefresh: () => void;
}

function PeticionCard({ peticion, onRefresh }: PeticionCardProps) {
  const [orando, setOrando] = useState(false);
  const tier = getEdadTier(peticion.creadoEn);
  const edad = EDAD_STYLES[tier];

  const orarMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/oraciones/${peticion.id}/orar`);
      return res.json();
    },
    onSuccess: () => {
      setOrando(true);
      onRefresh();
    },
  });

  const estadoMutation = useMutation({
    mutationFn: async (nuevoEstado: string) => {
      const res = await apiRequest("PUT", `/api/oraciones/${peticion.id}`, {
        estado: nuevoEstado,
      });
      return res.json();
    },
    onSuccess: onRefresh,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/oraciones/${peticion.id}`);
    },
    onSuccess: onRefresh,
  });

  const isEnOracion = peticion.estado === "en-oracion";
  const isRespondida = peticion.estado === "respondida";

  return (
    <Card className={`group relative flex flex-col overflow-hidden border transition-all duration-200
      ${edad.card}
      ${isEnOracion ? "shadow-md shadow-blue-200 ring-1 ring-blue-300" : ""}
      ${isRespondida ? "shadow-md shadow-emerald-200 ring-1 ring-emerald-300" : ""}
      hover:shadow-lg`}>

      {/* Pulsing top accent bar — En Oración */}
      {isEnOracion && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse" />
      )}

      {/* Corner ribbon — Respondida */}
      {isRespondida && (
        <div className="absolute top-4 -right-7 rotate-45 bg-emerald-500 text-white text-[10px] font-bold px-9 py-0.5 shadow-sm tracking-wide">
          ✓ RESPONDIDA
        </div>
      )}

      {/* Floating sparkle — Respondida */}
      {isRespondida && (
        <span className="absolute top-2 left-2 text-base animate-bounce select-none pointer-events-none">✨</span>
      )}

      <CardContent className="flex-1 p-5">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex items-center flex-wrap gap-1.5">
            {estadoBadge(peticion.estado)}

            {/* Pulsing ping dot — En Oración */}
            {isEnOracion && (
              <span className="relative flex h-2.5 w-2.5 self-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
              </span>
            )}

            {peticion.privada && (
              <Badge
                variant="outline"
                className="bg-neutral-100 text-neutral-500 border-neutral-200 text-xs"
              >
                 Privada
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontalIcon className="h-4 w-4 text-neutral-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {ESTADOS.map((e) => (
                <DropdownMenuItem
                  key={e.value}
                  disabled={peticion.estado === e.value || estadoMutation.isPending}
                  onClick={() => estadoMutation.mutate(e.value)}
                >
                  Marcar como "{e.label}"
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => deleteMutation.mutate()}
              >
                <TrashIcon className="h-3.5 w-3.5 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-2">{categoriaBadge(peticion.categoria)}</div>

        <p className="text-neutral-800 text-sm leading-relaxed mb-4 line-clamp-4">
          {peticion.peticion}
        </p>

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-medium text-neutral-500">{peticion.autor}</span>
          <span>{relativeTime(peticion.creadoEn)}</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-neutral-100/80 bg-white/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
            <span className="text-lg"></span>
            <span className="font-semibold text-neutral-700">{peticion.contadorOraciones}</span>
            <span className="text-xs">oraciones</span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${edad.chip}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${edad.dot}`} />
            {edad.label}
          </span>
        </div>

        <Button
          size="sm"
          variant={orando ? "default" : "outline"}
          disabled={orarMutation.isPending}
          onClick={() => orarMutation.mutate()}
          className={
            orando
              ? "bg-blue-500 hover:bg-blue-600 text-white border-0"
              : "text-blue-600 border-blue-200 hover:bg-blue-50"
          }
        >
           {orando ? "Orando!" : "Orar"}
        </Button>
      </CardFooter>
    </Card>
  );
}

//  Stats Banner 

function StatsBanner({ peticiones }: { peticiones: PeticionOracion[] }) {
  const total = peticiones.length;
  const pendientes = peticiones.filter((p) => p.estado === "pendiente").length;
  const enOracion = peticiones.filter((p) => p.estado === "en-oracion").length;
  const respondidas = peticiones.filter((p) => p.estado === "respondida").length;
  const totalOraciones = peticiones.reduce((a, p) => a + p.contadorOraciones, 0);

  const stats = [
    { label: "Total", value: total, icon: "", color: "text-neutral-700" },
    { label: "Pendientes", value: pendientes, icon: "", color: "text-amber-600" },
    { label: "En Oración", value: enOracion, icon: "", color: "text-blue-600" },
    { label: "Respondidas", value: respondidas, icon: "", color: "text-emerald-600" },
    { label: "Intercesiones", value: totalOraciones, icon: "", color: "text-rose-500" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm"
        >
          <span className="text-2xl mb-1">{s.icon}</span>
          <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
          <span className="text-xs text-neutral-400 mt-0.5">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

//  Main Page 

export default function OracionesPage() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todas");

  const { data: peticiones = [], isLoading } = useQuery<PeticionOracion[]>({
    queryKey: ["/api/oraciones"],
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["/api/oraciones"] });

  const filtered = peticiones.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      p.peticion.toLowerCase().includes(q) ||
      p.autor.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q);

    const matchesTab =
      activeTab === "todas" ||
      (activeTab === "pendientes" && p.estado === "pendiente") ||
      (activeTab === "en-oracion" && p.estado === "en-oracion") ||
      (activeTab === "respondidas" && p.estado === "respondida");

    return matchesSearch && matchesTab;
  });

  return (
    <>
      <Helmet>
        <title>Peticiones de Oración - Iglesia Admin</title>
        <meta
          name="description"
          content="Gestión de peticiones de oración  Ver, orar y administrar las peticiones de la congregación"
        />
      </Helmet>

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Peticiones de Oración</h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              Intercede por los miembros de la congregación
            </p>
          </div>
          <NuevaPeticionDialog onCreated={refresh} />
        </div>

        {!isLoading && <StatsBanner peticiones={peticiones} />}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Buscar por petición, autor o categoría..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              <TabsTrigger value="en-oracion">En Oración</TabsTrigger>
              <TabsTrigger value="respondidas">Respondidas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </CardContent>
                <div className="border-t bg-neutral-50 px-5 py-3 flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-20 rounded-md" />
                </div>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4"></span>
            <p className="text-neutral-500 font-medium">No hay peticiones de oración</p>
            <p className="text-neutral-400 text-sm mt-1">
              {searchTerm
                ? "Prueba con otros términos de búsqueda"
                : "Crea la primera petición con el botón 'Nueva Petición'"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <PeticionCard key={p.id} peticion={p} onRefresh={refresh} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <p className="text-xs text-neutral-400 mt-6 text-center">
            Mostrando {filtered.length} de {peticiones.length} peticiones
          </p>
        )}
      </div>
    </>
  );
}
