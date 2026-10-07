# 🌾 KrishOky Server - Backend API

**KrishOky Server** is the robust, scalable RESTful API powering the **KrishOky** AI-driven agricultural platform[cite: 1, 2]. Built using Node.js, Express, and TypeScript with a clean layered architecture (Routes -> Controllers -> Services -> Models), it provides real-time AI advisories via Google Gemini, Cloudinary image hosting, and bilingual data support.

## 🌐 Live API & Deployment

- **Live Base API:** [https://krishoky-server.vercel.app/](https://krishoky-server.vercel.app/)[cite: 2]
- **API Version Route:** `https://krishoky-server.vercel.app/api`
- **Frontend App:** [https://krishoky-client.vercel.app/](https://krishoky-client.vercel.app/)[cite: 2]

## ⚡ Features

- **Layered Clean Architecture:** Strict separation of concerns (Routes -> Controllers -> Services -> Models -> Interfaces).
- **Bilingual Schema Support:** Multilingual JSON structure (`{ bn: string, en: string }`) for localized content.
- **Secure Authentication:** Custom JWT authentication alongside Google OAuth support and bcrypt password hashing.
- **Role-Based Access Control (RBAC):** Granular authorization for `USER`, `SELLER`, and `ADMIN` roles.
- **AI-Powered Services:** Integrated **Google Gemini API** (`gemini-1.5-flash`) for crop diagnosis, farming advisories, AI description generation, and review summarization.

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js[cite: 1, 2]
- **Framework:** Express.js (TypeScript)[cite: 1, 2]
- **Database & ODM:** MongoDB Atlas with Mongoose ODM
- **AI Integration:** Google Gemini API (`@google/generative-ai`)[cite: 2]
- **Image Hosting:** Cloudinary & Multer[cite: 2]
- **Security:** JWT (JSON Web Tokens) & Bcrypt.js[cite: 2]

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory and add the following configuration keys:

````env
PORT=5000
DATABASE_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
BCRYPT_SALT_ROUNDS=12

# AI & Media Services
GEMINI_API_KEY=your_google_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS & Frontend Origins
FRONTEND_URL=[https://krishoky-client.vercel.app](https://krishoky-client.vercel.app)



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
````
