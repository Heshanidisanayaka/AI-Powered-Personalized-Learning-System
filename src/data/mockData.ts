import {
  User,
  Course,
  Recommendation,
  QuizQuestion,
  WeakArea,
  StudyTask,
  ChatMessage,
  AnalyticsMetric,
  AdminStats
} from '../types';

export const mockCurrentUser: User = {
  id: 'usr-sarah-01',
  name: 'Sarah Chen',
  email: 'sarah.chen@stanford.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  role: 'student',
  title: 'B.S. Computer Science & AI Candidate',
  grade: 'Senior Year',
  streakDays: 14,
  dailyGoalMinutes: 60,
  dailyGoalProgressMinutes: 42,
  totalXp: 3840,
  level: 8,
  learningStyle: 'Hands-on Coding',
  preferredDifficulty: 'Adaptive',
  targetExam: 'ACM-ICPC & Machine Learning Engineer Certification',
};

export const mockAdminUser: User = {
  id: 'usr-admin-01',
  name: 'Dr. Marcus Vance',
  email: 'm.vance@cognilearn.ai',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  role: 'admin',
  title: 'Dean of Curriculum & AI Analytics',
  grade: 'Faculty Director',
  streakDays: 45,
  dailyGoalMinutes: 120,
  dailyGoalProgressMinutes: 90,
  totalXp: 12450,
  level: 24,
  learningStyle: 'Theoretical',
  preferredDifficulty: 'Advanced',
};

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Advanced Neural Networks & Deep Learning',
    description: 'Master backpropagation, transformer architectures, attention mechanisms, and fine-tuning LLMs with PyTorch.',
    category: 'Artificial Intelligence',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600',
    instructor: 'Dr. Elena Rostova',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    totalModules: 14,
    completedModules: 10,
    progressPercent: 71,
    estimatedHours: 32,
    level: 'Advanced',
    rating: 4.9,
    enrolledStudentsCount: 1420,
    tags: ['PyTorch', 'Transformers', 'Backprop', 'LLMs'],
    nextLesson: {
      id: 'lesson-104',
      title: 'Multi-Head Self-Attention Implementation in PyTorch',
      duration: '24 mins',
      type: 'code'
    },
    modules: [
      { id: 'm1', title: 'Calculus of Backpropagation & Computational Graphs', duration: '35 mins', completed: true, type: 'reading' },
      { id: 'm2', title: 'Batch Normalization & LayerNorm Mathematics', duration: '28 mins', completed: true, type: 'video' },
      { id: 'm3', title: 'Convolutional Feature Maps & Dilated Convolutions', duration: '40 mins', completed: true, type: 'code' },
      { id: 'm4', title: 'Recurrent Neural Networks vs Vanishing Gradients', duration: '30 mins', completed: true, type: 'video' },
      { id: 'm5', title: 'Attention Is All You Need: The Transformer Paper', duration: '45 mins', completed: true, type: 'reading' },
      { id: 'm6', title: 'Building Multi-Head Self-Attention from Scratch', duration: '50 mins', completed: false, type: 'code' },
      { id: 'm7', title: 'Positional Encoding (Sinusoidal vs Rotary Embeddings)', duration: '25 mins', completed: false, type: 'video' },
      { id: 'm8', title: 'Knowledge Check: Neural Architectures & Tuning', duration: '20 mins', completed: false, type: 'quiz' }
    ]
  },
  {
    id: 'course-2',
    title: 'Data Structures & Algorithmic Optimization',
    description: 'Graph algorithms, dynamic programming, segment trees, and amortized complexity analysis for competitive programming.',
    category: 'Data Structures',
    thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc1562b53eb?auto=format&fit=crop&q=80&w=600',
    instructor: 'Alexandre Dubois',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    totalModules: 18,
    completedModules: 14,
    progressPercent: 78,
    estimatedHours: 40,
    level: 'Intermediate',
    rating: 4.8,
    enrolledStudentsCount: 2890,
    tags: ['Dynamic Programming', 'Graphs', 'Trees', 'C++'],
    nextLesson: {
      id: 'lesson-205',
      title: 'Topological Sorting & Kahn Algorithm Diagnostics',
      duration: '18 mins',
      type: 'interactive'
    },
    modules: [
      { id: 'm21', title: 'Asymptotic Analysis & Master Theorem Refresher', duration: '22 mins', completed: true, type: 'reading' },
      { id: 'm22', title: 'Breadth-First Search & Bipartite Verification', duration: '30 mins', completed: true, type: 'code' },
      { id: 'm23', title: 'Dijkstra vs Bellman-Ford Shortest Paths', duration: '35 mins', completed: true, type: 'video' },
      { id: 'm24', title: 'Dynamic Programming: Memoization vs Tabulation', duration: '45 mins', completed: true, type: 'code' },
      { id: 'm25', title: 'Topological Sort with Kahn Algorithm', duration: '18 mins', completed: false, type: 'interactive' },
      { id: 'm26', title: 'Segment Trees and Range Minimum Query', duration: '50 mins', completed: false, type: 'code' }
    ]
  },
  {
    id: 'course-3',
    title: 'Probabilistic Machine Learning & Bayesian Inference',
    description: 'Probability distributions, Markov Chain Monte Carlo, variational inference, and probabilistic graphical models.',
    category: 'Mathematics',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
    instructor: 'Prof. Ananya Nair',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    totalModules: 12,
    completedModules: 4,
    progressPercent: 33,
    estimatedHours: 26,
    level: 'Advanced',
    rating: 4.95,
    enrolledStudentsCount: 910,
    tags: ['Bayesian Stats', 'MCMC', 'Gaussian Processes', 'NumPy'],
    nextLesson: {
      id: 'lesson-304',
      title: 'Prior vs Posterior Distributions with Gaussian Conjugates',
      duration: '22 mins',
      type: 'video'
    },
    modules: [
      { id: 'm31', title: 'Bayes Rule & Conjugate Priors Introduction', duration: '20 mins', completed: true, type: 'reading' },
      { id: 'm32', title: 'Likelihood Estimation & MAP Principle', duration: '32 mins', completed: true, type: 'video' },
      { id: 'm33', title: 'Gaussian Conjugates and Empirical Bayes', duration: '22 mins', completed: false, type: 'video' },
      { id: 'm34', title: 'Markov Chain Monte Carlo (MCMC) Sampling', duration: '45 mins', completed: false, type: 'code' }
    ]
  },
  {
    id: 'course-4',
    title: 'Distributed Systems & Cloud Architecture',
    description: 'Consensus protocols (Raft, Paxos), CAP theorem, event-driven microservices, and high-throughput caching.',
    category: 'Cloud & Systems',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    instructor: 'Julian K. Richter',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    totalModules: 16,
    completedModules: 8,
    progressPercent: 50,
    estimatedHours: 35,
    level: 'Intermediate',
    rating: 4.7,
    enrolledStudentsCount: 1750,
    tags: ['Raft Consensus', 'CAP Theorem', 'Kafka', 'Redis'],
    nextLesson: {
      id: 'lesson-407',
      title: 'Raft Leader Election and Heartbeat Failover Simulator',
      duration: '29 mins',
      type: 'interactive'
    }
  }
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Visual Deep-Dive: Kahn Algorithm vs Cycle Detection in DAGs',
    category: 'Data Structures',
    type: 'Interactive Lab',
    difficulty: 'Intermediate',
    estimatedTime: '15 mins',
    matchScore: 98,
    aiReasoning: 'Based on your last adaptive quiz where you misidentified a cycle in a directed graph (Question #4), this hands-on simulator reinforces in-degree tracking step-by-step.',
    targetSkillGap: 'Graph Cycle Identification & In-degree Logic',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=500',
    impactPotential: '+14% Mastery Boost in Graph Algorithms',
    courseRefId: 'course-2'
  },
  {
    id: 'rec-2',
    title: 'Demystifying Cross-Entropy vs Negative Log-Likelihood Loss',
    category: 'Artificial Intelligence',
    type: 'Concept Deep Dive',
    difficulty: 'Intermediate',
    estimatedTime: '12 mins',
    matchScore: 94,
    aiReasoning: 'Your recent error in backpropagation calculations showed confusion between softmax probability outputs and raw logits in loss computation.',
    targetSkillGap: 'Loss Functions & Gradients',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500',
    impactPotential: '+11% Accuracy in Neural Math',
    courseRefId: 'course-1'
  },
  {
    id: 'rec-3',
    title: 'Bayes Theorem in Practice: Medical Diagnosis Edge Cases',
    category: 'Mathematics',
    type: 'Practice Drill',
    difficulty: 'Advanced',
    estimatedTime: '20 mins',
    matchScore: 91,
    aiReasoning: 'Recommended because you spent 3.5x average time calculating posterior false positive rates in your Bayesian stats assignment yesterday.',
    targetSkillGap: 'Posterior Probability & Base Rate Fallacy',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=500',
    impactPotential: '+19% Confidence on Midterm Exam',
    courseRefId: 'course-3'
  },
  {
    id: 'rec-4',
    title: 'Spaced Repetition Deck: Amortized Analysis & Master Theorem',
    category: 'Computer Science',
    type: 'Flashcard Deck',
    difficulty: 'Intermediate',
    estimatedTime: '8 mins',
    matchScore: 88,
    aiReasoning: 'Optimal spaced-repetition timing: It has been 9 days since your initial review of recurrence relations $T(n) = aT(n/b) + f(n)$. Memory decay is anticipated.',
    targetSkillGap: 'Complexity Analysis Recall',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500',
    impactPotential: 'Reinforces long-term concept retention to 92%',
    courseRefId: 'course-2'
  },
  {
    id: 'rec-5',
    title: 'Raft Protocol Simulator: Visual Split-Brain Prevention',
    category: 'Cloud & Systems',
    type: 'Interactive Lab',
    difficulty: 'Advanced',
    estimatedTime: '25 mins',
    matchScore: 86,
    aiReasoning: 'Aligned with your stated career goal of Cloud Architect. Bridges theoretical consensus concepts with production distributed logs.',
    targetSkillGap: 'Distributed Consensus Mechanics',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=500',
    impactPotential: 'Elevates Systems proficiency from 50% to 65%',
    courseRefId: 'course-4'
  }
];

