# --- Stage 1: Build & Dependencies ---
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Cache maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build executable jar
COPY src ./src
RUN mvn clean package -DskipTests

# Extract layers for Spring Boot layer indexing
RUN java -Djarmode=layertools -jar target/*.jar extract --destination target/extracted

# --- Stage 2: Minimal Runtime ---
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy extracted layers in order of change frequency (layer caching)
COPY --from=builder --chown=spring:spring /build/target/extracted/dependencies/ ./
COPY --from=builder --chown=spring:spring /build/target/extracted/spring-boot-loader/ ./
COPY --from=builder --chown=spring:spring /build/target/extracted/snapshot-dependencies/ ./
COPY --from=builder --chown=spring:spring /build/target/extracted/application/ ./

EXPOSE 8080

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
