import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, BookOpen, MessageSquare, Heart, Calendar, 
  TrendingUp, Activity, Zap, PlusCircle, Download,
  BarChart3, PieChart, Award, Clock
} from 'lucide-react';

// Interfaces
interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: 'up' | 'down';
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
}

interface Programa {
  id: number;
  nombre: string;
  publicado: boolean;
  totalDias?: number;
}

interface PeticionOracion {
  id: number;
  estado: string;
  creadoEn?: string;
  cantidadOraciones?: number;
}

interface Category {
  id: number;
  name: string;
}

interface Thread {
  id: number;
  views?: number;
}

interface User {
  id: number;
  createdAt?: string;
}

export default function IglesiaDashboard() {
  // Queries para obtener datos reales de la base de datos
  const { data: programas = [] } = useQuery<Programa[]>({
    queryKey: ['/api/programas'],
    queryFn: async () => {
      const res = await fetch('/api/programas?all=true');
      if (!res.ok) throw new Error('Error al cargar programas');
      return res.json();
    }
  });

  const { data: oraciones = [] } = useQuery<PeticionOracion[]>({
    queryKey: ['/api/oraciones'],
    queryFn: async () => {
      const res = await fetch('/api/oraciones');
      if (!res.ok) throw new Error('Error al cargar oraciones');
      return res.json();
    }
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/forum/categories'],
    queryFn: async () => {
      const res = await fetch('/api/forum/categories');
      if (!res.ok) throw new Error('Error al cargar categorías');
      return res.json();
    }
  });

  const { data: threads = [] } = useQuery<Thread[]>({
    queryKey: ['/api/forum/threads'],
    queryFn: async () => {
      const res = await fetch('/api/forum/threads');
      if (!res.ok) throw new Error('Error al cargar threads');
      return res.json();
    }
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Error al cargar usuarios');
      return res.json();
    }
  });

  // Calcular estadísticas a partir de los datos reales
  const cursosActivos = programas.filter(p => p.publicado).length;
  const cursosTotal = programas.length;
  
  const oracionesPendientes = oraciones.filter(o => o.estado === 'pendiente').length;
  const oracionesAtendidas = oraciones.filter(o => o.estado === 'atendida').length;
  const oracionesTotal = oraciones.length;
  
  const totalInteracciones = threads.reduce((sum, t) => sum + (t.views || 0), 0);
  
  const miembrosTotal = users.length;
  
  // Calcular actividad reciente
  const getRecentActivities = () => {
    const activities: Array<{
      id: string;
      type: string;
      text: string;
      time: string;
      icon: React.ComponentType<{ className?: string }>;
      color: string;
    }> = [];

    // Últimos cursos publicados
    const recentCursos = programas
      .filter(p => p.publicado)
      .slice(-2);
    
    recentCursos.forEach((curso, index) => {
      activities.push({
        id: `curso-${curso.id}`,
        type: 'curso',
        text: `Curso "${curso.nombre}" disponible`,
        time: 'Reciente',
        icon: BookOpen,
        color: 'text-blue-600 bg-blue-100'
      });
    });

    // Últimas oraciones
    const recentOraciones = oraciones.slice(-1);
    if (recentOraciones.length > 0) {
      activities.push({
        id: 'oraciones-recent',
        type: 'oracion',
        text: `${oraciones.slice(-5).length} nuevas peticiones de oración`,
        time: 'Reciente',
        icon: Heart,
        color: 'text-red-600 bg-red-100'
      });
    }

    // Actividad en foros
    if (threads.length > 0) {
      activities.push({
        id: 'foros-recent',
        type: 'foro',
        text: `${threads.length} temas activos en foros`,
        time: 'Actualizado',
        icon: MessageSquare,
        color: 'text-purple-600 bg-purple-100'
      });
    }

    return activities.slice(0, 4);
  };

  const recentActivity = getRecentActivities();

  const formatDate = (): string => {
    return new Date().toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

 const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, change, icon: Icon, color, trend = 'up' }) => (
  <div className="dashboard-stat-card bg-white rounded-xl shadow-sm p-4 border border-slate-200/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color} shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {change && (
        <div className={`flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-full ${trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
          <TrendingUp className={`w-3 h-3 mr-0.5 ${trend === 'down' ? 'rotate-180' : ''}`} />
          <span>{change}%</span>
        </div>
      )}
    </div>
    <div>
      <h3 className="text-xl font-bold text-slate-800 mb-0.5">{value.toLocaleString()}</h3>
      <p className="text-slate-600 text-xs font-semibold">{title}</p>
      {subtitle && (
        <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);

  const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon: Icon, color, onClick }) => (
    <button 
      onClick={onClick}
      className="adventist-card group text-left hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
    >
      <div className="flex items-center space-x-3 p-3">
        <div className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-slate-800">{title}</h4>
          <p className="text-xs text-slate-600">{description}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="p-4 md:p-6 space-y-5 bg-gray-50 min-h-screen">
      {/* Header con estilo Adventista */}
      <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-xl p-5 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
           
            <div>
              <h1 className="text-2xl font-bold">¡Bienvenido, Pr. Keni!</h1>
              <p className="text-slate-200">Panel Administrativo - {formatDate()}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-medium transition-all flex items-center border border-white/20">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
            <button className="bg-white text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg font-medium transition-all flex items-center shadow">
              <PlusCircle className="w-4 h-4 mr-2" />
              Nuevo
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Miembros"
          value={miembrosTotal}
          subtitle={`Usuarios registrados`}
          change={0}
          icon={Users}
          color="bg-gradient-to-br from-slate-600 to-slate-700"
        />
        <StatCard
          title="Cursos Activos"
          value={cursosActivos}
          subtitle={`${cursosTotal} cursos en total`}
          change={0}
          icon={BookOpen}
          color="bg-gradient-to-br from-blue-600 to-blue-700"
        />
        <StatCard
          title="Interacciones Foro"
          value={totalInteracciones}
          subtitle={`${threads.length} temas activos`}
          change={0}
          icon={MessageSquare}
          color="bg-gradient-to-br from-cyan-600 to-cyan-700"
        />
        <StatCard
          title="Peticiones Oración"
          value={oracionesTotal}
          subtitle={`${oracionesPendientes} pendientes`}
          change={0}
          icon={Heart}
          color="bg-gradient-to-br from-red-600 to-red-700"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Categorías Foro"
          value={categories.length}
          subtitle={`Comunidades activas`}
          change={0}
          icon={MessageSquare}
          color="bg-gradient-to-br from-emerald-600 to-emerald-700"
        />
        <StatCard
          title="Oraciones Atendidas"
          value={oracionesAtendidas}
          subtitle={`${((oracionesAtendidas / Math.max(oracionesTotal, 1)) * 100).toFixed(0)}% completadas`}
          change={0}
          icon={Award}
         color="bg-gradient-to-br from-amber-600 to-amber-700"
        />
        <StatCard
          title="Cursos Totales"
          value={cursosTotal}
          subtitle={`${cursosActivos} publicados`}
          change={0}
          icon={BookOpen}
          color="bg-gradient-to-br from-indigo-600 to-indigo-700"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Participación por Ministerio */}
        <div className="adventist-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Participación por Ministerio</h3>
            <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
              <BarChart3 className="w-4 h-4 text-white" />
              </div>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Cursos Bíblicos', value: cursosActivos, max: Math.max(cursosTotal, cursosActivos), color: 'bg-gradient-to-r from-blue-600 to-blue-700' },
              { name: 'Categorías Foro', value: categories.length, max: Math.max(categories.length, 10), color: 'bg-gradient-to-r from-cyan-600 to-cyan-700' },
              { name: 'Temas Activos', value: threads.length, max: Math.max(threads.length, 50), color: 'bg-gradient-to-r from-emerald-600 to-emerald-700' },
              { name: 'Peticiones Oración', value: oracionesTotal, max: Math.max(oracionesTotal, 50), color: 'bg-gradient-to-r from-red-600 to-red-700' }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">{item.name}</span>
                  <span className="text-slate-600 font-medium">{item.value}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${item.color} transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="adventist-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Actividad Reciente</h3>
            <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 group">
                <div className={`p-2 rounded-lg ${activity.color} group-hover:scale-110 transition-transform duration-200`}>
                  <activity.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800">{activity.text}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="adventist-card p-5">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Acciones Rápidas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            title="Nuevo Curso"
            description="Crear curso bíblico"
            icon={BookOpen}
            color="bg-gradient-to-br from-blue-600 to-blue-700"
            onClick={() => console.log('Crear curso')}
          />
          <QuickAction
            title="Agendar Seminario"
            description="Programar evento"
            icon={Calendar}
            color="bg-gradient-to-br from-emerald-600 to-emerald-700"
            onClick={() => console.log('Agendar seminario')}
          />
          <QuickAction
            title="Revisar Oraciones"
            description="Atender peticiones"
            icon={Heart}
            color="bg-gradient-to-br from-red-600 to-red-700"
            onClick={() => console.log('Revisar oraciones')}
          />
          <QuickAction
            title="Moderar Foros"
            description="Gestionar comunidad"
            icon={MessageSquare}
            color="bg-gradient-to-br from-cyan-600 to-cyan-700"
            onClick={() => console.log('Moderar foros')}
          />
        </div>
      </div>

      {/* Métricas Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Estadísticas de Cursos */}
        <div className="adventist-card p-5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Estadísticas de Cursos</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-700">Cursos Publicados</span>
              <div className="flex items-center">
                <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full shadow-sm" 
                    style={{width: `${(cursosActivos / Math.max(cursosTotal, 1)) * 100}%`}}></div>
                </div>
                <span className="text-xs font-bold text-slate-800">{cursosActivos}/{cursosTotal}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-700">Categorías Foro</span>
              <div className="flex items-center">
                <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                  <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 h-2 rounded-full shadow-sm" 
                    style={{width: `${Math.min((categories.length / 10) * 100, 100)}%`}}></div>
                </div>
                <span className="text-xs font-bold text-slate-800">{categories.length}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-700">Temas Activos</span>
              <div className="flex items-center">
                <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 h-2 rounded-full shadow-sm" 
                    style={{width: `${Math.min((threads.length / 50) * 100, 100)}%`}}></div>
                </div>
                <span className="text-xs font-bold text-slate-800">{threads.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas de Oración */}
        <div className="adventist-card p-5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Peticiones de Oración</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg border border-amber-200/60">
              <span className="text-xs font-medium text-slate-700">Pendientes</span>
              <span className="text-base font-bold text-amber-600">{oracionesPendientes}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg border border-emerald-200/60">
              <span className="text-xs font-medium text-slate-700">Atendidas</span>
              <span className="text-base font-bold text-emerald-600">{oracionesAtendidas}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg border border-blue-200/60">
              <span className="text-xs font-medium text-slate-700">Total</span>
              <span className="text-base font-bold text-blue-600">{oracionesTotal}</span>
            </div>
          </div>
        </div>

        {/* Resumen General */}
        <div className="adventist-card p-5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Resumen General</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="text-xs font-medium text-slate-700">Miembros totales</span>
              <span className="text-base font-bold text-slate-600">{miembrosTotal}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg border border-blue-200/60">
              <span className="text-xs font-medium text-slate-700">Cursos publicados</span>
              <span className="text-base font-bold text-blue-600">{cursosActivos}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-purple-50 rounded-lg border border-purple-200/60">
              <span className="text-xs font-medium text-slate-700">Temas en foros</span>
              <span className="text-base font-bold text-purple-600">{threads.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}