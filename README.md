# SEOnaut JavaScript Edition

A complete JavaScript/TypeScript conversion of SEOnaut - an open-source SEO auditing tool.

## Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL 8.4
- **ORM**: Sequelize
- **Authentication**: Express Session (cookie-based)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Recharts

## Features

- ✅ User authentication (signup, signin, signout)
- ✅ Project management (create, read, update, delete)
- ✅ Configurable crawl options
- 🚧 Web crawler implementation (in progress)
- 🚧 SEO issue detection (50+ analyzers to implement)
- 🚧 Dashboard with charts
- 🚧 Live crawl monitoring via WebSocket
- 🚧 Data export (CSV, Sitemap, WACZ)
- 🚧 URL explorer
- 🚧 Historical data tracking

## Quick Start

### Prerequisites

- Node.js 20 or higher
- MySQL 8.4
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   cd seonaut-js
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Database Setup**
   - Create a MySQL database named `seonaut`
   - The tables will be created automatically when the backend starts

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Docker Setup

```bash
docker-compose up -d
```

Access the application at http://localhost:5173

## Project Structure

```
seonaut-js/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── database/        # Database connection
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   ├── crawler/         # Web crawler
│   │   ├── websocket/       # WebSocket handlers
│   │   └── server.ts        # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # React components
│   │   ├── api/             # API client
│   │   ├── store/           # Zustand stores
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utilities
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
├── docs/                    # Documentation
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password
- `DELETE /api/auth/account` - Delete account

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Crawl (Coming Soon)
- `POST /api/crawl/start/:projectId` - Start crawl
- `POST /api/crawl/stop/:projectId` - Stop crawl
- `GET /api/crawl/status/:crawlId` - Get crawl status

## Development

### Backend Development

```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript
npm run start        # Start production server
npm test             # Run tests
npm run lint         # Lint code
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
SERVER_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=seonaut
DB_USER=seonaut
DB_PASSWORD=seonaut

SESSION_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173

CRAWLER_THREADS=2
CRAWLER_TIMEOUT_HOURS=2
CRAWLER_RANDOM_DELAY_MS=1500
```

## Conversion Status

### ✅ Completed
- Project structure and setup
- Database models (User, Project, Crawl, PageReport, Issue)
- Authentication system
- Project CRUD operations
- Frontend pages (SignIn, SignUp, ProjectList, ProjectAdd, Dashboard)
- State management with Zustand
- API client with Axios
- Docker setup

### 🚧 In Progress
- Web crawler implementation
- SEO analyzers (50+ issue types)
- Dashboard charts and statistics
- WebSocket for live updates

### 📋 To Do
- Complete crawler module
- Implement all SEO issue analyzers
- Add data export functionality
- Create URL explorer
- Add historical data tracking
- Implement testing
- Add comprehensive documentation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Original Project

This is a JavaScript/TypeScript conversion of [SEOnaut](https://github.com/stjudewashere/seonaut) by StJudeWasHere.

## Support

For issues and questions, please open an issue on GitHub.
