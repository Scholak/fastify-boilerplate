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
    min: 'Password must be at least 8 characters',
    uppercase: 'Password must contain at least one uppercase letter',
    number: 'Password must contain at least one number',
  },
  confirmPassword: {
    required: 'Confirm password field is required',
    match: "Passwords don't match",
  },
} as const

export const responseMessages = {
  USERS_RETRIEVED: 'Users retrieved successfully',
  USER_RETRIEVED: 'User retrieved successfully',
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_IN_USE: 'Email is already in use',
} as const
