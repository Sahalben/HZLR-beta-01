const puppeteer = require('puppeteer');

async function runSimulation() {
  console.log("Starting E2E Simulation...");
  const browser = await puppeteer.launch({ 
    headless: true, 
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });

  const workers = [
    { email: 'worker1@mockhzlr.com', name: 'Amit Kumar', address: 'Mumbai' },
    { email: 'worker2@mockhzlr.com', name: 'Priya Sharma', address: 'Mumbai' },
    { email: 'worker3@mockhzlr.com', name: 'Rahul Verma', address: 'Delhi' },
    { email: 'worker4@mockhzlr.com', name: 'Sneha Gupta', address: 'Delhi' },
    { email: 'worker5@mockhzlr.com', name: 'Vikram Singh', address: 'Bangalore' },
    { email: 'worker6@mockhzlr.com', name: 'Anjali Das', address: 'Bangalore' },
    { email: 'worker7@mockhzlr.com', name: 'Rohan Raj', address: 'Hyderabad' },
    { email: 'worker8@mockhzlr.com', name: 'Neha Mehta', address: 'Hyderabad' },
    { email: 'worker9@mockhzlr.com', name: 'Karan Shah', address: 'Pune' },
    { email: 'worker10@mockhzlr.com', name: 'Pooja Yadav', address: 'Pune' }
  ];

  const employers = [
    { email: 'employer1@mockhzlr.com', name: 'Apex Tech Solutions', address: 'Mumbai' },
    { email: 'employer2@mockhzlr.com', name: 'Urban Build Co', address: 'Delhi' },
    { email: 'employer3@mockhzlr.com', name: 'Fresh Market', address: 'Bangalore' },
    { email: 'employer4@mockhzlr.com', name: 'Swift Logistics', address: 'Hyderabad' },
    { email: 'employer5@mockhzlr.com', name: 'Prime Hospitality', address: 'Pune' }
  ];

  async function registerAccount(account, role) {
    const page = await browser.newPage();
    console.log(`Registering ${role}: ${account.email}`);
    
    try {
      await page.goto('http://localhost:8080/signup', { waitUntil: 'networkidle0' });
      
      // Click Role First
      if (role === 'worker') {
        await page.evaluate(() => {
          [...document.querySelectorAll('h3')].find(el => el.textContent.includes('Worker')).closest('.cursor-pointer').click();
        });
      } else {
        await page.evaluate(() => {
          [...document.querySelectorAll('h3')].find(el => el.textContent.includes('Employer')).closest('.cursor-pointer').click();
        });
      }

      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', account.email);
      await page.type('input[type="password"]', 'HzlrPass123!');
      
      // confirm password
      const passwordInputs = await page.$$('input[type="password"]');
      if (passwordInputs.length > 1) {
         await passwordInputs[1].type('HzlrPass123!');
      }
      
      const submitButtons = await page.$$('button[type="submit"]');
      await submitButtons[0].click();
      
      await new Promise(r => setTimeout(r, 2000));
      
      console.log(`Registered ${account.email} successfully.`);
    } catch(e) {
      console.error(`Failed registering ${account.email}`, e.message);
    } finally {
      await page.close();
    }
  }

  console.log("=== Registering Workers ===");
  for (const worker of workers) {
    await registerAccount(worker, 'worker');
  }

  console.log("=== Registering Employers ===");
  for (const emp of employers) {
    await registerAccount(emp, 'employer');
  }

  await browser.close();
  console.log("Simulation Complete.");
}

runSimulation();
