package main

import (
	"api-gateway/pkg/auth"
	"log"

	"github.com/joho/godotenv"

	"api-gateway/pkg/rerouting"
	"api-gateway/pkg/server"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
}

func main() {
	e := server.NewServer()

	authGroup := e.Group("/auth")
	auth.SetupRoutes(authGroup)

	apiGroup := e.Group("/")
	rerouting.SetupRoutes(apiGroup)

	server.StartServer(e)
}
