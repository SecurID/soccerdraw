# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup and Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts Vite development server with hot-reload. Access at http://localhost:5173

### Production Build
```bash
npm run build
```

### Production Preview
```bash
npm run preview
```

## Architecture Overview

This is a Vue.js 3 soccer tactical drawing application built with:
- **Fabric.js 5.3.0** for canvas manipulation and drawing
- **Vite** as build tool with Vue plugin and SVG loader
- **Tailwind CSS** for styling

### Core Component Structure

**Canvas.vue** is the main component containing all application logic:
- Initializes and manages Fabric.js canvas instance
- Handles tool selection and drawing state
- Manages mouse/keyboard events for drawing interactions
- Draws soccer field markings (goal areas, center circle, halfway line)
- Loads and positions SVG assets for goals

**Toolbar components** provide a simple tool selection interface using event emission pattern.

### Custom Fabric.js Classes

The app extends Fabric.js with two custom drawing tools:

**LineArrow (`src/classes/arrow-line.js`)**:
- Extends `fabric.Line` with custom arrowhead rendering
- Supports serialization via `toObject`/`fromObject`
- Used for directional movement indicators

**Cross (`src/classes/cross.js`)**:
- Extends `fabric.Object` for defensive player markers
- Renders two perpendicular lines at 45° rotation
- Center-origin positioning for proper rotation

### Drawing Tool System

Tools are selected via toolbar and activated through Canvas component state:
- **Cone**: Orange triangles
- **Player Offense**: Red circles  
- **Player Defense**: Black crosses (45° rotated)
- **Line**: Arrow lines for movement/passing
- **Goals**: Left/right facing goal SVGs (green)
- **Minigoals**: Left/right facing minigoal SVGs (orange)

Drawing flow: tool selection → mouse down → object creation → canvas addition → mouse up

### SVG Asset Loading

SVG files in `src/assets/svg/` are loaded dynamically:
- Imported as raw strings using Vite's `?raw` suffix
- Parsed with `fabric.loadSVGFromString()`
- Grouped with `fabric.util.groupSVGElements()`
- Positioned at click coordinates

### Canvas State Management

The Canvas component maintains:
- `canvas`: Fabric.js instance
- `currentTool`: Active drawing tool
- `isDrawing`: Drawing state flag
- `currentObject`: Active object being drawn
- Object properties (size, color)

Key interaction: Delete/Backspace removes selected canvas objects.

### Styling Architecture

- Pure Tailwind CSS implementation
- Canvas has fixed dimensions (1024x765) with gray border
- Flexbox layouts for component arrangement
- Hover/focus states for accessibility

## Important Technical Notes

- Canvas must be initialized in Vue's `mounted()` lifecycle
- Fabric.js event listeners need proper cleanup in `beforeDestroy()`
- SVG loading is asynchronous - handle accordingly when adding new assets
- Custom Fabric.js classes must implement serialization methods for persistence features