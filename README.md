# MovieNest (Intern Task 3)

MovieNest is a compact movie discovery application built for an AI engineering assignment. It demonstrates an approachable architecture and integration with OMDb and Firebase for authentication and persistent per-user favorites.

Features
- OMDb movie search with exact-title fallback and curated discovery picks
- Responsive movie grid and detail view (fetches details by IMDb ID)
- Email/password registration, login, and logout via Firebase Auth
- Per-user favorites persisted to Firestore (users/{uid}/favorites/{imdbID})
- Firestore security rules that restrict favorites to their owning user
- Accessible UI components and responsive styling
- TypeScript types, hooks for state (useMovieSearch, useMovieDetails, useAuth, useFavorites), and service layer for external APIs

Tech stack
- React 18 + TypeScript
- Vite (development server and build)
- Firebase Auth and Firestore (client SDK)
- OMDb API (external movie data)

Architecture overview
- Components: Presentational UI only (src/components)
- Hooks: ViewModel / business logic (src/hooks)
- Services: External API communication and Firebase wrappers (src/services)
- Models/Types: Type contracts (src/models)

Environment variables (Vite)
- Provide Firebase and OMDb configuration via Vite env variables (do NOT commit these):
  - VITE_OMDB_API_KEY
  - VITE_FIREBASE_API_KEY
  - VITE_FIREBASE_AUTH_DOMAIN
  - VITE_FIREBASE_PROJECT_ID
  - VITE_FIREBASE_STORAGE_BUCKET
  - VITE_FIREBASE_MESSAGING_SENDER_ID
  - VITE_FIREBASE_APP_ID
  - VITE_FIREBASE_MEASUREMENT_ID (optional)
- Create a local .env.local with these keys for development. Do not commit .env.local; it is ignored by .gitignore.

How to run locally
1. Install dependencies
   npm install

2. Create a local environment file (.env.local) with the variables listed above (do NOT add secrets to git).

3. Start the dev server
   npm run dev

4. Build for production
   npm run build
   npm run preview

Firebase Auth / Firestore setup
- Enable Email/Password sign-in in the Firebase Console for your project.
- Create a Firestore database (Native mode).
- Deploy Firestore security rules (local file: firestore.rules) to enforce per-user access:
  match /users/{userId}/favorites/{favoriteId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
- Use the same Firebase project keys in .env.local that match the Firestore rules deployment.

Testing and validation
- Type check: npm run typecheck (tsc --noEmit)
- Build: npm run build
- Manual browser testing was used to validate registration/login, saving favorites, persistence across refresh, and security rules.

AI-assisted development note
- This project was developed with an AI assistant that helped generate code, propose architecture, assist debugging, and prepare tests. The developer reviewed and validated all AI-generated changes.

Repository
- GitHub: (repository URL used during development)

If you have questions about local setup, Firebase deployment, or testing steps, ask and guidance can be provided.