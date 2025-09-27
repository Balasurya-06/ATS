# ACCUST Backend

## Environment Variables
- Copy `.env.example` to `.env` and update with your values
- Update MongoDB connection string
- Change JWT_SECRET in production

## Installation
```bash
npm install
```

## Development
```bash
npm run dev
```

## Production
```bash
npm start
```

## API Documentation

### Authentication
- POST `/api/auth/login` - PIN authentication
- POST `/api/auth/verify` - Verify JWT token

### Profiles
- POST `/api/profiles` - Create new profile
- GET `/api/profiles` - Get all profiles (with pagination)
- GET `/api/profiles/:id` - Get profile by ID
- PUT `/api/profiles/:id` - Update profile
- DELETE `/api/profiles/:id` - Delete profile
- GET `/api/profiles/search` - Search profiles

### Statistics
- GET `/api/stats` - Get dashboard statistics

### File Upload
- POST `/api/upload` - Upload files (photos, documents)