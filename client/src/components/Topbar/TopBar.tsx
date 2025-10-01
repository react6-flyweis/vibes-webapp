import React, { useState } from "react";
import { Home, Rocket, Briefcase, Building2, Menu, X } from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  dropdown?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, dropdown }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
      {icon}
      <span className="text-sm font-medium text-gray-900">{label}</span>
      {dropdown && (
        <svg
          className="w-3 h-3 text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
        </svg>
      )}
    </div>
  );
};

const Topbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
<nav className="w-full h-16 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700shadow p-3">
  <div className="flex items-center justify-between max-w-7xl mx-auto h-full">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 21C12 21 4 13.75 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.09C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.75 16 21 16 21H12Z"
          />
        </svg>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Vibes
      </span>
    </div>

    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-6">
      <NavItem icon={<Home size={18} />} label="Home" />
      <NavItem icon={<Rocket size={18} />} label="VibesLaunchFund" dropdown />
      <NavItem icon={<Briefcase size={18} />} label="Business Tools" dropdown />
      <NavItem icon={<Building2 size={18} />} label="Enterprise" dropdown />
    </div>

    {/* Mobile Hamburger */}
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  </div>

  {/* Mobile Dropdown Menu */}
  {isOpen && (
    <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-start p-4 space-y-3 md:hidden z-50">
      <NavItem icon={<Home size={18} />} label="Home" />
      <NavItem icon={<Rocket size={18} />} label="VibesLaunchFund" dropdown />
      <NavItem icon={<Briefcase size={18} />} label="Business Tools" dropdown />
      <NavItem icon={<Building2 size={18} />} label="Enterprise" dropdown />
    </div>
  )}
</nav>

  );
};

export default Topbar;
