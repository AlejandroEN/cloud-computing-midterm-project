package main

import (
	"api-gateway/pkg/auth"
	"api-gateway/pkg/rerouting"
	"api-gateway/pkg/server"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	e := server.NewServer()

	authGroup := e.Group("/auth")
	auth.SetupRoutes(authGroup)

	apiGroup := e.Group("/")
	apiGroup.Use(auth.JwtMiddleware)
	rerouting.SetupRoutes(apiGroup)

	server.StartServer(e)
}
