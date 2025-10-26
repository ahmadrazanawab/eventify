import { NextResponse } from 'next/server';
import { getAuthToken, decodeToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    console.log('=== Admin Check Request ===');
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || getAuthToken();
    
    console.log('Auth header:', authHeader?.substring(0, 20) + '...');
    console.log('Token from cookie:', getAuthToken()?.substring(0, 10) + '...');
    
    if (!token) {
      console.error('No token provided');
      return NextResponse.json(
        { isAdmin: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    console.log('Decoding token...');
    const decoded = decodeToken(token);
    console.log('Decoded token:', decoded);
    
    if (!decoded) {
      console.error('Failed to decode token');
      return NextResponse.json(
        { isAdmin: false, message: 'Invalid or expired token' },
        { status: 403 }
      );
    }

    console.log('Checking admin status for user:', decoded.userId);
    console.log('User role:', decoded.role);
    
    const isAdmin = decoded.role === 'admin';

    if (!isAdmin) {
      console.error('User is not an admin');
      return NextResponse.json(
        { isAdmin: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('User is admin, granting access');
    return NextResponse.json({
      isAdmin: true,
      user: {
        id: decoded.userId,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error('Admin check failed:', error);
    return NextResponse.json(
      { 
        isAdmin: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
