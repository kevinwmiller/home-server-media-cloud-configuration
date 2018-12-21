OC.L10N.register(
    "password_policy",
    {
    "Password needs to be at least %s characters long" : "Лозинка мора да има бар %s карактера",
    "Password needs to contain at least one lower and one upper case character." : "Лозинка мора да има бар једно мало и бар једно велико слово.",
    "Password needs to contain at least one numeric character." : "Лозинка мора да има бар једну цифру.",
    "Password needs to contain at least one special character." : "Лозинка мора да садржи бар један специјални карактер.",
    "Password is among the 1,000,000 most common ones. Please make it unique." : "Лозинка је међу 1.000.000 најкоришћенијих лозинки. Одаберите неку мало јединственију.",
    "Password is present in compromised password list. Please choose a different password." : "Лозинка је међу најчешће проваљеним лозинкама. Одаберите неку другу.",
    "Password policy" : "Правила за лозинке",
    "Allows admins to configure a password policy" : "Дозвољава администраторима да подесе правила за лозинке",
    "Allow admin to define certain pre-conditions for password, e.g. enforce a minimum length" : "Дозвољава администраторима да дефинишу одређене предуслове за лозинке, нпр. да захтевају минималну дужину",
    "Minimal length" : "Минимална дужина",
    "Forbid common passwords" : "Забрани честе лозинке",
    "Enforce upper and lower case characters" : "Захтевај употребу и малих и великих слова",
    "Enforce numeric characters" : "Захтевај употребу цифри",
    "Enforce special characters" : "Захтевај употребу специјалних карактера",
    "Check password against the list of breached passwords from haveibeenpwned.com" : "Провери лозинке на листи најчешће проваљиваних лозинки на сајту haveibeenpwned.com",
    "This check creates a hash of the password and sends the first 5 characters of this hash to the haveibeenpwned.com API to retrieve a list of all hashes that start with those. Then it checks on the Nextcloud instance if the password hash is in the result set." : "Ова провера прави хеш лозинке и шаље првих 5 карактера хеша на haveibeenpwned.com да дохвати све хешеве који почињу исто тако. Онда проверава на Некстклауд инстанци да ли је Ваш хеш у листи враћених хешева.",
    "Check password against the list of breached passwords from haveibeenpwnd.com" : "Провери лозинке на листи најчешће проваљиваних лозинки на сајту haveibeenpwnd.com"
},
"nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);");
