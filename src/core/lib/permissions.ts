export const PERMISSIONS = {
  USERS_LIST: 'users.list',
  USERS_DETAIL: 'users.detail',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_ASSIGN_ROLES: 'users.assign-roles',
  ROLES_LIST: 'roles.list',
  ROLES_DETAIL: 'roles.detail',
  ROLES_CREATE: 'roles.create',
  ROLES_EDIT: 'roles.edit',
  ROLES_DELETE: 'roles.delete',
} as const

export type TPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const PERMISSION_MODULES = [
  {
    label: 'Kullanıcı İzinleri',
    permissions: [
      {
        key: PERMISSIONS.USERS_LIST,
        label: 'Listele',
        description: 'Kullanıcı listesini görüntüleyebilir',
      },
      {
        key: PERMISSIONS.USERS_DETAIL,
        label: 'Detay',
        description: 'Kullanıcı detaylarını görüntüleyebilir',
      },
      {
        key: PERMISSIONS.USERS_CREATE,
        label: 'Oluştur',
        description: 'Sisteme yeni kullanıcı ekleyebilir',
      },
      {
        key: PERMISSIONS.USERS_EDIT,
        label: 'Düzenle',
        description: 'Mevcut kullanıcı bilgilerini güncelleyebilir',
      },
      {
        key: PERMISSIONS.USERS_DELETE,
        label: 'Sil',
        description: 'Kullanıcıları sistemden kalıcı olarak silebilir',
      },
      {
        key: PERMISSIONS.USERS_ASSIGN_ROLES,
        label: 'Rol Ata',
        description: 'Kullanıcılara rol atayabilir veya rollerini kaldırabilir',
      },
    ],
  },
  {
    label: 'Rol İzinleri',
    permissions: [
      {
        key: PERMISSIONS.ROLES_LIST,
        label: 'Listele',
        description: 'Rol listesini görüntüleyebilir',
      },
      {
        key: PERMISSIONS.ROLES_DETAIL,
        label: 'Detay',
        description: 'Rol detaylarını görüntüleyebilir',
      },
      {
        key: PERMISSIONS.ROLES_CREATE,
        label: 'Oluştur',
        description: 'Sisteme yeni rol ekleyebilir',
      },
      {
        key: PERMISSIONS.ROLES_EDIT,
        label: 'Düzenle',
        description: 'Mevcut rol bilgilerini ve izinlerini güncelleyebilir',
      },
      {
        key: PERMISSIONS.ROLES_DELETE,
        label: 'Sil',
        description: 'Rolleri sistemden kalıcı olarak silebilir',
      },
    ],
  },
] as const
