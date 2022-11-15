build-app:
	yarn build && NODE_ENV=production yarn webpack
build-image:
	docker build . --tag user-management

build: build-app build-image
start:
	docker-compose --project-name user-management -f .docker/docker-compose.yml up -d
stop:
	docker-compose --project-name user-management -f .docker/docker-compose.yml down
