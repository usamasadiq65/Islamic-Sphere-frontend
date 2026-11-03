# Islamic Sphere - User Frontend

Islamic Sphere is a community and learning web application that brings together Islamic study resources, community groups, scholar sessions, events, prayer tools, and personal learning activities.

## Features

- User registration, sign-in, email verification, and password recovery
- Learning paths, Quran reading and study pages, and dua resources
- Community groups, group details, and real-time chat
- Scholar directory and session booking/details
- Events, tasks, and progress tracking
- Prayer and location-based features
- Zakat calculator and emotion/reflection tools
- Support and contact forms

## Tech stack

- React 19 with Create React App
- React Router 7
- Bootstrap 5, React Bootstrap, Tailwind CSS 3, and custom CSS
- Axios for API requests
- Stream Chat React SDK for real-time chat
- `date-fns`, React Toastify, and Sonner

## Requirements and setup

- Node.js and npm
- A running Islamic Sphere backend

Install dependencies from this directory:

```bash
npm install
```

Create a `.env` file with the API URL. The optional Geoapify key supports location search:

```env
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_GEOAPIFY_KEY=your_geoapify_key
```

The development server runs on port 3001 when `PORT=3001` is set. Start it on macOS/Linux with:

```bash
PORT=3001 npm start
```

Open [http://localhost:3001](http://localhost:3001). On Windows PowerShell, use `$env:PORT=3001; npm start`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the React development server |
| `npm run build` | Create a production build in `build/` |
| `npm test` | Run the Create React App test runner |
| `npm run build:css` | Build the Tailwind stylesheet |

## Related applications

The API is maintained in the separate Islamic Sphere backend repository. The project also has a separate React admin panel for management tasks.
