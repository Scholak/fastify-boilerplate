export const responseMessages = {
  ROLES_RETRIEVED: 'Roller başarıyla getirildi',
  ROLE_RETRIEVED: 'Rol başarıyla getirildi',
  ROLE_CREATED: 'Rol başarıyla oluşturuldu',
  ROLE_UPDATED: 'Rol başarıyla güncellendi',
  ROLE_DELETED: 'Rol başarıyla silindi',
  ROLE_NOT_FOUND: 'Rol bulunamadı',
  ROLE_NAME_TAKEN: 'Bu rol adı zaten kullanımda',
  ROLES_ASSIGNED: 'Roller başarıyla atandı',
  ROLES_REVOKED: 'Roller başarıyla kaldırıldı',
  ADMIN_ROLE_READONLY: 'Admin rolü salt okunurdur, düzenlenemez veya silinemez',
} as const

export const validationMessages = {
  name: { required: 'Rol adı zorunludur' },
  permissions: { invalid: 'Geçersiz izin anahtarı' },
} as const
