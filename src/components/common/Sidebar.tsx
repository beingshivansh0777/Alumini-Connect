import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageCircle, 
  DollarSign, 
  BarChart, 
  UserCheck, 
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  user: User;
}

interface SubmenuItem {
  id: string;
  label: string;
  href: string;
}

interface BaseMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
}

interface MenuItemWithSubmenu extends BaseMenuItem {
  hasSubmenu: true;
  submenu: SubmenuItem[];
}

interface MenuItemWithoutSubmenu extends BaseMenuItem {
  hasSubmenu?: false;
  submenu?: undefined;
}

type MenuItem = MenuItemWithSubmenu | MenuItemWithoutSubmenu;

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getMenuItems = (): MenuItem[] => {
    const commonItems: MenuItem[] = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, href: '#' },
      { id: 'events', label: 'Events', icon: Calendar, href: '#' },
    ];

    switch (user.role) {
      case 'student':
        return [
          ...commonItems,
          { id: 'directory', label: 'Alumni Directory', icon: Users, href: '#' },
          { id: 'mentorship', label: 'Find Mentors', icon: MessageCircle, href: '#' },
        ];
      
      case 'alumni':
        return [
          ...commonItems,
          { id: 'profile', label: 'My Profile', icon: UserCheck, href: '#' },
          { id: 'directory', label: 'Alumni Directory', icon: Users, href: '#' },
          { id: 'mentorship', label: 'Mentorship', icon: MessageCircle, href: '#' },
          { id: 'donations', label: 'Donate', icon: DollarSign, href: '#' },
        ];
      
      case 'admin':
        return [
          ...commonItems,
          { 
            id: 'management', 
            label: 'Management', 
            icon: Settings, 
            hasSubmenu: true,
            submenu: [
              { id: 'alumni-approval', label: 'Alumni Approval', href: '#' },
              { id: 'event-management', label: 'Event Management', href: '#' },
              { id: 'mentorship-tracking', label: 'Mentorship Tracking', href: '#' },
            ]
          },
          { id: 'analytics', label: 'Analytics', icon: BarChart, href: '#' },
          { id: 'donations', label: 'Donations', icon: DollarSign, href: '#' },
        ];
      
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.hasSubmenu ? (
              <div>
                <button
                  onClick={() => toggleSection(item.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {expandedSections.includes(item.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {expandedSections.includes(item.id) && item.submenu && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveSection(subItem.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          activeSection === subItem.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};