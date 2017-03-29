#include "stdafx.h"
#include <windows.h>
#include <stdio.h>
#include <tchar.h>

typedef struct {
	char target_planet[256];
	char fmt[256];
	void (*callback)(char *);
} s_droid;

#define MAX_DROIDS 0x100
static s_droid *droids[MAX_DROIDS] = { 0 };

# include <Processthreadsapi.h>

static void setup_mitigations(void)
{
	HANDLE hProc = GetCurrentProcess();
	PROCESS_MITIGATION_DEP_POLICY dep = { 0 };
	PROCESS_MITIGATION_ASLR_POLICY aslr = { 0 };
	PROCESS_MITIGATION_STRICT_HANDLE_CHECK_POLICY strict_handle_check = { 0 };
	PROCESS_MITIGATION_DYNAMIC_CODE_POLICY dynamic_code = { 0 };
	PROCESS_MITIGATION_SYSTEM_CALL_DISABLE_POLICY system_call_disable = { 0 };
	PROCESS_MITIGATION_EXTENSION_POINT_DISABLE_POLICY extension_point_disable = { 0 };
	PROCESS_MITIGATION_CONTROL_FLOW_GUARD_POLICY cfg = { 0 };
	PROCESS_MITIGATION_BINARY_SIGNATURE_POLICY signature = { 0 };
	PROCESS_MITIGATION_FONT_DISABLE_POLICY font = { 0 };
	PROCESS_MITIGATION_IMAGE_LOAD_POLICY image_load = { 0 };

	// ASLR Policy

	GetProcessMitigationPolicy(hProc, ProcessASLRPolicy, &aslr, sizeof(aslr));
	aslr.EnableBottomUpRandomization = 1;
	aslr.EnableForceRelocateImages = 1;
	aslr.EnableHighEntropy = 1;
	aslr.DisallowStrippedImages = 1;

	if (!SetProcessMitigationPolicy(ProcessASLRPolicy, &aslr, sizeof(aslr))) {
#ifdef DEBUG
		std::cerr << "Failed to set ASLR Policy (" << GetLastError() << ")" << std::endl;
#endif
	}

	// Dynamic Code Policy

	GetProcessMitigationPolicy(hProc, ProcessDynamicCodePolicy, &dynamic_code, sizeof(dynamic_code));
	dynamic_code.ProhibitDynamicCode = 1;
 
	if (!SetProcessMitigationPolicy(ProcessDynamicCodePolicy, &dynamic_code, sizeof(dynamic_code))) {
#ifdef DEBUG
		std::cerr << "Failed to set Dynamic Code Policy (" << GetLastError() << ")" << std::endl;
#endif
	}

	// Strict Handle Check Policy

	GetProcessMitigationPolicy(hProc, ProcessStrictHandleCheckPolicy, &strict_handle_check, sizeof(strict_handle_check));
	strict_handle_check.RaiseExceptionOnInvalidHandleReference = 1;
	strict_handle_check.HandleExceptionsPermanentlyEnabled = 1;

	if (!SetProcessMitigationPolicy(ProcessStrictHandleCheckPolicy, &strict_handle_check, sizeof(strict_handle_check))) {
#ifdef DEBUG
		std::cerr << "Failed to set Strict Handle Check Policy (" << GetLastError() << ")" << std::endl;
#endif
	}

	// System Call Disable Policy

	GetProcessMitigationPolicy(hProc, ProcessSystemCallDisablePolicy, &system_call_disable, sizeof(system_call_disable));
	system_call_disable.DisallowWin32kSystemCalls = 1;

	if (!SetProcessMitigationPolicy(ProcessSystemCallDisablePolicy, &system_call_disable, sizeof(system_call_disable))) {
#ifdef DEBUG
		std::cerr << "Failed to set System Call Disable Policy (" << GetLastError() << ")" << std::endl;
#endif
	}

	// Extension Point Disable Policy

	GetProcessMitigationPolicy(hProc, ProcessExtensionPointDisablePolicy, &extension_point_disable, sizeof(extension_point_disable));
	extension_point_disable.DisableExtensionPoints = 1;

	if (!SetProcessMitigationPolicy(ProcessExtensionPointDisablePolicy, &extension_point_disable, sizeof(extension_point_disable))) {
#ifdef DEBUG
		std::cerr << "Failed to set Extension Point Disable Policy (" << GetLastError() << ")" << std::endl;
#endif
	}

	// Control Flow Guard Policy

	GetProcessMitigationPolicy(hProc, ProcessControlFlowGuardPolicy, &cfg, sizeof(cfg));
	cfg.EnableControlFlowGuard = 1;

	if (!SetProcessMitigationPolicy(ProcessControlFlowGuardPolicy, &cfg, sizeof(cfg))) {
#ifdef DEBUG
		std::cerr << "Failed to set Control Flow Guard Policy (" << GetLastError() << ")" << std::endl;
#endif
	}

	// Signature Policy

	GetProcessMitigationPolicy(hProc, ProcessSignaturePolicy, &signature, sizeof(signature));
	signature.MicrosoftSignedOnly = 1;

	if (!SetProcessMitigationPolicy(ProcessSignaturePolicy, &signature, sizeof(signature))) {
#ifdef DEBUG
		std::cerr << "Failed to set Signature Policy (" << GetLastError() << ")" << std::endl;
#endif
	}

	// Font Disable Policy

	GetProcessMitigationPolicy(hProc, ProcessFontDisablePolicy, &font, sizeof(font));
	font.DisableNonSystemFonts = true;

	signature.MicrosoftSignedOnly = 1;
	if (!SetProcessMitigationPolicy(ProcessFontDisablePolicy, &font, sizeof(font))) {
#ifdef DEBUG
		std::cerr << "Failed to set Font Disable Policy (" << GetLastError() << ")" << std::endl;
#endif
	}

	// Image Load Policy
	GetProcessMitigationPolicy(hProc, ProcessImageLoadPolicy, &image_load, sizeof(image_load));
	image_load.NoRemoteImages = 1;
	image_load.NoLowMandatoryLabelImages = 1;

	if (!SetProcessMitigationPolicy(ProcessImageLoadPolicy, &image_load, sizeof(image_load))) {
#ifdef DEBUG
		std::cerr << "Failed to set Image Load Policy (" << GetLastError() << ")" << std::endl;
#endif
	}
}

