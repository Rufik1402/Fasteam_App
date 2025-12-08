# ---- 1. Build stage ----
FROM gradle:9.2-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle build -x test

# ---- 2. Run stage ----
FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
