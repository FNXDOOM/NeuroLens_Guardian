# NeuroLens Guardian

An AI-powered assistive mobility platform for elderly users and people with cognitive disabilities or autism.

## Overview

NeuroLens Guardian provides real-time navigation assistance, hazard detection, and safety monitoring through:
- **AR Detection** - Multi-mode camera detection (Webcam, Mobile, AR Glasses) with real-time TensorFlow.js object detection
- **3D AR Simulation** - Immersive AR glasses visualization with live camera sync and hazard markers
- **AI Assistant** - Conversational guidance with distress detection and calm mode
- **Safe Zone Discovery** - Interactive map of nearby assistance points with live routing
- **Caregiver Monitoring** - Real-time tracking and emergency response dashboard
- **Public Transport** - Accessible public transportation assistance
- **Voice Assistant** - Hands-free voice command interface with Web Speech API
- **Journey Replay** - Review past journeys and analyze patterns
- **Dynamic Dashboard** - Real-time status updates synced across all components

## Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account (free tier works)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Copy .env.example to .env.local (already configured with working keys)

# 3. Set up database
# Open Supabase SQL Editor: https://kmavjtrmqdjdfvzqpvon.supabase.co
# Run: database/seed-data-simple.sql

# 4. Test database connection
node test-db.mjs

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
neurolens-guardian/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── user/              # User dashboard & settings
│   ├── caregiver/         # Caregiver dashboard & settings
│   ├── ar-vision/         # AR camera interface
│   ├── ar-glasses/        # AR glasses simulation
│   ├── ar-showcase/       # AR demo showcase
│   ├── ai-assistant/      # AI chat assistant
│   ├── safe-zones/        # Safe Zone discovery
│   ├── monitoring/        # Caregiver monitoring
│   ├── public-transport/  # Public transport assistance
│   └── api/               # API routes
│       ├── ai/            # AI endpoints (chat, distress, simplify)
│       └── guidance/      # Navigation guidance
│
├── components/
│   ├── neurolens/         # 50+ feature components
│   │   ├── navbar.tsx
│   │   ├── ar-camera-view.tsx
│   │   ├── ai-assistant-panel.tsx
│   │   ├── safe-zone-map.tsx
│   │   ├── live-monitoring-panel.tsx
│   │   ├── public-transport-panel.tsx
│   │   ├── voice-assistant-controls.tsx
│   │   ├── journey-replay-panel.tsx
│   │   ├── demo-control-panel.tsx
│   │   ├── distress-detection-panel.tsx
│   │   └── ... (40+ more)
│   │
│   ├── detection/         # AR detection components
│   │   ├── ARDetectionModal.jsx      # Multi-mode AR detection modal
│   │   ├── ARCameraOverlay.jsx       # TensorFlow.js camera detection
│   │   ├── ARGlassesSimulation.jsx   # AR glasses simulation
│   │   └── CameraDetection.jsx       # Camera utilities
│   │
│   ├── simulation/        # 3D simulation components
│   │   ├── ARGlasses3DScene.jsx      # Three.js 3D scene
│   │   ├── SimulationModal.jsx       # 3D simulation modal
│   │   └── ARGlassesControls.jsx     # Simulation controls
│   │
│   ├── user/             # User dashboard components
│   │   ├── LiveStatusCard.jsx        # Dynamic status display
│   │   ├── NearestSafeZoneCard.jsx   # Live Safe Zone info
│   │   └── LiveNavigationPanel.jsx   # Live navigation state
│   │
│   ├── map/              # Map components
│   │   └── LiveMap.jsx   # MapLibre GL JS integration
│   │
│   ├── ui/               # 57 shadcn/ui components
│   └── theme-provider.tsx
│
├── hooks/                # Custom React hooks
│   ├── useAuth.js
│   ├── useSafeZones.js
│   ├── useLocationTracking.js
│   ├── useAIGuidance.js
│   ├── useCaregiverMonitoring.js
│   ├── useDistressEngine.js      # Distress detection & analysis
│   ├── useSafetyEngine.js        # Safety scoring & recommendations
│   ├── usePublicTransport.js
│   ├── useVoiceAssistant.js
│   ├── useJourneyReplay.js
│   ├── useDemoMode.js            # Demo scenario control
│   └── useSimulationState.js     # AR simulation state adapter
│
├── services/             # API integrations
│   ├── supabase.js       # Database & auth
│   ├── database.js       # Database operations
│   ├── maps.js           # MapLibre & MapTiler
│   ├── navigation.js     # OpenRouteService routing
│   ├── ai.js             # Groq AI
│   ├── groqGuidance.js   # AI guidance service
│   └── publicTransport.js # Public transport API
│
├── utils/                # Utilities
│   ├── safetyEngine.js           # Safety analysis
│   ├── distanceEstimation.js     # Distance calculations
│   ├── predictiveHazards.js      # Hazard prediction
│   ├── voiceCommands.js          # Voice command parsing
│   ├── tensorflowLoader.js       # TensorFlow.js model loader
│   └── testAIRoutes.js           # AI API testing
│
├── data/                 # Mock/seed data
│   └── safeZones.js
│
├── database/             # Database files
│   ├── schema.sql        # Full schema
│   ├── seed-data.sql     # Complete seed data
│   ├── seed-data-simple.sql # Simplified seed
│   ├── fix-rls-policy.sql
│   └── QUICK_FIX.md
│
├── constants/
│   └── testUsers.js
│
└── public/              # Static assets
```

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript, JavaScript
- **Styling**: Tailwind CSS, shadcn/ui (57 components)
- **State**: React Hooks, Context API
- **3D Graphics**: Three.js, React Three Fiber
- **Maps**: MapLibre GL JS
- **AI Detection**: TensorFlow.js (COCO-SSD model)

### Backend & Services
- **Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Maps**: MapLibre GL JS, MapTiler (8 map styles)
- **Routing**: OpenRouteService (navigation, geocoding)
- **AI**: Groq (Llama models via API)
- **Detection**: TensorFlow.js (object detection)
- **Voice**: Web Speech API (synthesis & recognition)

### APIs & Integrations
- Supabase Realtime (live updates)
- MapTiler Vector Tiles
- OpenRouteService Directions API
- Groq AI API
- Browser Geolocation API
- Web Speech API (voice)

## Features

### User Features

**AR Detection (Multi-Mode)**
- **Webcam Mode**: Desktop camera with front-facing detection
- **Mobile Mode**: Smartphone rear camera optimized for mobile
- **AR Glasses Mode**: 3D visualization with live camera sync
- Real-time TensorFlow.js object detection (vehicles, pedestrians, obstacles)
- Bounding boxes and confidence scores
- Hazard severity classification (danger, caution, warning)
- Automatic distress engine updates
- Seamless mode switching without losing detections

**3D AR Simulation**
- Immersive AR glasses visualization
- Real-time sync with camera detections
- Dynamic hazard markers (vehicles, pedestrians, obstacles)
- Warning signs for high-severity hazards
- Directional movement arrows with urgency levels
- Context-aware HUD messages
- Safe Zone markers with distance
- Modal-based access from dashboard

**Dynamic Dashboard**
- Live status card with real-time distress engine updates
- Nearest Safe Zone card with live distance calculation
- Live navigation panel with route info and ETA
- Quick actions (Start Journey, Find Safe Zone, 3D Simulation, Speak Guidance, Emergency SOS)
- Real-time hazard detection feed
- Guardian notification status
- Demo mode for testing scenarios

**Navigation**
- Turn-by-turn directions with OpenRouteService
- Voice guidance with Web Speech API
- Safe route planning
- Landmark recognition
- Simplified instructions
- Real-time route updates
- Distance and ETA display

**AI Assistant**
- Conversational interface powered by Groq AI
- Context-aware responses
- Distress detection and analysis
- Instruction simplification
- Calm guidance mode
- Multi-turn conversations
- Emergency response suggestions

**Safe Zones**
- Interactive MapLibre map with 8 styles
- Nearby assistance points discovery
- Safety ratings and amenities
- Quick routing to nearest zone
- Distance calculation
- Favorite locations
- Real-time updates

**Public Transport**
- Route planning
- Real-time updates
- Accessibility info
- Step-by-step guidance
- Alternative routes
- Transit state tracking

**Voice Assistant**
- Hands-free control
- Voice commands
- Speech feedback with Web Speech API
- Natural language processing
- Speak current guidance
- Error handling for interruptions

**Emergency**
- SOS button with manual trigger
- Guardian contacts
- Auto emergency call
- Location sharing
- Emergency broadcast
- Distress level monitoring

**Settings**
- 9 language support
- Theme customization (light/dark)
- Accessibility options
- Privacy controls
- Device status
- Notification preferences

### Caregiver Features

**Monitoring Dashboard**
- Real-time location tracking
- Live journey monitoring
- Alert management
- User status overview
- Quick actions

**Journey Replay**
- Historical journey review
- Route visualization
- Event timeline
- Pattern analysis
- Hazard history

**Alerts & Notifications**
- Real-time alerts
- Priority levels
- Alert history
- Custom preferences
- Multi-channel delivery

**User Management**
- Multiple user monitoring
- User profiles
- Contact management
- Settings control

**Analytics**
- Journey statistics
- Safety metrics
- Distress patterns
- Usage insights

## Pages & Routes

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Landing page | Done |
| `/user` | User dashboard | Done |
| `/user/settings` | User settings (9 sections) | Done |
| `/caregiver` | Caregiver dashboard | Done |
| `/caregiver/settings` | Caregiver settings | Done |
| `/ar-vision` | AR camera interface | Done |
| `/ar-glasses` | AR glasses simulation | Done |
| `/ar-showcase` | AR demo showcase | Done |
| `/ai-assistant` | AI chat assistant | Done |
| `/safe-zones` | Safe Zone discovery | Done |
| `/monitoring` | Caregiver monitoring | Done |
| `/public-transport` | Public transport | Done |

## Configuration

### Environment Variables

All environment variables are pre-configured in `.env.local`:

```bash
# Supabase (Database, Auth, Realtime)
NEXT_PUBLIC_SUPABASE_URL=https://kmavjtrmqdjdfvzqpvon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[configured]