void action_droideka(char *planet)
{
	printf("Droideka launches a powerfull blaster cannon attack on planet %s and protects itself with a deflector shield!\n", planet);
}

void action_b1battledroid(char *planet)
{
	printf("B1 Battle Droid overwhelms planet %s with lame attacks!\n", planet);
}

void action_probedroid(char *planet)
{
	printf("Probe Droid seeks for remaining rebels on %s...", planet);
}

void action_ig88(char *planet)
{
	printf("IG-88 starts a bug hunt on %s and kills everyone in its way!", planet);
}

int get_droid_id(void)
{
	unsigned id;
	printf("ID? ");
	scanf_s("%u", &id);
	getchar();

	if (id < MAX_DROIDS && droids[id]) {
		return id;
	} 

	printf("Invalid ID.\n");

	return -1;
}

void readline(char *dst, int size)
{
	if (fgets(dst, size, stdin) == NULL) {
		return;
	}

	size_t i = strlen(dst);

	if (i > 0 && dst[i - 1] == '\n') {
		dst[i - 1] = '\0';
	}
}

void add_droid(void)
{
	unsigned char type;
	unsigned id;

	for (id = 0; id < MAX_DROIDS && droids[id]; id++);
	if (id >= MAX_DROIDS) {
		printf("Too many droids already. Army is ready!\n");
		return;
	}
	s_droid *droid = (s_droid*)HeapAlloc(GetProcessHeap(), 0, sizeof(s_droid));

	if (!droid) {
		printf("FATAL ERROR\n");
		exit(1);
	}

	memset(droid, 0, sizeof(s_droid));

	printf("Target planet? ");
	readline(droid->target_planet, sizeof(droid->target_planet));

	bool fail = false;

	do {
		printf("Type?\n");
		printf(
			" d - Droideka\n"
			" b - B1 Battle Droid\n"
			" p - Probe Droid\n"
			" i - IG-88\n"
			"~~~~~~~~~~~~~~~~~~~~~~\n"
		);
		scanf_s("%c", &type, 1);
		getchar();
		switch (type) {
		case 'd':
			strcpy_s(droid->fmt, sizeof(droid->fmt), "[+] A Droideka lands on %1$s (%2$d, %3$d).\n");
			droid->callback = &action_droideka;
			break;
		case 'b':
			strcpy_s(droid->fmt, sizeof(droid->fmt), "[+] An army of %$3d%$2d B1 Battle Droid arrives on %$1s.\n");
			droid->callback = &action_b1battledroid;
			break;
		case 'p':
			strcpy_s(droid->fmt, sizeof(droid->fmt), "[+] Probe Droid arrived on planet %$1s after %$2d days and %$3d hours...\n");
			droid->callback = &action_probedroid;
			break;
		case 'i':
			strcpy_s(droid->fmt, sizeof(droid->fmt), "[+] IG-88 has a bounty of %$2d%$3d$ on planet %$1s.\n");
			droid->callback = &action_ig88;
			break;
		default:
			printf("Invalid type.\n");
			fail = true;
			break;
		}
	} while (fail);

	droids[id] = droid;
	printf("Droid added.\n");
}

