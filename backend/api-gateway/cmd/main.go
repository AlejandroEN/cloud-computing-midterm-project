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

	server.StartServer(e)
}
