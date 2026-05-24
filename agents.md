# Agents Guide - Absensi Frontend

## Project Structure
React + TypeScript + Vite + Tailwind CSS

## Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Lucide React (icons)

## Commands
```bash
# Run development server
npm run dev

# Build for production
npm run build
```

## Backend Services
- Attendance API: `http://localhost:3000`
- Employee API: `http://localhost:3001`

## Conventions
- Pages go in `src/pages/`
- Reusable components go in `src/components/`
- API calls go in `src/services/`
- Use `useState` for local state
- Use `useEffect` with `[]` for initial data fetch
- Use `useCallback` for functions passed to `useEffect`
- Avoid `any` type where possible
- Use `localStorage` to store logged in employee data
- Always use `formatDate` from `components/DateTimeFormat.ts` for dates

## Auth
- Employee data stored in `localStorage` as `employee`
- `useAuth` hook reads from localStorage
- Redirect to `/` if not logged in

## Routes
- `/` — Login
- `/dashboard` — Dashboard wrapper with drawer navigation
- `/dashboard/attendance` — Check in / out (all users)
- `/dashboard/my-history` — Personal attendance history (all users)
- `/dashboard/employees` — Employee list (ADMIN_HRD only)
- `/dashboard/employees/:id` — Employee detail (ADMIN_HRD only)
- `/dashboard/history` — All attendance history (ADMIN_HRD only)

## Notes
- Bottom navigation replaced with burger drawer menu
- Infinite scroll for attendance history
- Image uploads use multipart/form-data
- Late = check in after 9 AM
- Overtime = check out after 6 PM