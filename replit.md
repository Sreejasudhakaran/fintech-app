# Budget Buddy - Smart Personal Finance Tracker

## Overview

Budget Buddy is a modern FinTech web application designed as a personal finance tracker with AI-powered financial insights. The application enables users to track expenses, visualize spending patterns through interactive charts, and receive personalized AI-generated saving advice. Built as a full-stack solution, it provides secure user authentication, real-time data visualization, and a responsive mobile-first design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Styling**: TailwindCSS with shadcn/ui components for consistent, accessible UI design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Animation**: Framer Motion for smooth page transitions and interactive animations
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Charts**: Recharts for interactive data visualizations including pie charts and analytics

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript for full-stack type safety
- **Database ORM**: Drizzle ORM with PostgreSQL schema definitions
- **API Design**: RESTful endpoints for authentication, expense management, and AI advice
- **Authentication**: Dual approach supporting both Supabase Auth and custom auth endpoints
- **Storage**: In-memory storage implementation with interface for easy database swapping

### Database Design
- **Users Table**: Stores user authentication data with email, password, and timestamps
- **Expenses Table**: Core expense tracking with user relationships, amounts, categories, dates, and notes
- **Schema Management**: Drizzle migrations for database version control
- **Data Validation**: Zod schemas for consistent validation across client and server

### Authentication Strategy
- **Primary**: Supabase Auth integration for production-ready authentication
- **Fallback**: Custom authentication endpoints for development and testing
- **Session Management**: JWT-based authentication with secure session handling
- **User Isolation**: All data operations are scoped to authenticated users only

### AI Integration
- **Service**: OpenAI GPT integration for personalized financial advice
- **Data Processing**: Expense analysis and pattern recognition for intelligent recommendations
- **API Structure**: Dedicated endpoints for AI-powered features with expense context

### Development Workflow
- **Build System**: Vite for fast development and optimized production builds
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Component Architecture**: Modular component structure with shared UI library
- **Path Resolution**: Absolute imports using TypeScript path mapping for clean imports

## External Dependencies

### Core Services
- **Supabase**: Primary database and authentication service (PostgreSQL backend)
- **OpenAI**: AI-powered financial advice and insights generation
- **Neon Database**: Alternative PostgreSQL hosting option via @neondatabase/serverless

### UI Framework
- **Radix UI**: Accessible component primitives for consistent user interface
- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Recharts**: Chart library for expense visualization and analytics

### Development Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Static type checking for enhanced development experience
- **Drizzle Kit**: Database migration and schema management tools

### Optional Integrations
- **Replit Plugins**: Development environment enhancements for cartographer and dev banner
- **React Query**: Server state management and caching layer
- **Framer Motion**: Animation library for enhanced user experience

The architecture follows a modern full-stack pattern with clear separation of concerns, enabling scalable development while maintaining code quality and user experience standards.