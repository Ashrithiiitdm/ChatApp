# ChatApp

A real-time chat application built with **Node.js**, **Express**, **React**, **Socket.io**, and **MongoDB**. This project demonstrates a full-stack web application where users can engage in live chat sessions.

## 🌐 Live Demo

Check out the live demo 👉 [ChatApp](https://chat-app-jet-zeta-83.vercel.app)

## ✨ Features

- **Real-Time Messaging:** Enjoy instant chat interactions with friends and colleagues.
- **Efficient Communication:** Experience swift and reliable message delivery.
- **Persistent Chat History:** Access all your conversations anytime.
- **Media Sharing:** Share images and other media stored securely in the cloud.
- **Profile Customization:** Set your profile photo for a personalized experience.
- **One-to-One & Group Messaging:** Connect privately or in group chats for dynamic conversations.



## 🛠️ Tech Stack

- **Frontend:**
  - **React:** For building dynamic user interfaces.
  - **Tailwind CSS & ShadCN:** For rapid UI development and styling.
  - **Socket.io-client:** For enabling real-time communication in the browser.
  
- **Backend:**
  - **Node.js:** JavaScript runtime for building scalable network applications.
  - **Express.js:** Web framework for building RESTful APIs.
  - **Socket.io:** For real-time bi-directional communication between clients and servers.
  - **MongoDB:** NoSQL database for storing chat data persistently.
  - **Cloudinary:** For image uploads and storage instead of local storage.
  - **JWT (JSON Web Tokens):** For secure user authentication.
  
- **Deployment & Infrastructure:**
  - **Vercel:** Hosting and deployment for the frontend application.
  - **Render:** Deployment platform for the backend server.
  - **MongoDB Atlas:** Cloud database service for MongoDB.
  

## 📦 Getting Started

### ✅ Prerequisites

- Node.js & npm
- MongoDB Atlas account or local instance

### 📥 Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Ashrithiiitdm/ChatApp.git
   cd ChatApp
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server/` directory and add:

   ```env
   PORT=8080
   JWT_SECRET=''
   ORIGIN=''
   MONGO_URL=''
   CLOUDINARY_API_SECRET=''
   CLOUDINARY_API_KEY=''
   CLOUDINARY_CLOUD_NAME=''
   ```

   Start the backend server:

   ```bash
   npm start
   ```

3. **Frontend Setup**

   Open a new terminal:

   ```bash
   cd client
   npm install
   ```

   Create a `.env` file in the `server/` directory and add:

   ```env
    VITE_BACKEND_URL='http://localhost:8080'
   ```



## 🚀 Usage

- Visit the homepage and enter your name or username.
- Join an existing room or create a new one.
- Start chatting in real-time!

## 🙋‍♂️ Contact

Built by [Ashrith](https://github.com/Ashrithiiitdm) with ❤️

---

Feel free to ⭐ this repo if you found it helpful!
