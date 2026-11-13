# 📱 BudgetApp — Cross-Platform Personal Finance

Cross-platform mobile personal finance & budget tracking application built with **React Native**, **Expo SDK 58**, and **TypeScript**, targeting Android and iOS smartphones.

---

## 🚀 Key Features Built

1. **Authentication Flow**
   - Email/password registration and sign-in via Firebase Auth.
   - Built-in **One-Tap Reviewer Demo Mode** for immediate offline evaluation.

2. **Executive Dashboard**
   - Real-time balance calculations (`Income - Expenses`).
   - Dynamic monthly summaries (income, total expenses, active currency formatting).
   - Quick navigation shortcuts and recent transaction feed.

3. **Transaction Logging & Classification**
   - Income and expense categorization with intuitive badge selectors (Food & Dining, Groceries, Shopping, Transportation, Utilities, Salary, Freelance, etc.).
   - Full description notes and decimal precision handling.

4. **Transaction History & Ledger**
   - Real-time transaction filtering by type (`All`, `Income`, `Expense`).
   - Live search by keyword, note, or amount.
   - Month-by-month pagination & ledger record deletion with safety confirmation alerts.

5. **Budget Targets & Limits**
   - Category-level budget spending progress bars.
   - Overall monthly budget threshold indicators (safe, warning, over-budget color cues).
   - Dynamic financial savings rate calculations.

6. **Profile & Architecture Diagnostics**
   - Active user info and auth session management.
   - Reset/re-seed sample data tool for quick QA.
   - Full stack component inspector.

---

## 🛠 Tech Stack Architecture

- **Framework:** React Native + Expo (SDK 58)
- **Language:** TypeScript 5.9 (Strict Mode)
- **Routing:** Expo Router (File-based routing)
- **State Store:** Zustand v5 (Reactive stores with zero boilerplate)
- **Data Layer:** Firebase Firestore + Local fallback via `@react-native-async-storage/async-storage`
- **Styling:** React Native StyleSheet with light/dark adaptive color system

---

## 💻 Running the Application

### 1. Start the Development Server
```bash
cd budget-app
npx expo start
```

- Press `a` to open on an Android emulator or device (via Expo Go).
- Press `i` to open on an iOS simulator (macOS required for local iOS simulator).
- Press `w` to open in your web browser.
- Scan the terminal QR code with your Android or iPhone camera via the **Expo Go** app.

### 2. Connect to Production Firebase (Optional)
Add your Firebase configuration in `.env` or update [src/services/firebase.ts](file:///c:/Users/Koko/Downloads/BUDGET%20APP/budget-app/src/services/firebase.ts):
```env
EXPO_PUBLIC_FIREBASE_API_KEY="your-api-key"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
EXPO_PUBLIC_FIREBASE_APP_ID="your-app-id"
```
*Note: If unconfigured, the app automatically runs in local offline mode with sample transactions.*

---

## 🚢 GitHub CI/CD & Deployment Pipeline

This repository includes automated workflows under `.github/workflows/`:

1. **`ci.yml` (Continuous Integration):**
   - Triggers on every push & pull request to `main` and `develop`.
   - Runs linting and static TypeScript verification (`tsc --noEmit`).

2. **`deploy.yml` (EAS Build & Store Submission):**
   - Triggers on push to `main`.
   - Uses EAS (Expo Application Services) to build APK/AAB for Google Play and IPA for Apple TestFlight / App Store without requiring local macOS hardware.
