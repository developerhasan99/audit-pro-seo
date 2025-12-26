# AuditProSEO JavaScript - Development Guide

## Getting Started

### Prerequisites

- Node.js 20 or higher
- MySQL 8.4
- npm or yarn
- Git

### Initial Setup

1. **Install Dependencies**

   Backend:
   ```bash
   cd backend
   npm install
   ```

   Frontend:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**

   Copy `.env.example` to `.env` in the backend directory and update the values:
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Setup Database**

   Create a MySQL database:
   ```sql
   CREATE DATABASE audit_pro_seo;
   CREATE USER 'audit_pro_seo'@'localhost' IDENTIFIED BY 'audit_pro_seo';
   GRANT ALL PRIVILEGES ON audit_pro_seo.* TO 'audit_pro_seo'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Start Development Servers**

   Backend (terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   Frontend (terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

## Project Architecture

### Backend Architecture

The backend follows a layered architecture:

- **Routes**: Handle HTTP requests and responses
- **Middleware**: Authentication, error handling, validation
- **Models**: Database models using Sequelize ORM
- **Services**: Business logic and data processing
- **Crawler**: Web crawling and page analysis

### Frontend Architecture

The frontend uses a component-based architecture:

- **Pages**: Top-level route components
- **Components**: Reusable UI components
- **Store**: Global state management with Zustand
- **API**: HTTP client and API service methods
- **Hooks**: Custom React hooks

## Code Style

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` type when possible
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript for prop types

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase with descriptive names

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

### Docker

```bash
docker-compose up --build
```

## Database Migrations

The project uses Sequelize for database management. Models are automatically synced in development mode.

For production, you should create proper migrations:

```bash
cd backend
npx sequelize-cli migration:generate --name migration-name
npx sequelize-cli db:migrate
```

## Debugging

### Backend Debugging

Use VS Code debugger or add breakpoints with:
```typescript
debugger;
```

### Frontend Debugging

Use React DevTools and browser developer tools.

## Common Issues

### Port Already in Use

If port 3000 or 5173 is already in use:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Connection Issues

- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### CORS Issues

- Verify `CORS_ORIGIN` in backend `.env`
- Check proxy configuration in `vite.config.ts`

## Next Steps

1. Implement the web crawler module
2. Add SEO issue analyzers
3. Create dashboard charts
4. Implement WebSocket for live updates
5. Add data export functionality
6. Write comprehensive tests
7. Add API documentation

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
