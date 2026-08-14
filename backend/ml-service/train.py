import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import os

# Generate synthetic dataset mirroring EduTrack activities
def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    # Features:
    # 1. num_activities: Total number of verified activities
    # 2. unique_categories: Number of unique categories participated in
    # 3. technical_count: Number of technical activities
    # 4. leadership_count: Number of leadership activities
    # 5. arts_count: Number of arts/cultural activities
    
    num_activities = np.random.randint(0, 20, num_samples)
    
    unique_categories = []
    technical_count = []
    leadership_count = []
    arts_count = []
    
    for n in num_activities:
        if n == 0:
            unique_categories.append(0)
            technical_count.append(0)
            leadership_count.append(0)
            arts_count.append(0)
            continue
            
        # Randomly distribute n activities among 3 main categories
        t = np.random.randint(0, n + 1)
        l = np.random.randint(0, n - t + 1)
        a = n - t - l
        
        technical_count.append(t)
        leadership_count.append(l)
        arts_count.append(a)
        
        # Calculate unique categories (out of 3)
        unique = sum(1 for x in [t, l, a] if x > 0)
        unique_categories.append(unique)

    df = pd.DataFrame({
        'num_activities': num_activities,
        'unique_categories': unique_categories,
        'technical_count': technical_count,
        'leadership_count': leadership_count,
        'arts_count': arts_count
    })
    
    # Target: Score (0-100)
    # The score should reward volume (up to a point) and diversity.
    # We add some random noise to make it realistic for ML.
    base_score = 30
    volume_score = np.minimum(df['num_activities'] * 8, 40)
    diversity_score = np.minimum(df['unique_categories'] * 10, 30)
    
    target_score = base_score + volume_score + diversity_score
    target_score = target_score + np.random.normal(0, 2, num_samples) # add noise
    target_score = np.clip(target_score, 0, 100)
    
    df['score'] = target_score
    return df

def train_model():
    print("Generating synthetic data...")
    df = generate_synthetic_data(1000)
    
    X = df[['num_activities', 'unique_categories', 'technical_count', 'leadership_count', 'arts_count']]
    y = df['score']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print(f"Model Evaluation Metrics:")
    print(f"R2 Score: {r2:.4f} (Target > 0.85)")
    print(f"MAE: {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")
    
    # Save the model
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/score_predictor.joblib')
    print("Model saved to models/score_predictor.joblib")

if __name__ == "__main__":
    train_model()
