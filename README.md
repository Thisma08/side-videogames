# Comment créer une application full stack simple
***
## 1. Créer le dossier racine du projet
***
## 2. Création d'une base de donnéer SQL Server
### 2.1. Créer le container Docker
#### 2.1.1. Lancer Docker Desktop
#### 2.1.2. Lancer cmd et y taper la commande suivante:
`docker run --name="SQLServer" -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=yourStrong(!)Password" -p 1433:1433 -v M:/SQL/data:/var/opt/mssql/data -v M:/SQL/log:/var/opt/mssql/log -v M:/SQL/secrets:/var/opt/mssql/secrets -d mcr.microsoft.com/mssql/server:2022-latest`

Cela va créer un container SQL Server.

Le port doit être défini sur 1433 (Port par défaut de SQL Server)

![docker_run_sql_server](https://files.catbox.moe/ewk24v.png)

**Remarque:**
Si erreur de type:
![port_already_allocated_error](https://files.catbox.moe/jcrvyz.png)
=> Regarder les containers en cours d'exécution et arrêter ceux ayant le même port (Dans ce cas 1433).
#### 2.1.3. Ouvrir SQL Server Management Studio (SSMS)
#### 2.1.4. Se connecter au container
Veiller à ce que le container est en cours d'exécution, que l'ip est sur 127.0.0.1 (Localhost), que le port est bien 1433 et que le mot de passe utilisé est le même que celui précisé dans la commande "docker run":

![connexion_ssms](https://files.catbox.moe/l8ps4z.png)

**Remarque:**
Si erreur de type `Login failed for user "sa"`
=> Se rendre dans "Computer Management" (Taper "Computer Management" dans la barre de recherche de Windows) > "SQL Server Configuration Manager" > "SQL Server Services":

![computer_management_sql_server](https://files.catbox.moe/r1xqya.png)

Arrêter la ou les instance(s) locale(s) de SQL Server en cours d'exécution:

![stopped_sql_server_instance](https://files.catbox.moe/ms8ql6.png)

#### 2.1.5. Créer la base de données

Une fois connecté, cliquer sur "New Query" et créer une nouvelle base de données:
![new_database](https://files.catbox.moe/214sbz.png)

***
## 3. Backend
### 3.1. Lancer Rider
### 3.2. Créer un projet avec le template "Web API" dans le dossier racine:
![create_web_api_project](https://files.catbox.moe/nqh6jz.png)
### 3.3. Créer un dossier "Data" dans le projet et une classe "DbContext" dans celui-ci:
![create_data_drectory_and_dbcontext_class](https://files.catbox.moe/21clcl.png)