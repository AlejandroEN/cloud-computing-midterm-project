package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var oauth2Config *oauth2.Config

func init() {
	requiredEnvVars := []string{"GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_REDIRECT_URL", "JWT_SECRET"}
	for _, env := range requiredEnvVars {
		if os.Getenv(env) == "" {
			log.Fatalf("Environment variable %s is not set", env)
		}
	}

	oauth2Config = &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_OAUTH_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes:       []string{"openid", "profile", "email"},
		Endpoint:     google.Endpoint,
	}
}

func SetupRoutes(authGroup *echo.Group) {
	authGroup.GET("/google", HandleGoogleAuth)
	authGroup.GET("/google/callback", HandleGoogleCallback)
	authGroup.GET("/logout", HandleLogout)
}

func HandleGoogleAuth(c echo.Context) error {
	authURL := oauth2Config.AuthCodeURL("", oauth2.AccessTypeOffline)
	return c.Redirect(http.StatusFound, authURL)
}

func HandleGoogleCallback(c echo.Context) error {
	code := c.QueryParam("code")
	if code == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing code parameter"})
	}

	token, err := oauth2Config.Exchange(context.Background(), code)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Failed to exchange token: %v", err)})
	}

	client := oauth2Config.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Failed to get user info: %v", err)})
	}
	defer resp.Body.Close()

	var user struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Failed to decode user info: %v", err)})
	}

	profile, err := getProfileByEmail(user.Email, c)
	if err != nil {
		profile, err = createProfile(user.Email, c)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Failed to create profile: %v", err)})
		}
	}

	tokenString, err := createJWT(profile.ID, profile.InstitutionID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Failed to create JWT token: %v", err)})
	}

	cookie := &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(24 * time.Hour),
	}
	c.SetCookie(cookie)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message":     "Successfully authenticated",
		"token":       tokenString,
		"profile":     profile,
		"institution": profile.Institution,
	})
}

func createJWT(profileID, institutionID string) (string, error) {
	claims := jwt.MapClaims{
		"X-Profile-ID":     profileID,
		"X-Institution-ID": institutionID,
		"exp":              time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func HandleLogout(c echo.Context) error {
	c.SetCookie(&http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	return c.JSON(http.StatusOK, map[string]string{"message": "Successfully logged out"})
}
