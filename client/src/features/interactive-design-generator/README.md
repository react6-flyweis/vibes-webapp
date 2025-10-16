# Interactive Design Generator Feature

A comprehensive, modular design generation system with AI-powered storytelling, mood-based palettes, real-time collaboration, and group integration.

## 📁 Folder Structure

```
interactive-design-generator/
├── components/           # Reusable UI components
│   ├── AchievementsDisplay.tsx
│   ├── CollaborationPanel.tsx
│   ├── DesignCanvas.tsx
│   ├── DesignControls.tsx
│   ├── GroupIntegration.tsx
│   ├── MoodIcon.tsx
│   ├── MoodPalettes.tsx
│   ├── OnboardingCard.tsx
│   ├── StoryGenerator.tsx
│   └── index.ts
├── hooks/               # Custom React hooks
│   ├── useAchievements.ts
│   ├── useCanvas.ts
│   ├── useCollaboration.ts
│   ├── useGroupIntegration.ts
│   ├── useMoodPalette.ts
│   ├── useOnboarding.ts
│   ├── useSparkleEffect.ts
│   └── index.ts
├── utils/               # Utility functions
│   ├── canvas-utils.ts
│   ├── color-utils.ts
│   └── index.ts
├── constants/           # Constants and configurations
│   └── index.ts
├── types.ts            # TypeScript type definitions
├── index.tsx           # Main feature component
└── README.md           # This file
```

## 🎨 Components

### Core Components

- **DesignCanvas**: Canvas component for drawing with color palette integration
- **DesignControls**: Control panel for mood, style, and intensity settings
- **MoodPalettes**: Grid display of all available mood palettes
- **StoryGenerator**: AI story generation with image creation
- **AchievementsDisplay**: Gamification system showing unlocked achievements
- **CollaborationPanel**: Real-time collaboration features
- **GroupIntegration**: Social group integration and content sharing
- **OnboardingCard**: Step-by-step onboarding experience
- **MoodIcon**: Icon component for mood visualization

## 🪝 Custom Hooks

### useCanvas

Manages canvas drawing state and operations:

- Drawing/painting functionality
- Undo/redo history management
- Canvas export
- Pointer event handling

### useMoodPalette

Handles mood-based color palette generation:

- Current mood state
- Mood intensity adjustment
- Dynamic palette generation
- Color intensity calculations

### useAchievements

Manages achievement system:

- Achievement tracking
- Unlock notifications
- Progress calculation
- Animation triggers

### useCollaboration

Handles collaborative features:

- Collaborator management
- Real-time effects
- Sparkle animations

### useOnboarding

Controls onboarding flow:

- Step progression
- Completion tracking
- Progress calculation

### useGroupIntegration

Integrates with group/event system:

- Event context fetching
- Group member management
- Content sharing
- API integration

### useSparkleEffect

Creates ambient sparkle effects:

- Periodic sparkle generation
- DOM cleanup

## 🛠️ Utilities

### color-utils.ts

Color manipulation and sparkle effects:

- `adjustColorIntensity()` - Adjust single color brightness
- `adjustPaletteIntensity()` - Adjust entire palette
- `createSparkleEffect()` - Create sparkle animations
- `createRandomSparkle()` - Single sparkle at random position
- `cleanupSparkles()` - Remove all sparkles from DOM

### canvas-utils.ts

Canvas operations and management:

- `setupCanvas()` - Initialize canvas with DPI scaling
- `getCanvasPosition()` - Get pointer position relative to canvas
- `drawLine()` - Draw line on canvas
- `clearCanvas()` - Clear entire canvas
- `exportCanvasAsDataURL()` - Export canvas as image
- `restoreCanvasFromDataURL()` - Restore canvas from image
- `createCanvasSnapshot()` - Create snapshot for undo/redo

## 📊 Constants

### Mood Palettes

8 predefined color palettes for different moods:

- Energetic
- Calm
- Creative
- Professional
- Romantic
- Mysterious
- Playful
- Elegant

### Achievements

6 unlockable achievements:

- First Creation (10 points)
- Palette Master (25 points)
- Story Teller (15 points)
- Team Player (20 points)
- Mood Explorer (30 points)
- Design Wizard (100 points)

### Onboarding Steps

4-step onboarding flow:

1. Mood selection
2. Style selection
3. Intensity setting
4. Completion

## 🎯 Types

All TypeScript interfaces and types are defined in `types.ts`:

- `MoodType` - Available mood options
- `DesignStyle` - Available design styles
- `Achievement` - Achievement object structure
- `Collaborator` - Collaborator information
- `SharedContent` - Shared content structure
- `GroupMember` - Group member data
- `EventContext` - Event information
- And more...

## 🚀 Usage

### Basic Import

```tsx
import InteractiveDesignGenerator from "@/features/interactive-design-generator";

function App() {
  return <InteractiveDesignGenerator />;
}
```

### Using Individual Components

```tsx
import {
  DesignCanvas,
  MoodPalettes,
} from "@/features/interactive-design-generator/components";
import {
  useCanvas,
  useMoodPalette,
} from "@/features/interactive-design-generator/hooks";

function CustomDesignPage() {
  const canvas = useCanvas();
  const moodPalette = useMoodPalette();

  return (
    <div>
      <DesignCanvas
        canvasRef={canvas.canvasRef}
        colorPalette={moodPalette.colorPalette}
        onColorSelect={canvas.setBrushColor}
        onUndo={canvas.undo}
        onRedo={canvas.redo}
        onClear={canvas.clearCanvas}
        onExport={canvas.exportCanvas}
      />
    </div>
  );
}
```

### Using Utilities

```tsx
import {
  createSparkleEffect,
  adjustColorIntensity,
} from "@/features/interactive-design-generator/utils";

// Create sparkle effect
createSparkleEffect("achievement", 10, 2000);

// Adjust color
const adjustedColor = adjustColorIntensity("#FF6B6B", 0.7);
```

## 🔧 Configuration

### Environment Variables

Required for AI story generation:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Customization

You can customize constants in `constants/index.ts`:

- Add new mood palettes
- Modify achievement definitions
- Adjust animation durations
- Change default settings

## 📝 Best Practices

1. **Component Composition**: Use smaller components to build complex UIs
2. **Hook Reusability**: Custom hooks can be used independently
3. **Type Safety**: All components and hooks are fully typed
4. **Performance**: Canvas operations are optimized with refs
5. **Cleanup**: Effects properly cleanup on unmount

## 🧪 Testing

Each component and hook can be tested independently:

```tsx
import { render, screen } from '@testing-library/react';
import { DesignCanvas } from '@/features/interactive-design-generator/components';

test('renders canvas', () => {
  const mockRef = { current: document.createElement('canvas') };
  render(<DesignCanvas canvasRef={mockRef} ... />);
  expect(screen.getByRole('img')).toBeInTheDocument();
});
```

## 🤝 Contributing

When adding new features:

1. Create components in `components/`
2. Extract logic into hooks in `hooks/`
3. Add utilities in `utils/`
4. Define types in `types.ts`
5. Add constants in `constants/`
6. Update this README

## 📄 License

Part of the Vibes webapp project.
