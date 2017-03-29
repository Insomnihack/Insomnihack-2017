BIN_NAME=skybot
CC=gcc
ARCHFLAG=-m64
CFLAGS=-Wl,-z,relro,-z,now -fpic -pie -fstack-protector-all -Wno-implicit-function-declaration -Wno-format-security -z noexecstack
CFLAGS_DEBUG=-Wl,-z,relro,-z,now -fpic -pie -fstack-protector-all -Wno-implicit-function-declaration -Wno-format-security -z noexecstack -DDEBUG

all:
	$(RM) $(BIN_NAME)
	$(CC) $(ARCHFLAG) $(CFLAGS) $(BIN_NAME).c -o $(BIN_NAME)
	strip $(BIN_NAME)
	$(RM) *.o
debug:
	$(RM) $(BIN_NAME)
	$(CC) $(ARCHFLAG) $(CFLAGS_DEBUG) $(BIN_NAME).c -o $(BIN_NAME)
	strip $(BIN_NAME)
	$(RM) *.o
