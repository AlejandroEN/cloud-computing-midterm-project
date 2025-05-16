package auth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/labstack/echo/v4"
	"net/http"
	"os"
)

type Institution struct {
	Name     string `json:"name"`
	ImageURL string `json:"image_url"`
}

type Profile struct {
	ID            string      `json:"id"`
	InstitutionID string      `json:"institution_id"`
	Institution   Institution `json:"institution"`
	Email         string      `json:"email"`
}

func getProfileByEmail(email string, c echo.Context) (*Profile, error) {
	url := fmt.Sprintf("%s/profiles?email=%s", os.Getenv("MICROSERVICE_PROFILES_URL"), email)
	req, err := http.NewRequest(http.MethodGet, url, nil)

	if err != nil {
		return nil, err
	}

	req.Header.Set("X-Internak-Token", os.Getenv("INTERNAL_API_SECRET"))
	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch profile: status code %d", resp.StatusCode)
	}

	var profile Profile

	if err := json.NewDecoder(resp.Body).Decode(&profile); err != nil {
		return nil, err
	}

	return &profile, nil
}

func createProfile(email string, c echo.Context) (*Profile, error) {
	url := fmt.Sprintf("%s/profiles", os.Getenv("MICROSERVICE_PROFILES_URL"))
	profilePayload := map[string]string{"email": email}
	payloadBytes, err := json.Marshal(profilePayload)

	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(payloadBytes))

	if err != nil {
		return nil, err
	}

	req.Header.Set("X-Internal-Token", os.Getenv("INTERNAL_API_SECRET"))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("failed to create profile: status code %d", resp.StatusCode)
	}

	var profile Profile

	if err := json.NewDecoder(resp.Body).Decode(&profile); err != nil {
		return nil, err
	}

	return &profile, nil
}

func extractJWT(c echo.Context) string {
	cookie, err := c.Cookie("token")

	if err != nil {
		return ""
	}

	return cookie.Value
}
