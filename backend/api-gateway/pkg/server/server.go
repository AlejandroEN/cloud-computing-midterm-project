package server

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"log"
	"net/http"
	"os"
	"strings"
)

func NewServer() *echo.Echo {
	e := echo.New()
	allowOrigins := os.Getenv("ALLOW_ORIGINS")

	if allowOrigins == "" {
		log.Fatal("ALLOW_ORIGINS is not set in the environment")
	}

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: strings.Split(allowOrigins, ","),
		AllowHeaders: []string{
			echo.HeaderOrigin,
			echo.HeaderContentType,
			echo.HeaderAccept,
			"X-Profile-ID",
			"X-Institution-ID",
			"X-Institution-Token",
		},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodPatch,
			http.MethodPost,
			http.MethodDelete,
		},
	}))

	return e
}

func StartServer(e *echo.Echo) {
	port := ":" + os.Getenv("PORT")

	if port == ":" {
		port = ":8080"
	}

	log.Printf("Starting Gateway API on port %s\n", port)

	if err := e.Start(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
