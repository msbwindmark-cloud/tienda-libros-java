# 1. Fase de construcción
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
# Entramos en la carpeta donde está el pom.xml y compilamos
RUN mvn -f CrudRestJPADemo/pom.xml clean package -DskipTests

# 2. Fase de ejecución
FROM openjdk:17-jdk-slim
# Buscamos el jar dentro de la subcarpeta target
COPY --from=build /CrudRestJPADemo/target/CrudRestJPADemo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]