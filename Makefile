ENV_FILE=.env

.PHONY: env up down

env:
	@./scripts/ensure-env.sh

up: env
	docker-compose up --build

down:
	docker-compose down
