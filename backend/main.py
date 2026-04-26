from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from database.db import engine, SessionLocal, Base
from models.user import User
from models.task import Task
from models.submission import Submission
from services.ai_service import check_image 
import shutil
import os 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://analyzer-mauve-six.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables
Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- LOGIN ----------------
@app.post("/login")
def login(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(email=email)
        db.add(user)
        db.commit()

    return {"message": "Login success"}

# ---------------- GET TASKS ----------------
@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return tasks

# ---------------- UPLOAD ----------------
@app.post("/upload")
async def upload(
    email: str,
    task_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Get task
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    # AI check
    ai_result = check_image(file_path, task.description)

    submission = Submission(
        user_email=email,
        task_id=task_id,
        image_path=file_path,
        status=ai_result
    )

    db.add(submission)
    db.commit()

    return {
        "message": "Uploaded",
        "result": ai_result
    }


@app.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)):
    submissions = db.query(Submission).all()

    scores = {}

    for sub in submissions:
        if sub.status and "YES" in sub.status.upper():
            scores[sub.user_email] = scores.get(sub.user_email, 0) + 1

    # Convert to sorted list
    leaderboard = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    return leaderboard

@app.post("/create-task")
def create_task(title: str, description: str, db: Session = Depends(get_db)):
    task = Task(title=title, description=description)
    db.add(task)
    db.commit()

    return {"message": "Task created"}

@app.delete("/delete-task/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    db.delete(task)
    db.commit()

    return {"message": "Task deleted"}

@app.get("/submissions")
def get_submissions(db: Session = Depends(get_db)):
    submissions = db.query(Submission).all()
    return submissions

@app.put("/update-submission/{submission_id}")
def update_submission(submission_id: int, status: str, db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == submission_id).first()

    if not sub:
        return {"error": "Submission not found"}

    sub.status = status
    db.commit()

    return {"message": "Updated"}

@app.post("/admin-login")
def admin_login(email: str, password: str):
    # Hardcoded admin (for now)
    if email == "test@xyz.com" and password == "12345678":
        return {"status": "success"}
    
    return {"status": "fail"}