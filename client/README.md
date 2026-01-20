# movie-keeper

A small JavaScript project to help you catalog, track, and manage your movie collection. Use movie-keeper to record movies you own or want to watch, add ratings and tags, search your collection, and export or import lists.


---

## About
movie-keeper is a lightweight tool for keeping track of movies. 


## Features
- Add, edit, and remove your movies
- Add to a database of genres if the genre you want is not found.

## Tech Stack
- Language: Python
- Framework: React
- Data storage: JSON file / SQLAlchemy
- Package manager: npm

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation
Clone the repository:
```bash
git clone https://github.com/StopScreenSharing/movie-keeper.git
cd movie-keeper
```

Install dependencies:
```bash
npm install
```

## Configuration
Create a `.env` file if your project uses environment variables:
```bash
cp .env.example .env
# then edit .env with your values
```

Example environment variables (adjust to your project):
- PORT=5555 — port the app runs on
- NODE_ENV=development

## Usage
Start the app in development:
```bash
npm start

```

Open the web UI at http://localhost:5555 (if applicable), or run the CLI command:
```bash
python app.py
```

Adjust commands to match your project's scripts in package.json.

## Development
Recommended workflow:
1. Fork and clone the repo
2. Create a feature branch: `git checkout -b feat/add-import`
3. Install dependencies and run the dev server

## Testing
Run tests:
```bash
npm test
# or
npm run test:watch
```

