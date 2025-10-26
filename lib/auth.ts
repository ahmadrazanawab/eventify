import jwt from 'jsonwebtoken';

type UserRole = 'admin' | 'student' | 'guest';

export interface JwtPayload extends jwt.JwtPayload {
  userId: string;
  role: UserRole;
}

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || process.env.JWT_SECRET || 'your-secret-key';

export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  // First try to get from regular cookie (for development)
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  
  // Then try to get from HTTP-only cookie (for production)
  const httpOnlyParts = value.split('; token=');
  if (httpOnlyParts.length === 2) return httpOnlyParts.pop()?.split(';').shift() || null;
  
  return null;
}

export function setAuthToken(token: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `token=${token}; path=/; max-age=86400; samesite=lax`;
}

export function removeAuthToken(): void {
  if (typeof document === 'undefined') return;
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    if (!JWT_SECRET || JWT_SECRET === 'your-secret-key') {
      console.error('JWT_SECRET is not properly configured');
      return null;
    }
    
    if (!token) {
      console.error('No token provided to decode');
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log('Successfully decoded token for user:', decoded.userId);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export function isTokenExpired(decodedToken: JwtPayload): boolean {
  return Date.now() >= (decodedToken.exp || 0) * 1000;
}

export function generateToken(payload: Omit<JwtPayload, 'exp' | 'iat'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded || isTokenExpired(decoded)) {
    removeAuthToken();
    return null;
  }
  
  return {
    id: decoded.userId,
    role: decoded.role,
  };
}
