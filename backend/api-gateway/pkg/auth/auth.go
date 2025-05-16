package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"log"
	"net/http"
	"os"
	"time"
)

var oauth2Config *oauth2.Config

func init() {
	requiredEnvVars := []string{"GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_REDIRECT_URL", "JWT_SECRET"}

	for _, env := range requiredEnvVars {
		if os.Getenv(env) == "" {
			log.Fatalf("Environment variable %s is not set", env)
		}
	}

	// Configuración de OAuth2 para Google (esto ya lo tienes correcto)
	oauth2Config = &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_OAUTH_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes:       []string{"openid", "profile", "email"},
		Endpoint:     google.Endpoint,
	}
}

func SetupRoutes(authGroup *echo.Group) {
	authGroup.POST("/verify-google-token", HandleGoogleToken)
}

func HandleGoogleToken(c echo.Context) error {
	// Obtener el token de Google del cuerpo de la solicitud
	var requestBody struct {
		Token string `json:"token"`
	}

	if err := c.Bind(&requestBody); err != nil {
		log.Println("Error al enlazar el cuerpo de la solicitud:", err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	// Verificar el token de Google
	isValid, err := verifyGoogleToken(requestBody.Token)
	if err != nil || !isValid {
		log.Println("Error al verificar el token de Google:", err)
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid Google token"})
	}

	// Obtener la información del usuario desde Google
	userInfo, err := getUserInfoFromGoogle(requestBody.Token)
	if err != nil {
		log.Println("Error al obtener la información del usuario de Google:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Failed to get user info: %v", err)})
	}

	// Buscar el perfil del usuario en la base de datos o crear uno nuevo
	profile, err := getProfileByEmail(userInfo.Email, c)
	if err != nil {
		log.Println("Error al obtener el perfil del usuario:", err)
		profile, err = createProfile(userInfo.Email, c)
		if err != nil {
			log.Println("Error al crear el perfil:", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Failed to create profile: %v", err)})
		}
	}

	// Generar el JWT personalizado
	tokenString, err := createJWT(profile.ID, profile.InstitutionID)
	if err != nil {
		log.Println("Error al crear el token JWT:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Failed to create JWT token: %v", err)})
	}

	// Devolver el token JWT al cliente
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Successfully authenticated",
		"token":   tokenString,
		"profile": profile,
	})
}

func verifyGoogleToken(token string) (bool, error) {
	// Crear un cliente HTTP
	client := &http.Client{}

	// Construir la URL para verificar el token de Google
	url := fmt.Sprintf("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=%s", token)

	// Hacer la solicitud GET para verificar el token
	resp, err := client.Get(url)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	// Si el token es inválido, el servicio devolverá un código de estado diferente a 200
	if resp.StatusCode != http.StatusOK {
		return false, fmt.Errorf("invalid token")
	}

	// Si llegamos hasta aquí, el token es válido
	return true, nil
}

func getUserInfoFromGoogle(token string) (*struct {
	Email string `json:"email"`
}, error) {
	// Crear un cliente OAuth2
	client := oauth2Config.Client(context.Background(), &oauth2.Token{AccessToken: token})
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var user struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, err
	}

	return &user, nil
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
