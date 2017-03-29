#include <err.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <signal.h>
#include <unistd.h>
#include <sys/types.h>
#include <assert.h>


int custom_strncmp(const char *s, const char *t, size_t n)
{
    while(n--) {
        if (*s != *t) {
            return *s - *t;
        } else {
            ++s;
            ++t;
        }
    }
    return 0;
}


char *custom_strncat(char *s, const char *t, size_t n, size_t bfsize)
{
    size_t slen = strlen(s);
    char *pend = s + slen;

    if (slen + n >= bfsize)
        return NULL;

    while(n--)
        *pend++ = *t++;
    return s;
}


char *custom_strncpy(char *s, const char *ct, size_t n)
{
    char *saver = s;

    while(n--)
        *saver++ = *ct++;
    *saver = '\0';
    return s;
}


size_t custom_strlen(char *str)
{
    size_t len = 0;
    while (*str != '\0') {
        str++;
        len++;
    }
    return len;
}


void remove_all_chars(char* str, char c) {
    char *pr = str, *pw = str;
    while (*pr) {
        *pw = *pr++;
        pw += (*pw != c);
    }
    *pw = '\0';
}


void delete_str(char *s,const char *toremove)
{
    while(s = strstr(s,toremove)) {
        memmove(s,s+strlen(toremove),1+strlen(s+strlen(toremove)));
    }
}


/* x = rand_range(1, 10);
 * x will be between 1 and 10, inclusive
 */
int rand_range(int min, int max)
{
    time_t t;
    srand((unsigned) time(&t));
    int diff = max - min;
    return (int) (((double)(diff+1)/RAND_MAX) * rand() + min);
}


static char *rand_string(char *str, size_t size)
{
    const char charset[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJK...";
    if (size) {
        --size;
        for (size_t n = 0; n < size; n++) {
            int key = rand() % (int) (sizeof charset - 1);
            str[n] = charset[key];
        }
        str[size] = '\0';
    }
    return str;
}


void print_file(char *filename)
{
    int c;
    FILE *file;
    file = fopen(filename, "r");
    if (file) {
        while ((c = getc(file)) != EOF)
            putchar(c);
        fclose(file);
    } else {
        fprintf(stderr, "Can't open file %s\n", filename);
    }
}


/*
 * Returns an integer in the range [0, n]
 */
int randint(int n) {
    time_t t;
    srand((unsigned) time(&t));
    return rand() % n;
}


