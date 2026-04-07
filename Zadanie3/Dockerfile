FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY . .
RUN chmod +x gradlew
RUN ./gradlew installDist -Dorg.gradle.java.home=$JAVA_HOME
CMD ["./app/build/install/app/bin/app"]