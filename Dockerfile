FROM maven:3-openjdk-18 AS initial

# copy sources to container
COPY .mvn .
COPY Proofs Proofs
COPY src src
COPY mvnw mvnw
COPY pom.xml pom.xml

# build application
RUN mvn clean package

# Discard container after WebCorC is packaged/compiled
FROM openjdk:18-jdk-slim-buster AS run
COPY --from=initial target/edu.kit.cbc.web.war /usr/local/lib/webcorc.war
EXPOSE 5000
ENTRYPOINT ["java","-jar","/usr/local/lib/webcorc.war", "--server.port=5000"]
