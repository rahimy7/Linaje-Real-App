import { useLocation } from "wouter";
import { XIcon } from "@/lib/icons";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [location, setLocation] = useLocation();

  const handleNavigation = (path: string) => {
    setLocation(path);
    onClose();
  };

  const adminUser = {
    name: "Pastor Keni",
    role: "Administrador",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwm93fwjovHMblv_ofyirT2Cm5zJQHMeT6Q&s"
  };

  // Determines if a nav item is active
  const isActive = (path: string) => {
    if (path === "/dashboard" && location === "/") return true;
    return location === path;
  };

  return (
    <nav className={`mobile-nav fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 z-30 shadow-xl p-4 lg:hidden flex flex-col ${isOpen ? 'active' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
            <i className="ri-church-line text-white text-sm"></i>
          </div>
          <h1 className="text-base font-bold text-white">Iglesia Adventista</h1>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white focus:outline-none">
          <XIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center space-x-3 mb-6 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
        <img 
          src={adminUser.avatar} 
          alt="Admin User" 
          className="w-10 h-10 rounded-full object-cover border-2 border-slate-600/50" 
        />
        <div>
          <h2 className="font-semibold text-white text-sm">{adminUser.name}</h2>
          <p className="text-xs text-slate-400">{adminUser.role}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavigation("/dashboard"); }}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${isActive("/dashboard") ? 'bg-slate-700/60 text-white border border-slate-600/60' : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'}`}
            >
              <i className="ri-dashboard-line text-lg"></i>
              <span className="text-sm">Dashboard</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavigation("/usuarios"); }}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${isActive("/usuarios") ? 'bg-slate-700/60 text-white border border-slate-600/60' : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'}`}
            >
              <i className="ri-user-line text-lg"></i>
              <span className="text-sm">Usuarios</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavigation("/pedidos"); }}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${isActive("/pedidos") ? 'bg-slate-700/60 text-white border border-slate-600/60' : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'}`}
            >
              <i className="ri-shopping-bag-line text-lg"></i>
              <span className="text-sm">Pedidos</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavigation("/productos"); }}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${isActive("/productos") ? 'bg-slate-700/60 text-white border border-slate-600/60' : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'}`}
            >
              <i className="ri-store-2-line text-lg"></i>
              <span className="text-sm">Productos</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigation("/foros"); }}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${isActive("/foros") ? 'bg-slate-700/60 text-white border border-slate-600/60' : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'}`}
            >
              <i className="ri-discuss-line text-lg"></i>
              <span className="text-sm">Foros</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavigation("/configuracion"); }}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${isActive("/configuracion") ? 'bg-slate-700/60 text-white border border-slate-600/60' : 'hover:bg-slate-700/40 text-slate-300 hover:text-white'}`}
            >
              <i className="ri-settings-3-line text-lg"></i>
              <span className="text-sm">Configuración</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <a 
          href="#" 
          onClick={(e) => e.preventDefault()}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-700/40 text-slate-300 hover:text-white transition-all"
        >
          <i className="ri-logout-box-line text-lg"></i>
          <span className="text-sm">Cerrar sesión</span>
        </a>
      </div>
    </nav>
  );
}
