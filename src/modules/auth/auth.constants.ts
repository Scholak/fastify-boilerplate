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
    required: 'Şifre alanı zorunludur',
  },
  newPassword: {
    required: 'Şifre alanı zorunludur',
    min: 'Şifre en az 8 karakter olmalıdır',
    uppercase: 'Şifre en az bir büyük harf içermelidir',
    number: 'Şifre en az bir rakam içermelidir',
  },
  currentPassword: {
    required: 'Mevcut şifre alanı zorunludur',
  },
  confirmPassword: {
    required: 'Şifre tekrar alanı zorunludur',
    match: 'Şifreler eşleşmiyor',
  },
  token: {
    required: 'Token alanı zorunludur',
  },
} as const

export const responseMessages = {
  SIGNED_IN: 'Giriş başarılı',
  SIGNED_OUT: 'Çıkış başarılı',
  RESET_LINK_SENT: 'E-posta adresi kayıtlıysa sıfırlama bağlantısı gönderildi',
  PASSWORD_RESET: 'Şifre başarıyla sıfırlandı',
  TOKEN_REFRESHED: 'Token yenilendi',
  CURRENT_USER: 'Mevcut kullanıcı',
  INVALID_CREDENTIALS: 'E-posta veya şifre hatalı',
  INVALID_TOKEN: 'Geçersiz veya süresi dolmuş sıfırlama tokeni',
  NO_REFRESH_TOKEN: 'Yenileme tokeni sağlanmadı',
  INVALID_REFRESH_TOKEN: 'Geçersiz yenileme tokeni',
  INVALID_EXPIRED_REFRESH_TOKEN: 'Geçersiz veya süresi dolmuş yenileme tokeni',
  PROFILE_UPDATED: 'Profil başarıyla güncellendi',
  PASSWORD_CHANGED: 'Şifre başarıyla değiştirildi',
  INVALID_CURRENT_PASSWORD: 'Mevcut şifre hatalı',
} as const
