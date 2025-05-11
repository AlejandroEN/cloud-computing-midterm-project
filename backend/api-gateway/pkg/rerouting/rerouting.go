package rerouting

import (
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

func SetupRoutes(apiGroup *echo.Group) {
	apiGroup.Any("/orchestrator/*", forwardHandler("MICROSERVICE_ORCHESTRATOR_URL"))

	apiGroup.Any("/posts/*", forwardHandler("MICROSERVICE_POSTS_URL"))

	apiGroup.Any("/profiles/*", forwardHandler("MICROSERVICE_PROFILES_URL"))
	apiGroup.Any("/institution/*", forwardHandler("MICROSERVICE_PROFILES_URL"))

	apiGroup.Any("/purchases/*", forwardHandler("MICROSERVICE_PURCHASES_URL"))
	apiGroup.Any("/reviews/*", forwardHandler("MICROSERVICE_PURCHASES_URL"))
}

func forwardHandler(microserviceURLEnvVar string) echo.HandlerFunc {
	return func(c echo.Context) error {
		microserviceURL := os.Getenv(microserviceURLEnvVar)
		if microserviceURL == "" {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Microservice URL not found"})
		}

		return forwardRequest(c, microserviceURL)
	}
}

func forwardRequest(c echo.Context, microserviceURL string) error {
	profileID := c.Get("profileID").(string)
	institutionID := c.Get("institutionID").(string)

	req := c.Request()
	client := http.Client{}

	newReq, err := http.NewRequest(req.Method, fmt.Sprintf("%s%s", microserviceURL, req.URL.Path), req.Body)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create forwarding request"})
	}

	newReq.Header = req.Header.Clone()
	newReq.Header.Set("X-Profile-ID", profileID)
	newReq.Header.Set("X-Institution-ID", institutionID)

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
	c.Response().Write(body)
	return nil
}
