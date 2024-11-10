# Junction2024-Ophiuchus
# Iris

## 📖 Overview
Iris automates equipment inventory with the framework of a digital solution that interprets labels of building machinery to take inventory with BIM integration

---

## 🚀 Features
- *Optical Character Recognition:* Reading text from images to eliminate eye-to-hand copying.
- *User-friendly App Design:* Easy to use app for non-experts to do inventory.
- *Natural Language Processing:* The output of the OCR has to be interpretted into usable inventory data.  
- *BIM Integration:* Created databases designed to work with BIM format allowing.

---

## 🛠️ Tech Stack
Mention the languages, frameworks, APIs, and tools you used in this project.

*Example:*
- *Frontend:* React Native(TypeScript, JavaScript)
- *Backend:*  Flask (TypeScript, JavaScript)
- *Database:* MySQL
- *APIs:* google-cloud-documentai, 
- *Other Tools:* Expo SDK, Pillow

---

## 📐 Architecture
Iris uses an *expo frontend* that communicates with a *Backend backend. The backend interacts with **MySQL for data storage* and integrates with external APIs for data on workouts and nutrition.

We use basic server-client architecture to facilitate communication between the API and the user via the app.

---

## 📲 How to use

#### Set Up Google Cloud Credentials:

The project requires access to Google Document AI. Follow these steps:

1. Create a Google Cloud project and install Google Cloud CLI
2. Enable the Document AI API for your project.
3. Set the GOOGLE_APPLICATION_CREDENTIALS via login to the google cloud CLI on your local computer 

#### Set Up Environment Variables

Create a .env file in the root directory to securely store sensitive information. Add the following environment variables:

`PROJECT_ID=your-google-cloud-project-id 
LOCATION=your-documentai-location (e.g., us, eu)
PROCESSOR_ID=your-documentai-processor-id 
DB_USER=your-database-username
DB_PASSWORD=your-database-password 
DB_HOST=localhost 
DB_NAME=your-database-name 
DB_PORT=3306`

#### Set Up MySQL Database

Install MySQL and create a database with the name specified in the .env file (DB_NAME).
CREATE DATABASE your_database_name;

### Run the Flask Server

Start the Flask server:
python server.py


### Run the following commands in CLI

1.Install Node.js and npm from nodejs.org
2.Install Expo CLI
npm install -g expo-cli
3.Clone the repository
git clone https://github.com/your-username/your-repo.git
cd your-repo
4.Install project dependencies
npm install or yarn install

Install additional dependencies
npm install expo-camera expo-media-library @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
or yarn add expo-camera expo-media-library @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context

Configure React Navigation
npm install react-native-gesture-handler react-native-reanimated or
yarn add react-native-gesture-handler react-native-reanimated

Link native dependencies (for React Native CLI projects)
npx react-native link

Start the project
expo start
or
npx react-native run-android
npx react-native run-ios

## 🤝 Team
Rohit Binu
Madoc Karthaus
Alexandra Muntean
Tunay Ata Gok
