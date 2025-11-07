# Database Setup Guide

This guide will help you set up the database for the Indekun project.

## Prerequisites

- MySQL (5.7+) or PostgreSQL (12+)
- Node.js and npm installed

## Step 1: Choose Your Database

The application supports both MySQL and PostgreSQL. Update your `.env.local` file with the appropriate configuration.

## Step 2: Create the Database

### For MySQL:
```bash
mysql -u root -p
CREATE DATABASE indekun_db;
exit;
```

### For PostgreSQL:
```bash
psql -U postgres
CREATE DATABASE indekun_db;
\q
```

## Step 3: Run the Schema

### For MySQL:
```bash
mysql -u root -p indekun_db < database/schema.sql
```

### For PostgreSQL:
```bash
psql -U postgres -d indekun_db -f database/schema-postgresql.sql
```

## Step 4: Create Admin User Password

The schema creates a default admin user with email `admin@university.edu`. However, you need to update the password hash. 

You can use this Node.js script to generate a password hash:

```javascript
const bcrypt = require('bcryptjs');
const password = 'admin123'; // Change this to your desired password
bcrypt.hash(password, 10).then(hash => {
  console.log('Password hash:', hash);
  console.log('SQL update command:');
  console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@university.edu';`);
});
```

Or run the setup script:
```bash
node scripts/setup-admin.js
```

## Step 5: Configure Environment Variables

Copy `.env.example` to `.env.local` and update with your database credentials:

```env
DATABASE_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=indekun_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

## Step 6: Test the Connection

Start your Next.js development server:
```bash
npm run dev
```

The API endpoints should now be accessible at:
- `http://localhost:3000/api/auth/login`
- `http://localhost:3000/api/equipment`
- etc.

## Default Credentials

After setup, you can login with:
- **Email:** admin@university.edu
- **Password:** admin123 (or whatever you set in the setup script)

**Important:** Change the default admin password in production!