export const mockWeakAreas: WeakArea[] = [
  {
    id: 'weak-1',
    topic: 'Graph Traversal & Topological Ordering',
    subject: 'Data Structures & Algorithms',
    masteryPercentage: 46,
    benchmarkPercentage: 80,
    criticalGaps: [
      'Confusing queue vs stack state management in Kahn Algorithm',
      'Detecting cycles in directed vs undirected graph components',
      'Edge cases with disconnected subgraphs'
    ],
    status: 'Critical Focus',
    suggestedAction: 'Take 5-Question Targeted Practice Drill',
    lastPracticed: '2 days ago'
  },
  {
    id: 'weak-2',
    topic: 'Backpropagation Gradients in LayerNorm',
    subject: 'Neural Networks & Deep Learning',
    masteryPercentage: 54,
    benchmarkPercentage: 85,
    criticalGaps: [
      'Jacobian matrix derivative through variance normalization',
      'Learnable affine parameters scale (gamma) and shift (beta)'
    ],
    status: 'Needs Practice',
    suggestedAction: 'Review Visual Matrix Derivation and PyTorch autograd',
    lastPracticed: 'Yesterday'
  },
  {
    id: 'weak-3',
    topic: 'Bayesian Conjugate Priors & Normal Models',
    subject: 'Probabilistic Machine Learning',
    masteryPercentage: 62,
    benchmarkPercentage: 75,
    criticalGaps: [
      'Deriving posterior precision with known vs unknown variance',
      'Normal-Gamma joint prior distribution calculations'
    ],
    status: 'Developing',
    suggestedAction: 'Complete 3 Interactive Step-by-Step Bayesian Exercises',
    lastPracticed: '4 days ago'
  },
  {
    id: 'weak-4',
    topic: 'Dynamic Programming Memoization States',
    subject: 'Data Structures & Algorithms',
    masteryPercentage: 79,
    benchmarkPercentage: 80,
    criticalGaps: [
      'Space-optimized 1D rolling array tabulation for unbounded knapsack'
    ],
    status: 'Nearly Mastered',
    suggestedAction: '1 Quick Speed Challenge to reach 90% Mastery',
    lastPracticed: '3 hours ago'
  }
];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    subject: 'Data Structures',
    topic: 'Graph Traversal',
    difficulty: 'Intermediate',
    question: 'In Kahn’s Algorithm for Topological Sort on a Directed Graph, what condition signals that the graph contains at least one cycle?',
    options: [
      'The queue becomes empty before all vertices have been added to the topological ordering array.',
      'A vertex is encountered that has an out-degree equal to 0.',
      'The sum of all in-degrees exceeds twice the number of edges.',
      'The BFS traversal visits the destination vertex before its immediate parent.'
    ],
    correctOptionIndex: 0,
    explanation: 'Kahn\'s algorithm processes nodes with in-degree 0. If a directed cycle exists, the in-degrees of nodes in that cycle can never reach 0 because they depend on each other cyclically. Consequently, the queue exhausts early before all vertices are visited.',
    conceptTag: 'Kahn Algorithm & DAG Cycle Detection',
    hint: 'Think about what happens to the in-degree count of vertices locked inside a mutual dependency loop.'
  },
  {
    id: 'q2',
    subject: 'Deep Learning',
    topic: 'Attention Mechanisms',
    difficulty: 'Advanced',
    question: 'In Scaled Dot-Product Attention: Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) * V, why is the dot product divided by sqrt(d_k)?',
    options: [
      'To prevent the dot products from growing excessively large for high dimensions, which would push the softmax function into regions with vanishingly small gradients.',
      'To ensure that the attention matrix has an exact trace equal to 1.0 across all attention heads.',
      'To invert the covariance matrix of Query and Key vectors for whitening the representation.',
      'To normalize the output vector V so that its L2 norm equals the dimension of the embedding space.'
    ],
    correctOptionIndex: 0,
    explanation: 'As dimension d_k grows large, the dot products grow in magnitude (variance scales proportionally to d_k). Huge values cause softmax to saturate (approaching 1 for max, 0 for others), yielding near-zero gradient descent updates. Dividing by sqrt(d_k) stabilizes the variance back to 1.',
    conceptTag: 'Transformer Attention Scaling & Gradients',
    hint: 'Consider the slope of the softmax function when inputs have very large absolute magnitudes.'
  },
  {
    id: 'q3',
    subject: 'Mathematics',
    topic: 'Bayesian Inference',
    difficulty: 'Medium',
    question: 'Suppose a rare disease has an incidence rate of 1 in 1,000 (0.1%). A diagnostic test has a 99% true positive rate (sensitivity) and a 5% false positive rate. If a randomly selected individual tests positive, what is the approximate probability they actually have the disease?',
    options: [
      'Approximately 1.94% (~2%)',
      'Approximately 95.0%',
      'Approximately 99.0%',
      'Approximately 50.0%'
    ],
    correctOptionIndex: 0,
    explanation: 'Using Bayes\' theorem: P(D|+) = [P(+|D) * P(D)] / P(+). P(+) = (0.99 * 0.001) + (0.05 * 0.999) = 0.00099 + 0.04995 = 0.05094. Thus P(D|+) = 0.00099 / 0.05094 ≈ 1.94%. This demonstrates the famous Base Rate Fallacy.',
    conceptTag: 'Base Rate Fallacy & Posterior Probability',
    hint: 'Do not forget to weigh the false positives from the vast majority of healthy patients against the rare true positives.'
  },
  {
    id: 'q4',
    subject: 'Data Structures',
    topic: 'Dynamic Programming',
    difficulty: 'Hard',
    question: 'What is the time complexity of computing the Longest Increasing Subsequence (LIS) of an array of size N using Patient Sorting with Binary Search?',
    codeSnippet: `// Standard LIS via tails array
vector<int> tails;
for (int x : nums) {
    auto it = lower_bound(tails.begin(), tails.end(), x);
    if (it == tails.end()) tails.push_back(x);
    else *it = x;
}`,
    options: [
      'O(N log N) time and O(N) space',
      'O(N^2) time and O(1) space',
      'O(N) time and O(N) space',
      'O(2^N) time and O(N) space'
    ],
    correctOptionIndex: 0,
    explanation: 'For each of the N elements, `lower_bound` performs binary search over the `tails` array which has at most N elements, taking O(log N) time. Doing this across N elements yields an optimal O(N log N) total runtime with O(N) auxiliary space.',
    conceptTag: 'Patience Sorting & Subsequence Optimization',
    hint: 'Each outer iteration touches one element and runs a logarithmic search over a sorted helper list.'
  },
  {
    id: 'q5',
    subject: 'Cloud & Systems',
    topic: 'Consensus Protocols',
    difficulty: 'Intermediate',
    question: 'In the Raft distributed consensus protocol, how does a follower react when its election timer elapses without receiving a heartbeat from the current leader?',
    options: [
      'It increments its current term, transitions to candidate state, votes for itself, and broadcasts RequestVote RPCs.',
      'It immediately assumes the role of leader and starts sending AppendEntries heartbeats to all peers.',
      'It disconnects its network socket and waits for a manual operator override.',
      'It triggers a rollback to the genesis block of the distributed state machine.'
    ],
    correctOptionIndex: 0,
    explanation: 'When election timeout fires, the follower assumes leader failure, increments its term count, transitions to Candidate, votes for itself, and sends RequestVote RPCs to acquire majority quorum.',
    conceptTag: 'Raft Leader Election State Transitions',
    hint: 'A follower must first campaign and obtain majority approval before it can ever become a leader.'
  }
];

