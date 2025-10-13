# <img width="90" src="https://github.com/user-attachments/assets/a5bc0cb1-f430-49f3-989b-806878c27003" style="vertical-align: middle; top:10; margin-right: 8px;" /> Homeli – Modern Homely Food Delivery App

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

<img width="222" height="468" alt="image" src="https://github.com/user-attachments/assets/203d66cf-9367-4dd2-acaf-701385a28d6f" />

<img width="222" height="500" alt="image" src="https://github.com/user-attachments/assets/73a09e8a-2ad0-44e3-917a-b3271d3d3729" />

<img width="222" height="500" alt="image" src="https://github.com/user-attachments/assets/1cf749d9-db28-4801-90f3-72d40925fef7" />

<img width="222" height="500" alt="image" src="https://github.com/user-attachments/assets/1044fbed-937b-4259-b2a7-56b1ff07d8cb" />

⚙️ Installation & Setup  

1️⃣ Clone the repository  
```bash
git clone https://github.com/your-username/homeli.git
cd homeli

2️⃣ Install dependencies
npm install

3️⃣ Start the Expo app
npx expo start


Then, choose to run on:

Android Emulator

iOS Simulator

Physical device (via Expo Go)

4️⃣ Start the Backend (if separate)
cd server
npm install
npm run dev

📁 Folder Structure
homeli/
│
├── app/                # React Native screens & navigation
├── components/         # UI components
├── context/            # Auth & notification context
├── assets/             # Images, icons, and static files
├── server/             # Express backend (API)
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   └── controllers/    # Route logic
└── package.json

🌍 Environment Variables

Create a .env file in both root and server directories:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
GOOGLE_MAPS_API_KEY=your_api_key

📹 Demo Video

🎥 Watch the Demo

Optional but highly recommended to add a short demo link.

📬 Contact

👤 Your Name
💼 LinkedIn

💻 GitHub

✉️ your.email@example.com

⭐ If you like this project, give it a star!

