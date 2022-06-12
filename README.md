### Appointment Mangement Backend (API)

#### API Documentation

-   https://documenter.getpostman.com/view/254034/Uz5NjtDp

#### URL

```
Local URL
http://localhost:3000/
```

#### Description

-   Use JWT for API authentication.
-   Use Express JS for the Node.js framework.
-   Use MongoDB as a database.

#### Setup Instruction

1. Clone the repo or download the repo.
```
git clone https://github.com/muhdfaiz/appointment-backend.git
```
<br>

2. Install NPM packages.
```
npm install
```
<br>

3. Rename `.env.example` to `.env`. Update config like MongoDB host, port and database name/
<br>

4. Create MongoDB database. Connect to MongoDB CLI and run command below

```
use appointments
db.createCollection("users")
db.createCollection("appointments")
```

5. Run application

```
Dev Mode
npm run dev

Prod Mode
npm run prod
```
