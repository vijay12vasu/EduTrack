python -m pip install -r requirements.txt
python train.py
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
