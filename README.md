# Canvas Interaction System

This project implements a canvas-based user interaction system where elements (activities and events) can be placed on a 25x25 grid. Activities and events are draggable elements that follow specific placement and connection rules, providing a highly interactive user interface. The canvas enforces these rules to ensure valid placements and connections, with visual feedback and real-time updates

## 🛠 Tech Stack

- ⚛️ **React** – UI library for building interactive interfaces  
- 🟦 **TypeScript** – Strongly typed JavaScript  
- 🧩 **React Flow** – Library for building node-based editors and diagrams

## 🚀 Getting Started (Manual Setup)

1. **Install dependencies**
   ```bash
   cd canvas-interaction-system
   npm install
   ```

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

This will generate a build folder containing the minified production-ready files, with filenames that include hashes for cache optimization.
Your app is now ready for deployment!
For more deployment information, check out the official React docs on deployment.

### `Project Structure 📂`

```plaintext
src/
├── components/
│   ├── canvas/
│   │   ├── nodes/
│   │   │   ├── Activity.tsx
│   │   │   └── Event.tsx
│   │   ├── summary/
│   │   │   ├── index.tsx
│   │   │   └── summary.css
│   │   ├── toolbox/
│   │   │   ├── index.tsx
│   │   │   ├── toolbox.css
│   │   │   └── canvas.css
│   │   ├── index.tsx
├── constants/
│   └── index.tsx
├── App.tsx
├── App.css
└── index.tsx
```

### `Components 🛠️`

```plaintext
nodes/Activity.tsx: Defines the Activity component, which users can drag and drop onto the canvas grid.

nodes/Event.tsx: Defines the Event component, which users connect to the activities.

summary/index.tsx: Displays a summary of the activities and events added to the canvas.

toolbox/index.tsx: Contains the toolbox panel where users can find draggable activities and events.

toolbox/canvas.css: Contains the canvas-specific styles for interactions and grid rendering.
```

### `Features ⭐`

```plaintext
Drag-and-Drop Functionality 🖱️:

Activities and events can be dragged from the toolbox and dropped onto the canvas.

Placement and Connection Rules 📏:

Activities must be placed on the borders between cells or span across multiple cells.

Events can be connected to the head or butt of an activity.

Validation and Feedback ⚠️:

Invalid placements (e.g., placing an activity outside the grid or connecting an event incorrectly) trigger feedback.

Customization 🔧:

Activities can be resized, and events can be reconnected to different activities.

Persistence 💾:

Users can save and reload their canvas configurations.
```

