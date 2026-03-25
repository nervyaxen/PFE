import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'machrou3i_jwt_secret';

/**
 * START SAFE MODIFICATION — JWT Authentication Middleware
 * Verifies Bearer token from Authorization header.
 * Attaches decoded { id, role } to req.user on success.
 * END SAFE MODIFICATION
 */
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

/**
 * Role-based access control middleware.
 * Usage: authorize('admin', 'manager')
 */
export function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required.' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
}
