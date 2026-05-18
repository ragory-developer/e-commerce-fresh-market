import jwt from 'jsonwebtoken';
import http from 'http';

const token = jwt.sign({ userId: 'test', role: 'ADMIN' }, 'freshcart_access_secret_key_change_in_production', { expiresIn: '1h' });

const req = http.request('http://localhost:5000/api/wallet/balance', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});
req.on('error', console.error);
req.end();
