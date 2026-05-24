from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

app = FastAPI(title="Serwis AI dla Bota E-biznes")

class PromptRequest(BaseModel):
    prompt: str

OLLAMA_URL = "http://localhost:11434/api/generate"

@app.post("/generate")
def generate_response(request: PromptRequest):
    print(f"Otrzymano zapytanie: {request.prompt}")
    
    payload = {
        "model": "llama3",
        "prompt": request.prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        
        result = response.json()
        return {"response": result.get("response", "")}
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Błąd połączenia z Ollama: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)