import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const PASSWORD_SECRET = process.env.PASSWORD_SECRET || 'password-secret-key'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// 简单密码加密（使用 HMAC-SHA256）
export function hashPassword(password: string): string {
  return crypto
    .createHmac('sha256', PASSWORD_SECRET)
    .update(password)
    .digest('hex')
}

// 验证密码
export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  const hashed = hashPassword(password)
  return hashed === hashedPassword
}

// 生成 JWT Token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// 验证 JWT Token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

// 从请求中获取用户信息
export async function getCurrentUser(token: string | null) {
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  return user
}

