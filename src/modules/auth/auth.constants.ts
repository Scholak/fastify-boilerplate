export const validationMessages = {
  firstName: {
    required: 'First name is required',
  },
  lastName: {
    required: 'Last name is required',
  },
  email: {
    invalid: 'Invalid email address',
  },
  password: {
    required: 'Password is required',
  },
  newPassword: {
    required: 'Password field is required',
    min: 'Password must be at least 8 characters',
    uppercase: 'Password must contain at least one uppercase letter',
    number: 'Password must contain at least one number',
  },
  currentPassword: {
    required: 'Current password is required',
  },
  confirmPassword: {
    required: 'Confirm password field is required',
    match: "Passwords don't match",
  },
  token: {
    required: 'Token is required',
  },
} as const

export const responseMessages = {
  SIGNED_IN: 'Signed in successfully',
  RESET_LINK_SENT: 'If the email exists, a reset link has been sent',
  PASSWORD_RESET: 'Password reset successfully',
  TOKEN_REFRESHED: 'Token refreshed',
  CURRENT_USER: 'Current user',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_TOKEN: 'Invalid or expired reset token',
  NO_REFRESH_TOKEN: 'No refresh token provided',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  INVALID_EXPIRED_REFRESH_TOKEN: 'Invalid or expired refresh token',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  INVALID_CURRENT_PASSWORD: 'Current password is incorrect',
} as const
