/**
 * Role color utilities for consistent color scheme across the application
 *
 * Color Scheme:
 * - Siswa (Student): Blue
 * - Guru (Teacher): Green
 * - Admin: Purple
 */

export const ROLE_COLORS = {
  // Siswa/Student colors
  siswa: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-blue-100 text-blue-800',
    badge:
      'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-300',
    text: 'text-blue-600',
    border: 'border-blue-200',
    icon: 'text-blue-600',
  },
  student: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-blue-100 text-blue-800',
    badge:
      'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-300',
    text: 'text-blue-600',
    border: 'border-blue-200',
    icon: 'text-blue-600',
  },

  // Guru/Teacher colors
  guru: {
    primary: 'bg-green-600 hover:bg-green-700',
    secondary: 'bg-green-100 text-green-800',
    badge:
      'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-300',
    text: 'text-green-600',
    border: 'border-green-200',
    icon: 'text-green-600',
  },
  teacher: {
    primary: 'bg-green-600 hover:bg-green-700',
    secondary: 'bg-green-100 text-green-800',
    badge:
      'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-300',
    text: 'text-green-600',
    border: 'border-green-200',
    icon: 'text-green-600',
  },

  // Admin colors
  admin: {
    primary: 'bg-purple-600 hover:bg-purple-700',
    secondary: 'bg-purple-100 text-purple-800',
    badge:
      'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-300',
    text: 'text-purple-600',
    border: 'border-purple-200',
    icon: 'text-purple-600',
  },

  // Other roles (fallback to existing colors)
  staff: {
    primary: 'bg-purple-600 hover:bg-purple-700',
    secondary: 'bg-purple-100 text-purple-800',
    badge:
      'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-300',
    text: 'text-purple-600',
    border: 'border-purple-200',
    icon: 'text-purple-600',
  },
  principal: {
    primary: 'bg-yellow-600 hover:bg-yellow-700',
    secondary: 'bg-yellow-100 text-yellow-800',
    badge:
      'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
  },
  coordinator: {
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    secondary: 'bg-indigo-100 text-indigo-800',
    badge:
      'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-300',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    icon: 'text-indigo-600',
  },
};

/**
 * Get role colors by type
 * @param {string} role - The user role
 * @param {string} type - The color type (primary, secondary, badge, text, border, icon)
 * @returns {string} CSS classes for the color type
 */
export const getRoleColor = (role, type = 'primary') => {
  const normalizedRole = role?.toLowerCase() || 'student';
  const roleColors = ROLE_COLORS[normalizedRole] || ROLE_COLORS.student;
  return roleColors[type] || roleColors.primary;
};

/**
 * Get role badge colors (for Header, Users page, etc.)
 * @param {string} role - The user role
 * @returns {string} CSS classes for badge styling
 */
export const getRoleBadgeColor = (role) => {
  return `${getRoleColor(role, 'badge')} shadow-lg hover:shadow-xl`;
};

/**
 * Get role secondary colors (for list items, cards, etc.)
 * @param {string} role - The user role
 * @returns {string} CSS classes for secondary styling
 */
export const getRoleSecondaryColor = (role) => {
  return getRoleColor(role, 'secondary');
};

/**
 * Get role primary button colors
 * @param {string} role - The user role
 * @returns {string} CSS classes for primary button styling
 */
export const getRolePrimaryColor = (role) => {
  return getRoleColor(role, 'primary');
};

/**
 * Get role icon colors
 * @param {string} role - The user role
 * @returns {string} CSS classes for icon styling
 */
export const getRoleIconColor = (role) => {
  return getRoleColor(role, 'icon');
};

/**
 * Get role text colors
 * @param {string} role - The user role
 * @returns {string} CSS classes for text styling
 */
export const getRoleTextColor = (role) => {
  return getRoleColor(role, 'text');
};

export default {
  ROLE_COLORS,
  getRoleColor,
  getRoleBadgeColor,
  getRoleSecondaryColor,
  getRolePrimaryColor,
  getRoleIconColor,
  getRoleTextColor,
};
