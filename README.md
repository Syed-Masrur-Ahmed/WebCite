# WebCite 
**WebCite allows near-instant visualization and organization of the citation network around nearly any scholarly paper — just enter a DOI!**

## Overview
WebCite accepts a DOI and an adjustable query limit. Once a valid DOI has been entered, the website produces a dynamic visualization of citations, illustrated through a simple graph. We help academics quickly identify the most relevant work in their field, discover seminal papers, and trace the evolution of ideas through academic literature.

## Features
- Creates an interactable graph where the nodes are academic papers and edges are citations
- Custom Node limit for total numbers of nodes shown
- Hovering over nodes gives information such as title, authors and DOI
- Clicking on a node redirects user to paper

## Demo
https://youtu.be/KFaohlzyqic

## Usage
https://webcite.study

## Technologies Used
- React, Material-UI, react-force-graph-2d
- Flask, PyAlex, NetworkX
- Render.com for deployment

## API Documentation
```
GET /api/search?q=<DOI>&node_limit=<number>
Response: {
  nodes: [...],
  links: [...]
}
```

## Project Structure
```
/backend  - Flask backend code
/frontend - React frontend code
README.md - Project overview
```

