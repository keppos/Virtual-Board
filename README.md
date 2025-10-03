# Virtual Board

Projektet går ut på att skapa en virtuell whiteboard som man kan använda för kollaborativt arbete som projektplanering, brainstorming, minnesanteckningar eller liknande.

Det finns massvis med kommersiella lösningar (kolla in Padlet, Jamboard, Miro, Mural etc för att hämta inspiration) men nu har vi chansen att skapa en egen app som funkar som vi vill och inte gnäller om betalning och annat!

Ett enkelt exempel kunde se ut ungefär så här: <img src="/assets/images/uppgift.png" width="300">

## Del 1 – API för inloggning och användaruppgifter (10p)

Använd t.ex. Node + Express för att koda denna del.
Använd valfri databas. Utomstående SQL-tjänster som Neon, Aiven PostgreSQL.
Använd ORM/ODM för databashantering, Prisma rekommenderas (Drizzle, Mongoose, Sequelize eller annan liknande funkar också)
Ha en endpoint för skapande av ny användare (POST) som tar emot att användarnamn och lösenord, saltar+hashar lösenordet (använd t.ex. bcrypt), och sparar alltihop i databasen.
Ha en endpoint för inloggning (POST) som tar emot användarnamn och lösenord
Lyckad lösenordsautentisering ska returnera en JWT-token
JWT:n ska innehålla allt som behövs för fortsatt användning av appen, alltså t.ex.vilka boards en viss användare har tillgång till
Ha en endpont boards/ som returnerar de boards en viss användare har tillgång till.
JWT ska skickas i en authorization-header enligt alla konstens regler
 

## Del 2 – REST-API för uppdatering och kollaborativt arbete (10p)

Skapa denna del i en skild repo så att den kan driftsättas skilt från inloggningstjänsten
Välj teknologi för API. REST är ok, men det är fritt fram att testa något annat (WebSocket, GraphQL, gRPC...)
Använd JWT (som fås från inloggningstjänsten i Del 1) för auktorisering
Använd valfri databas, behöver inte vara samma tjänst som i Del 1. Om ni använder samma tjänst, sätt ändå upp som en skild databas.
Det ska förutom GET gå att skapa nya noteringar  (POST) och ändra på gamla (PUT/PATCH), samt radera (DELETE). 
Felmeddelanden ska ge rätt statuskod
 

## Del 2b (BONUS) – Stöd för flera boards

I databasen för REST-API, skapa en tabell vid namn boards med kolumner för id och boardens namn
I tabellen för själva noteringarna, lägg till en relationskolumn för board_id 
I användardatabasen (Del 1), skapa relation till boards så att en användare kan ha åtkomst till flera boards. Detta kan göras med skild relationstabell (med två kolumner, board_id och user_id) eller som en kolumn i användartabellen med datatypen array för board_id
Ha en drop-down i frontend (Del 3) där man ser och kan välja mellan de boards man har rättighet till.
 

## Del 3 – Frontend-applikation (10p)

Använd client side HTML, CSS och JavaScript för att koda denna del, ramverk är tillåtna men vanlig javascript duger bra
Ha ett inloggningsformulär (för API:n i Del 1)
Förutom att skapa och uppdatera text ska det också gå att flytta på lapparna med drag-and-drop. Nya positionen kan uppdateras (PUT/PATCH) när man släpper upp musknappen.
Ha ett vettigt system för att GET:a alla ändringar som andra kan ha gjort. T.ex. vid något/olika events eller med setInterval()
Frontend kan vara i en egen repo eller som en statisk underkartalog i samma repo som Del 2. Diskutera fram en vettig lösning.

## Del 4 – Stil, logik och UX (10p)

Följ regler och guidelines gällande autentisering och auktorisering
Koda snygg och modern JS
Satsa på så bra UX som möjligt, fixa så att lapparna går att flytta med musen, ändra färg osv.
Ge vettiga felmeddelanden åt användaren!

## Del 5 – Driftsättning (5p)

Driftsätt API-delarna på en molntjänst som t.ex. CSC Rahti, Render, Azure eller AWS.
Driftsätt med docker: ha en Dockerfile i repon om molntjänsten sedan använder.
Frontend-appen behöver ingen server-side-teknologi så den kan driftsättas var som helst, t.o.m. people.arcada.fi. Det är förstås ok att driftsätta den i molnet också.
Det ska alltså finnas tre skilda driftsättnigar: en för inloggnings-API, en för själva Virtual Board REST-API, och en för frontend.