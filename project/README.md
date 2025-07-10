# Workora Project

A modern web application for business and worker registration, authentication, and dashboard management, built with React, TypeScript, Supabase, and Vite.

## Features
- Business and worker registration with Supabase authentication
- Secure login and user type validation
- Waitlist and contact form with robust error handling
- Responsive UI with Tailwind CSS
- End-to-end (E2E) and component testing (Cypress, Jest, React Testing Library)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm

### Setup
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd project
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the project root:
     ```env
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
   - Replace with your actual Supabase credentials.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (default Vite port).

## Testing

### Run All Tests
- **Component/Unit Tests (Jest + React Testing Library):**
  ```bash
  npm test
  ```
- **End-to-End (E2E) Tests (Cypress):**
  - Open Cypress UI:
    ```bash
    npm run cypress:open
    ```
  - Run Cypress headless:
    ```bash
    npm run cypress:run
    ```

### Test Coverage
- All authentication, registration, and error edge cases are covered.
- Mocks are used for Supabase and toast notifications in tests.

## Project Structure
```
project/
  src/
    components/        # Reusable UI components
    contexts/          # React context providers (Auth)
    lib/               # Supabase client setup
    pages/             # Main app pages (Login, Register, Dashboard, etc.)
    types/             # TypeScript types
  cypress/             # Cypress E2E tests
  public/              # Static assets
  .env                 # Environment variables (not committed)
  README.md            # This file
```

## Detailed Working

### Authentication & Registration
- Uses Supabase for secure authentication.
- Business and worker users are registered with user type metadata.
- Login checks user type and provides clear error messages for mismatches.
- All errors (network, credentials, duplicate, RLS) are handled and surfaced to the UI.

### Error Handling
- All forms and flows show user-friendly error messages for network, credential, and validation issues.
- Missing or invalid Supabase credentials throw a clear error at startup.

### Testing
- **Jest/React Testing Library:** Unit/component tests for UI and logic, with mocks for Supabase and toast.
- **Cypress:** E2E tests for registration, login, waitlist, and contact flows.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE) 