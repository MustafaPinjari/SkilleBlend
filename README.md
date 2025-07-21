# Accessibility Widget 2025

A modern, AI-powered accessibility widget that enhances web accessibility with real-time adjustments and intelligent suggestions. This widget helps make websites more accessible to users with various needs and preferences.

![Accessibility Widget Demo](/public/Dark.jpeg)
*Screenshot of the Accessibility Widget in action*

## 🌟 Features

- **Visual Adjustments**
  - Dynamic contrast control
  - Text size and spacing customization
  - Dark/Light mode toggle
  - Dyslexia-friendly font option

- **Interactive Elements**
  - Draggable and collapsible widget
  - Real-time preview of changes
  - Keyboard navigation support
  - Voice control capabilities

- **AI-Powered**
  - Smart accessibility suggestions
  - Automated issue detection
  - Personalized settings recommendations

- **User Experience**
  - Smooth animations and transitions
  - Intuitive interface
  - Responsive design
  - Cross-browser compatibility

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Python (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MustafaPinjari/SkillBlend.git
   cd accessibility-widget
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   # or
   yarn install

   # Backend dependencies
   cd accessibility_backend
   pip install -r requirements.txt
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   # Add other environment variables as needed
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd accessibility_backend
   python manage.py runserver
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser**
   Visit `http://localhost:3000` to see the application in action.

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Python 3.8+
- PostgreSQL (recommended) or SQLite
- Redis (for Celery task queue)

### Backend Setup

1. **Virtual Environment**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   cd accessibility_backend
   pip install -r requirements.txt
   ```

3. **Database Setup**
   ```bash
   # Apply migrations
   python manage.py migrate
   
   # Create superuser (optional)
   python manage.py createsuperuser
   ```

4. **Environment Variables**
   Create a `.env` file in the `accessibility_backend` directory:
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   <!-- DATABASE_URL=postgresql://user:password@localhost:5432/accessibility_db --> optional as we set it to default sqlite
   CELERY_BROKER_URL=redis://localhost:6379/0
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_GA_TRACKING_ID=your-ga-tracking-id
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd accessibility_backend
   python manage.py runserver
   ```

2. **Start Frontend Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Start Celery Worker** (in a new terminal)
   ```bash
   cd accessibility_backend
   celery -A accessibility_backend worker -l info
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Django Admin: http://localhost:8000/admin

## 🏗️ Implementation Choices

### Frontend Architecture
- **Next.js**: Chosen for its server-side rendering capabilities, API routes, and seamless React integration.
- **TypeScript**: Provides static typing for better code quality and developer experience.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and consistent design.
- **Zustand**: Lightweight state management solution for global state needs.
- **React Hook Form**: For efficient form handling and validation.
- **Framer Motion**: For smooth animations and transitions.

### Backend Architecture
- **Django REST Framework**: Robust framework for building RESTful APIs with excellent documentation.
- **PostgreSQL**: Production-ready relational database with JSON field support.
- **Celery & Redis**: For handling asynchronous tasks like accessibility scanning and reporting.
- **JWT Authentication**: Secure token-based authentication system.
- **Django CORS Headers**: For handling cross-origin requests in development.

### Accessibility Features
- **WCAG 2.1 Compliance**: All components meet AA compliance standards.
- **Keyboard Navigation**: Full keyboard support for all interactive elements.
- **ARIA Attributes**: Proper ARIA labels and roles for screen readers.
- **Color Contrast**: Dynamic contrast adjustment with WCAG 2.1 AA compliance.
- **Reduced Motion**: Respects user's motion preferences.

### Performance Optimizations
- **Code Splitting**: Automatic code splitting via Next.js.
- **Lazy Loading**: Components and assets are loaded on demand.
- **Caching**: Implemented at multiple levels (browser, CDN, database).
- **Image Optimization**: Automatic image optimization with Next.js Image component.

### Security Measures
- **CSRF Protection**: Enabled for all state-changing operations.
- **CORS**: Properly configured for production and development environments.
- **Content Security Policy**: Implemented to prevent XSS attacks.
- **Rate Limiting**: Implemented on sensitive endpoints.

## 🛠️ Usage

1. Click the accessibility icon in the bottom-right corner to open the widget
2. Adjust settings using the intuitive controls
3. See changes in real-time on the page
4. Use the AI suggestions to improve accessibility
5. Save your preferences for future visits

## 📸 Screenshots

### Main Interface
![Main Interface](./public/light.jpeg)

### Settings Panel
![Settings Panel](./public/setting.png)

### Dark Mode
![Dark Mode](./public/Dark.jpeg)

### Authentication
![Authentication](/public/auth.png)

## 🛠️ Built With

- **Frontend**
  - Next.js
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - React Hook Form

- **Backend**
  - Django
  - Django REST Framework
  - Celery (for async tasks)
  - PostgreSQL

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Mustafa Pinjari - [@https.mustafa.in](https://instagram.in/https.mustafa.in) - unlessuser99@gmail.com

Project Link: [https://github.com/MustafaPinjari/SkilleBlend](https://github.com/MustafaPinjari/SkilleBlend.git)

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Django Documentation](https://docs.djangoproject.com/)
- [Inspired by Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

<div align="center">
  Made with ❤️ by Mustafa Pinjari
</div>