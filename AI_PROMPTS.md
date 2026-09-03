AI Prompt Summary for MovieNest (important prompts used during development)

This file lists and summarizes the key AI prompts used during the project. Prompts were iterative and often abbreviated — below are the core intents and representative summaries (sensitive values like API keys were never included in prompts).

1. Project & architecture planning
- Intent: Define folder structure, boundaries (components/hooks/services/models) and responsibilities.
- Summary: "Design a small React+TS app structure for movie discovery. Components = UI, Hooks = ViewModel, Services = API/Firebase, Models = types. Suggest files and initial skeleton." 

2. UI foundation
- Intent: Build the header, hero, search panel, and movie card UI with responsive styling.
- Summary: "Create topbar, hero panel, search bar, movie grid and card components with CSS matching a curated visual style. Provide accessible markup and responsive rules." 

3. OMDb integration
- Intent: Implement search and mapping to internal Movie model and handle search edge cases.
- Summary: "Write an omdbService with search (s=) and exact title (t=) fallback, normalize responses to a Movie type, map poster URLs and build posterAccent gradients." 

4. AI code review
- Intent: Request the AI to inspect created files and propose precise edits or fixes.
- Summary: "Review components and services: suggest and apply small surgical edits to add types, extract helpers and fix runtime or TypeScript issues." 

5. Search improvements
- Intent: Make search robust and helpful (too-broad handling, exact-title attempts, curated discovery picks).
- Summary: "Add QueryTooBroad handling, exact title variants, and a loadInitialDiscoveryMovies function to show curated picks when the app opens." 

6. Movie Details
- Intent: Add details view by fetching OMDb using imdbID (i=) and present details in a modal-style component.
- Summary: "Add fetchMovieDetailsById service, MovieDetail model, useMovieDetails hook, and MovieDetails presentational component. Show loading and error states." 

7. Firebase foundation
- Intent: Prepare Firebase client initialization and Firestore favorites service while keeping secrets in env vars.
- Summary: "Add firebaseClient.ts reading VITE_FIREBASE_* env vars and export auth/firestore; add favoritesService wrappers (add/remove/list) for users/{uid}/favorites/{imdbID}. Do not include credentials." 

8. Authentication (Email/Password)
- Intent: Implement auth service and useAuth hook exposing register/login/logout and currentUser state.
- Summary: "Create firebaseAuthService (wrap onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut) and useAuth hook that subscribes and exposes register/login/logout and loading state." 

9. Firestore Favorites (persistence)
- Intent: Create useFavorites hook and wire favorites persistence into UI.
- Summary: "Implement useFavorites to load favorite IDs for currentUser.uid, optimistic updates for add/remove, toggleFavorite, and error handling. Keep Firestore calls in favoritesService." 

10. Debugging the Firebase blank-screen issue
- Intent: Diagnose and fix runtime crash when VITE_FIREBASE_* env vars are absent.
- Summary: "Add isFirebaseConfigured checks in firebaseClient; avoid initializing Firebase during module evaluation if env vars are missing; ensure subscribeToAuthChanges returns noop and calls back null when not configured." 

Notes
- Prompts were used interactively: planning prompts, follow-ups, and surgical edit requests. Each prompt was focused on a single goal (add hook, create component, fix runtime error), which improved iteration speed and safety.
- No secrets, API keys, or .env values were included in any prompt or documentation here.
