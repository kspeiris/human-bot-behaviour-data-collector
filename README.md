# Behavioural Data Collection Framework

A lightweight web behavioural fingerprinting framework for coordinated bot detection research.

## Features

- **Real-time Behavioural Tracking**: Mouse movements, clicks, scrolls, keyboard interactions, and navigation
- **Privacy-First Design**: Anonymous session IDs, no personal data collection
- **Google Sheets Integration**: Cloud-based data storage via Google Apps Script
- **Modern UI/UX**: Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Hosting**: Netlify

## Setup Instructions

### 1. Google Apps Script Setup

1. Create a new Google Sheet
2. Go to Extensions → Apps Script
3. Copy the contents of `google-apps-script/Code.gs` into the editor
4. Save the project
5. Click Deploy → New Deployment
6. Select "Web App" as type
7. Set access to "Anyone" (for data collection)
8. Copy the Deployment URL

### 2. Frontend Setup

```bash
# Clone the repository
git clone <repository-url>
cd behavioural-data-collection

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=YOUR_APPS_SCRIPT_URL" > .env

# Start development server
npm run dev

# Build for production
npm run build