from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import joblib
import os
import pandas as pd

app = FastAPI(title="EduTrack ML Service", version="1.0.0")

model_path = os.path.join("models", "score_predictor.joblib")
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print("Model loaded successfully.")
    else:
        print(f"WARNING: Model file not found at {model_path}. Please run train.py first.")

class ActivityData(BaseModel):
    category: str

class ScoreRequest(BaseModel):
    studentId: str
    activities: List[ActivityData]

class ScoreResponse(BaseModel):
    overallScore: int
    categoryScores: Dict[str, int]
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    diversityAnalysis: str
    scoreExplanation: str

@app.post("/predict/score", response_model=ScoreResponse)
def predict_score(request: ScoreRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="ML Model is not loaded. Ensure train.py has been run.")

    activities = request.activities
    num_activities = len(activities)
    
    if num_activities == 0:
        return ScoreResponse(
            overallScore=0,
            categoryScores={},
            strengths=["No verified activities yet."],
            weaknesses=["Lack of recorded participation."],
            recommendations=["Start by participating in foundational workshops.", "Join a campus club or society."],
            diversityAnalysis="No data available.",
            scoreExplanation="Your score of 0 reflects 0 verified achievements."
        )

    # Calculate categories
    cat_counts = {}
    technical_count = 0
    leadership_count = 0
    arts_count = 0
    
    for a in activities:
        cat = a.category
        cat_counts[cat] = cat_counts.get(cat, 0) + 1
        
        c = cat.lower()
        if "tech" in c or "hackathon" in c or "code" in c:
            technical_count += 1
        elif "lead" in c or "manage" in c or "org" in c:
            leadership_count += 1
        else:
            arts_count += 1

    unique_categories = len(cat_counts)
    
    # Predict score using model
    input_data = pd.DataFrame([{
        'num_activities': num_activities,
        'unique_categories': min(unique_categories, 3),  # capped to fit training distribution roughly
        'technical_count': technical_count,
        'leadership_count': leadership_count,
        'arts_count': arts_count
    }])
    
    predicted = model.predict(input_data)[0]
    overall_score = min(max(int(round(predicted)), 0), 100)
    
    # Calculate category scores
    category_scores = {cat: min(count * 20, 100) for cat, count in cat_counts.items()}
    
    # Strengths
    strengths = []
    if unique_categories >= 3:
        strengths = [
            "Highly versatile skill set.",
            "Consistent participation across multiple domains.",
            "Strong foundational engagement in extracurriculars."
        ]
    else:
        strengths = ["Strong focus and specialization in specific areas.", "Dedicated engagement in chosen activities."]
        
    # Weaknesses
    weaknesses = []
    if unique_categories < 2:
        weaknesses = ["Over-specialization (lack of diversity).", "Missing interdisciplinary experiences."]
    else:
        weaknesses = ["Could improve leadership or mentoring roles.", "Opportunity to scale impact of current activities."]
        
    # Recommendations
    recommendations = []
    if unique_categories < 3:
        recommendations = ["Branch out into different categories like Technical, Sports, or Arts.", "Try cross-functional hackathons."]
    else:
        recommendations = ["Pursue national-level competitions.", "Take up leadership roles in your current societies.", "Begin mentoring junior students in your strong areas."]
        
    # Diversity Analysis
    if unique_categories == 1:
        diversity = "Highly focused on a single domain. Excellent for depth, but lacks breadth."
    elif unique_categories == 2:
        diversity = "Moderate diversity. Balancing two domains well."
    else:
        diversity = "Excellent diversity. Demonstrates a well-rounded and highly adaptable profile."
        
    explanation = f"AI-Predicted Score: Based on our scikit-learn RandomForestRegressor model trained on historical patterns. Your score of {overall_score} reflects {num_activities} verified achievements across {unique_categories} unique categories."
    
    return ScoreResponse(
        overallScore=overall_score,
        categoryScores=category_scores,
        strengths=strengths,
        weaknesses=weaknesses,
        recommendations=recommendations,
        diversityAnalysis=diversity,
        scoreExplanation=explanation
    )
