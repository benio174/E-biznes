from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI(title="Serwis AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InteractionRequest(BaseModel):
    text: str

@app.post("/analyze")
def analyze_text(request: InteractionRequest):
    print(f"[PYTHON LOG] Przetwarzanie wiadomości: {request.text}")
    
    OLLAMA_URL = "http://localhost:11434/api/generate"
    
    # Dodajemy instrukcję systemową bezpośrednio do promptu dla /api/generate
    full_prompt = f"Odpowiadaj krótko, maksymalnie w dwóch zdaniach, wyłącznie w języku polskim. Pytanie: {request.text}"
    
    payload = {
        "model": "llama3:latest",  # Użyliśmy dokładnej nazwy z Twojej konsoli
        "prompt": full_prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        
        # Jeśli Ollama zwróci błąd (np. status 500), wypiszemy jego dokładną treść w konsoli Pythona!
        if response.status_code != 200:
            print(f"[DEBUG OLLAMA ERROR] Kod statusu: {response.status_code}")
            print(f"[DEBUG OLLAMA ERROR] Treść błędu z Ollamy: {response.text}")
            
        response.raise_for_status()
        return {"reply": response.json().get("response", "")}
        
    except requests.exceptions.RequestException as e:
        print(f"[ERR] Wyjątek krytyczny połączenia: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Blad Ollama: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)