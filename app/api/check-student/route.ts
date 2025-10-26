import { NextResponse } from 'next/server';
import { getAuthToken, decodeToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || getAuthToken();
    
    if (!token) {
      return NextResponse.json(
        { isStudent: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      return NextResponse.json(
        { isStudent: false, message: 'Invalid or expired token' },
        { status: 403 }
      );
    }

    // In a real app, you would check the database to verify the user's role
    // For now, we'll trust the role in the token
    const isStudent = decoded.role === 'student';

    if (!isStudent) {
      return NextResponse.json(
        { isStudent: false, message: 'Student access required' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      isStudent: true,
      user: {
        id: decoded.userId,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error('Student check failed:', error);
    return NextResponse.json(
      { isStudent: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
