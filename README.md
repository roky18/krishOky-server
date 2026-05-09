# 🌾 KrishOky Server

**KrishOky** is an AI-powered agricultural platform backend designed to help farmers and users with smart agricultural solutions. Built with a focus on clean architecture, security, and modern AI integration.

## ♻ Features

- **Secure Authentication:** JWT-based login and registration with password hashing (bcrypt).
- **Role-Based Access Control (RBAC):** Separate permissions for `USER` and `ADMIN`.
- **AI Integration:** Powered by **Google Gemini AI** for smart agricultural advice and automated content generation.
- **Clean Architecture:** Structured folder system (Controllers, Services, Models, Routes) for high scalability.
- **Strictly Typed:** Developed using **TypeScript** to ensure bug-free and robust code.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **AI Engine:** Google Gemini API
- **Security:** JSON Web Token (JWT) & Bcrypt.js

## ⚙️ Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/roky18/krishOky-server.git](https://github.com/roky18/krishOky-server.git)
    cd krishOky-server
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add the following:

    ```env
    PORT=5000
    DATABASE_URL=your_mongodb_uri
    BCRYPT_SALT_ROUNDS=12
    JWT_ACCESS_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

4.  **Run the server:**
    ```bash
    npm run dev
    ```

## 🔌 API Endpoints

### Auth Module

- `POST /api/auth/register` - User Registration
- `POST /api/auth/login` - User Login (Returns JWT)

### AI Module

- `POST /api/ai/chat` - Chat with Agricultural AI Assistant

## 👨‍💻 Author

**Roky**

- GitHub: [@roky18](https://github.com/roky18)
- Portfolio: [https://roky18.github.io/Protfolieo/]

## 📜 License

This project is licensed under the MIT License.
