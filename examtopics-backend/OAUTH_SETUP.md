# Google OAuth Setup Guide

## 1. Google Cloud Console Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API and Google OAuth2 API

### Step 2: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Fill in the details:

#### For Development (localhost):
```
Name: ExamTopics Backend - Development
Authorized JavaScript origins:
- http://localhost:3000
- http://localhost:3001

Authorized redirect URIs:
- http://localhost:3001/auth/google/callback
```

#### For Production (Render):
```
Name: ExamTopics Backend - Production
Authorized JavaScript origins:
- https://examtopics-practice.onrender.com

Authorized redirect URIs:
- https://examtopics-backend-latest.onrender.com/auth/google/callback
```

### Step 3: Get Credentials
1. Copy **Client ID** and **Client Secret**
2. Add them to your environment variables

## 2. Environment Variables

### Backend (.env)
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret_here

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-change-in-production
SESSION_SECRET=your-session-secret-key

# Environment Configuration
NODE_ENV=development

# Frontend URLs (for OAuth callback)
FRONTEND_URL=http://localhost:3000

# CORS Configuration
```

### Frontend (.env)
```env
# Backend URL Configuration
REACT_APP_BACKEND_URL=http://localhost:3001

# Frontend URL Configuration (optional)
REACT_APP_FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## 3. Production Deployment

### Render Backend Environment Variables:
```env
NODE_ENV=production
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
JWT_SECRET=your_production_jwt_secret
SESSION_SECRET=your_production_session_secret
FRONTEND_URL=https://examtopics-practice.onrender.com
GOOGLE_CALLBACK_URL=https://examtopics-backend-latest.onrender.com/auth/google/callback
MONGO_URI=your_mongodb_atlas_uri
```

### Render Frontend Environment Variables:
```env
REACT_APP_BACKEND_URL=https://examtopics-backend-latest.onrender.com
REACT_APP_FRONTEND_URL=https://examtopics-practice.onrender.com
NODE_ENV=production
```

## 4. OAuth Flow

### Development Flow:
1. User clicks "Login with Google" on frontend (localhost:3000)
2. Frontend redirects to backend OAuth endpoint (localhost:3001/auth/google)
3. Backend redirects to Google OAuth
4. Google redirects back to backend callback (localhost:3001/auth/google/callback)
5. Backend redirects to the frontend callback with a one-use code in the URL fragment. The frontend clears the fragment and exchanges the code and its original verifier with `POST /auth/exchange`.
6. Frontend stores token and loads user info

### Production Flow:
1. User clicks "Login with Google" on frontend (examtopics-practice.onrender.com)
2. Frontend redirects to backend OAuth endpoint (examtopics-backend-latest.onrender.com/auth/google)
3. Backend redirects to Google OAuth
4. Google redirects back to backend callback (examtopics-backend-latest.onrender.com/auth/google/callback)
5. Backend redirects to the frontend callback with a one-use code in the URL fragment. The frontend exchanges the code and verifier over HTTPS.
6. Frontend stores token and loads user info

## 5. Troubleshooting

### Common Issues:

#### 1. redirect_uri_mismatch
- **Cause**: Redirect URI in Google Cloud doesn't match backend callback URL
- **Solution**: 
  - Check exact URL in Google Cloud Console
  - Ensure no trailing slashes
  - Verify protocol (http vs https)
  - Check port numbers

#### 2. CORS Errors
- **Cause**: Frontend and backend domains don't match CORS configuration
- **Solution**: Set FRONTEND_URL in the backend to the exact frontend origin; it is the only origin allowed in production

#### 3. Invalid Client ID
- **Cause**: Wrong client ID or secret
- **Solution**: Verify credentials in environment variables

#### 4. JWT Token Issues
- **Cause**: Invalid or expired JWT secret
- **Solution**: Generate new JWT_SECRET and update all environments

## 6. Security Best Practices

1. **Never commit credentials** to version control
2. **Use different credentials** for development and production
3. **Rotate JWT secrets** regularly
4. **Use HTTPS** in production
5. **Validate tokens** on every request
6. **Set appropriate token expiration** (7 days recommended)

## 7. Testing

### Local Testing:
```bash
# Backend
cd examtopics-backend
npm start

# Frontend
cd examtopics-practice
npm start
```

### Production Testing:
1. Deploy backend to Render
2. Deploy frontend to Render
3. Test OAuth flow end-to-end
4. Verify user data persistence
5. Test logout functionality

## 8. Monitoring

### Backend Logs:
- Check Render logs for OAuth errors
- Monitor JWT token generation
- Track user authentication success/failure

### Frontend Logs:
- Check browser console for CORS errors
- Monitor token storage/retrieval
- Track user session management

The exchange code expires after 60 seconds. Render keeps the frontend and API on their existing separate hostnames. The browser calls the exchange from the frontend origin with credentials and `X-ExamTopics-Session: 1`. Its response sets the partitioned, host-only `__Host-examtopics-session` cookie. Keep `FRONTEND_URL` set to the exact frontend HTTPS origin.

`POST /auth/session` restores a valid session in the same frontend partition without extending its idle deadline. Trusted foreground activity calls `POST /auth/activity` at most once per minute per tab. The server expires sessions after 24 hours without accepted activity or 30 days from sign-in. Access JWTs last at most ten minutes and stay in tab memory. The browser needs CHIPS to keep the session across reloads. When cookie delivery is blocked, the app explains the limitation and can use the access JWT until it expires.

On staging, verify TTL indexes with `expireAfterSeconds: 0` on `oauthlogincodes.expiresAt` and `authsessions.expiresAt`. The latter is a new collection. No user or exam data needs migration. Release frontend and backend together. Existing users need one sign-in after the change to obtain a session cookie. Verify sign-in, reload, idle expiry, and logout on the target browsers before production rollout.
