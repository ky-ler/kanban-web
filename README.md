# Kanban Web

This is the frontend for the Kanban project management application, built with React, Vite, and TypeScript. It provides a user-friendly interface for managing projects, collaborating with team members, and tracking tasks. Please note that this project is currently under development.

## Tech Stack

* **React 19**
* **Vite**
* **TypeScript**
* **TanStack Router**
* **React Query**
* **Tailwind CSS**
* **Shadcn**
* **Keycloak**

## Key Features

* **Project Management:** Create, view, and manage your Kanban projects.
* **Collaborator Support:** Add and manage collaborators on your projects.
* **Issue Tracking:** Create, update, and track issues within each project.
* **User-Friendly Interface:** A clean and intuitive interface for managing your workflow.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* **Node.js (v18 or later)**
* **npm or yarn**
* **Running Backend Services:** This frontend application requires the `kanban-backend`, Keycloak, and PostgreSQL services to be running. Please follow the setup instructions in the [kanban-backend repository's README.md](https://github.com/ky-ler/kanban-backend/blob/main/README.md) to get these services up and running using Docker Compose before proceeding.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/ky-ler/kanban-web.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd kanban-web
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```
4.  **Set up environment variables:**
    * Create a `.env` file in the root of the project by copying the `.env.example` file.
    * Ensure the values in your `.env` file match the configuration of your running backend services:
        ```
        VITE_KEYCLOAK_URL=http://localhost:9090
        VITE_KEYCLOAK_REALM=kanban
        VITE_KEYCLOAK_CLIENT=kanban-app
        VITE_API_URL=http://localhost:8080/api
        ```
5.  **Run the application:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.
