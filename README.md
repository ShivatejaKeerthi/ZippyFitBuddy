# ZippyFitBuddy

Zippy - Your AI FitBuddy is a fitness tracker web application built with **Vite, React, and JavaScript**. It helps users set and track their fitness goals efficiently. The app includes guided goal-setting steps and stores user progress in MongoDB.

## 🚀 Features

- **User-Friendly UI** – Intuitive and interactive interface.
- **Step-by-Step Goal Setting** – Navigate with Previous & Next buttons.
- **Goal Summary Page** – Displays all selected choices beautifully.
- **MongoDB Integration** – Stores user goals securely.
- **Social Authentication** – Login via Google & Facebook.
- **Responsive Design** – Works seamlessly on all devices.

## 📂 Folder Structure

```
zippyfitbuddy/
│── client/               # Frontend (React + Vite)
│   ├── src/              # React components & pages
│   ├── public/           # Static assets
│   ├── .env              # Environment variables
│   ├── vite.config.js    # Vite configuration
│── server/               # Backend (Node.js + Express)
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication & validation
│   ├── .env              # Backend environment variables
│   ├── index.js          # Entry point
│── netlify.toml          # Netlify deployment config
│── README.md             # Project documentation
```

## 🔧 Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/zippyfitbuddy.git
cd zippyfitbuddy
```

### 2️⃣ Install Dependencies
#### **Frontend**
```sh
cd client
npm install
```
#### **Backend**
```sh
cd server
npm install
```

### 3️⃣ Configure Environment Variables
Create `.env` files in `client/` and `server/`.
#### **Frontend (`client/.env`)**
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```
#### **Backend (`server/.env`)**
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Application
#### **Backend**
```sh
cd server
npm start
```
#### **Frontend**
```sh
cd client
npm run dev
```
Open `http://localhost:5173` in your browser.

## 🚀 Deployment

### **Frontend (Vercel)**
1. Set `Base Directory`: `client`
2. Set `Build Command`: `npm run build`
3. Set `Publish Directory`: `client/dist`
4. Add `_redirects` file in `client/public/`:
```
/* /index.html 200
```

### **Backend (Render/Railway)**
Deploy the `server` folder on **Render** (https://render.com/) or **Railway** (https://railway.app/).

## 🛠 Technologies Used
- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js, MongoDB

- **Hosting:** Vercel (Frontend), Render/Railway (Backend)

## 💡 Future Improvements
- Add **progress tracking**
- Implement **email notifications**
- Introduce **AI-powered workout recommendations**
- Social Login: **Google OAuth, Facebook Login**

## 🤝 Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue.
