# Use official Golang image
FROM golang:1.23.9

# Set environment variables
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# Set working directory
WORKDIR /app

# Copy go.mod and go.sum
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the application
RUN go build -o api-gateway ./cmd/main.go

# Expose the port your app runs on
EXPOSE 8080

# Command to run the executable
CMD ["./api-gateway"]
