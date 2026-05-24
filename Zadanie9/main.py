from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import random
import time

app = FastAPI(title="Serwis AI - Punkt 4.5 (Filtrowanie Tematów)")

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
    "Dzień dobry! W czym mogę Ci dzisiaj pomóc w naszym sklepie?",
    "Cześć! Miło Cię widzieć. Szukasz ubrań z nowej kolekcji czy czegoś klasycznego?",
    "Witaj drogi kliencie! Jestem Twoim wirtualnym asystentem zakupowym. W czym doradzić?",
    "Siemanko! Gotowy na upolowanie dzisiejszych super okazji cenowych?",
    "Dzień dobry! Z przyjemnością pomogę Ci wybrać najlepsze produkty z naszej oferty."
]

ZAMKNIECIA = [
    "Dziękuję za rozmowę! Życzę udanych zakupów i wspaniałego dnia.",
    "Do zobaczenia! W razie kolejnych pytań o naszą ofertę, jestem do dyspozycji.",
    "Trzymaj się! Mamy nadzieję, że wybrane stylizacje przypadką Ci do gustu.",
    "Sesja zakończona. Dziękujemy za odwiedzenie naszego sklepu internetowego!",
    "Do usłyszenia! Nie zapomnij zapisać się do naszego newslettera po zniżki."
]

SKLEP_KEYWORDS = [

    "buty", "but", "koszulka", "t-shirt", "bluza", "spodnie", "sukienka", "spódnica", 
    "kurtka", "płaszcz", "odzież", "ciuchy", "ubrania", "kolekcja", "moda", "stylizacja",

    "sklep", "cena", "koszt", "kupić", "zakupy", "zamówienie", "rozmiar", "kolor", 
    "dostawa", "wysyłka", "płatność", "zwrot", "reklamacja", "rabat", "promocja", "kod"
]

@app.post("/analyze")
def analyze_text(request: InteractionRequest):
    start_time = time.time()
    user_text = request.text.strip().lower()
    print(f"[PYTHON LOG] Analiza wiadomości: {user_text}")
    
    powitania_keywords = ["cześć", "czesc", "witaj", "dzień dobry", "dzien dobry", "hej", "hello", "siemanko", "!witaj"]
    if user_text in powitania_keywords:
        return {
            "reply": random.choice(OTWARCIA),
            "status": "success",
            "source": "template_greeting"
        }
        
    pozegnania_keywords = ["pa", "pa pa", "do widzenia", "żegnaj", "zegnaj", "koniec", "narazie", "nara", "pa!", "!zegnaj"]
    if user_text in pozegnania_keywords:
        return {
            "reply": random.choice(ZAMKNIECIA),
            "status": "success",
            "source": "template_farewell"
        }

    is_topic_valid = any(keyword in user_text for keyword in SKLEP_KEYWORDS)
    
    if not is_topic_valid:
        print(f"[PYTHON LOG] Wykryto temat spoza zakresu sklepu!")
        return {
            "reply": "Przepraszam, ale jestem asystentem sklepu odzieżowego i mogę pomagać Ci tylko w tematach związanych z naszymi ubraniami i zakupami.",
            "status": "blocked",
            "source": "guardrail_filter"
        }

    system_prompt = (
        "Jesteś pomocnym asystentem w sklepie odzieżowym. Odpowiadaj bardzo krótko (maksymalnie jedno zdanie), "
        "wyłącznie po polsku i tylko na tematy związane z ubraniami lub zakupami. Pytanie klienta: "
    )
    
    payload = {
        "model": "llama3:latest",
        "prompt": f"{system_prompt} {request.text}",
        "stream": False,
        "options": {
            "num_predict": 25
        }
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=10)
        response.raise_for_status()
        ai_response = response.json().get("response", "").strip()
        
        return {
            "reply": ai_response,
            "status": "success",
            "source": "ollama_ai"
        }
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Blad Ollama: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)