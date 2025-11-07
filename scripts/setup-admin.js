const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter admin password (default: admin123): ', async (password) => {
  const adminPassword = password || 'admin123';
  const email = 'admin@university.edu';
  
  try {
    const hash = await bcrypt.hash(adminPassword, 10);
    
    console.log('\n=== Admin User Setup ===');
    console.log('Email:', email);
    console.log('Password:', adminPassword);
    console.log('\nPassword Hash:');
    console.log(hash);
    console.log('\n=== SQL Commands ===');
    console.log('\nFor MySQL:');
    console.log(`UPDATE users SET password = '${hash}' WHERE email = '${email}';`);
    console.log('\nFor PostgreSQL:');
    console.log(`UPDATE users SET password = '${hash}' WHERE email = '${email}';`);
    console.log('\n=== Next Steps ===');
    console.log('1. Connect to your database');
    console.log('2. Run the UPDATE command above');
    console.log('3. Test login with the admin credentials');
    
    rl.close();
  } catch (error) {
    console.error('Error generating hash:', error);
    rl.close();
  }
});

