const http = require('http');

const data = JSON.stringify({ phone: '9999999999', otp: '123456' });

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/v1/auth/verify-otp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let body = '';
  res.on('data', d => { body += d; });
  res.on('end', () => console.log(body));
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
