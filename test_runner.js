const { spawn } = require('child_process');
const http = require('http');

const server = spawn('npx', ['ts-node', 'src/index.ts'], { cwd: 'c:\\Projects\\HZLR-beta-main\\apps\\api', shell: true });

server.stdout.on('data', (data) => console.log(`API: ${data.toString()}`));
server.stderr.on('data', (data) => console.error(`API ERR: ${data.toString()}`));

setTimeout(async () => {
  console.log('--- TESTING API ---');
  try {
    const email = `testuser${Date.now()}@test.com`;
    console.log(`Testing Signup with ${email}...`);
    
    const signupRes = await fetch('http://localhost:8080/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Password123!', role: 'WORKER' })
    });
    
    console.log(`Signup Status: ${signupRes.status}`);
    const signupText = await signupRes.text();
    console.log(`Signup Output: ${signupText}`);

    const loginRes = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Password123!' })
    });
    
    console.log(`Login Status: ${loginRes.status}`);
    const loginText = await loginRes.text();
    console.log(`Login Output: ${loginText}`);

  } catch(e) {
    console.error(`Fetch error: ${e.message}`);
  }
  
  process.exit(0);
}, 5000);
