const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// Enhanced CSRF configuration
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 // 1 hour
  },
  value: (req) => {
    // Check both header and body for CSRF token
    return req.headers['x-csrf-token'] || req.body._csrf;
  }
});

// Secure cookie settings
const secureCookies = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

module.exports = {
  csrfProtection,
  cookieParser,
  secureCookies
};