export const mockStudyTasks: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Review Self-Attention Math in Transformers',
    course: 'Advanced Neural Networks & Deep Learning',
    dueDate: 'Today, 6:00 PM',
    durationMinutes: 30,
    completed: true,
    priority: 'High',
    type: 'reading',
    aiSuggested: false
  },
  {
    id: 'task-2',
    title: 'Adaptive Quiz: Kahn Algorithm & Cycle Edge Cases',
    course: 'Data Structures & Algorithmic Optimization',
    dueDate: 'Today, 8:30 PM',
    durationMinutes: 15,
    completed: false,
    priority: 'High',
    type: 'quiz',
    aiSuggested: true
  },
  {
    id: 'task-3',
    title: 'Implement Multi-Head Attention in PyTorch',
    course: 'Advanced Neural Networks & Deep Learning',
    dueDate: 'Tomorrow, 4:00 PM',
    durationMinutes: 45,
    completed: false,
    priority: 'Medium',
    type: 'coding',
    aiSuggested: false
  },
  {
    id: 'task-4',
    title: 'Spaced Repetition Flashcards: Bayesian Formulas',
    course: 'Probabilistic Machine Learning',
    dueDate: 'Oct 14, 11:00 AM',
    durationMinutes: 20,
    completed: false,
    priority: 'Low',
    type: 'review',
    aiSuggested: true
  },
  {
    id: 'task-5',
    title: 'Simulate Raft Split-Brain Quorum in Sandbox',
    course: 'Distributed Systems & Cloud Architecture',
    dueDate: 'Oct 15, 3:00 PM',
    durationMinutes: 35,
    completed: false,
    priority: 'Medium',
    type: 'coding',
    aiSuggested: false
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: "Hello Sarah! 👋 I am your CogniTutor AI assistant. I've analyzed your recent diagnostic results and noticed you're currently working on **Graph Algorithms** and **Self-Attention in Transformers**. How can I help you master today's concepts?",
    timestamp: '10:14 AM',
    suggestedFollowUps: [
      'Why is Kahn’s algorithm preferred over DFS for topological sort?',
      'Explain Multi-Head Attention with a clean visual analogy',
      'Give me a tricky practice question on Base Rate Fallacy',
      'What are my top 3 knowledge gaps right now?'
    ]
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: "Can you explain why Kahn's algorithm detects cycles in a Directed Acyclic Graph?",
    timestamp: '10:15 AM'
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: "Great question! Let's break down the intuition simply:\n\n### The Core Intuition\nKahn's algorithm relies on **in-degrees** (the count of incoming prerequisite edges pointing to a node).\n\n1. It begins by finding every node that has **0 prerequisites** (`in_degree == 0`) and enqueues them.\n2. When we process a node, we pretend to \"delete\" it and decrement the in-degree of all its neighbors.\n3. **If there is a cycle** (e.g., $A \\rightarrow B \\rightarrow C \\rightarrow A$), every node in that cycle continuously points to another. None of them can ever reach an `in_degree` of 0!\n4. As a result, the queue runs out of nodes before you visit all vertices. If `visited_count < total_vertices`, a cycle is guaranteed.",
    codeSnippet: `// Kahn's Algorithm Cycle Check in C++
int visitedCount = 0;
while (!q.empty()) {
    int u = q.front(); q.pop();
    visitedCount++;
    for (int v : adj[u]) {
        if (--inDegree[v] == 0) q.push(v);
    }
}
bool hasCycle = (visitedCount < numNodes);`,
    timestamp: '10:16 AM',
    suggestedFollowUps: [
      'How does DFS detect cycles in directed graphs differently?',
      'What is the time and space complexity of Kahn’s algorithm?',
      'Generate a quick 1-question quiz on this topic'
    ],
    relatedTopic: 'Graph Algorithms & Cycle Detection'
  }
];

