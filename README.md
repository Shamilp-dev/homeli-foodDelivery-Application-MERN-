# <img width="90" src="https://github.com/user-attachments/assets/a5bc0cb1-f430-49f3-989b-806878c27003"/> Homeli – Modern Homely Food Delivery App

> A full-stack **MERN + React Native** food delivery application that brings home-style food closer to users, offering a smooth ordering and tracking experience.

## 🚀 Features  

- 🏠 **Browse restaurants** offering homemade and local cuisines  
- 🍲 **Seamless ordering experience** with live order status updates  
- 🚗 **Real-time delivery tracking** via interactive map  
- 💳 **Secure payment & order management**  
- 🔔 **Push notifications** for order updates  
- 👤 **User authentication & profile management**  
- ⚙️ **Admin dashboard** for restaurant and order control  

---

## 🧩 Tech Stack  

| Category | Technology |
|-----------|-------------|
| Frontend (App) | React Native (Expo), TypeScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ORM) |
| Cloud & Storage | AWS S3 |
| Maps & Location | Google Maps API |
| Authentication | JWT, AsyncStorage |
| Others | Axios, Context API, RESTful APIs |

---

## 📸 Screenshots  

<img width="180" height="468" alt="image" src="https://github.com/user-attachments/assets/d934ccb6-e148-4f7c-b99d-808ffefd0c86" />

<img width="180" height="468" alt="image" src="https://github.com/user-attachments/assets/73a09e8a-2ad0-44e3-917a-b3271d3d3729" />

<img width="180" height="468" alt="image" src="https://github.com/user-attachments/assets/1cf749d9-db28-4801-90f3-72d40925fef7" />

<img width="180" height="468" alt="image" src="https://github.com/user-attachments/assets/1044fbed-937b-4259-b2a7-56b1ff07d8cb" />

------------------------------------------------------------------------------------------------------------------------------------

⚙️ Installation & Setup  