# MapTiler (Maps & Geocoding)
NEXT_PUBLIC_MAPTILER_API_KEY=[configured]

# OpenRouteService (Routing & Navigation)
NEXT_PUBLIC_OPENROUTE_API_KEY=[configured]

# Groq AI (Backend only)
GROQ_API_KEY=[configured]
```

### Database Setup

**IMPORTANT**: Run seed data before development:

1. Open Supabase SQL Editor: https://kmavjtrmqdjdfvzqpvon.supabase.co
2. Copy contents of `database/seed-data-simple.sql`
3. Paste and execute in SQL Editor
4. Verify: `node test-db.mjs`

**Database Schema:**
- `users` - User profiles
- `safe_zones` - Safe location data
- `journeys` - Journey tracking
- `alerts` - Alert system
- `caregiver_relationships` - User-caregiver links
- `user_settings` - User preferences

**Known Issue**: RLS policy has infinite recursion. Workaround applied in code. Fix available in `database/fix-rls-policy.sql`.

## Development

```bash
# Development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Test database
node test-db.mjs

# Test AI routes
node utils/testAIRoutes.js
```

### Development Notes

- Dev server runs on http://localhost:3000
- Hot reload enabled
- TypeScript checking on build
- ESLint configured
- Tailwind JIT mode

## Current Status

### Completed Features

**Core Infrastructure**
- Next.js 16 App Router setup
- TypeScript configuration
- Tailwind CSS + shadcn/ui
- Environment configuration
- Database schema & seed data

**AR Detection & Simulation**
- Multi-mode AR detection (Webcam, Mobile, AR Glasses)
- TensorFlow.js object detection integration
- Real-time camera feed processing
- 3D AR glasses simulation with Three.js
- Live camera-to-3D sync
- Dynamic hazard markers in 3D space
- Warning signs and directional arrows
- Context-aware HUD messages
- Seamless mode switching

**Dynamic Dashboard**
- Live status card with distress engine
- Nearest Safe Zone card with live updates
- Live navigation panel with route info
- Quick actions with real functionality
- Speech synthesis for guidance
- Real-time state synchronization

**UI Components (50+)**
- Navigation & layout
- AR camera views
- Map interfaces
- Dashboard panels
- Settings pages
- Alert systems
- Emergency controls
- Modal components

**Services & APIs**
- Supabase integration
- MapTiler maps (8 styles)
- OpenRouteService routing
- Groq AI backend
- Public transport API
- Voice commands
- TensorFlow.js detection

**Features**
- AR detection (3 modes)
- 3D AR simulation
- AI assistant
- Safe zone discovery
- Caregiver monitoring
- Public transport
- Voice assistant
- Journey replay
- Demo mode
- Settings (user & caregiver)
- Dynamic dashboards

**Advanced Features**
- Safety engine
- Distress detection
- Predictive hazards
- Distance estimation
- Real-time tracking
- Object detection mapping
- Hazard severity classification
- Movement recommendations

### Known Issues

1. **Database RLS Policy** - Infinite recursion in users table policy
   - Workaround: Demo mode fallback in code
   - Fix: Run `database/fix-rls-policy.sql` in Supabase

2. **File System** - Settings page file occasionally becomes empty
   - Workaround: Stop dev server before file writes
   - Status: Monitoring

3. **Navigation Distance** - OpenRouteService distance limits
   - Workaround: Error handling with user-friendly messages
   - Status: Handled

### In Progress

- Performance optimization for TensorFlow.js
- Real-time Supabase integration
- Production deployment prep

### Future Enhancements

- Custom TensorFlow.js model training
- Advanced AR features (depth sensing, spatial audio)
- Machine learning for personalized guidance
- Testing suite (Jest, Cypress)
- PWA capabilities
- Offline mode with service workers
- Multi-language UI translation
- Analytics dashboard
- Wearable device integration

## User Flows

### User Journey
1. Land on homepage → Choose "I need assistance"
2. View dynamic dashboard with real-time status
3. Click "AR Detection" to open multi-mode camera
4. Switch between Webcam, Mobile, and AR Glasses modes
5. See detected objects in real-time with bounding boxes
6. Switch to AR Glasses mode to see 3D visualization
7. Start navigation with voice guidance
8. AI assistant provides context-aware help
9. Emergency SOS if needed with automatic guardian notification

### AR Detection Flow
1. Open AR Detection from dashboard
2. Grant camera permissions
3. TensorFlow.js loads COCO-SSD model
4. Choose camera mode:
   - **Webcam**: Desktop front-facing camera
   - **Mobile**: Smartphone rear camera
   - **AR Glasses**: 3D visualization with live sync
5. Real-time object detection runs continuously
6. Detected objects classified by severity
7. Hazards trigger distress engine updates
8. Switch modes seamlessly without losing detections
9. View detected objects as 3D markers in AR Glasses mode

### Caregiver Journey
1. Land on homepage → Choose "I'm a caregiver"
2. View monitoring dashboard with real-time user location
3. See live user status and distress level
4. Receive and manage alerts
5. Review journey history with replay
6. Configure settings and preferences

## Security & Privacy

- Row Level Security (RLS) on all tables
- Secure API key management
- Environment variable protection
- User data encryption
- Privacy controls in settings
- Emergency data access controls

## Accessibility

- WCAG 2.1 AA compliant design
- Screen reader support
- Keyboard navigation
- High contrast mode
- Large text mode
- Voice guidance
- Simplified UI mode
- Calm guidance mode
- Reduced motion option

## Internationalization

Supported languages (in settings):
- English
- Hindi (हिन्दी)
- Kannada (ಕನ್ನಡ)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Spanish (Español)
- French (Français)
- German (Deutsch)
- Arabic (العربية)

## Testing

### Manual Testing
- User flows tested
- Caregiver flows tested
- Navigation tested
- Settings tested
- Emergency features tested

### Test Users
```javascript
// Available in constants/testUsers.js
{
  user: { email: 'user@test.com', password: 'test123' },
  caregiver: { email: 'caregiver@test.com', password: 'test123' }
}
```

## Performance

- Lighthouse score: TBD
- First Contentful Paint: TBD
- Time to Interactive: TBD
- Bundle size: TBD

## Contributing

This is a private project. For questions or issues, contact the development team.

## License

Private - All rights reserved

## Troubleshooting

### Database Connection Issues
```bash
# 1. Verify environment variables
cat .env.local

