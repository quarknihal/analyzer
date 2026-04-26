from sqlalchemy import Column, Integer, String, ForeignKey
from database.db import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)

    user_email = Column(String)
    task_id = Column(Integer, ForeignKey("tasks.id"))

    image_path = Column(String)
    status = Column(String)