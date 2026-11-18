# SkillUp

SkillUp is a bilingual study companion for discovering learning resources, tracking book progress, keeping margin notes, and organizing revision tasks. It is built with React and Vite, with study preferences and personal data stored in the browser.

## Features

- Browse and search books by discipline, with curated ordering and live sorting.
- Open book details with reading status, page progress, and per-book margin notes.
- Save books to a bookshelf and filter favorites by discipline or reading status.
- Track revision tasks and save study notes from the AI Study Assistant.
- Switch between English and French, and between light and dark themes.
- View responsive, scroll-triggered content reveals that respect reduced-motion preferences.

## Getting started

Prerequisites: Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL after the server starts.

### AI Study Assistant setup

The assistant uses the Google Gemini API. Add a key to a local `.env.local` file in the project root:

```dotenv
VITE_AI_API_KEY=your_api_key
# Optional; defaults to gemini-3.8-flash
VITE_AI_MODEL=gemini-3.8-flash
```

Restart the development server after changing environment variables. Do not commit `.env.local` or expose a private API key in a public client-side deployment. For production, route AI requests through a backend that keeps the key server-side.

Book search uses the public Open Library API and does not require configuration.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Application routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/ressources` | Resource catalog |
| `/ressources/:id` | Book details, reading progress, and margin notes |
| `/favoris` | Saved bookshelf |
| `/revisions` | Revision tasks |
| `/assistant` | AI Study Assistant and saved study notes |

## Data and persistence

The app stores user preferences and study data in browser `localStorage`; there is no account or server-side sync. Data is shared between pages in the current app session and persists in that browser.

| Storage key | Data |
| --- | --- |
| `skillup_theme_v1` | Light or dark theme preference |
| `skillup_language_v1` | English or French preference |
| `skillup_student_name_v2` | Student name |
| `skillup_favorite_books_v2` | Saved books |
| `skillup_book_study_v1` | Per-book reading status, page counts, and margin notes |
| `skillup_tasks_v2` | Revision tasks |
| `skillup_assistant_notes_v1` | Saved assistant conversations |

Older reading progress stored under `skillup_reading_progress_v1` is migrated into `skillup_book_study_v1` when available.

## Tech stack

- React 19 and React Router
- Vite
- Tailwind CSS 4
- Motion
- Open Library for book search and metadata
- Google Gemini API for the optional AI Study Assistant

## Project structure

```text
src/
  components/   Shared UI and study components
  context/      Shared app state and localStorage persistence
  data/         App data and resource categories
  i18n/         English and French translations
  pages/        Home, resources, favorites, revisions, and assistant pages
  services/     Open Library and Gemini API integrations
  utils/        Reading progress and book study helpers
```
