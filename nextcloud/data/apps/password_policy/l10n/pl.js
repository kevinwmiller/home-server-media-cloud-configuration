OC.L10N.register(
    "password_policy",
    {
    "Password needs to be at least %s characters long" : "Hasło musi zawierać co najmniej %s znaków",
    "Password needs to contain at least one lower and one upper case character." : "Hasło musi zawierać co najmniej jedną małą oraz wielką literę.",
    "Password needs to contain at least one numeric character." : "Hasło musi zawierać co najmniej jeden znak numeryczny.",
    "Password needs to contain at least one special character." : "Hasło musi zawierać co najmniej jeden znak specjalny.",
    "Password is among the 1,000,000 most common ones. Please make it unique." : "Hasło jest jednym z 1.000.000 najczęściej używanych haseł. Proszę wybrać inne.",
    "Password is present in compromised password list. Please choose a different password." : "Hasło jest obecne na liście haseł skompromitowanych. Wybierz inne hasło.",
    "Password policy" : "Polityka haseł",
    "Allows admins to configure a password policy" : "Zezwala administratorom na konfigurowanie zasad haseł.",
    "Allow admin to define certain pre-conditions for password, e.g. enforce a minimum length" : "Zezwala administratorowi na definiowanie określonych warunków wstępnych dla hasła, np. wymuszenie minimalnej długości",
    "Minimal length" : "Minimalna długość",
    "Forbid common passwords" : "Zabroń takich samych haseł",
    "Enforce upper and lower case characters" : "Wymuś wielkie i małe litery",
    "Enforce numeric characters" : "Wymuś znaki numeryczne",
    "Enforce special characters" : "Wymuś znaki specjalne",
    "Check password against the list of breached passwords from haveibeenpwned.com" : "Sprawdź hasło z listą naruszonych haseł na hasibeenpwned.com",
    "This check creates a hash of the password and sends the first 5 characters of this hash to the haveibeenpwned.com API to retrieve a list of all hashes that start with those. Then it checks on the Nextcloud instance if the password hash is in the result set." : "Ten test tworzy skrót hasła i wysyła 5 pierwszych znaków tego skrótu do API haveibeenpwned.com, aby pobrać listę wszystkich skrótów, które zaczynają się od nich. Następnie sprawdza w instancji NextCloud czy skrót hasła jest w zestawie wyników.",
    "Check password against the list of breached passwords from haveibeenpwnd.com" : "Sprawdź hasło z listą naruszonych haseł na hasibeenpwned.com"
},
"nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);");
