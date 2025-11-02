# My Metal Roadmap

Plataforma web para rutas de aprendizaje en ingeniería metalúrgica, basada en React. Permite visualizar, crear, editar y compartir mapas mentales interactivos de temas metalúrgicos.

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ (LTS recomendado)
- **npm** o **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/alexjhan/my-metal-roadmap.git
cd my-metal-roadmap

# Install dependencies
npm install
# o
yarn install
```

### Development

```bash
# Start development server (http://localhost:3000)
npm run dev
# o
npm start
```

### Build for Production

```bash
# Create optimized build
npm run build

# Test the production build locally
npm run start:prod  # (si está disponible) o usar 'serve -s build'
```

### Run Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
my-metal-roadmap/
├── public/
│   ├── index.html              # Main HTML file (empty <div id="root"></div>)
│   └── assets/                 # Static assets (images, icons, etc.)
│
├── src/
│   ├── App.js                  # Main app component with routing
│   ├── index.js                # React entry point
│   ├── index.css               # Global styles (Tailwind CSS)
│   ├── UserContext.js          # User authentication context
│   │
│   ├── components/             # React components
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── RoadmapGrid.js
│   │   ├── RoadmapPage.js
│   │   ├── editor/
│   │   │   └── EditRoadmapRefactored.js  # Main editor component
│   │   └── ... (other pages and components)
│   │
│   ├── data/                   # Centralized data & configurations
│   │   ├── index.js            # Central export hub (NEW)
│   │   ├── allRoadmaps.js      # All roadmap definitions
│   │   ├── nodes.js            # Node structures
│   │   ├── edges.js            # Edge structures
│   │   └── metal_roadmaps.json # JSON roadmap data
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── supabase.js         # Supabase client
│   │   └── roadmapStorage.js   # Storage utilities
│   │
│   ├── hooks/                  # React hooks
│   │   ├── useLayout.js
│   │   └── useReactFlowOptimized.js
│   │
│   ├── config/                 # Configuration files
│   │   ├── dev.js              # Development config
│   │   └── performance.js      # Performance monitoring config
│   │
│   └── styles/                 # Global styles
│       └── moveable.css
│
├── build/                      # Production build output (generated)
│
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🔧 Tech Stack

- **Frontend Framework**: React 18.2.0
- **Routing**: react-router-dom v7.6.3
- **Visualization**: React Flow v11.11.4, Dagre v1.1.5
- **Dragging/Moveable**: react-moveable v0.56.0
- **Styling**: Tailwind CSS 3.3.2
- **Database**: Supabase (supabase-js v2.50.4)
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Icons**: react-icons v5.5.0

## 📝 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` or `start` | `npm run dev` | Start development server with hot reload |
| `build` | `npm run build` | Create optimized production build |
| `test` | `npm run test` | Run tests once |
| `test:watch` | `npm run test:watch` | Run tests in watch mode |
| `eject` | `npm run eject` | Eject from Create React App (irreversible) |

## 🗺️ How to Add a New Roadmap

### 1. Define the Roadmap

Edit `src/data/allRoadmaps.js` and add an entry to `allRoadmapsData`:

```javascript
export const allRoadmapsData = {
  // ... existing roadmaps ...
  newRoadmapKey: {
    title: "New Roadmap Title",
    description: "Description of the roadmap topic.",
    icon: "📚",
    nodes: createEmptyNodes("New Roadmap Title", "📚"),
    edges: emptyEdges
  }
};
```

### 2. Add Custom Nodes/Edges (Optional)

If your roadmap has a specific structure (like `termodinamica`), define nodes and edges in `src/data/nodes.js` and `src/data/edges.js`, then use them instead:

```javascript
import { nodes as customNodes } from './nodes';
import { edges as customEdges } from './edges';

// In allRoadmapsData:
newRoadmapKey: {
  title: "New Roadmap Title",
  description: "...",
  icon: "📚",
  nodes: customNodes,
  edges: customEdges
}
```

### 3. Create a Page Component (Optional)

If your roadmap needs a dedicated page with special layout or interactions, create a component in `src/components/`:

```javascript
// src/components/NewRoadmapPage.js
import React from 'react';
import RoadmapLayout from './RoadmapLayout';

export default function NewRoadmapPage() {
  return <RoadmapLayout roadmapType="newRoadmapKey" />;
}
```

### 4. Add Route (If Needed)

Edit `src/App.js` and add a new route:

```javascript
<Route path="/roadmap/newRoadmapKey" element={<MainLayout><NewRoadmapPage /></MainLayout>} />
```

### 5. Access via UI

Your new roadmap will automatically appear in:
- `RoadmapGrid.js` (grid view)
- `RoadmapsSection.js` (section view)
- Navigation at `/roadmap/newRoadmapKey`

## 🔐 Environment Variables

Create a `.env.local` file in the project root with Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📊 Using Data Exports

### Import from Centralized Hub

```javascript
// Option 1: Use centralized exports from src/data/index.js
import { allRoadmapsData, sortedAllRoadmapsData, roadmaps } from 'src/data';

// Option 2: Direct import (still works)
import { allRoadmapsData } from 'src/data/allRoadmaps';
```

### Sorted Roadmaps

Access roadmaps sorted alphabetically by title:

```javascript
import { sortedAllRoadmapsData } from 'src/data';

Object.entries(sortedAllRoadmapsData).forEach(([key, roadmap]) => {
  console.log(roadmap.title); // Prints titles in alphabetical order
});
```

## 🐛 Troubleshooting

### Issue: `npm install` fails

**Solution**: Clear npm cache and retry
```bash
npm cache clean --force
npm install
```

### Issue: Port 3000 is already in use

**Solution**: Use a different port
```bash
PORT=3001 npm run dev
```

### Issue: Supabase connection errors

**Solution**: 
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Ensure network connectivity

### Issue: React Router not working

**Solution**: Ensure `BrowserRouter` is wrapping your app (already done in `App.js`)

## 🚀 Deployment

### Vercel (Recommended for React apps)

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=build
```

### Traditional Server

```bash
# Build static files
npm run build

# Upload `build/` folder to your server's public directory
# Configure server to serve index.html for all routes (for React Router)
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Flow Docs](https://reactflow.dev)
- [Supabase Docs](https://supabase.com/docs)

## 📄 License

See [LICENSE](LICENSE) file (if available).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Last Updated**: November 2, 2025
