# Virtual Board - Auth API

Minimal authentication API för Virtual Board projektet (Del 1).

## Funktioner
- ✅ Användarregistrering med bcrypt-hashade lösenord
- ✅ Inloggning med JWT-tokens
- ✅ Skyddade endpoints med JWT-verifiering
- ✅ PostgreSQL databas via Prisma ORM

## Setup

### 1. Installera dependencies
```bash
npm install
```

### 2. Konfigurera databas
`.env` filen innehåller redan din Neon PostgreSQL connection string.

### 3. Kör Prisma migrations
```bash
npx prisma migrate dev --name init
```

### 4. Generera Prisma client
```bash
npm run prisma:generate
```

### 5. Starta servern
```bash
npm start
```

För development med auto-reload:
```bash
npm run dev
```

Servern körs på `http://localhost:3000`

## API Endpoints

### POST /register
Skapa ny användare.

**Request body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Användare skapad",
  "userId": 1,
  "username": "testuser"
}
```

### POST /login
Logga in och få JWT-token.

**Request body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Inloggning lyckades",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

### GET /boards
Hämta användarens boards (kräver JWT-token).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "userId": 1,
  "username": "testuser",
  "boards": []
}
```

## Testa API:t

Med curl:
```bash
# Registrera användare
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d "{\"username\":\"test\",\"password\":\"pass123\"}"

# Logga in
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"username\":\"test\",\"password\":\"pass123\"}"

# Hämta boards (använd token från login)
curl http://localhost:3000/boards -H "Authorization: Bearer <your-token>"
```

## Nästa steg
- Del 2: Skapa REST API för boards och notes
- Del 3: Bygg frontend
- Del 5: Driftsätt med Docker
