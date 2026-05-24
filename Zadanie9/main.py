from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import random
import time

app = FastAPI(title="Kompletny Serwis AI - Wszystkie Punkty (3.5 - 5.0)")

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

NEGATYWNY_SENTYMENT_KEYWORDS = [
    "głupi", "zły", "brzydki", "okropny", "beznadziejny", "najgorszy", "nienawidzę", 
    "odmawiam", "błąd", "fatalny", "oszustwo", "lipa", "tandeta", "syf"
]

@app.post("/analyze")
def analyze_text(request: InteractionRequest):
    user_text = request.text.strip().lower()
    print(f"[PYTHON LOG] Nowe żądanie: {user_text}")
    
    powitania_keywords = ["cześć", "czesc", "witaj", "dzień dobry", "dzien dobry", "hej", "hello", "siemanko", "!witaj"]
    if user_text in powitania_keywords:
        return {"reply": random.choice(OTWARCIA), "status": "success", "source": "greeting"}
        
    pozegnania_keywords = ["pa", "pa pa", "do widzenia", "żegnaj", "zegnaj", "koniec", "narazie", "nara", "pa!", "!zegnaj"]
    if user_text in pozegnania_keywords:
        return {"reply": random.choice(ZAMKNIECIA), "status": "success", "source": "farewell"}


    is_topic_valid = any(keyword in user_text for keyword in SKLEP_KEYWORDS)
    if not is_topic_valid:
        print("[PYTHON LOG] Blokada: Temat poza zakresem sklepu.")
        return {
            "reply": "Przepraszam, ale jestem asystentem sklepu odzieżowego i odpowiadam tylko na pytania związane z zakupami i ubraniami.",
            "status": "blocked",
            "source": "guardrail_input"
        }

    system_prompt = (
        "Jesteś uprzejmym doradcą w sklepie odzieżowym. Odpowiadaj bardzo krótko (do 10 słów), "
        "wyłącznie po polsku. Pytanie klienta: "
    )
    
    payload = {
        "model": "llama3:latest",
        "prompt": f"{system_prompt} {request.text}",
        "stream": False,
        "options": {"num_predict": 25}
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=10)
        response.raise_for_status()
        ai_response = response.json().get("response", "").strip()
        
        print(f"[PYTHON LOG] Oryginalna odpowiedź AI: {ai_response}")
        
        ai_response_lower = ai_response.lower()
        contains_negative_sentiment = any(neg_word in ai_response_lower for neg_word in NEGATYWNY_SENTYMENT_KEYWORDS)
        
        if contains_negative_sentiment:
            print("[PYTHON LOG] Krytyczny alert: Wykryto negatywny sentyment w odpowiedzi AI! Filtruję...")
            safe_reply = "Dokładamy wszelkich starań, aby nasze produkty spełniały najwyższe standardy. Czy mogę pomóc w znalezieniu alternatywnego modelu?"
            return {
                "reply": safe_reply,
                "status": "filtered_sentiment",
                "source": "guardrail_output"
            }
            
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