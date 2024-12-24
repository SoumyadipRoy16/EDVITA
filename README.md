# EDVITA: Streamlining Academic Success

A comprehensive online platform built with Next.js for managing coding tests and internship applications. This system provides a seamless experience for candidates to take coding tests while giving administrators powerful tools to manage and evaluate applications.

## 📚 Project Overview

The Test Management System is designed to streamline the technical assessment process for internship positions. It features a modern, responsive interface built with Next.js and includes robust testing capabilities, user authentication, and comprehensive admin controls.

## 🚀 Key Features

### For Candidates
- **Secure Authentication**: Complete login/registration system with social media integration
- **Interactive Dashboard**: Track test performance and application status
- **Code Testing Environment**: Real-time code editor with multiple language support
- **Automated Evaluation**: Instant feedback on code submissions
- **Profile Management**: Comprehensive profile and educational background tracking
- **Application Tracking**: Real-time status updates on internship applications

### For Administrators
- **Comprehensive Dashboard**: Monitor all test activities and submissions
- **Question Management**: Create and manage coding problems
- **Candidate Evaluation**: Review and grade submissions
- **Application Processing**: Approve or reject internship applications
- **Performance Analytics**: Track candidate performance metrics
- **User Management**: Manage candidate accounts and permissions

## 🛠️ Technology Stack

### Frontend
- Next.js 13 with App Router
- TypeScript
- Tailwind CSS
- ShadcnUI Components
- Monaco Editor for code editing

### Backend
- Next.js API Routes
- MongoDB for database
- Redis for caching
- JWT Authentication

### Key Libraries
- Mongoose for MongoDB interaction
- Redis client for caching
- JWT for authentication
- Nodemailer for email notifications

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── test/             # Testing interface
│   └── ...               # Other app pages
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── landing/          # Landing page components
│   ├── test/            # Test-related components
│   └── ui/              # UI components
├── contexts/             # React contexts
├── lib/                  # Utility functions
├── models/              # MongoDB models
├── styles/              # Global styles
└── types/               # TypeScript types
```

## 🔐 Security Features

- JWT-based authentication
- Secure password handling
- Rate limiting
- Anti-cheat measures for tests
- Session management
- Input validation
- XSS protection

## 📈 Performance Optimization

- Server-side rendering with Next.js
- Redis caching for improved performance
- Optimized database queries
- Lazy loading of components
- Image optimization
- Efficient state management

## 👥 Target Users

1. **Candidates**
   - Students seeking internship opportunities
   - Job seekers taking technical assessments
   - Developers practicing coding problems

2. **Administrators**
   - HR personnel
   - Technical recruiters
   - Team leads
   - Interview coordinators

## 📱 Responsive Design

- Mobile-first approach
- Tablet-optimized layouts
- Desktop-friendly interface
- Consistent experience across devices
- Test environment optimized for desktop use

## 🔄 Real-time Features

- Live code compilation
- Real-time test case validation
- Instant feedback on submissions
- Live timer updates
- Application status updates
- Admin monitoring capabilities
