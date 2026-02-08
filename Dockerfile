# 1. Fase de construcción (usando Maven)
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# 2. Fase de ejecución
FROM openjdk:17-jdk-slim
COPY --from=build /target/CrudRestJPADemo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]