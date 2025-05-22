# Kanban Board
A simple Kanban Board built using React, TypeScript, Vite, and React DnD, demonstrating task management with drag-and-drop functionality, modular component structure, and modern state/data handling.

---

## 🚀 Live Demo

🔗 [Hosted on GitHub Pages](https://azharkhalid.github.io/kanban-board/)

---

## How to Run the Project Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/azharKhalid/kanban-board.git
   cd kanban-board
   npm install
   npm run dev
   ```
---

## A brief explanation of the approach taken.
1. **Design Decisions**:
    - Tasks are managed via modular components and passed via props/state to promote reusability.
    - Constants, types, and reusable components are maintained in separate folders for clarity and scalability.
    - Memoization (useMemo) and React.memo are used to prevent unnecessary re-renders.

2. **Trade-offs and Limitations**
    - No authentication is included currently; the API calls fetch general tasks.
    - Minimal global state management; React Query handles API cache but Redux is not implemented yet.
    - Basic error/loading states are included, but further polish can be added.

## Possible Improvements.
  - Add user authentication (login/logout).
  - Fetch tasks based on the authenticated user.
  - Implement Redux Toolkit for better state management.
  - Persist task state (e.g., localStorage or backend).
  - Improve mobile responsiveness and accessibility.
