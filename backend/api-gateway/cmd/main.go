package main

import (
	"api-gateway/pkg/auth"
	_ "api-gateway/pkg/config"
	"api-gateway/pkg/rerouting"
	"api-gateway/pkg/server"
)

func main() {
	e := server.NewServer()

	authGroup := e.Group("/auth")
	auth.SetupRoutes(authGroup)

	apiGroup := e.Group("/")
	apiGroup.Use(auth.JWTMiddleware)
	rerouting.SetupRoutes(apiGroup)

	server.StartServer(e)
}
