import React from 'react';
import { useLocation } from "wouter";

export default function AdventistaSidebar() {
  const [location, setLocation] = useLocation();

  const adminUser = {
    name: "Pastor Keni",
    role: "Administrador",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwm93fwjovHMblv_ofyirT2Cm5zJQHMeT6Q&s"
  };

  // Determines if a nav item is active
  const isActive = (path: string) => {
    if (path === "/dashboard" && location === "/") return true;
    if (path === "/cursos") return location.startsWith("/cursos");
    return location === path;
  };

  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 shadow-xl z-10">
      {/* Logo Header */}
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg p-1.5">
            <img 
              src="https://i.pinimg.com/736x/5a/75/b4/5a75b4878be3363d62de6a61e232f893.jpg" 
              alt="Logo Iglesia Adventista" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Iglesia Adventista</h1>
            <p className="text-[11px] text-slate-400">Panel Administrativo</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="mx-4 mt-4 mb-4">
        <div className="flex items-center space-x-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 backdrop-blur-sm">
          <div className="relative">
            <img 
              src={adminUser.avatar} 
              alt="Admin User" 
              className="w-11 h-11 rounded-full object-cover border-2 border-slate-600/50" 
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-white text-sm truncate">{adminUser.name}</h2>
            <p className="text-[11px] text-slate-400 font-medium">{adminUser.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <nav className="space-y-1">
          <div className="mb-3">
            <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Principal
            </h3>
            <div className="space-y-0.5">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/dashboard"); }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive("/dashboard") 
                    ? 'bg-slate-700/60 text-white border border-slate-600/60 shadow-md' 
                    : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                <i className={`ri-dashboard-3-line text-lg ${isActive("/dashboard") ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`}></i>
                <span className="font-medium text-sm">Dashboard</span>
                {isActive("/dashboard") && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full ml-auto animate-pulse"></div>}
              </a>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Ministerios
            </h3>
            <div className="space-y-0.5">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/miembros"); }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive("/miembros") 
                    ? 'bg-slate-700/60 text-white border border-slate-600/60 shadow-md' 
                    : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                <i className={`ri-team-line text-lg ${isActive("/miembros") ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`}></i>
                <span className="font-medium text-sm">Miembros</span>
              </a>

              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/cursos"); }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive("/cursos") 
                    ? 'bg-slate-700/60 text-white border border-slate-600/60 shadow-md' 
                    : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                <i className={`ri-book-open-line text-lg ${isActive("/cursos") ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`}></i>
                <span className="font-medium text-sm">Programas</span>
              </a>

              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/eventos"); }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive("/eventos") 
                    ? 'bg-slate-700/60 text-white border border-slate-600/60 shadow-md' 
                    : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                <i className={`ri-calendar-event-line text-lg ${isActive("/eventos") ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`}></i>
                <span className="font-medium text-sm">Eventos</span>
              </a>

              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/foros"); }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive("/foros") 
                    ? 'bg-slate-700/60 text-white border border-slate-600/60 shadow-md' 
                    : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                <i className={`ri-discuss-line text-lg ${isActive("/foros") ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`}></i>
                <span className="font-medium text-sm">Foros</span>
              </a>

              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/oraciones"); }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive("/oraciones") 
                    ? 'bg-slate-700/60 text-white border border-slate-600/60 shadow-md' 
                    : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                <i className={`ri-heart-3-line text-lg ${isActive("/oraciones") ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`}></i>
                <span className="font-medium text-sm">Peticiones</span>
              </a>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Administración
            </h3>
            <div className="space-y-0.5">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/meditaciones"); }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive("/meditaciones") 
                    ? 'bg-slate-700/60 text-white border border-slate-600/60 shadow-md' 
                    : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                <i className={`ri-leaf-line text-lg ${isActive("/meditaciones") ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`}></i>
                <span className="font-medium text-sm">Meditaciones</span>
              </a>

              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/donaciones"); }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive("/donaciones") 
                    ? 'bg-slate-700/60 text-white border border-slate-600/60 shadow-md' 
                    : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                <i className={`ri-hand-coin-line text-lg ${isActive("/donaciones") ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`}></i>
                <span className="font-medium text-sm">Donaciones</span>
              </a>

              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/admin/jobs"); }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive("/admin/jobs") 
                    ? 'bg-slate-700/60 text-white border border-slate-600/60 shadow-md' 
                    : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                <i className={`ri-briefcase-line text-lg ${isActive("/admin/jobs") ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`}></i>
                <span className="font-medium text-sm">Empleos</span>
              </a>

              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/configuracion"); }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive("/configuracion") 
                    ? 'bg-slate-700/60 text-white border border-slate-600/60 shadow-md' 
                    : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                <i className={`ri-settings-3-line text-lg ${isActive("/configuracion") ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`}></i>
                <span className="font-medium text-sm">Configuración</span>
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Footer with Church Info */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-md">
            <i className="ri-church-line text-white text-sm"></i>
          </div>
          <p className="text-[11px] text-slate-400">
            Iglesia Adventista del
          </p>
          <p className="text-[11px] text-white font-semibold">
            Séptimo Día
          </p>
        </div>
      </div>
    </aside>
  );
}