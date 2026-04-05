const { execSync } = require('child_process');

try {
  // Get process using port 4000
  const output = execSync('netstat -ano | findstr :4000').toString();
  const lines = output.trim().split('\n');
  if (lines.length > 0) {
    const parts = lines[0].trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid !== '0') {
      console.log(`Killing process ${pid} on port 4000`);
      execSync(`taskkill /PID ${pid} /F`);
    } else {
      console.log("No valid PID found on port 4000");
    }
  }
} catch (e) {
  console.log("Port 4000 is clean or error occurred", e.message);
}
