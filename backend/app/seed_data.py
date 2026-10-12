import json
import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.course import Course, CourseModule, CourseMaterial
from app.models.quiz import Question, QuizAttempt
from app.models.performance import TopicMastery, LearningHistory
from app.models.planner import StudyTaskRecord
from app.services.auth_service import get_password_hash

logger = logging.getLogger("cognilearn.seeder")
logging.basicConfig(level=logging.INFO)

def seed_database():
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Seed Users
        if not db.query(User).filter(User.id == "usr-sarah-01").first():
            sarah = User(
                id="usr-sarah-01",
                email="sarah.chen@stanford.edu",
                hashed_password=get_password_hash("password"),
                name="Sarah Chen",
                role="student",
                title="B.S. Computer Science & AI Candidate",
                grade="Senior Year",
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
                streak_days=14,
                daily_goal_minutes=60,
                daily_goal_progress_minutes=42,
                total_xp=3840,
                level=8,
                learning_style="Hands-on Coding",
                preferred_difficulty="Adaptive",
                target_exam="ACM-ICPC & Machine Learning Engineer Certification"
            )
            admin = User(
                id="usr-admin-01",
                email="m.vance@cognilearn.ai",
                hashed_password=get_password_hash("password"),
                name="Dr. Marcus Vance",
                role="admin",
                title="Dean of Curriculum & AI Analytics",
                grade="Faculty Director",
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
                streak_days=45,
                daily_goal_minutes=120,
                daily_goal_progress_minutes=90,
                total_xp=12450,
                level=24,
                learning_style="Theoretical",
                preferred_difficulty="Advanced"
            )
            db.add_all([sarah, admin])
            db.commit()
            logger.info("Seeded initial users (Sarah Chen & Dr. Marcus Vance).")

        # 2. Seed Courses & Modules
        if not db.query(Course).first():
            courses_data = [
                {
                    "id": "course-1",
                    "title": "Advanced Neural Networks & Deep Learning",
                    "description": "Master backpropagation, transformer architectures, attention mechanisms, and fine-tuning LLMs with PyTorch.",
                    "category": "Artificial Intelligence",
                    "thumbnail": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600",
                    "instructor": "Dr. Elena Rostova",
                    "instructor_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
                    "total_modules": 8,
                    "completed_modules": 5,
                    "progress_percent": 62,
                    "estimated_hours": 32,
                    "level": "Advanced",
                    "rating": 4.9,
                    "enrolled_count": 1420,
                    "tags": "PyTorch,Transformers,Attention,LLMs",
                    "modules": [
                        ("m1", "Calculus of Backpropagation & Computational Graphs", "35 mins", True, "reading"),
                        ("m2", "Batch Normalization & LayerNorm Mathematics", "28 mins", True, "video"),
                        ("m3", "Convolutional Feature Maps & Dilated Convolutions", "40 mins", True, "code"),
                        ("m4", "Recurrent Neural Networks vs Vanishing Gradients", "30 mins", True, "video"),
                        ("m5", "Attention Is All You Need: The Transformer Paper", "45 mins", True, "reading"),
                        ("m6", "Building Multi-Head Self-Attention from Scratch", "50 mins", False, "code"),
                        ("m7", "Positional Encoding (Sinusoidal vs Rotary Embeddings)", "25 mins", False, "video"),
                        ("m8", "Knowledge Check: Neural Architectures & Tuning", "20 mins", False, "quiz")
                    ],
                    "materials": [
                        ("mat-1", "Attention & Transformers Mathematical Derivation Cheat Sheet", "PDF Guide", "2.4 MB", "Staff Pick")
                    ]
                },
                {
                    "id": "course-2",
                    "title": "Data Structures & Algorithmic Optimization",
                    "description": "Graph algorithms, dynamic programming, segment trees, and amortized complexity analysis for competitive programming.",
                    "category": "Data Structures",
                    "thumbnail": "https://images.unsplash.com/photo-1516116211227-bbc1562b53eb?auto=format&fit=crop&q=80&w=600",
                    "instructor": "Alexandre Dubois",
                    "instructor_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
                    "total_modules": 6,
                    "completed_modules": 4,
                    "progress_percent": 67,
                    "estimated_hours": 40,
                    "level": "Intermediate",
                    "rating": 4.8,
                    "enrolled_count": 2890,
                    "tags": "Dynamic Programming,Graphs,Trees,C++",
                    "modules": [
                        ("m21", "Asymptotic Analysis & Master Theorem Refresher", "22 mins", True, "reading"),
                        ("m22", "Breadth-First Search & Bipartite Verification", "30 mins", True, "code"),
                        ("m23", "Dijkstra vs Bellman-Ford Shortest Paths", "35 mins", True, "video"),
                        ("m24", "Dynamic Programming: Memoization vs Tabulation", "45 mins", True, "code"),
                        ("m25", "Topological Sort with Kahn Algorithm", "18 mins", False, "interactive"),
                        ("m26", "Segment Trees and Range Minimum Query", "50 mins", False, "code")
                    ],
                    "materials": [
                        ("mat-2", "Graph Cycle Detection: Kahn vs DFS Invariant Matrix", "Jupyter Notebook", "850 KB", "Interactive")
                    ]
                },
                {
                    "id": "course-3",
                    "title": "Probabilistic Machine Learning & Bayesian Inference",
                    "description": "Probability distributions, Markov Chain Monte Carlo, variational inference, and probabilistic graphical models.",
                    "category": "Mathematics",
                    "thumbnail": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600",
                    "instructor": "Prof. Ananya Nair",
                    "instructor_avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
                    "total_modules": 4,
                    "completed_modules": 1,
                    "progress_percent": 25,
                    "estimated_hours": 26,
                    "level": "Advanced",
                    "rating": 4.95,
                    "enrolled_count": 910,
                    "tags": "Bayesian Stats,MCMC,Gaussian Processes",
                    "modules": [
                        ("m31", "Bayes Rule & Conjugate Priors Introduction", "20 mins", True, "reading"),
                        ("m32", "Likelihood Estimation & MAP Principle", "32 mins", False, "video"),
                        ("m33", "Gaussian Conjugates and Empirical Bayes", "22 mins", False, "video"),
                        ("m34", "Markov Chain Monte Carlo (MCMC) Sampling", "45 mins", False, "code")
                    ],
                    "materials": [
                        ("mat-3", "Bayesian Conjugate Priors Quick Reference", "Formula Sheet", "1.1 MB", "Essential")
                    ]
                },
                {
                    "id": "course-4",
                    "title": "Distributed Systems & Cloud Architecture",
                    "description": "Consensus protocols (Raft, Paxos), CAP theorem, event-driven microservices, and high-throughput caching.",
                    "category": "Cloud & Systems",
                    "thumbnail": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
                    "instructor": "Julian K. Richter",
                    "instructor_avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
                    "total_modules": 4,
                    "completed_modules": 2,
                    "progress_percent": 50,
                    "estimated_hours": 35,
                    "level": "Intermediate",
                    "rating": 4.7,
                    "enrolled_count": 1750,
                    "tags": "Raft,Paxos,CAP,Kafka",
                    "modules": [
                        ("m41", "CAP Theorem Trade-Offs in Distributed Storage", "25 mins", True, "reading"),
                        ("m42", "Leader Election in Raft State Machines", "35 mins", True, "interactive"),
                        ("m43", "Log Replication & Log Compaction", "30 mins", False, "code"),
                        ("m44", "Byzantine Fault Tolerance Overview", "20 mins", False, "reading")
                    ],
                    "materials": [
                        ("mat-4", "Raft State Machine Log Replication Protocol Flowchart", "High-Res Diagram", "3.2 MB", "Visual Guide")
                    ]
                }
            ]

            for c_data in courses_data:
                course = Course(
                    id=c_data["id"],
                    title=c_data["title"],
                    description=c_data["description"],
                    category=c_data["category"],
                    thumbnail=c_data["thumbnail"],
                    instructor=c_data["instructor"],
                    instructor_avatar=c_data["instructor_avatar"],
                    total_modules=c_data["total_modules"],
                    completed_modules=c_data["completed_modules"],
                    progress_percent=c_data["progress_percent"],
                    estimated_hours=c_data["estimated_hours"],
                    level=c_data["level"],
                    rating=c_data["rating"],
                    enrolled_count=c_data["enrolled_count"],
                    tags=c_data["tags"]
                )
                db.add(course)

                for m_id, m_title, m_dur, m_comp, m_type in c_data["modules"]:
                    db.add(CourseModule(
                        id=m_id,
                        course_id=course.id,
                        title=m_title,
                        duration=m_dur,
                        completed=m_comp,
                        module_type=m_type
                    ))

                for mat_id, mat_title, mat_type, mat_size, mat_badge in c_data["materials"]:
                    db.add(CourseMaterial(
                        id=mat_id,
                        course_id=course.id,
                        title=mat_title,
                        material_type=mat_type,
                        file_size=mat_size,
                        badge=mat_badge
                    ))

            db.commit()
            logger.info("Seeded initial courses, modules, and handouts.")

        # 3. Seed Adaptive Question Bank
        if not db.query(Question).first():
            questions_data = [
                {
                    "id": "q1",
                    "subject": "Data Structures",
                    "topic": "Graph Traversal & Cycle Detection",
                    "difficulty": "Medium",
                    "question_text": "In Kahn’s Algorithm for Topological Sort on a Directed Graph, what condition signals that the graph contains at least one cycle?",
                    "code_snippet": None,
                    "options": [
                        "The queue becomes empty before all vertices have been added to the topological ordering array.",
                        "A vertex is encountered that has an out-degree equal to 0.",
                        "The sum of all in-degrees exceeds twice the number of edges.",
                        "The BFS traversal visits the destination vertex before its immediate parent."
                    ],
                    "correct_option_index": 0,
                    "explanation": "Kahn's algorithm processes nodes with in-degree 0. If a directed cycle exists, the in-degrees of nodes in that cycle can never reach 0 because they depend on each other cyclically. Consequently, the queue exhausts early before all vertices are visited.",
                    "concept_tag": "Kahn Algorithm & DAG Cycle Detection",
                    "hint": "Think about what happens to the in-degree count of vertices locked inside a mutual dependency loop."
                },
                {
                    "id": "q2",
                    "subject": "Deep Learning",
                    "topic": "Attention Mechanisms in Transformers",
                    "difficulty": "Advanced",
                    "question_text": "In Scaled Dot-Product Attention: Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) * V, why is the dot product divided by sqrt(d_k)?",
                    "code_snippet": None,
                    "options": [
                        "To prevent the dot products from growing excessively large for high dimensions, which would push the softmax function into regions with vanishingly small gradients.",
                        "To ensure that the attention matrix has an exact trace equal to 1.0 across all attention heads.",
                        "To invert the covariance matrix of Query and Key vectors for whitening the representation.",
                        "To normalize the output vector V so that its L2 norm equals the dimension of the embedding space."
                    ],
                    "correct_option_index": 0,
                    "explanation": "As dimension d_k grows large, dot products scale in variance proportionally to d_k. Large magnitudes push softmax into saturated regions with near-zero gradients. Dividing by sqrt(d_k) stabilizes the variance back to 1.",
                    "concept_tag": "Transformer Attention Scaling & Gradients",
                    "hint": "Consider the slope of the softmax function when inputs have very large absolute magnitudes."
                },
                {
                    "id": "q3",
                    "subject": "Mathematics",
                    "topic": "Bayesian Inference & Base Rate Fallacy",
                    "difficulty": "Medium",
                    "question_text": "Suppose a rare disease has an incidence rate of 1 in 1,000 (0.1%). A diagnostic test has a 99% sensitivity and a 5% false positive rate. If a randomly selected individual tests positive, what is the approximate probability they actually have the disease?",
                    "code_snippet": None,
                    "options": [
                        "Approximately 1.94% (~2%)",
                        "Approximately 95.0%",
                        "Approximately 99.0%",
                        "Approximately 50.0%"
                    ],
                    "correct_option_index": 0,
                    "explanation": "Using Bayes' theorem: P(D|+) = [P(+|D) * P(D)] / P(+). P(+) = (0.99 * 0.001) + (0.05 * 0.999) = 0.00099 + 0.04995 = 0.05094. Thus P(D|+) = 0.00099 / 0.05094 ≈ 1.94%. This demonstrates the Base Rate Fallacy.",
                    "concept_tag": "Base Rate Fallacy & Posterior Probability",
                    "hint": "Do not forget to weigh the false positives from the vast majority of healthy patients against the rare true positives."
                },
                {
                    "id": "q4",
                    "subject": "Data Structures",
                    "topic": "Dynamic Programming & Optimization",
                    "difficulty": "Hard",
                    "question_text": "What is the time complexity of computing the Longest Increasing Subsequence (LIS) of an array of size N using Patient Sorting with Binary Search?",
                    "code_snippet": "// Standard LIS via tails array\nvector<int> tails;\nfor (int x : nums) {\n    auto it = lower_bound(tails.begin(), tails.end(), x);\n    if (it == tails.end()) tails.push_back(x);\n    else *it = x;\n}",
                    "options": [
                        "O(N log N) time and O(N) space",
                        "O(N^2) time and O(1) space",
                        "O(N) time and O(N) space",
                        "O(2^N) time and O(N) space"
                    ],
                    "correct_option_index": 0,
                    "explanation": "For each of the N elements, `lower_bound` performs binary search over the `tails` array which has at most N elements, taking O(log N) time. Total runtime is O(N log N).",
                    "concept_tag": "Patience Sorting & Subsequence Optimization",
                    "hint": "Each outer iteration touches one element and runs a logarithmic search over a sorted helper list."
                },
                {
                    "id": "q5",
                    "subject": "Cloud & Systems",
                    "topic": "Consensus Protocols",
                    "difficulty": "Intermediate",
                    "question_text": "In the Raft distributed consensus protocol, how does a follower react when its election timer elapses without receiving a heartbeat from the current leader?",
                    "code_snippet": None,
                    "options": [
                        "It increments its current term, transitions to candidate state, votes for itself, and broadcasts RequestVote RPCs.",
                        "It immediately assumes the role of leader and starts sending AppendEntries heartbeats to all peers.",
                        "It disconnects its network socket and waits for a manual operator override.",
                        "It triggers a rollback to the genesis block of the distributed state machine."
                    ],
                    "correct_option_index": 0,
                    "explanation": "When election timeout fires, the follower assumes leader failure, increments its term count, transitions to Candidate, votes for itself, and campaigns for majority quorum.",
                    "concept_tag": "Raft Leader Election State Transitions",
                    "hint": "A follower must first campaign and obtain majority approval before it can ever become a leader."
                }
            ]

            for q_data in questions_data:
                db.add(Question(
                    id=q_data["id"],
                    subject=q_data["subject"],
                    topic=q_data["topic"],
                    difficulty=q_data["difficulty"],
                    question_text=q_data["question_text"],
                    code_snippet=q_data["code_snippet"],
                    options_json=json.dumps(q_data["options"]),
                    correct_option_index=q_data["correct_option_index"],
                    explanation=q_data["explanation"],
                    concept_tag=q_data["concept_tag"],
                    hint=q_data["hint"]
                ))
            db.commit()
            logger.info("Seeded adaptive question repository.")

        # 4. Seed Topic Mastery for Sarah Chen
        if not db.query(TopicMastery).filter(TopicMastery.user_id == "usr-sarah-01").first():
            topics_data = [
                {
                    "id": "tm-sarah-01",
                    "topic": "Graph Traversal & Topological Ordering",
                    "subject": "Data Structures & Algorithms",
                    "total_attempts": 12,
                    "correct_attempts": 5,
                    "raw_acc": 41.7,
                    "rule_score": 46.0,
                    "ml_score": 44.5,
                    "is_weak": True,
                    "weak_reason": "Low accuracy (41.7%) on directed cycle detection; confusing queue vs stack state management in Kahn Algorithm.",
                    "benchmark": 80.0
                },
                {
                    "id": "tm-sarah-02",
                    "topic": "Backpropagation Gradients in LayerNorm",
                    "subject": "Neural Networks & Deep Learning",
                    "total_attempts": 9,
                    "correct_attempts": 5,
                    "raw_acc": 55.6,
                    "rule_score": 54.0,
                    "ml_score": 52.8,
                    "is_weak": True,
                    "weak_reason": "Difficulty calculating Jacobian matrix derivative through variance normalization and gamma/beta scaling parameters.",
                    "benchmark": 85.0
                },
                {
                    "id": "tm-sarah-03",
                    "topic": "Bayesian Conjugate Priors & Normal Models",
                    "subject": "Probabilistic Machine Learning",
                    "total_attempts": 8,
                    "correct_attempts": 5,
                    "raw_acc": 62.5,
                    "rule_score": 62.0,
                    "ml_score": 64.0,
                    "is_weak": True,
                    "weak_reason": "Occasional errors deriving posterior precision with known vs unknown variance; Base rate fallacy.",
                    "benchmark": 75.0
                },
                {
                    "id": "tm-sarah-04",
                    "topic": "Dynamic Programming Memoization States",
                    "subject": "Data Structures & Algorithms",
                    "total_attempts": 14,
                    "correct_attempts": 11,
                    "raw_acc": 78.6,
                    "rule_score": 79.0,
                    "ml_score": 81.5,
                    "is_weak": False,
                    "weak_reason": None,
                    "benchmark": 80.0
                }
            ]

            for t in topics_data:
                db.add(TopicMastery(
                    id=t["id"],
                    user_id="usr-sarah-01",
                    topic=t["topic"],
                    subject=t["subject"],
                    total_attempts=t["total_attempts"],
                    correct_attempts=t["correct_attempts"],
                    raw_accuracy_percent=t["raw_acc"],
                    rule_based_mastery=t["rule_score"],
                    ml_predicted_mastery=t["ml_score"],
                    is_weak_area=t["is_weak"],
                    weak_reason=t["weak_reason"],
                    benchmark_percent=t["benchmark"]
                ))
            db.commit()
            logger.info("Seeded student topic mastery telemetry.")

        # 5. Seed Study Tasks
        if not db.query(StudyTaskRecord).filter(StudyTaskRecord.user_id == "usr-sarah-01").first():
            tasks = [
                StudyTaskRecord(
                    id="task-1",
                    user_id="usr-sarah-01",
                    title="Review Self-Attention Math in Transformers",
                    course="Advanced Neural Networks & Deep Learning",
                    due_date="Today, 6:00 PM",
                    duration_minutes=30,
                    completed=True,
                    priority="High",
                    task_type="reading",
                    ai_suggested=False
                ),
                StudyTaskRecord(
                    id="task-2",
                    user_id="usr-sarah-01",
                    title="Adaptive Quiz: Kahn Algorithm & Cycle Edge Cases",
                    course="Data Structures & Algorithmic Optimization",
                    due_date="Today, 8:30 PM",
                    duration_minutes=15,
                    completed=False,
                    priority="High",
                    task_type="quiz",
                    ai_suggested=True
                ),
                StudyTaskRecord(
                    id="task-3",
                    user_id="usr-sarah-01",
                    title="Implement Multi-Head Attention in PyTorch",
                    course="Advanced Neural Networks & Deep Learning",
                    due_date="Tomorrow, 4:00 PM",
                    duration_minutes=45,
                    completed=False,
                    priority="Medium",
                    task_type="coding",
                    ai_suggested=False
                ),
                StudyTaskRecord(
                    id="task-4",
                    user_id="usr-sarah-01",
                    title="Spaced Repetition Flashcards: Bayesian Formulas",
                    course="Probabilistic Machine Learning",
                    due_date="Oct 14, 11:00 AM",
                    duration_minutes=20,
                    completed=False,
                    priority="Low",
                    task_type="review",
                    ai_suggested=True
                )
            ]
            db.add_all(tasks)
            db.commit()
            logger.info("Seeded initial study tasks.")

    except Exception as e:
        logger.error("Error during seeding: %s", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
