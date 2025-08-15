# Password Reset Flow Documentation

## Overview
The password reset flow uses a secure JWT-based approach with HTTP-only cookies. The JWT token is self-contained and doesn't require database storage.

## Flow Steps

### 1. Request Password Reset
**Endpoint:** `POST /api/auth/forgot-password`
**Body:**
```json
{
  "email": "user@example.com"
}
```
**Response:** OTP sent to email

### 2. Verify OTP and Set Reset Token Cookie
**Endpoint:** `POST /api/auth/verify-otp-forgot-password`
**Body:**
```json
{
  "email": "user@example.com",
  "otpCode": "123456"
}
```
**Response:**
```json
{
  "message": "OTP verified successfully.",
  "success": true
}
```
**Cookie Set:** `reset_token` (HTTP-only, secure, 15 minutes expiry)

### 3. Reset Password (Token from Cookie)
**Endpoint:** `POST /api/auth/reset-password`
**Body:**
```json
{
  "password": "NewSecurePassword123!"
}
```
**Response:**
```json
{
  "message": "Password reset successfully."
}
```
**Cookie Cleared:** `reset_token` is automatically cleared after successful reset

## Security Features

1. **OTP Verification:** User must verify OTP before getting reset token
2. **HTTP-Only Cookie:** Reset token stored in secure, HTTP-only cookie
3. **JWT Self-Contained:** Token contains all necessary information (email, type, expiration)
4. **Time-Limited Token:** Reset token expires in 15 minutes
5. **Single-Use Token:** Token is cleared after password reset
6. **Password Strength:** Enforced strong password requirements
7. **Automatic Cleanup:** Cookie is cleared after successful password reset

## Client Implementation

```javascript
// Step 1: Request password reset
const forgotPassword = async (email) => {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ email })
  });
  return response.json();
};

// Step 2: Verify OTP (reset token cookie is set automatically)
const verifyOTP = async (email, otpCode) => {
  const response = await fetch('/api/auth/verify-otp-forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ email, otpCode })
  });
  return response.json();
};

// Step 3: Reset password (token is automatically read from cookie)
const resetPassword = async (newPassword) => {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ password: newPassword })
  });
  return response.json();
};
```

## Cookie Configuration

The reset token cookie is configured with:
- **httpOnly:** `true` (prevents XSS attacks)
- **secure:** `true` in production (HTTPS only)
- **sameSite:** `"none"` (allows cross-site requests)
- **maxAge:** `15 minutes` (automatic expiration)

## JWT Token Structure

The reset token JWT contains:
```json
{
  "email": "user@example.com",
  "type": "password_reset",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Error Handling

- **Invalid OTP:** Returns 400 with "Invalid or expired OTP"
- **Missing Reset Token:** Returns 400 with "Reset token and password are required"
- **Expired Reset Token:** Returns 400 with "Invalid or expired reset token"
- **Weak Password:** Returns 400 with password requirements message
- **User Not Found:** Returns 400 with "User not found"

## Security Benefits

1. **XSS Protection:** HTTP-only cookies cannot be accessed by JavaScript
2. **CSRF Protection:** SameSite cookie policy helps prevent CSRF attacks
3. **Automatic Expiration:** Cookies expire automatically after 15 minutes
4. **Secure Transmission:** Cookies are only sent over HTTPS in production
5. **No Token Exposure:** Reset token is never exposed in response body or localStorage
6. **No Database Storage:** JWT is self-contained, no need to store tokens in database
7. **Stateless:** No server-side token storage required

## Database Schema

The user model only needs:
- `otpCode`: For OTP verification
- `otpExpiry`: For OTP expiration
- `password`: For storing hashed passwords

No reset token fields are needed since JWT handles all token management.
