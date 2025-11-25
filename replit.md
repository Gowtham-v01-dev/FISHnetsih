# Fish Net Application

## Overview
Fish Net is a Progressive Web App (PWA) for fishermen to identify fish species using AI, track catches, view locations on maps, and maintain a history of their catches. Built with Vite, React, TypeScript, and shadcn/ui.

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **AI/ML**: TensorFlow.js and Hugging Face Transformers
- **Maps**: Leaflet and Mapbox GL
- **State Management**: TanStack Query (React Query)
- **Local Storage**: IndexedDB via idb library
- **PWA**: Service Worker with offline support

### Project Structure
```
src/
├── components/        # Reusable UI components
│   ├── analyze/      # Fish analysis components
│   ├── auth/         # Authentication components
│   ├── history/      # Catch history components
│   ├── layout/       # Layout components (navigation, etc.)
│   ├── map/          # Map-related components
│   ├── offline/      # Offline indicator
│   ├── reference/    # Species library
│   ├── reports/      # PDF generation
│   ├── social/       # Social feed components
│   └── ui/           # shadcn/ui base components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components (routes)
├── services/         # Business logic and data services
│   ├── auth.ts       # Authentication service
│   ├── database.ts   # IndexedDB database service
│   ├── pwa.ts        # PWA/Service Worker service
│   ├── sampleData.ts # Sample data seeding
│   ├── social.ts     # Social features
│   ├── sync.ts       # Sync service
│   └── tensorflow.ts # AI/ML service
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Configuration

### Vite Configuration
- **Host**: 0.0.0.0 (required for Replit)
- **Port**: 5000 (Replit standard)
- **Allowed Hosts**: ["*"] (required for Replit's proxy environment)
- **HMR**: Configured for Replit's proxy environment with WSS protocol

### Workflow
- **Name**: Start application
- **Command**: `npm run dev`
- **Port**: 5000 (webview output)

### Deployment Configuration
- **Target**: Autoscale (stateless web app)
- **Build**: `npm run build`
- **Run**: `npm run preview`

## Key Features
1. **Fish Identification**: AI-powered fish species identification using camera
2. **Catch History**: Track and manage fishing catches with images
3. **Map Integration**: View catch locations on interactive maps
4. **Offline Support**: PWA with service worker for offline functionality
5. **Species Library**: Reference library for fish species
6. **Social Feed**: Share catches with the community
7. **PDF Reports**: Generate catch reports

## Development Notes

### Important Files
- `vite.config.ts`: Vite configuration with Replit-specific settings
- `src/services/database.ts`: IndexedDB implementation for local data storage
- `src/services/tensorflow.ts`: TensorFlow.js integration for AI features

### Known Issues Fixed
- Fixed import error: Changed `HistoryList` from named export to default export import in `HistoryPage.tsx`

### Environment Setup
- No backend server required (frontend-only app)
- Uses IndexedDB for local data persistence
- Service Worker handles offline capabilities
- Sample data is seeded on first load

## Recent Changes

### Footer Navigation Fix & Real AI Chatbot Integration (2025-11-25)
1. **Footer Navigation Multilingual Fix**: Resolved text overflow issues for Tamil and other languages
   - Reduced padding from p-3 to p-2 for more compact layout
   - Added max-width constraint (72px) with whitespace-nowrap to prevent wrapping
   - Reduced font size to text-[10px] with leading-tight for better fit
   - Added text-ellipsis for graceful truncation when labels are too long
   - Reduced icon size from 24px to 22px for balanced proportions
   - All navigation labels now display on single line across all supported languages
2. **Web-LLM AI Chatbot Integration**: Replaced fake AI responses with real offline AI model
   - Installed and integrated @mlc-ai/web-llm package (v0.2.80)
   - Created useWebLLM custom hook for managing MLC AI engine
   - Model: Llama-3.2-1B-Instruct-q4f16_1-MLC (optimized for in-browser inference)
   - WebGPU-powered inference running entirely in browser (no server required)
   - Streaming responses with real-time chunk-by-chunk display
   - Full error handling and loading states with progress tracking
   - Model cached in IndexedDB for true offline functionality
   - Conversation history maintained for contextual responses
   - Replaced legacy AIChat component with new AIChatInterface
   - Browser compatibility check for WebGPU support
3. **Technical Implementation**:
   - New hook: `src/hooks/useWebLLM.ts` manages AI engine lifecycle
   - New component: `src/components/social/AIChatInterface.tsx` for real AI chat UI
   - TypeScript definitions: `src/types/webgpu.d.ts` for WebGPU Navigator API
   - Updated MessagesDialog to use AIChatInterface instead of fake AI responses
   - Temperature: 0.7, Max tokens: 512 for balanced creativity and response length
4. **User Experience**:
   - Loading screen shows model download progress on first use
   - Model initialization typically takes ~1 minute on first load
   - Subsequent loads are instant (model cached locally)
   - Streaming responses appear progressively like ChatGPT
   - Error messages guide users to WebGPU-compatible browsers (Chrome, Edge)
   - Completely private - all processing happens locally in browser

### World's View Modal Tabbed Interface with Full Accessibility (2025-11-24)
1. **Tabbed Navigation Interface**: Redesigned World's View Modal with navigation list and content area
   - Left side: Navigation buttons for Map, News, Weather (with icons, labels, and chevron indicators)
   - Right side: Content area displaying the active section
   - Active tab highlighted with primary color, border accent, and semibold text
2. **Component Architecture**:
   - Uses CatchMap component instead of full MapPage for better modal embedding
   - All three panels (map, news, weather) rendered in DOM with stable IDs
   - Inactive panels hidden with CSS classes (visible via block/hidden toggles)
   - Window resize event triggered when switching to map tab for proper Leaflet rendering
3. **WAI-ARIA Accessibility**:
   - Roving tabindex pattern (active tab: tabIndex=0, others: tabIndex=-1)
   - Proper ARIA attributes: role="tablist", role="tab", role="tabpanel"
   - Stable IDs for all tabs and panels (map-tab/map-panel, news-tab/news-panel, weather-tab/weather-panel)
   - Complete aria-selected, aria-controls, aria-labelledby relationships
4. **Keyboard Navigation**:
   - ArrowLeft/ArrowUp: Navigate to previous tab
   - ArrowRight/ArrowDown: Navigate to next tab
   - Home: Jump to first tab, End: Jump to last tab
   - Focus managed via React refs and useEffect (synced with render cycle)
   - Supports reverse navigation (Shift+Tab)
5. **Translation Fixes**:
   - Telugu (te): "కొత్త పోస్ట్" for "New Post" button
   - Kannada (kn): "ಹೊಸ ಪೋಸ್ಟ್" for "New Post" button
### Complete i18n Implementation for All Components (2025-11-20)
1. **Updated Vite Configuration**: Changed allowed host to match current Replit deployment URL
2. **AnalyzePage Full Internationalization**: Replaced all hardcoded English text with i18n translation keys including:
   - Hero section (AI Fish Scanner, descriptions, status messages)
   - Professional Analysis card content
   - All buttons (Capture & Analyze, Upload from Gallery, Calibrate Size)
   - Feature grid (Accuracy, Instant Results, Health Score, Size Estimation)
   - Loading states and error messages
   - Toast notifications
3. **MapPage Internationalization**: Added i18n support for Back button navigation
4. **CommunityChat Complete Internationalization**: 
   - Implemented render-time translation for all UI elements
   - Converted sample messages to use translation keys (textKey) resolved at render time
   - This ensures chat messages update when language changes (no cached translations)
   - Placeholder text and tooltips now use i18n
5. **Translation Files Updated**: Added 40+ new translation keys across all 12 language files:
   - analyze section: 27 new keys (AI scanner, analysis states, errors, success messages)
   - map section: 1 new key (back button)
   - communityChat section: 14 new keys (UI labels and sample conversation messages)
6. **Architecture Pattern**: Sample/seeded content now uses translation keys stored in state, with t() calls at render time to ensure language changes propagate immediately throughout the app

### Uniform Language Switching Implementation (2025-11-20 - Earlier)
1. **Complete i18n Migration**: All pages (FeedPage, ProfilePage, HistoryPage) migrated from hardcoded English text to use translation keys
2. **Translation Keys Added**: Added 30+ new keys to en.json covering:
   - Feed page: Sample comments, share titles, toast messages, empty states
   - Profile page: Stats labels, post messages, share titles
   - History page: Subtitle, health score, analysis details, trends
   - Common: New Post button
3. **Hardcoded Language Names**: Language dropdown shows native script names (English, தமிழ், తెలుగు, हिन्दी, etc.)
4. **Page Reload Mechanism**: Language change triggers 1-second delay then full page reload to ensure complete app refresh
5. **All User-Facing Text Now Uses t()**: Toast messages, chart legends, sample comments, share dialogs, all UI labels
6. **Implementation Approach**: All translation keys include defaultValue fallbacks, ensuring app works immediately while allowing translations to be added to other locale files later

### UI Enhancement & Internationalization (2025-09-29)
1. **Navigation Branding**: Updated all pages (Feed, My Catches, Profile) to display "Fish Net" branding consistently
2. **Loading Screens**: Added loading states (1s for login/signup, 1.5s for image upload/analyze) for better UX
3. **My Catches UI**: Fixed grid items to show dark background (active:bg-gray-900) when clicked
4. **Personal Chat**: Enhanced chat service with 3 personal conversations (2 with messages, 1 empty) with localStorage caching
5. **Real Fish Images**: Downloaded 30+ real fish photos and relocated from attached_assets to public/fish_images directory for proper Vite serving
6. **Settings Dialog**: Implemented comprehensive settings with name change, location permissions, email display, and language selection with confirmation
7. **Internationalization (i18n)**: Configured full i18n support with 12 languages:
   - English (en) - base language
   - Tamil (ta), Telugu (te), Hindi (hi), Kannada (kn), Malayalam (ml), Gujarati (gu), Marwadi (mwr), Bengali (bn), Punjabi (pa), Marathi (mr), Odia (or)
   - Language selection persisted to localStorage
   - Language change confirmation dialog
8. **Image Management**: Updated sample data to use /fish_images/ paths from public directory

### GitHub Import Setup (2025-09-29)
1. Installed npm dependencies (553 packages)
2. Added `allowedHosts: ["*"]` to vite.config.ts for Replit proxy compatibility
3. Verified workflow is running successfully on port 5000
4. Confirmed deployment configuration (autoscale target)
5. Tested application - all features working (IndexedDB, Service Worker, UI)

### Previous Changes (2025-09-29)
1. Configured Vite for Replit environment (port 5000, 0.0.0.0 host, WSS HMR)
2. Set up workflow for development server
3. Fixed import error in HistoryPage.tsx
4. Configured deployment settings for autoscale
5. Verified application runs successfully with all features working
6. Reorganized Feed page - moved Community and Chat into Messages dialog button
7. Created FishermanIndia community chat with fish-related messages and photos
8. Added 3 chat conversations (2 with messages, 1 empty) with localStorage caching
9. Fixed My Catches page image loading to show images immediately
10. Fixed Map page - replaced blue screen with OpenStreetMap tiles
11. Added custom fish image markers with hover effects on map
12. Implemented random fish images for sample data, original images for user catches