export const mockWeeklyAnalytics: AnalyticsMetric[] = [
  { day: 'Mon', hours: 2.4, quizzesTaken: 3, avgAccuracy: 84, focusScore: 92 },
  { day: 'Tue', hours: 3.1, quizzesTaken: 4, avgAccuracy: 78, focusScore: 88 },
  { day: 'Wed', hours: 1.8, quizzesTaken: 2, avgAccuracy: 90, focusScore: 95 },
  { day: 'Thu', hours: 4.2, quizzesTaken: 5, avgAccuracy: 82, focusScore: 85 },
  { day: 'Fri', hours: 3.6, quizzesTaken: 4, avgAccuracy: 88, focusScore: 91 },
  { day: 'Sat', hours: 5.0, quizzesTaken: 6, avgAccuracy: 76, focusScore: 80 },
  { day: 'Sun', hours: 2.8, quizzesTaken: 3, avgAccuracy: 86, focusScore: 89 }
];

export const mockAdminStats: AdminStats = {
  totalStudents: 14820,
  activeToday: 3410,
  averageMastery: 74.8,
  coursesActive: 28,
  totalQuestions: 1450,
  aiQueriesAnswered: 89420
};

export const mockAdminUsers = [
  { id: 'usr-1', name: 'Sarah Chen', email: 'sarah.chen@stanford.edu', role: 'Student', enrolled: 4, completion: '68%', riskScore: 'Low', joined: 'Jan 12, 2026', status: 'Active' },
  { id: 'usr-2', name: 'David Kim', email: 'd.kim@berkeley.edu', role: 'Student', enrolled: 3, completion: '32%', riskScore: 'High (Needs Intervention)', joined: 'Feb 04, 2026', status: 'At Risk' },
  { id: 'usr-3', name: 'Aisha Al-Mansoor', email: 'aisha.m@mit.edu', role: 'Student', enrolled: 5, completion: '89%', riskScore: 'Low', joined: 'Dec 18, 2025', status: 'Active' },
  { id: 'usr-4', name: 'Liam O\'Connor', email: 'liam.oc@oxford.ac.uk', role: 'Student', enrolled: 2, completion: '51%', riskScore: 'Medium', joined: 'Jan 29, 2026', status: 'Active' },
  { id: 'usr-5', name: 'Dr. Elena Rostova', email: 'e.rostova@cognilearn.ai', role: 'Instructor', enrolled: 0, completion: 'N/A', riskScore: 'None', joined: 'Oct 10, 2024', status: 'Active' }
];

