from sqlalchemy import Column, String, Integer, Float, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    thumbnail = Column(String(255), nullable=False)
    instructor = Column(String(100), nullable=False)
    instructor_avatar = Column(String(255), nullable=False)
    total_modules = Column(Integer, default=10)
    completed_modules = Column(Integer, default=0)
    progress_percent = Column(Integer, default=0)
    estimated_hours = Column(Integer, default=30)
    level = Column(String(50), default="Intermediate")
    rating = Column(Float, default=4.9)
    enrolled_count = Column(Integer, default=1200)
    tags = Column(String(255), default="AI,Algorithms")

    modules = relationship("CourseModule", back_populates="course", cascade="all, delete-orphan")
    materials = relationship("CourseMaterial", back_populates="course", cascade="all, delete-orphan")

class CourseModule(Base):
    __tablename__ = "course_modules"

    id = Column(String(50), primary_key=True, index=True)
    course_id = Column(String(50), ForeignKey("courses.id"), nullable=False)
    title = Column(String(200), nullable=False)
    duration = Column(String(50), default="25 mins")
    completed = Column(Boolean, default=False)
    module_type = Column(String(50), default="reading") # video, reading, code, quiz, interactive
    summary = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

    course = relationship("Course", back_populates="modules")

class CourseMaterial(Base):
    __tablename__ = "course_materials"

    id = Column(String(50), primary_key=True, index=True)
    course_id = Column(String(50), ForeignKey("courses.id"), nullable=False)
    title = Column(String(200), nullable=False)
    material_type = Column(String(50), default="PDF Guide")
    file_size = Column(String(50), default="2.4 MB")
    downloads = Column(Integer, default=150)
    badge = Column(String(50), default="Essential")

    course = relationship("Course", back_populates="materials")
