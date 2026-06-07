# 🎓 LectureCheck – AI-Powered Lecture Verification System

LectureCheck is a full-stack web application designed to analyze lecture content and compare it with reference study materials. The platform enables instructors to upload lecture videos and reference PDFs, generate AI-powered transcripts, and evaluate the similarity between lecture content and academic resources.

---

## 🚀 Features

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Password hashing using bcrypt

### 🎥 Lecture Upload
- Upload lecture videos
- Store lecture metadata in MongoDB
- Manage uploaded lectures through an intuitive dashboard

### 📄 Reference PDF Management
- Upload and store reference PDFs
- Extract text from uploaded documents
- Retrieve and manage academic resources

### 🤖 AI-Powered Analysis
- Speech-to-text transcription using AssemblyAI
- Automated lecture content processing
- Similarity analysis between lecture transcripts and reference materials

### 📊 Dashboard
- View uploaded lectures
- Manage reference documents
- Access AI-generated reports and analytics

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### AI & Processing
- AssemblyAI
- FFmpeg
- PDF Parser

### Authentication
- JWT (JSON Web Token)
- bcrypt.js

---

## 📂 Project Structure

LectureCheck/

├── my-react-app/

│   ├── src/

│   ├── public/

│   └── package.json

│

├── Backendpdf/

│   ├── uploads/

│   ├── files/

│   ├── audios/

│   ├── backend.js

│   └── package.json

│

└── similarityCheck.py

---

## ⚙️ Installation

### Clone Repository

git clone https://github.com/yourusername/LectureCheck.git

cd LectureCheck

### Install Frontend Dependencies

cd my-react-app

npm install

### Install Backend Dependencies

cd ../Backendpdf

npm install

### Configure Environment Variables

Create a .env file in the backend directory and add:

REACT_APP_API_URL=http://localhost:5000

ASSEMBLYAI_API_KEY=YOUR_API_KEY

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY

---

## ▶️ Running the Project

### Start Backend Server

npm start

### Start Frontend Application

npm start

### Start Similarity Service

python similarityCheck.py

---

## 📊 Workflow

1. User uploads a lecture video.
2. Video is processed and converted into audio using FFmpeg.
3. AssemblyAI generates an automatic transcript.
4. Reference PDFs are uploaded and parsed.
5. Text from transcripts and PDFs is processed.
6. Similarity analysis is performed.
7. Results are displayed through the dashboard.

---



## 🎯 Key Highlights

- Full-stack MERN-based application
- AI-powered speech-to-text integration
- Secure authentication and authorization
- File upload and document management
- Lecture-to-document similarity analysis
- Academic content verification workflow

---

## 🔮 Future Enhancements

- Advanced semantic similarity using transformer models
- Topic-wise lecture coverage analysis
- AI-generated lecture summaries
- Real-time lecture monitoring
- Interactive analytics dashboard
- Multi-language transcription support

---

## 👩‍💻 Author

Nandyala Vani

Chemical Engineering Undergraduate, IIT (BHU) Varanasi

Full Stack Developer | AI Enthusiast

---

⭐ If you found this project useful, feel free to star the repository.
