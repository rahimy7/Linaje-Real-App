// AdminForosPage.tsx
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Users, MessageSquare, Calendar, Filter, MoreHorizontal, TrendingUp, Activity, BookOpen, Hash } from 'lucide-react';
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";

// Tipos de datos
interface Category {
  id: number;
  name: string;
  description: string;
  type: 'thematic' | 'course';
  icon: string;
  color: string;
  subforums: number;
  threads: number;
  posts: number;
  members: number;
  isActive: boolean;
  createdAt: string;
  moderators: string[];
  schedule?: string;
  courseCode?: string;
}

interface FormData {
  name: string;
  description: string;
  type: 'thematic' | 'course';
  icon: string;
}

interface Subforum {
  id: number;
  name: string;
  categoryId: number;
  threads: number;
  posts: number;
  members: number;
}

export default function AdminForosPage() {
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    type: 'thematic',
    icon: '🧠'
  });

  // Fetch data from API
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/forum/categories"],
  });

  const { data: subforums = [], isLoading: isLoadingSubforums } = useQuery<Subforum[]>({
    queryKey: ["/api/forum/subforums"],
  });

  // Calculate stats from real data
  const forumStats = {
    totalCategories: categories.length,
    totalSubforums: subforums.length,
    totalThreads: categories.reduce((sum, cat) => sum + (cat.threads || 0), 0),
    totalPosts: categories.reduce((sum, cat) => sum + (cat.posts || 0), 0),
    activeUsers: categories.reduce((sum, cat) => sum + (cat.members || 0), 0),
    newUsersToday: 0, // No disponible aún
    postsToday: 0, // No disponible aún
    threadsToday: 0 // No disponible aún
  };

  const filteredCategories = categories.filter((category: Category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || category.type === filterType;
    return matchesSearch && matchesType;
  });

  interface StatCardProps {
    title: string;
    value: number;
    change?: number;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color = "text-blue-600" }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{change} hoy</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gray-50 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onViewDetails: (category: Category) => void;
  }

  const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onViewDetails }) => (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: category.color + '20' }}
            >
              {category.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  category.type === 'course' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {category.type === 'course' ? 'Curso' : 'Temático'}
                </span>
                <span className={`w-2 h-2 rounded-full ${
                  category.isActive ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onViewDetails(category)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onEdit(category)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{category.subforums}</p>
            <p className="text-xs text-gray-500">Subforos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{category.threads}</p>
            <p className="text-xs text-gray-500">Temas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{category.posts}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{category.members}</p>
            <p className="text-xs text-gray-500">Miembros</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Moderadores: {category.moderators.join(', ')}</span>
          {category.schedule && (
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {category.schedule}
            </span>
          )}
          {category.courseCode && (
            <span className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              {category.courseCode}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const handleInputChange = (field: keyof FormData, value: string | 'thematic' | 'course') => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Creating category:', formData);
    setShowCreateModal(false);
    setFormData({ name: '', description: '', type: 'thematic', icon: '🧠' });
  };

  const CreateCategoryModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Crear Nueva Categoría</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              rows={3} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select 
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as 'thematic' | 'course')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="thematic">Temático</option>
                <option value="course">Curso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
              <input 
                value={formData.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="🧠" 
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Categoría
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Administración de Foros - MiApp Admin</title>
        <meta name="description" content="Gestiona categorías, subforos y configuraciones de la comunidad" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Administración de Foros</h1>
              <p className="text-gray-600">Gestiona categorías, subforos y configuraciones de la comunidad</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Resumen', icon: Activity },
              { id: 'categories', label: 'Categorías', icon: Hash },
              { id: 'subforums', label: 'Subforos', icon: MessageSquare },
              { id: 'moderation', label: 'Moderación', icon: Eye }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Categorías" 
                  value={forumStats.totalCategories} 
                  icon={Hash}
                  color="text-purple-600"
                />
                <StatCard 
                  title="Total Subforos" 
                  value={forumStats.totalSubforums} 
                  icon={MessageSquare}
                  color="text-blue-600"
                />
                <StatCard 
                  title="Temas Activos" 
                  value={forumStats.totalThreads} 
                  change={forumStats.threadsToday}
                  icon={Users}
                  color="text-green-600"
                />
                <StatCard 
                  title="Usuarios Activos" 
                  value={forumStats.activeUsers} 
                  change={forumStats.newUsersToday}
                  icon={Activity}
                  color="text-orange-600"
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  {[
                    { action: "Nueva categoría creada", item: "Meditación Avanzada", time: "Hace 2 horas", type: "success" },
                    { action: "Subforo moderado", item: "Depresión - Post eliminado", time: "Hace 4 horas", type: "warning" },
                    { action: "Nuevo moderador asignado", item: "Dr. García en Ansiedad", time: "Hace 6 horas", type: "info" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.item}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'categories' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar categorías..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="thematic">Temáticos</option>
                    <option value="course">Cursos</option>
                  </select>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4 mr-2" />
                    Más filtros
                  </button>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCategories.map((category: Category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category}
                    onEdit={(cat: Category) => console.log('Edit:', cat)}
                    onViewDetails={(cat: Category) => setSelectedCategory(cat)}
                  />
                ))}
              </div>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron categorías</h3>
                  <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'subforums' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Gestión de Subforos</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 font-medium text-gray-700">Nombre</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-700">Categoría</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-700">Temas</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-700">Posts</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-700">Miembros</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subforums.map((subforum) => {
                      const category = categories.find((c: Category) => c.id === subforum.categoryId);
                      return (
                        <tr key={subforum.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6 font-medium text-gray-900">{subforum.name}</td>
                          <td className="py-4 px-6 text-gray-600">{category?.name}</td>
                          <td className="py-4 px-6 text-gray-600">{subforum.threads}</td>
                          <td className="py-4 px-6 text-gray-600">{subforum.posts}</td>
                          <td className="py-4 px-6 text-gray-600">{subforum.members}</td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button className="p-1 text-gray-400 hover:text-blue-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedTab === 'moderation' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Panel de Moderación</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-2">23</div>
                    <div className="text-sm text-gray-600">Posts Pendientes</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-2">8</div>
                    <div className="text-sm text-gray-600">Reportes Abiertos</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">5</div>
                    <div className="text-sm text-gray-600">Moderadores Activos</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Reportes Recientes</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { tipo: "Contenido inapropiado", subforo: "Ansiedad", reportado: "Hace 2 horas", estado: "Pendiente" },
                      { tipo: "Spam", subforo: "Motivación", reportado: "Hace 4 horas", estado: "En revisión" },
                      { tipo: "Acoso", subforo: "Depresión", reportado: "Hace 1 día", estado: "Resuelto" }
                    ].map((reporte, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{reporte.tipo}</div>
                          <div className="text-sm text-gray-600">Subforo: {reporte.subforo} • {reporte.reportado}</div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          reporte.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          reporte.estado === 'En revisión' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {reporte.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {showCreateModal && <CreateCategoryModal />}
      </div>
    </>
  );
}