import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-home'
  },

  {
    name: 'Main Stack',
    url: '/main-stock',
    icon: 'icon-diamond',
    children: [
      {
        name: 'Stock List',
        url: '/main-stock/stock-list',
        icon: 'icon-diamond'
      },
      {
        name: 'Add New Item',
        url: '/main-stock/add-new-item',
        icon: 'icon-diamond'
      },
      {
        name: 'Transfer',
        url: '/main-stock/transfer',
        icon: 'icon-diamond'
      }
    ]
  },
  {
    name: 'Sales',
    url: '/sales',
    icon: 'icon-basket-loaded',
    children: [
      {
        name: 'Sales List',
        url: '/sales/sales-list',
        icon: 'icon-basket-loaded'
      },
      {
        name: 'Make New Sale',
        url: '/sales/make-new-sale',
        icon: 'icon-basket-loaded'
      },
      {
        name: 'Return',
        url: '/sales/return',
        icon: 'icon-basket-loaded'
      },
      {
        name: 'Sale Box',
        url: '/sales/safe-box',
        icon: 'icon-basket-loaded',
        children: [
          {
            name: 'Sale Box List',
            url: '/sales/safe-box-list',
            icon: 'icon-basket-loaded'
          },
          {
            name: 'Sale Box Action',
            url: '/sales/safe-box-action',
            icon: 'icon-basket-loaded'
          }
        ]
      }
    ]
  },
  {
    name: 'Clients',
    url: '/charts',
    icon: 'icon-people',
    children: [
      {
        name: 'Clients List',
        url: '/clients/client-list',
        icon: 'icon-people'
      }
    ]
  },
  {
    name: 'Invoices',
    url: '/invoices',
    icon: 'icon-doc',
    children: [
      {
        name: 'Invoices List',
        url: '/invoices/invoices-list',
        icon: 'icon-doc'
      }
    ]
  },
  {
    name: 'Settings',
    url: '/settings',
    icon: 'icon-settings',
    children: [
      {
        name: 'Categories',
        url: '/settings/categories',
        icon: 'icon-settings'
      },
      {
        name: 'Stones',
        url: '/settings/stones',
        icon: 'icon-settings'
      },
      {
        name: 'Branches',
        url: '/settings/branches',
        icon: 'icon-settings'
      },
      {
        name: 'Users',
        url: '/settings/users',
        icon: 'icon-settings'
      }
    ]
  }
];
