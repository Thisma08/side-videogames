# Comment créer une application full stack simple
***
## 1. Créer le dossier racine du projet
***
## 2. Création d'une base de données SQL Server
### 2.1. Créer le container Docker
#### 2.1.1. Lancer Docker Desktop
#### 2.1.2. Lancer cmd et y taper la commande suivante:
**(Si pas de container SQL Server créé)**

`docker run --name="SQLServer" -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=yourStrong(!)Password" -p 1433:1433 -v M:/SQL/data:/var/opt/mssql/data -v M:/SQL/log:/var/opt/mssql/log -v M:/SQL/secrets:/var/opt/mssql/secrets -d mcr.microsoft.com/mssql/server:2022-latest`

Cela va créer un container SQL Server.

Le port doit être défini sur 1433 (Port par défaut de SQL Server)

![docker_run_sql_server](https://files.catbox.moe/20j3kt.png)

**Remarque:**
Si erreur de type:
![port_already_allocated_error](https://files.catbox.moe/jcrvyz.png)
=> Regarder les containers en cours d'exécution et arrêter ceux ayant le même port (Dans ce cas 1433).
### 2.2. Créer la base de données sur le container
#### 2.2.1. Ouvrir SQL Server Management Studio (SSMS)
#### 2.2.2. Se connecter au container
Veiller à ce que le container est en cours d'exécution, que l'ip est sur 127.0.0.1 (Localhost), que le port est bien 1433 et que le mot de passe utilisé est le même que celui précisé dans la commande "docker run":

![connexion_ssms](https://files.catbox.moe/l8ps4z.png)

**Remarque:**
Si erreur de type `Login failed for user "sa"`
=> Soit le mot de passe est erroné, soit il faut se rendre dans "Computer Management" (Taper "Computer Management" dans la barre de recherche de Windows) > "SQL Server Configuration Manager" > "SQL Server Services":

![computer_management_sql_server](https://files.catbox.moe/r1xqya.png)

Arrêter la ou les instance(s) locale(s) de SQL Server en cours d'exécution:

![stopped_sql_server_instance](https://files.catbox.moe/ms8ql6.png)

#### 2.2.3. Créer la base de données

Une fois connecté, cliquer sur "New Query" et créer une nouvelle base de données:
![new_database](https://files.catbox.moe/214sbz.png)

#### 2.2.4. Créer une table dans la base de données et y insérer des données:
![new_table](https://files.catbox.moe/bpiez7.png)
***
## 3. Backend
### 3.1. Créer le projet
#### 3.1.1. Lancer Rider
#### 3.1.2. Créer un projet avec le template "Web API" dans le dossier racine:
![create_web_api_project](https://files.catbox.moe/nqh6jz.png)
### 3.2. Connection string
#### 3.2.1. Supprimer le contenu de appsettings.development.json
#### 3.2.2. Parametrer la connection string:
Y réécrire `localhost` et le numéro de port (Cela va pointer vers la container au port 1433 sur la machine), le nom de la base de données s'y trouvant (videogames_db), l'utilisateur (sa) et le mot de passe créé dans la commande d'exécution du container (yourStrong(!)Password). 

_appsettings.json_ :
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=videogames_bd;User=sa;Password=yourStrong(!)Password;TrustServerCertificate=true"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```
### 3.3. Parametrer le projet dans program.cs:

Ajouter CORS, les controllers, le contexte de la db et Swagger

_program.cs_ :
```csharp
using System.Configuration;
using VideogamesAPI.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var corsPolicyName = "AllowAllOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicyName, policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

builder.Services.AddDbContext<VideogamesContext>(cfg => cfg.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection")
));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDeveloperExceptionPage();
app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "BandesDessinees API V1");
    c.RoutePrefix = string.Empty;
});

app.UseCors(corsPolicyName);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
```
### 3.4. Contexte de la base de données
#### 3.4.1. Créer un dossier "Data" dans le projet et une classe "DatabaseContext" dans celui-ci:
![create_data_drectory_and_databasecontext_class](https://files.catbox.moe/y09wfa.png)
#### 3.4.2. Créer la classe DatabaseContext:

Ne pas oublier de la faire hériter de la classe `DbContext` de `EntityFrameworkCore` (`DatabaseContext : DbContext`).

_ContextDb.cs_:
```csharp
using Microsoft.EntityFrameworkCore;

namespace VideogamesAPI.Data;

public class DatabaseContext : DbContext
{
    public DbSet<Videogame> Videogames { get; set; }

    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
    }
}
 ```

#### 3.4.3. Créer la classe correspondant à l'/les entité(s) dans la base de données:

**Attention:** La créer en dehors de la classe `DatabaseContext`.

_ContextDb.cs_:
```csharp
public class Videogame
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Publisher { get; set; }
    public string Support { get; set; }
}
```

#### 3.4.4. Construire le modèle
**Attention:** Veiller à faire correspondre les noms de propriétés dans `.Property()` les noms de colonnes dans `.HasColumnName()` aux noms des colonnes dans la base de données.
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Videogame>().ToTable("videogames");
 
        modelBuilder.Entity<Videogame>()
            .Property(v => v.Title)
            .HasColumnName("title");
        
        modelBuilder.Entity<Videogame>()
            .Property(v => v.Publisher)
            .HasColumnName("publisher");

        modelBuilder.Entity<Videogame>()
            .Property(v => v.Support)
            .HasColumnName("support");
    }
```
### 3.5. Controllers
#### 3.5.1. Créer un dossier "Controllers" dans le projet et une classe "Controller" dans celui-ci:
![create_controllers_drectory_and_videogamecontroller_class](https://files.catbox.moe/nd6ws2.png)

#### 3.5.2. Configurer le comportement d'un controller ASP.NET Core API
Avant la classe `Controller`, ajouter:
```csharp
[Route("api/[controller]")]
[ApiController]
```
Puis faire hériter la classe de la classe `ControllerBase` de `Microsoft.AspNetCore.Mvc`:
`public class BandesDessineesController : ControllerBase`

```csharp
using Microsoft.AspNetCore.Mvc;

namespace VideogamesAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VideogameController : ControllerBase {
}
```

### 3.5.3. Implémenter les constructeurs
Définit le contexte de la base de données comme attribut du controller.
```csharp
private readonly DatabaseContext _context;

public VideogameController(DatabaseContext context)
{
    _context = context;
}
```

### 3.5.4. Implémenter les méthodes pour récupérer les infos sur la base de données
#### 3.5.4.1. Récupérer tout
```csharp
[HttpGet]
public async Task<ActionResult<IEnumerable<Videogame>>> GetVideogames()
{
    return await _context.Videogames.ToListAsync();
}
```

#### 3.5.4.2. Récupérer par id
```csharp
[HttpGet("{id}")]
public async Task<ActionResult<Videogame>> GetVideogames(int id)
{
    var v = await _context.Videogames.FindAsync(id);

    if (v == null)
    {
        return NotFound();
    }

    return v;
}
```

### 3.5.5. Implémenter la méthode pour créer une nouvelle entrée
```csharp
[HttpPost]
public async Task<ActionResult<Videogame>> PostVideogames(Videogame videogame)
{
    _context.Videogames.Add(videogame);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetVideogames), new { id = videogame.Id }, videogame);
}
```

### 3.6. Tester le backend
#### 3.6.1. Selectionner la configuration d'exécution _[nom_projet]: http_:
![run_config](https://files.catbox.moe/i3xpzb.png)

### 3.6.2. Changer l'environnement de _Development_ à _Production_:

Changer la valeur des balise `ASPNETCORE_ENVIRONMENT` en `Production`.

_launchsettings.json_:
```json
{
  "$schema": "http://json.schemastore.org/launchsettings.json",
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:53675",
      "sslPort": 44378
    }
  },
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "http://localhost:5278",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Production"
      }
    },
    "https": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "https://localhost:7075;http://localhost:5278",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Production"
      }
    },
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": true,
      "launchUrl": "swagger",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Production"
      }
    }
  }
}
```

### 3.6.3. Se rendre à l'url http://localhost:5278
Sur la page qui s'affiche, il est possible de tester les différents endpoints de l'API.

![swagger_ui](https://files.catbox.moe/mn8kr5.png)

**Remarque:** Lors du test de l'endpoint _POST_, il faut laisser l'id à 0, car il sera automatiquement généré.

![post_example](https://files.catbox.moe/lduo23.png)

Après exécution de _POST_, exécuter _GET_:

![get_result](https://files.catbox.moe/lszznc.png)

L'id du nouvel élément ajouté a bien été incrémenté.
***
## 4. Frontend
### 4.1. Créer le projet
#### 4.1.1. Lancer Rider
#### 4.1.2. Créer un projet avec le template "Web API" dans le dossier racine:





