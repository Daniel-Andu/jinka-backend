# ⚠️ URGENT: Database Connection Issue

## Problem
Your TiDB Cloud database is not reachable. All "Failed to load" errors are because the backend cannot connect to the database.

## Error
```
Error: connect ETIMEDOUT
Code: ETIMEDOUT
```

This means the database server at `gateway01.eu-central-1.prod.aws.tidbcloud.com:4000` is not responding.

## Quick Fix Options

### Option 1: Fix TiDB Cloud Connection (Recommended)

1. **Go to TiDB Cloud Console**
   - Visit: https://tidbcloud.com/
   - Login to your account

2. **Check Cluster Status**
   - Is your cluster **Running** or **Paused**?
   - If **Paused**, click **Resume** button

3. **Whitelist Your IP Address**
   - Click on your cluster
   - Go to **Connect** → **Traffic Filter**
   - Click **Add IP Address**
   - Get your IP from: https://whatismyip.com/
   - Add your IP address
   - Click **Save**

4. **Test Connection**
   ```bash
   cd jinka-backend
   node test-db-connection.js
   ```

5. **If successful, restart backend**
   ```bash
   npm run dev
   ```

### Option 2: Use Local MySQL (Quick Alternative)

If you can't access TiDB Cloud right now, use local MySQL:

1. **Install MySQL**
   - Download from: https://dev.mysql.com/downloads/installer/
   - Install and remember the root password

2. **Create Database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE Jinka_cms;
   exit;
   ```

3. **Import Schema**
   ```bash
   cd jinka-backend
   mysql -u root -p Jinka_cms < FINAL_SCHEMA_FIX.sql
   ```

4. **Update .env file**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=Jinka_cms
   DB_SSL_CA=
   ```

5. **Create Admin User**
   ```bash
   node create-admin.js
   ```

6. **Start Backend**
   ```bash
   npm run dev
   ```

## Verification

After fixing, test these:

1. **Health Check**
   ```bash
   curl http://localhost:5001/health
   ```
   Should return: `{"ok":true,"db":"connected",...}`

2. **Login Test**
   - Open admin panel: http://localhost:3002
   - Login with: admin@jinkacity.gov.et / admin123
   - All pages should load without errors

## Why This Happened

TiDB Cloud clusters can:
- Auto-pause after inactivity
- Require IP whitelisting for security
- Have connection limits
- Experience network issues

## Current Status

- ✅ Backend code is correct
- ✅ Admin panel code is correct
- ✅ All CRUD fixes are applied
- ❌ Database connection is failing
- ❌ Need to fix TiDB Cloud access OR use local MySQL

## Once Fixed

After database connection is restored:
- ✅ All "Failed to load" errors will disappear
- ✅ All admin pages will work
- ✅ CRUD operations will function
- ✅ Customer website can fetch data

## Need Help?

Read the detailed guide: `DATABASE_CONNECTION_FIX.md`

The application is ready - it just needs database access!
