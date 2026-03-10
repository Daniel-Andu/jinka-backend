# Database Connection Issue - Fix Guide

## Problem
All API endpoints are failing with "Failed to load" errors because the backend cannot connect to TiDB Cloud database.

## Root Cause
The TiDB Cloud database at `gateway01.eu-central-1.prod.aws.tidbcloud.com:4000` is not reachable. This could be due to:

1. **TiDB Cloud cluster is paused/stopped**
2. **IP address not whitelisted**
3. **Network/firewall blocking connection**
4. **Credentials expired or changed**

## Solution Steps

### Step 1: Check TiDB Cloud Cluster Status

1. Go to https://tidbcloud.com/
2. Login to your account
3. Check if your cluster is **Running** or **Paused**
4. If paused, click **Resume** to start the cluster

### Step 2: Whitelist Your IP Address

1. In TiDB Cloud console, go to your cluster
2. Click on **Connect** button
3. Go to **Traffic Filter** or **IP Access List**
4. Add your current IP address:
   - Click **Add IP Address**
   - Enter your public IP (you can find it at https://whatismyip.com/)
   - Or use `0.0.0.0/0` to allow all IPs (NOT recommended for production)
5. Save the changes

### Step 3: Verify Database Credentials

Check if the credentials in `.env` file are correct:

```env
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=3Wqoqhx4joYsHuX.root
DB_PASSWORD=tpCG7TVgBC8ph3fS
DB_NAME=Jinka_cms
```

If credentials changed:
1. Go to TiDB Cloud console
2. Get the new connection string
3. Update `.env` file with new credentials

### Step 4: Test Connection

After fixing the above issues, test the connection:

```bash
cd jinka-backend
node test-db-connection.js
```

You should see:
```
✓ Database connection successful!
✓ Tables in database: X
  - hero_sliders
  - city_stats
  - services
  ...
```

### Step 5: Restart Backend

```bash
# Stop the current backend process (Ctrl+C)
# Then restart:
npm run dev
```

### Step 6: Test Health Endpoint

Open browser or use curl:
```bash
curl http://localhost:5001/health
```

Should return:
```json
{
  "ok": true,
  "db": "connected",
  "test": { "test": 1 }
}
```

## Alternative: Use Local MySQL

If TiDB Cloud is not available, you can use local MySQL:

### Install MySQL Locally

**Windows:**
1. Download MySQL from https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Remember the root password you set

**Mac:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE Jinka_cms;
USE Jinka_cms;
```

### Run Schema

```bash
cd jinka-backend
mysql -u root -p Jinka_cms < FINAL_SCHEMA_FIX.sql
```

### Update .env

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=Jinka_cms
DB_SSL_CA=
```

### Create Admin User

```bash
node create-admin.js
```

### Restart Backend

```bash
npm run dev
```

## Verification Checklist

- [ ] TiDB Cloud cluster is running (or local MySQL is running)
- [ ] IP address is whitelisted (for TiDB Cloud)
- [ ] Database credentials are correct in `.env`
- [ ] `node test-db-connection.js` succeeds
- [ ] Backend starts without errors
- [ ] `http://localhost:5001/health` returns success
- [ ] Admin panel can login
- [ ] Admin panel can load data from all pages

## Quick Fix Commands

```bash
# Test database connection
cd jinka-backend
node test-db-connection.js

# Restart backend
npm run dev

# Test health endpoint
curl http://localhost:5001/health

# Test login
curl -X POST http://localhost:5001/api/public/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jinkacity.gov.et","password":"admin123"}'
```

## Common Errors

### Error: ETIMEDOUT
- **Cause**: Cannot reach database server
- **Fix**: Check TiDB Cloud cluster is running and IP is whitelisted

### Error: ER_ACCESS_DENIED_ERROR
- **Cause**: Wrong username or password
- **Fix**: Verify credentials in `.env` file

### Error: ER_DBACCESS_DENIED_ERROR
- **Cause**: User doesn't have access to database
- **Fix**: Check database name and user permissions

### Error: ECONNREFUSED
- **Cause**: Database server not running
- **Fix**: Start MySQL/TiDB Cloud cluster

## Need Help?

1. Check TiDB Cloud status page
2. Verify your internet connection
3. Try using local MySQL as alternative
4. Check firewall settings
5. Contact TiDB Cloud support if cluster issues persist

## Once Fixed

After database connection is restored:
1. All admin pages will load correctly
2. CRUD operations will work
3. Customer website can fetch data via public API
4. No more "Failed to load" errors

The admin panel code is correct - it's just waiting for database connection to be restored.
