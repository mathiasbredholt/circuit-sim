// cudb.c

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <ctype.h>

#define NAME_SIZE 5
#define NUMBER_OF_ITEMS 7
#define MAX_STUDENTS 10000

typedef struct {
    char name[NAME_SIZE];
    uint16_t data;  // Data is saved as a 16 bit number for efficiency and cross-compatibility, as only 14 bits are used anyways
} student_t;

void listStudents();
void addNewStudent();
void deleteStudent();
void printMenu();
int askForNumber(int min, int max);
int askForBoolean();
void fillStringWithSpacer(char *str, int size);
void writeToFile();
void readFromFile();
void generateRandomDatabase();

uint16_t registeredStudents = 0;
student_t students[MAX_STUDENTS];

int main() {
    puts("Welcome to CUDB - The C University Data Base");
    printMenu();
    printf("%s\n", "Bye");
    return 0;
}

// Creates the menu with various options for using the program.
void printMenu() {
    int i;
    char items[NUMBER_OF_ITEMS][32] = { "Halt", "List all students",  "Add a new student", "Delete student", "Save database to file", "Load database from file", "Generate random database" };
    char spacerStr1[15];
    char spacerStr2[38];
    fillStringWithSpacer(spacerStr1, 15);
    fillStringWithSpacer(spacerStr2, 38);
    printf("\n%s%s%s\n", spacerStr1, " Options ", spacerStr1);
    for (i = 0; i < NUMBER_OF_ITEMS; ++i) {
        printf("| %d: %-31s|\n", i, items[i]);
    }
    printf("%s\n\n", spacerStr2);
    printf("%s ", "Enter action:");
    int action = askForNumber(0, NUMBER_OF_ITEMS - 1);
    //The menu, asks for a number and acts accordingly.
    if (action == 1) {
        listStudents();
        printMenu();
    }
    if (action == 2) {
        addNewStudent();
        printMenu();
    }
    if (action == 3) {
        deleteStudent();
        printMenu();
    }
    if (action == 4) {
        writeToFile();
        printMenu();
    }
    if (action == 5) {
        readFromFile();
        printMenu();
    }
    if (action == 6) {
        generateRandomDatabase();
        printMenu();
    }
}

// Asks for a number, and checks if its within the desired range.
int askForNumber(int min, int max) {
    int input, ch;
    while (1) {
        scanf("%d", &input);
        while ((ch = getchar()) != '\n' && ch != EOF); // Flushes the input stream
        if (input < min) {
            printf("\aThe number can not be less than %d! Try again: ", min);
        }
        else if (input > max) {
            printf("\aThe number can not be greater than %d! Try again: ", max);
        }
        else {
            return input;
        }
    }
    return input;
}

//Asks for a yes/no to confirm some actions from the menu.
int askForBoolean() {
    char input, ch;
    while (1) {
        scanf("%c", &input);
        while ((ch = getchar()) != '\n' && ch != EOF);
        if (input == 'y') {
            return 1;
        }
        else if (input == 'n') {
            return 0;
        }
        printf("\aInvalid input! Try again: ");
    }
    return 0;
}

void fillStringWithInput(char * str, int length) {
    char *input = calloc(length + 1, sizeof(char));
    char ch;
    while (1) {
        scanf("%s", input);
        while ((ch = getchar()) != '\n' && ch != EOF);
        if (strlen(input) <= length) {
            strcpy(str, input);
            break;
        }
        printf("\aThe input can not be longer than %d characters. Try again: ", length);
    }
}

//Creates the outline of our menu 'screen'
void fillStringWithSpacer(char *str, int length) {
    int i;
    for (i = 0; i < (length - 1); ++i) {
        *str = '-';
        str++;
    }
    *str = '\0';
}

