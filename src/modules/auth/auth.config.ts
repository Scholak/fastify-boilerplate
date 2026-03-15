export const authRateLimits = {
  signIn: { max: 5, timeWindow: '15 minutes' },
  forgotPassword: { max: 3, timeWindow: '1 hour' },
  resetPassword: { max: 10, timeWindow: '1 hour' },
  getToken: { max: 30, timeWindow: '15 minutes' },
  updateProfile: { max: 20, timeWindow: '1 minute' },
  changePassword: { max: 5, timeWindow: '15 minutes' },
  updateProfilePhoto: { max: 10, timeWindow: '1 minute' },
  deleteProfilePhoto: { max: 10, timeWindow: '1 minute' },
} as const
