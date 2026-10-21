Create backend/routes/authRoutes.js

Is file mein  do routes define karne hain:
Method	            Endpoint	                     Purpose
POST	            /api/auth/register	        Student registration
POST	            /api/auth/login	            Login and JWT generation


```js

const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

// TODO 1: Connect POST /register to register controller

// TODO 2: Connect POST /login to login controller

module.exports = router;

```

Hints
- router.post() HTTP POST endpoint create karta hai.
- First argument route path hota hai.
- Second argument controller function hota hai.
- /register aur /login ko yahan define karna hai; /api/auth prefix hum server.js mein add karenge.

