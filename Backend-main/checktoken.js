import jwt from 'jsonwebtoken';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmU2YjU4NjUyYjk0MjIwOTE0NjQ0ZiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1MjA3MDA2OCwiZXhwIjoxNzUyMTU2NDY4fQ.wRTAvkhRrUzZjmCPBIgXFgBd1Mm6nbAUyuV_ead7gsc';

try {
  const decoded = jwt.verify(token, 'mysecret123'); // 👈 match this with .env
  console.log('✅ Token is valid:', decoded);
} catch (err) {
  console.error('❌ Token invalid:', err.message);
}
