# API Examples and Responses

## 1. Authentication
### Register an Admin
**Request**: `POST /auth/register`
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "role": "ADMIN"
}
```
**Response (201 Created)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

### Login
**Request**: `POST /auth/login`
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
**Response (201 Created)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

---

## 2. Food Items Module
*Requires Bearer Token from Login. `ADMIN` role needed for write operations.*

### Create a Food Item
**Request**: `POST /food-items`
```json
{
  "name": "Margherita Pizza",
  "description": "Classic delight with 100% real mozzarella cheese",
  "price": 250,
  "category": "fastfood",
  "available": true
}
```
**Response (201 Created)**:
```json
{
  "id": "abc-123",
  "name": "Margherita Pizza",
  "description": "... cheese",
  "price": 250,
  "category": "fastfood",
  "available": true,
  "createdAt": "2026-03-13T00:00:00.000Z",
  "updatedAt": "2026-03-13T00:00:00.000Z"
}
```

### Search and Filter Food Items
**Request**: `GET /food-items?search=Pizza&category=fastfood&minPrice=200&maxPrice=300`
**Response (200 OK)**:
```json
[
  {
     "id": "abc-123",
     "name": "Margherita Pizza",
     ...
  }
]
```

---

## 3. Orders Module
*Requires Bearer Token.*

### Create Order (Cart logic)
**Request**: `POST /orders`
```json
{
  "items": [
    {
      "foodId": "abc-123",
      "quantity": 2
    },
    {
      "foodId": "xyz-789",
      "quantity": 1
    }
  ]
}
```
**Response (201 Created)**: (Dummy payment simulates "PAID" status automatically)
```json
{
  "id": "order-123",
  "userId": "user-abc",
  "status": "PAID",
  "total": 500,
  "createdAt": "2026-03-13T00:00:00.000Z",
  "updatedAt": "2026-03-13T00:00:00.000Z",
  "orderItems": [
    {
      "id": "item-123",
      "orderId": "order-123",
      "foodId": "abc-123",
      "quantity": 2,
      "food": { ... }
    }
  ]
}
```

### View My Orders
**Request**: `GET /orders/my-orders`
**Response (200 OK)**:
```json
[
  {
    "id": "order-123",
    "status": "PAID",
    "total": 500,
    ...
  }
]
```

### Cancel Order
**Request**: `DELETE /orders/order-123`
**Response (200 OK)**:
```json
{
  "id": "order-123",
  "status": "CANCELLED",
  ...
}
```
