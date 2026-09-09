# FinWiseAI

**🔗 Live app:** https://finwiseai-five.vercel.app
**📦 Backend API docs:** https://finwiseai-backend.onrender.com/docs

FinWiseAI is a full-stack personal finance app that helps it's user to track income and
expenses, set and monitor saving goals and understand their spending through
visual analytics with an built-in AI-powered financial advisor that can
answer questions about your own budget, goals and transactions in real time.

> **Try :** email `demo@finwiseai.com`, password `demo1234`
> ( [Demo account](#demo-account))

<img width="1903" height="961" alt="image" src="https://github.com/user-attachments/assets/80a6854c-210a-4660-810a-6a4a884d557a" />
<img width="1907" height="912" alt="image" src="https://github.com/user-attachments/assets/e8c6431c-1852-413e-8039-11e7c2ad93bb" />
<img width="1897" height="952" alt="image" src="https://github.com/user-attachments/assets/6540e071-5b37-400d-8d46-1fe896dbe802" />
<img width="1882" height="938" alt="image" src="https://github.com/user-attachments/assets/110f6e14-f5a8-48e5-91a1-500f974e937f" />

![FinWiseAI -(dashboard)(goals)(insights)(AI advisor)]


## Features

- 🔐 Secure signup/login with JWT authentication (bcrypt password hashing)
- 💰 Track income and expense transactions with categorization and filtering
- 🎯 Set savings goals with progress tracking
- 📊 Visual analytics — monthly income/expense trends, category breakdowns, budget status
- 🤖 AI advisor chat (Groq-powered LLM) that answers questions about your spending, goals, and budget, with full conversation history
- 🌓 Dark-themed, responsive UI built with Tailwind CSS

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Chart.js, Framer Motion\
**Backend:** FastAPI, SQLAlchemy, PostgreSQL\
**AI:** Groq API (LLM-powered financial assistant)\
**Auth:** JWT-based authentication with bcrypt password hashing\
**Deployed on:** Vercel (frontend), Render (backend), Neon (PostgreSQL)\

## Demo account

Feel free to explore with a demo account:
Email: demo@finwiseai.com
Password: demo1234


## Running locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        
pip install -r requirements.txt
copy .env.example .env    
```

Fill in `.env` with a real `SECRET_KEY`, a PostgreSQL `DATABASE_URL`
(or `sqlite:///./app.db` for a quick local run with no setup), and a
[Groq API key](https://console.groq.com) for the AI advisor.

```bash
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env      
npm run dev
```

Runs at `http://localhost:5173`.

## License

See [LICENSE](LICENSE).
