#  builds the react frontend
build-ui:
	@cd frontend && npm start

# java api for connecting to db and performing business logic
build-java-api:
	@cd gs-spring-boot/complete && ./mvnw spring-boot:run

# builds java api tests
test:
	@cd gs-spring-boot/complete && ./mvnw test