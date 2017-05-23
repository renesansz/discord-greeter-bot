# Let's go, Makefile!
# This is to compile CJOpus from a C program to a JavaScript script.
# http://mrbook.org/blog/tutorials/make/ - Thank you friend!
CC = emcc
EMCONF = emconfigure
EMMAKE = emmake
# Our flags...
CJOPUS = src/CJOpus.c
LIBOPUS = opus/.libs/libopus.so

CFLAGS = --memory-init-file 0 -O3 -g0 --llvm-opts 3 --closure 1 --llvm-lto 3
EMCONFFLAGS = --disable-doc --disable-extra-programs --disable-intrinsics

all: make_opus transpile

make_opus:
	cd opus; \
	./autogen.sh; \
	$(EMCONF) ./configure $(EMCONFFLAGS); \
	$(EMMAKE) make;
	
transpile:
	mkdir bin; \
	$(CC) $(CFLAGS) $(CJOPUS) $(LIBOPUS) -o bin/CJOpus.js;
