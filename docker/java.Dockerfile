# Build context is the repo root (see docker-compose.yml).
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /build
COPY backend-java/pom.xml .
# Warm the dependency cache in its own layer before copying source, so
# source-only changes don't force a full re-download on rebuild.
RUN mvn -q -B dependency:go-offline

COPY backend-java/src ./src
RUN mvn -q -B -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /build/target/quarkus-app/ ./

EXPOSE 8080
CMD ["java", "-jar", "quarkus-run.jar"]
