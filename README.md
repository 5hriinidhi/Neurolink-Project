# NeuroLink - Dementia Care Assistant

NeuroLink is a comprehensive web application designed to assist individuals with dementia and their caregivers. It provides a dual-interface system: a simplified, high-contrast dashboard for patients and a detailed management dashboard for caregivers.

## Features

### For Patients
- **Simplified Interface**: High-contrast, large text design for easy navigation.
- **Daily Reminders**: Clear, visual reminders for medications, meals, and appointments.
- **Memory Lane**: A photo and story gallery to help stimulate memory.
- **Family Contacts**: Easy-to-access contact list for family members with one-touch calling (simulated).
- **Emergency Assistance**: Prominent emergency contact button.
- **Voice Commands**: Integrated voice command support for hands-free navigation.

### For Caregivers
- **Dashboard Overview**: Real-time monitoring of patient status, alerts, and vital signs.
- **Task Management**: Create and schedule daily tasks for the patient.
- **Medication Tracking**: Monitor medication adherence and set schedules.
- **Alert System**: Receive notifications for missed medications, wandering, or emergencies.
- **Patient Settings**: Customize the patient's interface (font size, contrast, etc.).

## Tech Stack

- **Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory:
    ```bash
    cd AVISHKAAR
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Running the Application

To start the development server:

```bash
npm run dev
```

This will start the application locally, typically at `http://localhost:5173`. Open this URL in your browser to view the app.

## Building for Production

To build the application for production deployment:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

- `src/components/`: Contains all React components.
    - `Caregiver/`: Components specific to the Caregiver dashboard.
    - `Dashboard/`: Components for the Patient dashboard.
    - `Family/`: Family contact components.
    - `Layout/`: Shared layout components (Header, Navigation).
    - `Memory/`: Memory Lane components.
    - `Reminders/`: Reminder system components.
- `src/contexts/`: React Context providers for state management (Patient, Reminder, Task, Family).
- `src/types/`: TypeScript type definitions.
- `src/App.tsx`: Main application entry point and routing logic.

## License

This project is private and proprietary.
