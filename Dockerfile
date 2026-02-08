# 1. Fase de construcción
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
# Forzamos a Maven a buscar el pom.xml dentro de la carpeta
RUN mvn clean package -f CrudRestJPADemo/pom.xml -DskipTests

# 2. Fase de ejecución
FROM openjdk:17-jdk-slim
# Aquí estaba el error: el JAR está dentro de CrudRestJPADemo/target/
COPY --from=build /CrudRestJPADemo/target/CrudRestJPADemo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]