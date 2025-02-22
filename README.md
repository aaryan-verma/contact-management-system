# Contact Management Application

A modern contact management application built with Angular, featuring a clean UI and robust functionality for managing contacts.

## Features

- Create, read, update, and delete contacts
- Search contacts by name or phone number
- Sort contacts by name, email, or phone number
- Pagination for better data handling
- Form validation with duplicate email/phone detection
- Responsive design using Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v16.2.x)

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd contact-management-angular
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:4200`

## Project Structure

- `src/app/components/` - Contains all Angular components
  - `contact-list/` - Displays the list of contacts with search and sort
  - `contact-form/` - Handles contact creation and updates
  - `contact-card/` - Individual contact display component
- `src/app/controllers/` - Business logic layer
- `src/app/services/` - Data management layer
- `src/app/models/` - TypeScript interfaces
- `src/app/directives/` - Custom form validators

## Technologies Used

- Angular 16.2
- TypeScript
- Tailwind CSS
- RxJS
- Lucide Icons

## License

MIT
