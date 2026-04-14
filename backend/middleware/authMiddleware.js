import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  
  if (process.env.NODE_ENV === 'development' && req.headers['x-bypass-auth'] === 'true') {
    req.user = { id: 'development' };
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      message: 'No token provided',
      code: 'TOKEN_MISSING'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if token will expire soon (within next hour)
    const exp = decoded.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (exp - now < oneHour) {
      // Token will expire soon, issue new token
      const newToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      
      // Send new token in response header
      res.set('X-New-Token', newToken);
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
        expiredAt: err.expiredAt
      });
    }
    res.status(401).json({ 
      message: 'Invalid token',
      code: 'TOKEN_INVALID'
    });
  }
}
