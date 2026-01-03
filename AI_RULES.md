# AI Rules for Guitar Tabs & Chords Manager

This document outlines the core technologies used in this application and provides clear guidelines for library usage to maintain consistency and best practices.

## Tech Stack

*   **React & Next.js**: The application is built using React for the UI, leveraging Next.js for server-side rendering, routing, and other framework features.
*   **TypeScript**: All application code is written in TypeScript for type safety and improved developer experience.
*   **Tailwind CSS**: Styling is handled exclusively with Tailwind CSS, providing a utility-first approach for responsive and consistent designs.
*   **shadcn/ui**: A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **Radix UI**: Provides unstyled, accessible components that form the foundation for shadcn/ui components.
*   **Lucide React**: Used for all icons throughout the application.
*   **React Hook Form & Zod**: For robust form management and validation.
*   **Sonner**: A modern toast library for displaying notifications.
*   **next-themes**: For managing light and dark mode themes.
*   **Local Storage**: Used for client-side data persistence of songs and folders.

## Library Usage Rules

*   **UI Components**:
    *   Always prioritize using existing `shadcn/ui` components from the `components/ui` directory.
    *   If a required component is not available in `shadcn/ui` or needs significant customization, create a new component in `src/components/` and style it using Tailwind CSS.
    *   **Do not modify files within the `components/ui` directory.** These are prebuilt and should be treated as immutable.
*   **Styling**:
    *   All styling must be done using **Tailwind CSS classes**. Avoid inline styles or custom CSS files unless absolutely necessary for global styles (e.g., `app/globals.css`).
    *   Ensure designs are responsive across different screen sizes.
*   **Icons**:
    *   Use icons from the `lucide-react` library.
*   **Forms**:
    *   Implement all forms using `react-hook-form` for state management and `zod` for schema validation.
*   **State Management**:
    *   For local component state, use React's `useState` or `useReducer`.
    *   For global or shared state, consider using React Context API.
*   **Routing**:
    *   Utilize Next.js's App Router for navigation.
*   **Data Persistence**:
    *   For client-side data storage, use `localStorage` as demonstrated in `lib/storage.ts`.
*   **Notifications**:
    *   Use `sonner` for all toast notifications to provide user feedback.
*   **Theme Management**:
    *   Use `next-themes` for handling light/dark mode toggling.
*   **Carousels**:
    *   Use `embla-carousel-react` for carousel functionalities.
*   **OTP Inputs**:
    *   Use `input-otp` for one-time password input fields.
*   **Calendars/Date Pickers**:
    *   Use `react-day-picker` for calendar and date selection components.
*   **Charts**:
    *   Use `recharts` for all charting and data visualization needs.
*   **Drawers**:
    *   Use `vaul` for bottom/side sheet components.
*   **Command Palettes**:
    *   Use `cmdk` for command palette interfaces.