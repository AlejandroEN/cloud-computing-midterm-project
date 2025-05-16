package rerouting

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"io"
	"net/http"
	"os"
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
	profileID, ok1 := c.Get("profileID").(string)
	institutionID, ok2 := c.Get("institutionID").(string)
	if !ok1 || !ok2 {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Missing profile or institution ID"})
	}

	req := c.Request()

	targetURL := fmt.Sprintf("%s%s", microserviceURL, req.URL.Path)
	if req.URL.RawQuery != "" {
		targetURL = fmt.Sprintf("%s?%s", targetURL, req.URL.RawQuery)
	}

	var body io.Reader
	switch req.Method {
	case http.MethodPost, http.MethodPut, http.MethodPatch:
		body = req.Body
	default:
		body = nil
	}

	newReq, err := http.NewRequest(req.Method, targetURL, body)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create forwarding request"})
	}

	newReq.Header = http.Header{}
	for k, v := range req.Header {
		if k == "Host" || k == "Content-Length" {
			continue
		}
		for _, h := range v {
			newReq.Header.Add(k, h)
		}
	}
	newReq.Header.Set("X-Profile-ID", profileID)
	newReq.Header.Set("X-Institution-ID", institutionID)

	client := &http.Client{}
	resp, err := client.Do(newReq)
	if err != nil {
		return c.JSON(http.StatusBadGateway, map[string]string{"error": "Failed to reach the microservice"})
	}
	defer resp.Body.Close()

	for k, v := range resp.Header {
		for _, h := range v {
			c.Response().Header().Add(k, h)
		}
	}

	c.Response().WriteHeader(resp.StatusCode)
	_, err = io.Copy(c.Response().Writer, resp.Body)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to write response"})
	}

	return nil
}