1️⃣ Clone the repository  
```bash

git clone [https://github.com/your-username/homeli.git](https://github.com/Shamilp-dev/homeli-foodDelivery-Application-MERN-.git)

cd homeli

2️⃣ Install dependencies
npm install

3️⃣ Start the Expo app
npx expo start


Then, choose to run on:

Android Emulator

iOS Simulator

Physical device (via Expo Go)

4️⃣ Start the Backend
cd backend
npm install
npm run dev

📁 Folder Structure

📁 homeli_native/
│
├── 📱 app/                          # React Native screens & navigation
│   ├── (tabs)/                      # Tab-based navigation screens
│   │   ├── index.tsx                # Home/Main screen
│   │   ├── cart.tsx                 # Shopping cart screen
│   │   ├── dashboard.tsx            # Dashboard screen
│   │   ├── profile.tsx              # User profile screen
│   │   ├── explore.tsx              # Explore/Browse screen
│   │   └── _layout.tsx              # Tab layout configuration
│   │
│   ├── (auth)/                      # Authentication screens
│   │   └── login.tsx                # Login screen
│   │
│   ├── onboard/                     # Onboarding flow
│   │   └── onboard.tsx              # Onboarding screen
│   │
│   ├── _layout.tsx                  # Root layout configuration
│   ├── login.tsx                    # Main login entry
│   ├── checkout.tsx                 # Checkout screen
│   ├── payment-methods.tsx          # Payment methods screen
│   ├── edit-profile.tsx             # Edit profile screen
│   ├── notification.tsx             # Notifications screen
│   ├── orders.tsx                   # Orders history screen
│   ├── order-status.tsx             # Order status screen
│   ├── track-order.tsx              # Order tracking screen
│   ├── favorites.tsx                # Favorites/Wishlist screen
│   ├── addresses.tsx                # Saved addresses screen
│   ├── about.tsx                    # About screen
│   ├── support.tsx                  # Support/Help screen
│   └── modal.tsx                    # Modal component
│
├── 🧩 components/                   # Reusable UI components
│   ├── ui/                          # UI-specific components
│   │   ├── icon-symbol.tsx          # Icon symbol component
│   │   ├── icon-symbol.ios.tsx      # iOS icon variant
│   │   └── collapsible.tsx          # Collapsible component
│   │
│   ├── themed-text.tsx              # Themed text component
│   ├── themed-view.tsx              # Themed view component
│   ├── hello-wave.tsx               # Wave animation component
│   ├── parallax-scroll-view.tsx     # Parallax scroll component
│   ├── external-link.tsx            # External link component
│   └── haptic-tab.tsx               # Haptic feedback tab component
│
├── 🔧 hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts          # Color scheme hook
│   ├── use-color-scheme.web.ts      # Web-specific color scheme hook
│   └── use-theme-color.ts           # Theme color hook
│
├── 🎨 constants/                    # App constants
│   └── theme.ts                     # Theme configuration
│
├── 🖼️ assets/                       # Static assets
│   ├── loading/                     # Loading animations
│   │   └── loading.gif              # Loading spinner
│   │
│   └── images/                      # Image assets
│       ├── icon.png                 # App icon
│       ├── partial-react-logo.png   # React logo
│       ├── react-logo@2x.png        # React logo @2x
│       ├── android-icon-background.png
│       │
│       ├── dessert/                 # Dessert food images
│       │   ├── gulabjamun.png
│       │   ├── pazhampori.png
│       │   ├── chikkushake.png
│       │   ├── vanillaicecream.png
│       │   ├── strawberryshake.png
│       │   ├── cupcake.png
│       │   ├── juice.png
│       │   └── samosa.png
│       │
│       ├── lunch/                   # Lunch food images
│       │   ├── meals.png
│       │   ├── muttonbiriyani.png
│       │   └── paneerbuttermasala.png
│       │
│       ├── restaurants/             # Restaurant images
│       │   ├── abc.webp
│       │   ├── restaurant1.jpg
│       │   ├── restaurant2.jpg
│       │   └── restaurant3.jpg
│       │
│       └── chef/                    # Chef profile images
│           ├── chef-venkat.png
│           ├── chef-priya.png
│           └── chef-lakshmi.png
│
├── 🔙 backend/                      # Express.js backend server
│   ├── models/                      # Mongoose data models
│   │   ├── User.js                  # User schema
│   │   ├── Order.js                 # Order schema
│   │   ├── Cart.js                  # Cart schema
│   │   └── FoodItems.js             # Food items schema
│   │
│   ├── routes/                      # API route handlers
│   │   ├── auth.js                  # Authentication routes
│   │   ├── orders.js                # Order management routes
│   │   ├── cart.js                  # Cart operations routes
│   │   └── foodItems.js             # Food items routes
│   │
│   ├── server.js                    # Express server entry point
│   ├── package.json                 # Backend dependencies
│   └── package-lock.json            # Backend dependency lock
│
├── 🛠️ scripts/                      # Build & utility scripts
│   └── reset-project.js             # Project reset script
│
├── 📄 Configuration Files
│   ├── app.json                     # Expo app configuration
│   ├── package.json                 # Frontend dependencies
│   ├── package-lock.json            # Frontend dependency lock
│   ├── tsconfig.json                # TypeScript configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── webpack.config.js            # Webpack configuration
│   ├── expo-env.d.ts                # Expo TypeScript definitions
│   └── README.md                    # Project documentation
│
└── 📦 node_modules/                 # Dependencies (excluded)
🌍 Environment Variables

Create a .env file in both root and server directories:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
GOOGLE_MAPS_API_KEY=your_api_key

📹 Demo Video
https://www.linkedin.com/posts/shamilpziyad_reactnative-mernstack-fullstackdevelopment-activity-7383238080230690816-zkp6?utm_source=share&utm_medium=member_desktop&rcm=ACoAADr9NDIBluxq0jXiAl_4cgRxORaBpQSGQEo
🎥 Watch the Demo
:or Visit LinkedIn for Demo Video



📬 Contact

👤 Shamil P
💼 LinkedIn : https://www.linkedin.com/posts/shamilpziyad/
✉️ shamilpofficial@gmail.com

⭐ If you like this project, give it a star!

