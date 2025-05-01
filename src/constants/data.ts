import { NavItem } from 'types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Users',
    url: '/dashboard/user',
    icon: 'user',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Upload',
    url: '/dashboard/upload',
    icon: 'upload',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  // {
  //   title: 'Query',
  //   url: '/dashboard/query',
  //   icon: 'binoculars',
  //   shortcut: ['p', 'p'],
  //   isActive: false,
  //   items: [] // No child items
  // },
  // {
  //   title: 'Product',
  //   url: '/dashboard/product',
  //   icon: 'product',
  //   shortcut: ['p', 'p'],
  //   isActive: false,
  //   items: [] // No child items
  // },
  {
    title: 'Partner',
    url: '/dashboard/partner',
    icon: 'handshake',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Trunk',
    url: '/dashboard/trunk',
    icon: 'cloud',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  }

  // {
  //   title: 'Account',
  //   url: '#', // Placeholder as there is no direct link for the parent
  //   icon: 'billing',
  //   isActive: true,

  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/dashboard/profile',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     }
  //   ]
  // },
];

export type Partner = {
  id?: number;
  partner_name?: string;
  description?: string;
  currency?: string;
  country?: string;
};

export type User = {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  isBlocked?: boolean;
};

export type Trunk = {
  id: number;
  name: string;
  description?: string | null;
  partnerId: number;
};

export type FileUpload = {
  id?: number;
  name: string;
  path: string;
  file?: File | null;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
};
