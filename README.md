# 🧳Tforart Tripsy - Trip Expense Management App

Tforart Tripsy is a product within the Tforart software ecosystem. This is a web application that helps manage expenses for group trips. The app allows tracking individual member expenses, automatically calculating settlement amounts, and sharing trips with friends.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.6-FFCA28?logo=firebase)
![Mantine](https://img.shields.io/badge/Mantine-8.3-339AF0?logo=mantine)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss)

## ✨ Features

### 🚀 Trip Management

- Create, edit, and delete trips
- Track trip start and end dates
- Mark trips as completed

### 👥 Member Management

- Add/remove members from trips
- Invite friends via shareable links
- Display expense information for each person

### 💰 Expense Management

- Add expenses with description and payer information
- Track total trip expenses
- View detailed expenses by each member

### 📊 Summary & Settlement

- Automatically calculate average amount per person
- Identify main spender (highest spender)
- Calculate settlement amounts between members
- Optimized payment logic: all debtors transfer to the main spender

### 🔐 Authentication

- Sign in with Google account
- Protected routes for authenticated users

## 🛠️ Tech Stack

| Technology                | Purpose                             |
| ------------------------- | ----------------------------------- |
| **React 19**              | UI Framework                        |
| **TypeScript**            | Type Safety                         |
| **Vite**                  | Build Tool                          |
| **Firebase**              | Authentication & Firestore Database |
| **Mantine UI**            | Component Library                   |
| **Tailwind CSS 4**        | Utility-first CSS                   |
| **TanStack Query**        | Server State Management             |
| **React Hook Form + Zod** | Form Handling & Validation          |
| **React Router DOM**      | Client-side Routing                 |
| **date-fns**              | Date Utilities                      |
| **Lucide React**          | Icons                               |

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AddExpenseModal.tsx
│   ├── AddParticipantModal.tsx
│   ├── CreateTripModal.tsx
│   ├── EditTripModal.tsx
│   ├── ExpenseCard.tsx
│   ├── ParticipantCard.tsx
│   ├── ProtectedRoute.tsx
│   ├── ShareTripModal.tsx
│   ├── TripCard.tsx
│   ├── TripMenu.tsx
│   └── TripSummaryModal.tsx
├── config/
│   └── firebase.ts      # Firebase configuration
├── hooks/               # Custom React hooks
│   ├── auth.ts          # Authentication hook
│   ├── useCurrency.ts   # Currency formatting
│   ├── useExpense.ts    # Expense operations
│   ├── useInvite.ts     # Invite operations
│   ├── useTrips.ts      # Trip CRUD operations
│   └── useTripSettlement.ts  # Settlement calculation
├── pages/               # Page components
│   ├── Home.tsx         # Trip list page
│   ├── JoinTrip.tsx     # Join trip via invite
│   ├── Login.tsx        # Login page
│   └── Trip.tsx         # Trip detail page
├── schemas/
│   └── tripSchema.ts    # Zod validation schemas
├── services/            # API services
│   ├── expenseService.ts
│   ├── inviteService.ts
│   ├── tripService.ts
│   └── helpers.ts
├── types/
│   └── trip.d.ts        # TypeScript type definitions
├── App.tsx
├── main.tsx
└── index.css
```

## 🚀 Installation & Setup

### Requirements

- Node.js >= 18
- npm or yarn
- Firebase account

### Installation Steps

1. **Clone repository**

   ```bash
   git clone https://github.com/nstdev1001/tforart-tripsy.git
   cd tforart-tripsy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   Create a `.env` file in the root directory with the following content:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📜 Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint checks        |

## 🔥 Firebase Configuration

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/{tripId} {
      allow read, write: if request.auth != null;
    }
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null;
    }
    match /invites/{inviteId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Authentication

- Enable **Google Sign-In** in Firebase Console > Authentication > Sign-in method

## 📱 Screenshots

_Coming soon..._

## 🤝 Contributing

All contributions are welcome! Please create a Pull Request or Issue if you'd like to contribute.

## 📄 License

MIT License - See [LICENSE](LICENSE) file for more details.

---

Made with ❤️ by [nstdev1001](https://github.com/nstdev1001)
