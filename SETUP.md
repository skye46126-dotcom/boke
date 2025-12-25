# Personal Blog Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- AWS S3 account (for image storage)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for both the root workspace and the frontend.

### 2. Setup Database

Start PostgreSQL and create a database:

```bash
createdb personal_blog
```

### 3. Configure Environment

Copy the example environment file and configure it:

```bash
cd frontend
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/personal_blog

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET=your_bucket_name

# Admin Path (generate a random string)
ADMIN_PATH=manage-panel-$(openssl rand -hex 16)
```

### 4. Run Database Migration

```bash
cd frontend
npm run migrate
```

This will create the necessary database tables.

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Admin Access

Access the admin panel using the hidden URL:

```
http://localhost:3000/api/manage/[your-ADMIN_PATH]/articles
```

Replace `[your-ADMIN_PATH]` with the value from your `.env.local` file.

## API Endpoints

### Public Endpoints

- `GET /api/articles?page=1&limit=10` - Get published articles
- `GET /api/articles/[slug]` - Get article by slug

### Admin Endpoints

All admin endpoints require the correct `ADMIN_PATH` in the URL:

- `GET /api/manage/[adminPath]/articles` - List all articles
- `POST /api/manage/[adminPath]/articles` - Create article
- `GET /api/manage/[adminPath]/articles/[id]` - Get article
- `PUT /api/manage/[adminPath]/articles/[id]` - Update article
- `DELETE /api/manage/[adminPath]/articles/[id]` - Delete article
- `POST /api/manage/[adminPath]/upload/image` - Upload image
- `GET /api/manage/[adminPath]/upload/images` - List images
- `DELETE /api/manage/[adminPath]/upload/images/[id]` - Delete image

## Testing

Run the property-based tests:

```bash
cd backend
npm test
```

## Production Build

```bash
cd frontend
npm run build
npm start
```

## Docker Deployment (Optional)

```bash
docker-compose up -d
```

## Troubleshooting

### Database Connection Error

Make sure PostgreSQL is running and the `DATABASE_URL` is correct:

```bash
psql $DATABASE_URL -c "SELECT 1"
```

### AWS S3 Upload Error

Verify your AWS credentials and bucket permissions:

```bash
aws s3 ls s3://your-bucket-name
```

### Admin Path Not Working

Make sure the `ADMIN_PATH` environment variable is set and matches the URL you're accessing.

## Security Notes

1. **Never commit `.env.local`** - It contains sensitive credentials
2. **Keep ADMIN_PATH secret** - This is your only authentication
3. **Use HTTPS in production** - Protect data in transit
4. **Regular backups** - Backup your database regularly
5. **Update dependencies** - Keep packages up to date

## Next Steps

1. Build frontend UI components
2. Create admin dashboard
3. Implement Markdown editor
4. Add SEO optimization
5. Configure CDN for images
6. Set up monitoring and logging
