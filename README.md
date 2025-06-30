# 🚀 StackNest – Developer Collaboration Platform

StackNest is a **full-stack MERN** application that allows developers to **connect, join rooms, share projects, write articles, and participate in daily coding challenges** to improve problem-solving skills.
<!-- Abiram@personal.example.com -->
---

## 📜 Features

- ✅ User authentication (JWT)
- ✅ Real-time chat, audio & video calls
- ✅ Create & join rooms for discussions
- ✅ Post feeds & interact with other developers
- ✅ Daily coding challenges & leaderboard
- ✅ Friend system: send, accept & block users
- ✅ Admin panel with analytics & engagement tracking
- ✅ Premium membership & exclusive features

---

## 🏗️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.io (WebSockets), WebRTC
- **Authentication:** JWT, bcrypt
- **Deployment:** Docker, GCP
- **Dev Tools:** Postman, Figma (for UI prototyping)

---

## 🛠️ Installation & Setup

### 🔧 **1. Clone the Repository**

```sh
git clone https://github.com/your-username/StackNest.git
cd StackNest
```

### 🏑️ **2. Environment Configuration**

Create a `.env` file in both `client` and `server` directories:

#### `client/.env`

```env
VITE_API_URL=http://localhost:3000
```

#### `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### 🎓 **3. Install Dependencies**

```sh
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 🌍 **4. Run Development Servers**

```sh
# Start backend
npm run dev

# In a new terminal, start frontend
cd ../client
npm run dev
```

<!--
### 🌬️ **5. Run with Docker (Optional)**
```sh
docker-compose up --build
``` -->

---

## ✨ Upcoming Features

- Code editor with live collaboration
- Group calls with screen sharing
- User badges & activity points
- Event hosting for hackathons & meetups
- More advanced analytics for admins

## 🚀 Live Demo 
- stacknest.abiram.website

## Stay tuned for a live hosted version on GCP!
- stacknest.abiram.website (server will close soon)
## ✉️ Contact

For any feedback, questions, or collaboration:

- Email: abiramk4572@gmail.com
