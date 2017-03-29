## Infos

**Author**: awe  
**Category**: Pwn  
**Difficulty**: Easy  
**Solves**: 2 (WTF)  

## Description:

  After monitoring the number of people escaping from `winworld` during the Insomni'hack Teaser, the droids became confident that Windows 10 is just too secured, so they decided to use it again to manage their army.  
  The protections are the same `winworld`, but the difficulty is... not quite the same ;)

  Running on Windows 10 with:  
  ```bash
  AppJailLauncher.exe /key:flag.txt /port:1337 /timeout:12000000 easywin.exe
  ```

## Solution:

There is an obvious buffer overflow in the "change target" function, which allows to overwrite a format and a function pointer.

1) Use the format string to leak `ucrtbase.dll`. At offset 5 you have `ucrtbase!_argc`. Compute the base of `ucrtbase` from its offset.  
2) Overwrite the function pointer with `ucrtbase!system` and trigger it. The binary has Control Flow Guard but `system` is a valid target, so no problem.  
3) First argument of `system` is our buffer (how convenient?), however our charset is limited to `c > 0x20 && c < 0x7f` so we can't use space characters. We can use `,` or `^` to circumvent that restriction: `type,flag.txt\x00`.  
4) For some reason remotely this didn't work (buffering or whatever), adding another command that prints more bytes does the trick: `type,flag.txt&whoami^/all\x00`  
5) Get the flag: `INS{command^injection^for^the^win}`
