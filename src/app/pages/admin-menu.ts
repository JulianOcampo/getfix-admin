import { NbMenuItem } from '@nebular/theme';

export const ADMIN_ITEMS: NbMenuItem[] = [
  {
    title: 'GETFIX-APP',
    group: true,
  },
  {
    title: 'Getfix-Menu',
    icon: 'keypad-outline',
    children: [
      {
        title:'Categories',
        link: '/pages/get-fix-menu/categories'
      },
      {
        title:'Brands',
        link:'/pages/get-fix-menu/brands'
      },
      {
        title:'Models',
        link:'/pages/get-fix-menu/models'
      }
    ]
  },
  {
    title: 'Getfix-Courses',
    icon: 'edit-2-outline',
    children: [
      {
        title:'Manage',
        link: '/pages/get-fix-courses/manage',
      },
      {
        title:'Configurations',
        link:'/pages/get-fix-courses/configurations'
      },
    ]
  },
  {
    title: 'GETFIX-USERS',
    group: true,
  },
];