void delete_droid(void)
{
	int id = get_droid_id();

	if (id == -1) {
		return;
	}

	if (!HeapFree(GetProcessHeap(), 0, droids[id])) {
		printf("FATAL ERROR\n");
		exit(1);
	}
	droids[id] = NULL;
	printf("Droid removed.\n");
}

void change_droid_target()
{
	int id = get_droid_id();

	if (id == -1) {
		return;
	}

	s_droid *droid = droids[id];

	printf("New target planet? ");
	readline(droid->target_planet, sizeof(*droid));
}

int check_droid(const s_droid *droid)
{
	bool has_null = false;

	for (size_t i = 0; i < sizeof(droid->target_planet); i++)
	{
		if (droid->target_planet[i] == 0x00) {
			has_null = true;
			continue;
		}

		if (!(droid->target_planet[i] > 0x20 && droid->target_planet[i] < 0x7f)) {
			return 1;
		}
	}

	if (!has_null) {
		return 1;
	}

	has_null = false;

	for (size_t i = 0; i < sizeof(droid->fmt); i++)
	{
		if (droid->fmt[i] == 0x00) {
			has_null = true;
			continue;
		}

		if (!(droid->fmt[i] >= 0x20 && droid->fmt[i] < 0x7f) && !(droid->fmt[i] == 0x0a)) {
			return 1;
		}
	}

	if (!has_null) {
		return 1;
	}

	if (!droid->callback) {
		return 1;
	}

	return 0;
}


void launch_attack(void)
{
	printf("Launching attack!\n");
	SetStdHandle(STD_INPUT_HANDLE, NULL);

	for (size_t i = 0; i < MAX_DROIDS; i++) {
		s_droid *droid = droids[i];
		if (!droid) {
			continue;
		}

		if (!check_droid(droid)) {
			_printf_p(droid->fmt, droid->target_planet, rand() % 100, rand() % 100);
			droid->callback(droid->target_planet);
		} else {
			printf("Droid %zu failed the integrity check, cannot be used in the attack. Sending the droid to maintenance...\n", i);
		}
	}
}

int main()
{
	unsigned char choice;

	setup_mitigations();

	setvbuf(stdin, NULL, _IONBF, 0);
	setvbuf(stdout, NULL, _IONBF, 0);
	setvbuf(stderr, NULL, _IONBF, 0);

	printf("--------------------------------------\n"
		   "            [DROID ARMY]\n"
		   " a - add droid\n"
		   " d - delete droid\n"
		   " c - change droid's target\n"
		   " l - attack all the worldz!\n"
		   "--------------------------------------\n");

	while (true) {
		printf("Choice? ");
		scanf_s("%c", &choice, 1);
		getchar();

		switch (choice) {
		case 'a':
			add_droid();
			break;
		case 'd':
			delete_droid();
		case 'c':
			change_droid_target();
			break;
		case 'l':
			launch_attack();
			return 0;
		}
	}

    return 0;
}