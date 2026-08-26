# AI/ML Component Implementation Plan

Before we write the Python code to train the model, it is crucial to understand the theory and architecture behind what we are building. This document explains the exact Machine Learning approach we will take for your final-year project.

## Part 1: The Machine Learning Theory

### 1. What ML Problem We Are Solving
We are actually solving **two** linked problems:
1.  **Regression**: Predicting a continuous number (the exact Final Exam mark out of 100).
2.  **Classification**: Predicting a category (whether the student is "At Risk" of failing or "Safe").

### 2. Which ML Algorithm is Suitable?
We will use **Random Forest** (`RandomForestRegressor` for the exact score, and `RandomForestClassifier` for the risk status). 

### 3. Why Random Forest?
*   **Feature Importance**: Random Forest automatically tells us *which* features (e.g., Attendance vs. Quiz marks) had the biggest impact on the prediction. This is essential for generating **Personalized Recommendations** (e.g., if attendance is the root cause, the recommendation will focus on that).
*   **Robustness**: It handles outliers well (e.g., a student missing one assignment won't completely break the model).
*   **Non-linear data**: It can easily understand that scoring high on quizzes but having very low study hours might be a red flag.

### 4. Dataset Structure
Since we don't have real university data, we will generate a synthetic (mock) CSV dataset. 
*   **Rows**: Each row represents one student's progress in a specific subject leading up to the final exam.
*   **Columns**: The features (inputs) and the target variable (output).

### 5. Features (Inputs - `X`)
These are the data points the AI will look at to make a prediction:
1.  `Attendance_Percentage` (0-100)
2.  `Assignment_Marks` (Average score)
3.  `Quiz_Marks` (Average score)
4.  `Midterm_Marks` (0-100)
5.  `Study_Hours_Per_Week` (Number)
6.  `Previous_Term_Performance` (0-100)
7.  `Completed_Lessons_Count` (Number)
8.  `Quiz_Attempts` (Number of times they tried quizzes)

### 6. Target Variable (Output - `y`)
*   For Regression: `Final_Exam_Score` (0-100)
*   For Classification: `Is_At_Risk` (1 if Final Score < 50, else 0)

### 7. Data Preprocessing
Before feeding data to the AI, we must clean it:
*   **Imputation**: Fill in any missing values (e.g., if a student missed a quiz, fill it with the average or 0).
*   **Scaling**: Use `StandardScaler` to ensure all numbers are on the same scale (so a Midterm score of 80 doesn't overpower Study Hours of 12).

### 8. Training Process
1.  **Train-Test Split**: We will divide our dataset so 80% is used to teach (train) the AI, and 20% is hidden away for testing.
2.  **Fitting**: We feed the 80% `X` (features) and `y` (target) to the `RandomForestRegressor.fit()` method.

### 9. Testing
Once trained, we give the model the hidden 20% of features (`X_test`) and ask it to predict the final scores. We then compare its predictions to the actual hidden final scores (`y_test`) to see how smart it is.

### 10. Evaluation Metrics
To prove to your examiners that the model works, we will calculate:
*   **Mean Absolute Error (MAE)**: On average, how many marks is our prediction off by? (e.g., off by ±4 marks).
*   **R-Squared (R²)**: How well do the inputs explain the final score? (We want > 0.80).
*   **Accuracy & F1-Score**: For the classification part, how accurately did we catch the "At Risk" students without raising false alarms?

---

## Part 2: Implementation Steps

To build this independently of FastAPI, we will follow this exact order:

1.  **Environment Setup**: Install pandas, numpy, scikit-learn in a folder named `ml_engine`.
2.  **Data Generation Script**: Write a Python script to generate a realistic `student_data.csv` containing thousands of rows.
3.  **Training Script**: Write `train_model.py` to preprocess the data, train the Random Forest model, and print the evaluation metrics.
4.  **Save the Model**: Serialize (save) the trained model using `joblib` so it can be loaded instantly later.
5.  **Inference Script**: Write `predict.py` to test the saved model on a single fake student to ensure it outputs a score and a recommendation.

---

> [!IMPORTANT]
> **User Review Required**
> 
> Please review the ML theory and the step-by-step implementation plan. This approach is highly robust for a final-year project and will give you excellent metrics to write about in your thesis.
> 
> **Once you understand and approve this plan, let me know, and we will begin Step 1 (Environment Setup and Data Generation)!**
