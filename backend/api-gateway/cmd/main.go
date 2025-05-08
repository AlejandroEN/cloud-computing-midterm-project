package main

import (
	"log"

	"github.com/joho/godotenv"

	"api-gateway/pkg/rerouting"
	"api-gateway/pkg/server"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}
}

func main() {
	e := server.NewServer()

	rerouting.SetupRoutes(e)

	port := ":8080"
	log.Printf("Starting Gateway API on port %s\n", port)
	if err := e.Start(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
