import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        const googleToken = account.id_token;

        try {
          const response = await fetch(
            "http://localhost:8080/auth/verify-google-token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: googleToken }),
            },
          );

          if (!response.ok) {
            console.error("Failed to authenticate with Go service");
            return false;
          }

          const data = await response.json();
          console.log("Received from Go service:", data); // should include your JWT

          // You could store this JWT in the token/session if needed later
          return true;
        } catch (error) {
          console.error("Error sending Google token to Go service:", error);
          return false;
        }
      }

      return true;
    },
  },
});
