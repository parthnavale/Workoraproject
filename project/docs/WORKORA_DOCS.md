# Workora Project Documentation

## 1. Overview
Workora is a modern web application for business and worker registration, authentication, and dashboard management. It leverages React, TypeScript, Supabase, and Vite for a robust, scalable, and developer-friendly experience.

## 2. Architecture
- **Frontend:** React (with TypeScript), Vite, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Testing:** Jest, React Testing Library, Cypress

### Directory Structure
```
project/
  src/
    components/        # UI components (Header, Footer, ProtectedRoute, etc.)
    contexts/          # React Contexts (AuthContext)
    lib/               # Supabase client setup
    pages/             # Main app pages (Login, Register, Dashboard, etc.)
    types/             # TypeScript types
  cypress/             # Cypress E2E tests
  public/              # Static assets
  .env                 # Environment variables (not committed)
  README.md            # Project overview and setup
  docs/WORKORA_DOCS.md # This documentation
```

## 3. Authentication Flow
- **Registration:**
  - Users can register as either a business or a worker.
  - Registration stores user type in Supabase user metadata.
  - Duplicate email and weak password errors are handled and shown to the user.
- **Login:**
  - Users log in with email and password.
  - After login, the app checks the user type in metadata and only allows access to the correct dashboard.
  - User type mismatches are caught and surfaced as clear errors.
- **Session Management:**
  - AuthContext provides user state and signIn/signOut methods.
  - Session is persisted and restored on page reload.

## 4. Error Handling
- **Supabase Credentials:**
  - The app throws a clear error if Supabase credentials are missing or invalid.
- **Network Issues:**
  - All forms and flows show user-friendly messages for network errors.
- **Credential Issues:**
  - Invalid API keys, duplicate users, and RLS errors are caught and shown to the user.
- **Validation:**
  - All forms validate required fields and password strength before submission.

## 5. Testing Strategy
- **Unit/Component Tests:**
  - Located in `src/pages/__tests__/`
  - Use Jest and React Testing Library.
  - Supabase and toast are mocked for isolation.
  - Edge cases (invalid credentials, user type mismatch, network error) are covered.
- **E2E Tests:**
  - Located in `cypress/e2e/`
  - Use Cypress to simulate real user flows (registration, login, waitlist, contact form).
- **Running Tests:**
  - `npm test` for Jest tests
  - `npm run cypress:open` or `npm run cypress:run` for Cypress

## 6. Environment Variables
- `.env` file in the project root:
  ```env
  VITE_SUPABASE_URL=your-supabase-url
  VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
  ```
- Never commit your `.env` file.

## 7. Extending the App
- Add new pages to `src/pages/` and link them in the router.
- Add new components to `src/components/`.
- Use the AuthContext for authentication-aware features.
- Add new tests in `src/pages/__tests__/` or `cypress/e2e/` as needed.

## 8. Contact
For questions or contributions, open an issue or pull request on the repository. 