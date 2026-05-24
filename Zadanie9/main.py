from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import random

app = FastAPI(title="Serwis AI - Punkty 3.5 i 4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InteractionRequest(BaseModel):
    text: str

OLLAMA_URL = "http://localhost:11434/api/generate"

OTWARCIA = [
    "Dzień dobry! W czym mogę Ci dzisiaj pomóc?",
    "Cześć! Miło Cię widzieć. Szukasz ubrań z nowej kolekcji czy czegoś klasycznego?",
    "Witaj! Jestem Twoim wirtualnym asystentem zakupowym. W czym doradzić?",
    "Hej! Gotowy na upolowanie dzisiejszych super okazji cenowych?",
    "Dzień dobry! Z przyjemnością pomogę Ci wybrać najlepsze produkty z naszej oferty."
]

ZAMKNIECIA = [
    "Dziękuję za rozmowę! Życzę udanych zakupów i wspaniałego dnia.",
    "Do zobaczenia! W razie kolejnych pytań o naszą ofertę, jestem do dyspozycji.",
    "Trzymaj się! Mamy nadzieję, że wybrane stylizacje przypadną Ci do gustu.",
    "Sesja zakończona. Dziękujemy za odwiedzenie naszego sklepu internetowego!",
    "Do usłyszenia! Nie zapomnij zapisać się do naszego newslettera po zniżki."
]

@app.post("/analyze")
def analyze_text(request: InteractionRequest):
    user_text = request.text.strip().lower()
    print(f"[PYTHON LOG] Przetwarzanie wiadomości: {user_text}")
    
    powitania_keywords = ["cześć", "czesc", "witaj", "dzień dobry", "dzien dobry", "hej", "hello", "siemanko", "!witaj"]
    if user_text in powitania_keywords:
        wylosowane_otwarcie = random.choice(OTWARCIA)
        print(f"[PYTHON LOG] Wykryto powitanie. Losuję odpowiedź: {wylosowane_otwarcie}")
        return {"reply": wylosowane_otwarcie}
        
    pozegnania_keywords = ["pa", "pa pa", "do widzenia", "żegnaj", "zegnaj", "koniec", "narazie", "nara", "pa!", "!zegnaj"]
    if user_text in pozegnania_keywords:
        wylosowane_zamkniecie = random.choice(ZAMKNIECIA)
        print(f"[PYTHON LOG] Wykryto pożegnanie. Losuję odpowiedź: {wylosowane_zamkniecie}")
        return {"reply": wylosowane_zamkniecie}

    full_prompt = f"Odpowiadaj krótko, maksymalnie w dwóch zdaniach, wyłącznie w języku polskim. Pytanie klienta: {request.text}"
    
    payload = {
        "model": "llama3:latest",
        "prompt": full_prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        ai_response = response.json().get("response", "")
        return {"reply": ai_response}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Blad Ollama: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)