# Admin Register API - Documentation

## ✅ API Endpoint Created

**POST** `/api/auth/register`

## 📋 Request Format

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "full_name": "Admin Name",
  "email": "admin@amcsystems.ae",
  "password": "yourpassword123",
  "role": "admin"  // Optional: "admin" or "super_admin" (default: "admin")
}
```

## ✅ Response Format

### Success (201 Created)
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@amcsystems.ae",
      "full_name": "Admin Name",
      "role": "admin"
    },
    "message": "Admin registered successfully"
  }
}
```

### Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Admin with this email already exists",
  "error": "Admin with this email already exists"
}
```

## 🔒 Validation Rules

- **full_name**: Min 2 characters, Max 100 characters
- **email**: Valid email format
- **password**: Min 6 characters, Max 100 characters
- **role**: Optional, must be "admin" or "super_admin" (default: "admin")

## 📝 Postman Example

### Request
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "full_name": "Super Admin",
  "email": "admin@amcsystems.ae",
  "password": "admin123456",
  "role": "super_admin"
}
```

### Response
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "admin@amcsystems.ae",
      "full_name": "Super Admin",
      "role": "super_admin"
    },
    "message": "Admin registered successfully"
  }
}
```

## 🔐 Security Features

✅ Password hashing with bcrypt (12 rounds)
✅ Email uniqueness check
✅ Input validation with Zod
✅ Role validation
✅ No password in response

## ⚠️ Important Notes

1. **Password is hashed** before storing in database
2. **Email must be unique** - duplicate emails will be rejected
3. **No JWT tokens returned** - user needs to login separately after registration
4. **Role defaults to "admin"** if not specified

## 🚀 Usage Flow

1. Register admin via Postman: `POST /api/auth/register`
2. Login with credentials: `POST /api/auth/login`
3. Get access token and use for admin APIs

## 📁 Files Modified/Created

1. ✅ `validators/auth.ts` - Added registerSchema
2. ✅ `backend/services/auth.ts` - Added register method
3. ✅ `backend/controllers/auth.ts` - Added register controller
4. ✅ `app/api/auth/register/route.ts` - Created API route

## ✅ Status

**Register API Complete!** Ready to use via Postman.

