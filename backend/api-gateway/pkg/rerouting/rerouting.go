package rerouting

import (
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

func SetupRoutes(apiGroup *echo.Group) {
	apiGroup.Any("/orchestrator/*", orchestratorHandler)

	apiGroup.Any("/profiles/*", profilesHandler)
	apiGroup.Any("/institution/*", profilesHandler)

	apiGroup.Any("/posts/*", postsHandler)

	apiGroup.Any("/purchases/*", purchasesHandler)
	apiGroup.Any("/reviews/*", purchasesHandler)
}

func orchestratorHandler(c echo.Context) error {
	return forwardRequest(c, os.Getenv("MICROSERVICE_ORCHESTRATOR_URL"))
}

func profilesHandler(c echo.Context) error {
	return forwardRequest(c, os.Getenv("MICROSERVICE_PROFILES_URL"))
}

func postsHandler(c echo.Context) error {
	return forwardRequest(c, os.Getenv("MICROSERVICE_POSTS_URL"))
}

func purchasesHandler(c echo.Context) error {
	return forwardRequest(c, os.Getenv("MICROSERVICE_PURCHASES_URL"))
}

func forwardRequest(c echo.Context, microserviceURL string) error {
	tokenCookie, err := c.Cookie("token")
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Missing JWT token"})
	}

	tokenString := tokenCookie.Value

	req := c.Request()
	client := http.Client{}

	newReq, err := http.NewRequest(req.Method, fmt.Sprintf("%s%s", microserviceURL, req.URL.Path), req.Body)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create forwarding request"})
	}

	newReq.Header = req.Header.Clone()
	newReq.Header.Set("Authorization", "Bearer "+tokenString)

	resp, err := client.Do(newReq)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to reach the microservice"})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to read response body"})
	}

	c.Response().WriteHeader(resp.StatusCode)
	_, err = c.Response().Write([]byte(fmt.Sprintf("Response from %s", microserviceURL)))
	if err != nil {
		return err
	}

	_, err = c.Response().Write([]byte(fmt.Sprintf("\nResponse Body:\n")))
	if err != nil {
		return err
	}

	_, err = c.Response().Write(body)
	return err
}
