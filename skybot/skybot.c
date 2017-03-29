/*
 * skybot, is a spam application used by skynet
 * It allows you to red spam and send spam messages
 *
 * gcc -Wl,-z,relro,-z,now -fpic -pie -fstack-protector-all -Wno-implicit-function-declaration -Wno-format-security -z noexecstack
 *
 */
#include <err.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <signal.h>
#include <unistd.h>
#include <sys/types.h>
#include "mylibc.h"

#define ALARM_TIME 60
#define NAME_SIZE 32
#define LINE_SIZE 128
#define BANNERS 8
#define QUOTES 31

#define show(msg) printf("%s\n", msg)
#define clear_screen() printf("\033[H\033[J")

#ifdef DEBUG
    #define DEBUG 1
    static const char *file_path = "./";
#else
    #define DEBUG 0
    static const char *file_path = "/home/skybot";
#endif

static const char *pwd = "SU5Te24wN183aDNfZmw0Nl95MHVfZjAwbF8zeHBsMDE3XzE3fQ==";

typedef struct auth_s {
    char name[NAME_SIZE];
    int auth;
} auth_t;

auth_t *users;


void ALARMhandler(int sig)
{
    pid_t pid;
    pid = getpid();
    printf("Bye bye ...\n");
    printf("Exiting from pid %d\n", pid);
    kill(pid, 15);
    exit(0);
}


void print_random_banner()
{
    char buf[60];
    snprintf(buf, sizeof(buf), "%s/banners/%d.txt", file_path, randint(BANNERS));
    print_file(buf);
}


void read_random_email()
{
    int i;
    char buf[60];

    printf("-------------.....----\n");
    printf("| SKYBOT SENT EMAILS |\n");
    printf("----------------------\n");

    for(i = 0; i < sizeof(buf); i++) putchar('-');
    printf("\n");

    snprintf(buf, sizeof(buf), "%s/spam/%d.txt", file_path, randint(QUOTES));
    print_file(buf);

    for(i = 0; i < sizeof(buf); i++) putchar('-');
    printf("\n\n");
}


void vuln()
{
    int i;
    char to[100];
    char from[100];
    char subject[512];

    char *array[] = {to, from, subject};

    printf("To: ");
    /* fgets(to, sizeof(to), stdin); */
    read(STDIN_FILENO, to, sizeof(to));

    printf("From: ");
    /* fgets(from, sizeof(from), stdin); */
    read(STDIN_FILENO, from, sizeof(from));

    show("Subject: ");
    /* fgets(subject, sizeof(subject), stdin); */
    read(STDIN_FILENO, subject, sizeof(subject));

    printf("Your spam mail was sent to all humans:\n");
    printf("To: %s", to);
    printf("From: %s", from);
    show("Subject:");
    printf(subject);
}

//
// MAIN STARTS HERE
//

int main(int argc, char **argv)
{
    // make stdin/out unbuffered
    setvbuf(stdin, 0, _IONBF, 0);
    setvbuf(stdout, 0, _IONBF, 0);

    int i, j;
    unsigned char line[LINE_SIZE];

    signal(SIGALRM, ALARMhandler);
    alarm(ALARM_TIME);

    // initialize a structure to not segfault
    // on user->auth check
    users = malloc(sizeof(struct auth_s));
    if (users == NULL) {
        fprintf(stderr, "Error - unable to allocate required memory\n");
    } else {
        memset(users, 0, sizeof(struct auth_s));
    }

    print_random_banner();
    show("Welcome to the skynet email bot.");

    while(1) {
        show("Read spam or send one to all humans!");
        show("\nMenu: ");
        show("  1) read");
        show("  2) send");
        show("  3) delete");
        show("  4) exit\n");
        printf("|>>> ");

        if (fgets(line, sizeof(line), stdin) == NULL)
        /* if (!read(STDIN_FILENO, line, sizeof(line)) > 0) */
            break;

        if (custom_strncmp(line, "reset", 5) == 0) {
            free(users);
            users = 0;
        }

        if (custom_strncmp(line, "exit", 4) == 0) {
            exit(0);
        }

        if (custom_strncmp(line, "login", 5) == 0) {
            if (users->auth){
                show("You have logged in already!");
            } else {
                show("Please enter your password!");
            }
        }

        // read email fonctionality
        if (custom_strncmp(line, "read", 4) == 0) {
            read_random_email();
        }

        if (custom_strncmp(line, "delete", 6) == 0) {
            show("Nop, can't do that MOUHAHAHA !");
        }

        if (custom_strncmp(line, "send", 3) == 0) {
            if (users->auth) {
                vuln();
            } else {
                show("You need to authenticate before sending an email!");
            }
        }

        // off by one to go into vuln function
        if (custom_strncmp(line, "auth ", 5) == 0) {
            users = malloc(sizeof(struct auth_s));
            if (users == NULL) {
                fprintf(stderr, "Error - unable to allocate required memory\n");
            } else {
                memset(users, 0, sizeof(struct auth_s));
            }

            if (custom_strlen(line+5) <= NAME_SIZE) {
                for (i = 0, j = 5; i <= NAME_SIZE; i++) {
                    users->name[i] = line[j];
                    j++;
                }
                users->name[NAME_SIZE-1] = '\0';
            }
        }
    } // while end
}
