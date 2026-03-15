import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { config } from '@/core/config'

/** Singleton SES client initialised from environment config. */
const ses = new SESClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
})

/** Options accepted by {@link sendEmail}. */
export type TSendEmailOptions = {
  /** One or more recipient addresses. */
  to: string | string[]
  subject: string
  /** HTML body of the email. */
  html: string
  /** Optional plain-text fallback body. */
  text?: string
}

/**
 * Sends a transactional email via AWS SES.
 * The sender address is taken from `SES_FROM_EMAIL` / `SES_FROM_NAME` env vars.
 *
 * @throws If SES rejects the request (e.g. unverified sender, quota exceeded).
 */
export async function sendEmail(options: TSendEmailOptions): Promise<void> {
  const toAddresses = Array.isArray(options.to) ? options.to : [options.to]

  const command = new SendEmailCommand({
    Source: `${config.ses.fromName} <${config.ses.fromEmail}>`,
    Destination: { ToAddresses: toAddresses },
    Message: {
      Subject: { Data: options.subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: options.html, Charset: 'UTF-8' },
        ...(options.text && { Text: { Data: options.text, Charset: 'UTF-8' } }),
      },
    },
  })

  await ses.send(command)
}
