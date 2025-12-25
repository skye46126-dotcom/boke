# API Documentation

## Base URL

Development: `http://localhost:3000`
Production: `https://yourdomain.com`

## Authentication

Admin endpoints require the correct `ADMIN_PATH` in the URL. This path is configured via the `ADMIN_PATH` environment variable and should be kept secret.

## Public Endpoints

### Get Published Articles

```http
GET /api/articles?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10, max 50

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "uuid",
        "title": "Article Title",
        "slug": "article-title",
        "excerpt": "Brief description",
        "content": "Full markdown content",
        "status": "published",
        "created_at": "2025-12-25T00:00:00.000Z",
        "updated_at": "2025-12-25T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### Get Article by Slug

```http
GET /api/articles/:slug
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Article Title",
    "slug": "article-title",
    "excerpt": "Brief description",
    "content": "Full markdown content",
    "status": "published",
    "created_at": "2025-12-25T00:00:00.000Z",
    "updated_at": "2025-12-25T00:00:00.000Z"
  }
}
```

## Admin Endpoints

All admin endpoints require the `ADMIN_PATH` in the URL.

### Get All Articles (Admin)

```http
GET /api/manage/:adminPath/articles
```

Returns all articles including drafts.

### Create Article

```http
POST /api/manage/:adminPath/articles
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Article Title",
  "slug": "article-title",
  "content": "Full markdown content",
  "excerpt": "Brief description",
  "status": "draft"
}
```

**Notes:**
- `slug` is optional, will be auto-generated from title if not provided
- `status` must be either "draft" or "published"
- `excerpt` is optional

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Article Title",
    "slug": "article-title",
    "content": "Full markdown content",
    "excerpt": "Brief description",
    "status": "draft",
    "created_at": "2025-12-25T00:00:00.000Z",
    "updated_at": "2025-12-25T00:00:00.000Z"
  },
  "message": "Article created successfully"
}
```

### Get Article by ID

```http
GET /api/manage/:adminPath/articles/:id
```

### Update Article

```http
PUT /api/manage/:adminPath/articles/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "status": "published"
}
```

All fields are optional. Only provided fields will be updated.

### Delete Article

```http
DELETE /api/manage/:adminPath/articles/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

### Get Statistics

```http
GET /api/manage/:adminPath/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "published": 45,
    "draft": 5
  }
}
```

## Upload Endpoints

### Upload Image

```http
POST /api/manage/:adminPath/upload/image
Content-Type: multipart/form-data
```

**Form Data:**
- `image`: Image file (JPEG, PNG, GIF, WebP)

**Constraints:**
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/gif, image/webp

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://cdn.example.com/images/abc123.jpg",
    "filename": "abc123.jpg",
    "size": 102400,
    "markdown": "![image](https://cdn.example.com/images/abc123.jpg)"
  },
  "message": "Image uploaded successfully"
}
```

### Get All Images

```http
GET /api/manage/:adminPath/upload/images?limit=50
```

**Query Parameters:**
- `limit` (optional): Max items to return, default 50, max 100

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "filename": "abc123.jpg",
      "original_name": "my-photo.jpg",
      "url": "https://cdn.example.com/images/abc123.jpg",
      "size": 102400,
      "mime_type": "image/jpeg",
      "uploaded_at": "2025-12-25T00:00:00.000Z"
    }
  ]
}
```

### Delete Image Record

```http
DELETE /api/manage/:adminPath/upload/images/:id
```

**Note:** This only deletes the database record, not the file from S3.

**Response:**
```json
{
  "success": true,
  "message": "Image record deleted successfully"
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

1. **SQL Injection Protection**: All inputs are validated and sanitized
2. **Hidden Admin URLs**: Admin endpoints require secret path
3. **File Type Validation**: Only allowed image types can be uploaded
4. **File Size Limits**: Maximum 5MB per image
5. **Input Validation**: All request data is validated before processing

## Rate Limiting

Currently not implemented. Consider adding rate limiting in production:
- Public endpoints: 100 requests/minute
- Admin endpoints: 1000 requests/minute
- Upload endpoints: 10 requests/minute

## CORS

CORS is handled by Next.js. Configure in `next.config.js` if needed for external domains.
