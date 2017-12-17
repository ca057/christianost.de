define clean_up_build
	find build -type f -name '*.html' ! -name 'index.html' -delete
	find build -type d -empty -delete
endef

watch:
	while true; do \
		make $(WATCHMAKE); \
		inotifywait -qqr -e close_write -e delete src; \
	done

compile/dev: src
	rm -rf build/**
	pug -P src -o build
	@$(clean_up_build)