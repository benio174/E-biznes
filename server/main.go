package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Product struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func productsHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == "OPTIONS" {
		return
	}

	products := []Product{
		{ID: 1, Name: "Laptop Gamingowy", Price: 4500.00},
		{ID: 2, Name: "Myszka Bezprzewodowa", Price: 150.00},
		{ID: 3, Name: "Klawiatura Mechaniczna", Price: 350.00},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func paymentHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == "OPTIONS" {
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "sukces"}`))
}

func main() {
	http.HandleFunc("/api/products", productsHandler)
	http.HandleFunc("/api/payment", paymentHandler)

	fmt.Println("Serwer backendowy działa na porcie 8081...")
	http.ListenAndServe(":8081", nil)
}