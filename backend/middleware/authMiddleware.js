import { getSupabaseClient } from '../config/supabase.js';

/**
 * Auth middleware — verifies Supabase JWT from Authorization header.
 * Sets req.user with the authenticated user's info.
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  // Demo mode bypass
  if (token === 'demo-token') {
    req.user = { id: 'demo-user', name: 'Demo Farmer', isDemo: true };
    return next();
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    // No Supabase configured — allow demo access
    req.user = { id: 'demo-user', name: 'Farmer', isDemo: true };
    return next();
  }

  // Verify the JWT by fetching the user from Supabase
  verifyToken(supabase, token)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    });
}

/**
 * Optional auth — attaches user if token present, but doesn't block request.
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (token === 'demo-token') {
    req.user = { id: 'demo-user', name: 'Demo Farmer', isDemo: true };
    return next();
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    req.user = { id: 'demo-user', name: 'Farmer', isDemo: true };
    return next();
  }

  verifyToken(supabase, token)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(() => {
      // Token invalid but this is optional — continue without user
      next();
    });
}

/**
 * Verify a Supabase JWT by calling getUser with the access token.
 * This is the server-side verified approach — not just decoding.
 */
async function verifyToken(supabase, token) {
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error(error?.message || 'Token verification failed');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Farmer',
    metadata: user.user_metadata,
  };
}
