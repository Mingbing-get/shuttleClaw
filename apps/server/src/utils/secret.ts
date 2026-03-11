import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.VAR_SECRET || 'default-secret-key'
const ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16

/**
 * 加密字符串
 * @param text 要加密的字符串
 * @returns 加密后的字符串
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY.padEnd(32, '0').slice(0, 32)),
    iv,
  )
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

/**
 * 解密字符串
 * @param encryptedText 加密后的字符串
 * @returns 解密后的字符串
 */
export function decrypt(encryptedText: string): string {
  const [ivHex, encrypted] = encryptedText.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY.padEnd(32, '0').slice(0, 32)),
    iv,
  )
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