export const mockAdminQuestions = [
  { id: 'q-bank-1', topic: 'Graph Traversal', difficulty: 'Intermediate', accuracyRate: '54%', timesAttempted: 1240, status: 'Active' },
  { id: 'q-bank-2', topic: 'Attention Mechanisms', difficulty: 'Advanced', accuracyRate: '42%', timesAttempted: 890, status: 'Active' },
  { id: 'q-bank-3', topic: 'Bayesian Base Rate', difficulty: 'Medium', accuracyRate: '38%', timesAttempted: 2100, status: 'Flagged for Review' },
  { id: 'q-bank-4', topic: 'Dynamic Programming LIS', difficulty: 'Hard', accuracyRate: '61%', timesAttempted: 740, status: 'Active' },
  { id: 'q-bank-5', topic: 'Raft Leader Election', difficulty: 'Intermediate', accuracyRate: '72%', timesAttempted: 950, status: 'Active' }
];

export const mockAdminResources = [
  { id: 'res-1', title: 'Interactive Kahn Algorithm Playground', type: 'Interactive Web Lab', course: 'Data Structures', views: 3410, rating: 4.9 },
  { id: 'res-2', title: 'Attention Formula Derivation Cheat-sheet PDF', type: 'Downloadable PDF', course: 'Deep Learning', views: 5820, rating: 4.8 },
  { id: 'res-3', title: 'Bayes Theorem Decision Matrix Generator', type: 'Interactive Tool', course: 'Mathematics', views: 2190, rating: 4.7 },
  { id: 'res-4', title: 'Raft Split-Brain Simulator Sandbox', type: 'Interactive Web Lab', course: 'Cloud & Systems', views: 1840, rating: 4.9 }
];
