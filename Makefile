.PHONY : start
start : clean src
	mkdir build || true
	make watch WATCHMAKE=compile &
	cd build && python3 -m http.server

.PHONY : watch
watch :
	while true; do \
		make $(WATCHMAKE); \
		inotifywait -qqr -e close_write -e delete src; \
	done

.PHONY : clean
clean : build
	rm -rf $^

.PHONY : compile
compile : src
	./node_modules/.bin/pug -P src -o build -b layouts -w
	./node_modules/.bin/postcss src/**/*.css -o build/styles.css -w
