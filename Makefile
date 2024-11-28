build-ui:
	@cd frontend && npm start

build-java-api:
	@cd gs-spring-boot/complete && ./mvnw spring-boot:run