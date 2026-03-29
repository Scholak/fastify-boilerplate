export const validationMessages = {
  firstName: {
    required: 'Ad alanı zorunludur',
  },
  lastName: {
    required: 'Soyad alanı zorunludur',
  },
  email: {
    invalid: 'Geçersiz e-posta adresi',
  },
  password: {
    min: 'Şifre en az 8 karakter olmalıdır',
    uppercase: 'Şifre en az bir büyük harf içermelidir',
    number: 'Şifre en az bir rakam içermelidir',
  },
  confirmPassword: {
    required: 'Şifre tekrar alanı zorunludur',
    match: 'Şifreler eşleşmiyor',
  },
} as const

export const responseMessages = {
  USERS_RETRIEVED: 'Kullanıcılar başarıyla getirildi',
  USER_RETRIEVED: 'Kullanıcı başarıyla getirildi',
  USER_CREATED: 'Kullanıcı başarıyla oluşturuldu',
  USER_UPDATED: 'Kullanıcı başarıyla güncellendi',
  USER_DELETED: 'Kullanıcı başarıyla silindi',
  USER_NOT_FOUND: 'Kullanıcı bulunamadı',
  EMAIL_ALREADY_IN_USE: 'Bu e-posta adresi zaten kullanımda',
  USER_ROLES_RETRIEVED: 'Kullanıcı rolleri başarıyla getirildi',
  ROLES_ASSIGNED: 'Roller başarıyla atandı',
  ROLES_REVOKED: 'Roller başarıyla kaldırıldı',
  ROLE_NOT_FOUND: 'Bir veya daha fazla rol bulunamadı',
  CANNOT_DELETE_SELF: 'Kendi hesabınızı silemezsiniz',
} as const
