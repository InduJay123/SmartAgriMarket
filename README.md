# SmartAgriMarket 🌾

A modern agricultural marketplace platform built with React, TypeScript, and Vite. SmartAgriMarket connects farmers directly with buyers, enabling seamless trading of agricultural products.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🛒 Product listing and marketplace
- 👨‍🌾 Farmer and buyer profiles
- 🔍 Advanced search and filtering
- 💬 Real-time messaging system
- 📊 Analytics dashboard
- 📱 Responsive design for all devices
- 🔐 Secure authentication
- 💳 Payment integration

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** CSS/Tailwind CSS
- **State Management:** React Context API
- **Routing:** React Router
- **HTTP Client:** Axios

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git**

Check your versions:
```bash
node --version
npm --version
git --version
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SmartAgriMarket.git
   cd SmartAgriMarket
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   copy .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_API_URL=your_api_url
   VITE_API_KEY=your_api_key
   # Add other environment variables as needed
   ```

## 🎯 Running the Project

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will open at `http://localhost:5173` (or another port if 5173 is busy).

**Alternative ports:**
```bash
# If you want to specify a different port
npm run dev -- --port 3000
```

### Production Build

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist` folder.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
SmartAgriMarket/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main App component
│   ├── App.css         # Global styles
│   ├── main.tsx        # Entry point
│   └── index.css       # Base styles
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tsconfig.app.json   # App TypeScript config
├── tsconfig.node.json  # Node TypeScript config
├── vite.config.ts      # Vite configuration
└── README.md           # Project documentation
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (type-check + build) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_KEY=your_api_key_here

# Optional: Add based on your requirements
# Firebase/Supabase
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain

# Payment Gateway
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

**Note:** All environment variables must be prefixed with `VITE_` to be accessible in your React application.

## 🏗️ Build Configuration

This project uses Vite with the following plugins:

- **@vitejs/plugin-react** - Uses Babel for Fast Refresh
- Hot Module Replacement (HMR) enabled for instant updates during development
- TypeScript support with strict type checking

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Ensure all tests pass before submitting PR
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
npm run dev -- --port 3001
```

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
npm run build --verbose
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - [Your GitHub Profile](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Thanks to all contributors
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

## 🔗 Links

- [Documentation](https://github.com/YOUR_USERNAME/SmartAgriMarket/wiki)
- [Issue Tracker](https://github.com/YOUR_USERNAME/SmartAgriMarket/issues)
- [Live Demo](https://your-demo-url.com)

---

Made with ❤️ for the Agricultural Community
