export const usersRateLimits = {
  list: { max: 60, timeWindow: '1 minute' },
  getOne: { max: 60, timeWindow: '1 minute' },
  create: { max: 20, timeWindow: '1 minute' },
  update: { max: 30, timeWindow: '1 minute' },
  remove: { max: 20, timeWindow: '1 minute' },
} as const
