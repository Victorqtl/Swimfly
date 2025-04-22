# SwimFly

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2-blue.svg" alt="Next.js Version" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB.svg" alt="React Version" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6.svg" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg" alt="Tailwind Version" />
  <img src="https://img.shields.io/badge/Prisma-6.5-2D3748.svg" alt="Prisma Version" />
</p>

SwimFly is a modern task management application built with Next.js, helping you organize your life with elegant Kanban boards. Boost your productivity by managing your tasks in a visually appealing, drag-and-drop interface.

## 🚀 Features

-   **User Authentication**: Secure account creation and login using NextAuth
-   **Kanban Boards**: Create and manage multiple boards for different projects
-   **Drag and Drop**: Intuitive drag-and-drop interface for cards and lists using dnd-kit
-   **Real-time Updates**: Changes reflect instantly across the application
-   **Customization**: Personalize your boards with different colors and labels

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15, React 19, Tailwind CSS 4
-   **Backend**: Next.js API Routes, Prisma ORM
-   **Database**: PostgreSQL (Neon)
-   **Authentication**: NextAuth.js
-   **State Management**: Zustand
-   **UI Components**: Shadcn UI, DaisyUI
-   **Form Handling**: React Hook Form with Zod validation
-   **Drag and Drop**: Dnd kit

## 📋 Prerequisites

-   Node.js (v18+)
-   pnpm
-   Neon account (for PostgreSQL database)

## 🚀 Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/swimfly.git
    cd swimfly
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Database configuration:

    - Create a [Neon](https://neon.tech/) account if you don't have one yet
    - Create a new PostgreSQL project
    - Get the connection string from the project settings

4. Set up environment variables:
   Create a `.env` file with the following variables:

    ```
    DATABASE_URL="postgresql://[user]:[password]@[neon-host]/[db-name]?sslmode=require"
    AUTH_SECRET==your_nextauth_secret
    ```

5. Set up the database:

    ```bash
    pnpm prisma db push
    ```

6. Run the development server:

    ```bash
    pnpm dev
    ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

1. Create an account or log in
2. Create a new board for your project
3. Add lists to organize your workflow (e.g., "To Do", "In Progress", "Done")
4. Add cards to your lists representing tasks
5. Drag and drop cards between lists as your work progresses

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
