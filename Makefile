watch:
	while true; do \
		make $(WATCHMAKE); \
		inotifywait -qqr -e close_write -e delete src; \
	done

clean: build
	rm -rf build

compile/dev: src
	rm -rf build/**
	./node_modules/.bin/pug -P src -o build -b layouts
	./node_modules/.bin/postcss src/**/*.css -o build/styles.css