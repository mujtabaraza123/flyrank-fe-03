Manual Review and Corrections

This document records issues identified during manual and browser testing and describes the corrective actions carried out (noting whether AI assisted in the implementation).

Identified issues during testing

1. Broken / missing poster fallbacks
- Observation: Some movies returned by OMDb include "N/A" for the Poster field. In early testing this produced awkward blank poster areas or broken images.
- Action taken: Added normalizePosterUrl helper (service layer) to map "N/A" to null and adjusted MovieCard to render a styled gradient background when a poster is not available. This was implemented with AI help and validated manually in the browser.
- Implemented: services/omdbService.ts, components/movies/MovieCard.tsx

2. Movie Details click interaction not always reliable
- Observation: Clicking on a MovieCard sometimes did not open the details view due to event propagation and layout interactions. Favorite button clicks could also open the details inadvertently.
- Action taken: Made movie-card element keyboard-focusable (role="button", tabIndex=0), added key handlers for Enter/Space, and ensured FavoriteButton.stopPropagation prevents opening details. Also added explicit onClick on poster area to be robust against nested elements. These changes were applied after testing and were implemented with AI-assisted edits and manual verification.
- Implemented: components/movies/MovieCard.tsx, components/favorites/FavoriteButton.tsx

3. Firebase configuration causing blank page
- Observation: Importing and initializing Firebase during module load caused an uncaught runtime error when Vite env vars were missing; this prevented React from rendering (blank white page).
- Action taken: Added isFirebaseConfigured detection and wrapped initializeApp/getAuth/getFirestore in try/catch. The auth service was adjusted to provide a noop subscription when Firebase is not configured, and favoritesService guards against null firestore. This prevented module-evaluation-time throws and allowed the app to render when .env values were absent. The fix was implemented with AI-suggested changes and tested manually.
- Implemented: services/firebaseClient.ts, services/firebaseAuthService.ts, services/favoritesService.ts

4. Search behavior and OMDb limitations
- Observation: The OMDb API can return ambiguous results or "Too many results" errors for broad queries. Users could receive unhelpful responses on simple queries.
- Action taken: Implemented QueryTooBroadError handling, exact-title variants matching attempt (t=) when s= yielded no usable results, and a curated discovery list for the initial app load. This improved search reliability in manual browsing tests.
- Implemented: services/omdbService.ts, hooks/useMovieSearch.ts

Notes on AI vs Manual work
- Identification: Issues were discovered by manual browser testing and code inspection.
- Implementation: Most fixes were applied by AI-generated edits after the developer provided targeted prompts (e.g., "add keyboard handlers", "guard firebase init when env missing"). The developer reviewed, ran tests, and adjusted where necessary.
- Verification: The developer validated all fixes in the running app (register/login, favorites persistence, search cases, details modal, UI alignment).

Conclusion
- The project required iterative manual validation in the browser; issues found were fixed with AI-assisted edits and verified by the developer. All critical issues identified during manual testing are now addressed and verified.