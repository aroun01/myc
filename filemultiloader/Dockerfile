# syntax=docker/dockerfile:1

FROM golang:1.21.7

# Set destination for COPY
WORKDIR /code

# # Download Go modules 
# COPY go.mod go.sum ./
# # COPY go.mod ./
# RUN go mod download

# COPY *.go ./
# COPY * ./
COPY . /code/
# # Build
# RUN CGO_ENABLED=0 GOOS=linux go build -o /filemultiloader
# RUN CGO_ENABLED=0 GOOS=linux go build -o /main
RUN apt update
RUN apt upgrade -y 
RUN apt install -y mc 
RUN apt install lsof
RUN CGO_ENABLED=0 GOOS=linux go build -o filemultiloader main.go
EXPOSE 8181

# Run
# CMD [ "/filemultiloader" ]
