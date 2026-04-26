# API Endpoints Reference

## Authentication

### POST /api/auth/login
Login with username or email

**Request:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### GET /api/auth/profile
Get current user profile (requires Bearer token)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## Cars

### GET /api/cars
Get all cars (public)

**Response:**
```json
{
  "cars": [
    {
      "id": "car_id",
      "brand": "Tesla",
      "model": "Model S",
      "type": "Sedan",
      "year": 2024,
      "price": 89990,
      "image": "url",
      "description": "Description",
      "specs": {
        "engine": "Electric",
        "horsepower": 450,
        "acceleration": "2.3s",
        "topSpeed": "200mph",
        "fuelType": "Electric"
      },
      "colors": ["White", "Black", "Red"],
      "features": ["Autopilot", "Panoramic Roof"]
    }
  ]
}
```

### GET /api/cars/:id
Get car by ID (public)

**Response:**
```json
{
  "car": {
    "id": "car_id",
    "brand": "Tesla",
    "model": "Model S",
    ...
  }
}
```

## Orders

### GET /api/orders
Get all orders (requires Bearer token)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "orders": [
    {
      "id": "order_id",
      "user_id": "user_id",
      "car_id": "car_id",
      "quantity": 1,
      "total_price": 89990,
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Transactions

### GET /api/transactions
Get all transactions (requires Bearer token)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "transactions": [
    {
      "id": "transaction_id",
      "order_id": "order_id",
      "amount": 89990,
      "status": "completed",
      "payment_method": "credit_card",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Health Check

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/hello
Simple hello endpoint

**Response:**
```json
{
  "message": "Hello from backend!"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Username or email is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Car not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```
