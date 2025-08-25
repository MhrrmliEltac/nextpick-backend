# Favorites API Documentation

Bu API istifadəçilərin məhsulları favorilərə əlavə etməsi və idarə etməsi üçün endpoint-lər təqdim edir.

## Authentication

Bütün favorites endpoint-ləri authentication tələb edir. İstifadəçi cookie-də saxlanılan JWT token ilə giriş etməlidir.

### Cookie Authentication
- `access_token` - JWT token cookie-də saxlanılır
- Token avtomatik olaraq hər request ilə göndərilir
- Token 15 dəqiqə müddətində etibarlıdır
- Token bitdikdə `refresh_token` ilə yenilənə bilər

## Endpoints

### 1. Məhsulu Favorilərə Əlavə Etmək

**POST** `/api/favorites/add`

**Request Body:**
```json
{
  "productId": "product_id_here"
}
```

**Response:**
```json
{
  "message": "Məhsul favorilərə əlavə edildi",
  "favorite": {
    "_id": "favorite_id",
    "user": "user_id",
    "product": "product_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Məhsulu Favorilərdən Silmək

**DELETE** `/api/favorites/remove/:productId`

**Response:**
```json
{
  "message": "Məhsul favorilərdən silindi"
}
```

### 3. İstifadəçinin Favorilərini Görmək

**GET** `/api/favorites/my-favorites?page=1&limit=12`

**Response:**
```json
{
  "favorites": [
    {
      "_id": "favorite_id",
      "user": "user_id",
      "product": {
        "_id": "product_id",
        "productName": "Məhsul adı",
        "price": 100,
        "image": "image_url",
        "brand": {
          "_id": "brand_id",
          "brandName": "Marka adı"
        },
        "category": {
          "_id": "category_id",
          "title": "Kateqoriya adı"
        }
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalFavorites": 5,
  "totalPages": 1,
  "currentPage": 1,
  "limit": 12
}
```

### 4. Məhsulun Favori Statusunu Yoxlamaq

**GET** `/api/favorites/check/:productId`

**Response:**
```json
{
  "isFavorite": true,
  "favoriteId": "favorite_id"
}
```

### 5. Məhsulları Favori Statusu ilə Görmək

**GET** `/api/products/list-with-favorites?page=1&limit=12`

Bu endpoint authentication olmayan istifadəçilər üçün də işləyir, amma `isFavorite` sahəsi yalnız cookie token-i olan istifadəçilər üçün `true` olacaq.

**Response (Authenticated User):**
```json
{
  "products": [
    {
      "_id": "product_id",
      "productName": "Məhsul adı",
      "price": 100,
      "image": "image_url",
      "isFavorite": true,
      "brand": {
        "_id": "brand_id",
        "brandName": "Marka adı"
      },
      "category": {
        "_id": "category_id",
        "title": "Kateqoriya adı"
      }
    }
  ],
  "totalProducts": 50,
  "totalPages": 5,
  "currentPage": 1,
  "limit": 12,
  "userAuthenticated": true
}
```

**Response (Non-Authenticated User):**
```json
{
  "products": [
    {
      "_id": "product_id",
      "productName": "Məhsul adı",
      "price": 100,
      "image": "image_url",
      "isFavorite": false,
      "brand": {
        "_id": "brand_id",
        "brandName": "Marka adı"
      },
      "category": {
        "_id": "category_id",
        "title": "Kateqoriya adı"
      }
    }
  ],
  "totalProducts": 50,
  "totalPages": 5,
  "currentPage": 1,
  "limit": 12,
  "userAuthenticated": false
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Məhsul ID-si tələb olunur"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 404 Not Found
```json
{
  "message": "Məhsul tapılmadı"
}
```

### 500 Internal Server Error
```json
{
  "message": "Favorilərə əlavə edilə bilmədi",
  "error": "Error details"
}
```

## İstifadə Nümunəsi

1. İstifadəçi giriş edir və cookie-də JWT token saxlanılır
2. Məhsulları favori statusu ilə görür: `GET /api/products/list-with-favorites`
3. Məhsulu favorilərə əlavə edir: `POST /api/favorites/add`
4. Favorilərini görür: `GET /api/favorites/my-favorites`
5. Məhsulu favorilərdən silir: `DELETE /api/favorites/remove/:productId`

## Cookie Authentication Flow

1. **Login**: `POST /api/auth/signin` - Cookie-də `access_token` və `refresh_token` saxlanılır
2. **Automatic Token**: Hər request-də cookie avtomatik göndərilir
3. **Token Expiry**: `access_token` 15 dəqiqə sonra bitir
4. **Token Refresh**: `POST /api/auth/refresh` - `refresh_token` ilə yeni `access_token` alınır
5. **Logout**: `POST /api/auth/signout` - Cookie-lər təmizlənir