//Lists the students
void listStudents() {
    int i, totalGPA = 0;
    printf("\nNumber of students: %d\n", registeredStudents);
    if (registeredStudents > 0) { // If there is more than 0 students print out a formatted table containing the student information
        char spacerStr1[67];
        fillStringWithSpacer(spacerStr1, 67);
        printf("%s\n| %-10s | %-10s | %-10s | %-10s | %-10s |\n%s\n", spacerStr1, "ID", "Name", "Year", "Semester", "GPA", spacerStr1);
        for (i = 0; i < registeredStudents; ++i) {
            int year, semester, gpa;
            gpa = students[i].data / 64;
            semester = students[i].data / 32 % 2;
            year = students[i].data % 32 + 2009;
            char whichSemester[2][7] = { "Autumn", "Spring" };
            printf("|      s%04d | %-10s | %-10d | %-10s | %-10d |\n", i, students[i].name, year, whichSemester[semester], gpa);
            totalGPA += gpa;
        }
        printf("%s\n%s %d\n", spacerStr1, "Average GPA:", totalGPA / registeredStudents);
    }
}

//Adds a new student to the list.
void addNewStudent() {
    if (registeredStudents >= MAX_STUDENTS) {
        printf("Database full!\n");
        return;
    }
    int year, semester, gpa;
    printf("%s ", "Enter name (4 characters only):");
    fillStringWithInput(students[registeredStudents].name, 4);
    printf("%s ", "Enter start year (2009-2040):");
    year = askForNumber(2009, 2040);
    printf("%s ", "Enter start semester (0=Autumn/1=Spring):");
    semester = askForNumber(0, 1);
    printf("%s ", "Enter GPA (0-255):");
    gpa = askForNumber(0, 255);
    students[registeredStudents].data = (year - 2009) + (32 * semester) + (64 * gpa);
    printf("Student 's%04d %s' was added to database.\n", registeredStudents, students[registeredStudents].name);
    registeredStudents++;
}

//Deletes a student from the list.
void deleteStudent() {
    int i, id;
    if (registeredStudents > 0) {
        printf("Enter student number (0 to %d): ", registeredStudents - 1);
        id = askForNumber(0, 9999);
        char name[5];
        strcpy(name, students[id].name);
        printf("%ss%04d %s%s", "Delete student '", id, name, "'? (y/n) ");
        // Asks for which student to delete and confirmation.
        if (!askForBoolean()) return;
        for (i = id; i < registeredStudents; i++) {
            students[i] = students[i + 1];
        }
        registeredStudents--;
        printf("%ss%04d %s%s\n", "Student '", id, name, "' was removed.");
    } else {
        printf("%s\n", "There's no students in the database!\a");
    }
}

void generateRandomDatabase() {
    const char * alphabet = "abcdefghijklmnopqrstuvvxyz";
    int i;
    for (i = 0; i < MAX_STUDENTS; i++) {
        int j;
        for (j = 0; j < 4; j++) {
            students[i].name[j] = alphabet[rand() % strlen(alphabet)];
            students[i].data = rand() % 16384;
        }
        students[i].name[0] = toupper(students[i].name[0]);
        students[i].name[4] = 0;
    }
    registeredStudents = MAX_STUDENTS;
}

// Updates / creates / overwrites the database file.
void writeToFile() {
    FILE *f;
    if ((f = fopen("cudb.db", "rb"))) {  // Checks if database file exists
        fclose(f);
        printf("%s", "Database file already exists. Overwrite? (y/n) ");
        if (!askForBoolean()) return;
    }
    // Writes the number of students and the students array to a binary file
    f = fopen("cudb.db", "wb");
    fwrite(&registeredStudents, sizeof(uint16_t), 1, f);
    fwrite(students, sizeof(student_t), registeredStudents, f);
    fclose(f);
    printf("Database saved to 'cudb.db'.\n");
}

void readFromFile() {
    FILE *f;
    if ((f = fopen("cudb.db", "rb"))) {
        fread(&registeredStudents, sizeof(uint16_t), 1, f);
        fread(students, sizeof(student_t), registeredStudents, f);
        fclose(f);
        printf("Database file 'cudb.db' loaded.\n");
    } else {
        printf("Database file does not exist!\n");
    }
}
