const http = require('http');

async function testAuth() {
  const email = `test_${Date.now()}@test.com`;
  
  console.log("-> Testing Signup:");
  try {
    const signupReq = await fetch('http://localhost:8080/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Password123!', role: 'WORKER' })
    });
    console.log("Signup status:", signupReq.status);
    const signupData = await signupReq.json();
    console.log("Signup body:", signupData);

    if (signupData.success) {
      console.log("\n-> Testing Login:");
      const loginReq = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'Password123!' })
      });
      console.log("Login status:", loginReq.status);
      const loginData = await loginReq.json();
      console.log("Login body:", loginData);

      console.log("\n-> Testing Send Email OTP:");
      const sendReq = await fetch('http://localhost:8080/api/v1/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      console.log("Send OTP status:", sendReq.status);
      const sendData = await sendReq.json();
      console.log("Send OTP body:", sendData);
    }
  } catch (e) {
    console.error("Test blocked by network error:", e.message);
  }
}

testAuth();
