export const ok = (data: unknown, message = 'Success', meta?: unknown) => ({
  success: true,
  code: 'SUCCESS',
  message,
  data,
  meta,
})

export const fail = (code: string, message: string, data?: unknown) => ({
  success: false,
  code,
  message,
  data,
})
