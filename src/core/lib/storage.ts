import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { config } from '@/core/config'

/** Singleton S3 client initialised from environment config. */
const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
})

/**
 * Uploads a file buffer to S3 and returns its public URL.
 *
 * @param key - S3 object key (e.g. `profiles/userId/filename.jpg`).
 * @param body - File contents as a Buffer.
 * @param contentType - MIME type of the file (e.g. `image/jpeg`).
 * @returns The public HTTPS URL of the uploaded object.
 */
export async function uploadFile(key: string, body: Buffer, contentType: string): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )

  return `https://${config.s3.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`
}

/**
 * Deletes an object from S3 by its key.
 *
 * @param key - S3 object key to delete.
 */
export async function deleteFile(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: config.s3.bucket, Key: key }))
}

/**
 * Extracts the S3 object key from a full S3 public URL.
 * Useful when you need to delete an object given only its URL.
 *
 * @param url - Full S3 URL returned by {@link uploadFile}.
 */
export function keyFromUrl(url: string): string {
  const base = `https://${config.s3.bucket}.s3.${config.aws.region}.amazonaws.com/`
  return url.replace(base, '')
}
