# Atlas-Engine

Atlas-Engine is a web-based world generation engine that lets creators generate believable fictional planets in minutes by applying simplified, causally linked realism layers.

Instead of manually designing maps or stitching together technical tools, users start with high-level inputs like planet size, water percentage, tectonic activity, temperature, and realism level. The system then generates a coherent world map where tectonics influence continents and mountains, geography influences rivers, and climate systems influence biomes.

## Core Product

A user should be able to:

1. Open the web app
2. Choose basic world parameters
3. Click "Generate World"
4. Receive an editable planet map
5. Export the map for use in stories, games, RPG campaigns, or worldbuilding projects

## First MVP Goal

Build a simple web app that can:

- Generate random continent shapes
- Display them on a 2D map canvas
- Let the user adjust basic inputs:
  - Planet seed
  - Water percentage
  - Continent count
  - Tectonic activity
- Regenerate the map
- Export the map as an image

## Product Vision

The long-term goal is to create a fast, intuitive worldbuilding engine where realism layers are simplified but causally connected:

tectonics → continents → mountains → rivers → climate → biomes → civilization constraints

## Tech Direction

Initial prototype should be built as a browser-based application using:

- React
- TypeScript
- HTML Canvas or SVG
- Procedural generation algorithms
- Exportable image output

## Development Philosophy

Start simple. Build the smallest working version first. Every feature should make the user faster at creating a believable world.
