package main

import (
	"log"

	"api-gateway/pkg/rerouting"
	"api-gateway/pkg/server"
)

func main() {
	e := server.NewServer()

	rerouting.SetupRoutes(e)
	
	port := ":8080"
	log.Printf("Starting Gateway API on port %s\n", port)
	if err := e.Start(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