# 2. Test connection
node test-db.mjs

# 3. Check Supabase dashboard
# Visit: https://kmavjtrmqdjdfvzqpvon.supabase.co

# 4. Re-run seed data
# Copy database/seed-data-simple.sql to SQL Editor
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### API Errors
- Check `.env.local` exists
- Verify API keys are valid
- Check network connectivity
- Review browser console

### Settings Page Issues
- Stop dev server
- Verify file has content
- Restart dev server

## Support

**Quick Links:**
- Database issues → `database/QUICK_FIX.md`
- Test database → `node test-db.mjs`
- Test AI → `node utils/testAIRoutes.js`

**Common Commands:**
```bash
npm run dev          # Start development
npm run build        # Build production
node test-db.mjs     # Test database
```

## Roadmap

### Phase 1: Foundation (Done)
- UI components (50+)
- Page structure (12 pages)
- Service scaffolding
- Database schema
- Basic features

### Phase 2: Integration (In Progress)
- Supabase setup (Done)
- Map integration (Done)
- Routing service (Done)
- Authentication flow (Pending)
- Real-time updates (Pending)

### Phase 3: AI & Detection (In Progress)
- Groq AI backend (Done)
- AI assistant UI (Done)
- TensorFlow.js models (Pending)
- Real-time detection (Pending)
- Voice synthesis (Pending)

### Phase 4: Production (Planned)
- Testing suite (Pending)
- Performance optimization (Pending)
- Deployment (Pending)
- Monitoring (Pending)
- Documentation (Pending)

---

Built for accessibility and independence

Version: 1.0.0 | Last Updated: 2024
