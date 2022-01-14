CONTAINER_NAME = material_app

up:
	docker-compose -f docker-compose.yml up

build:
	docker-compose -f docker-compose.yml up --build

down:
	docker-compose -f docker-compose.yml down

migrations:
	docker exec -it $(CONTAINER_NAME) sh -c './manage.py makemigrations'

static:
	docker exec -it $(CONTAINER_NAME) sh -c './manage.py collectstatic'

migrate:
	docker exec -it $(CONTAINER_NAME) sh -c './manage.py migrate'

test:
	docker exec -it $(CONTAINER_NAME) sh -c './manage.py test'

coverage:
	docker exec -it $(CONTAINER_NAME) sh -c \
		'coverage run --source='./material' manage.py test'

report:
	docker exec -it $(CONTAINER_NAME) sh -c 'coverage report'

dist:
	-@rm -rf build/* dist/*
	@python -mbuild

# Because build and dist are created directories and generate deps causing make
# to cache
.PHONY: build dist
