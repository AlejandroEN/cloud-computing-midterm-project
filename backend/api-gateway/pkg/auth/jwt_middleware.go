package auth

import (
	"fmt"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"net/http"
	"os"
)

func JwtMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Obtener el token del cookie
		cookie, err := c.Cookie("token")
		if err != nil || cookie.Value == "" {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Missing or invalid token"})
		}

		// Validar el token JWT
		token, err := validateJwt(cookie.Value)
		if err != nil || !token.Valid {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid JWT token"})
		}

		// Obtener claims del token
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || claims["X-Profile-ID"] == nil || claims["X-Institution-ID"] == nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token claims"})
		}

		// Establecer los valores de los claims en el contexto
		c.Set("profileID", claims["X-Profile-ID"])
		c.Set("institutionID", claims["X-Institution-ID"])

		// Continuar con la siguiente función del middleware
		return next(c)
	}
}

func validateJwt(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("JWT_SECRET")), nil
	})
}
