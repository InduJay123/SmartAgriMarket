import { UserRole } from '../types/auth';
import { Sprout, ShoppingCart, Shield } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  const roles: { value: UserRole; label: string; icon: typeof Sprout }[] = [
    { value: 'farmer', label: 'Farmer', icon: Sprout },
    { value: 'buyer', label: 'Buyer', icon: ShoppingCart },
    { value: 'admin', label: 'Admin', icon: Shield },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {roles.map((role) => {
        const Icon = role.icon;
        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onRoleChange(role.value)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
              selectedRole === role.value
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-300 bg-white text-gray-600 hover:border-green-400'
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-sm font-medium">{role.label}</span>
          </button>
        );
      })}
    </div>
  );
}
