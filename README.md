# code explanation


# Step 5.1 : authController.js
---------------------------------
- backend/controllers/authController.js

Is controller ke do main functions honge:
- register — new student/admin account create karna.
- login — credentials verify karke JWT token return karna.

```js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
```

Inka use:
- User: MongoDB mein user find/create karne ke liye.
- bcrypt: password hash aur verify karne ke liye.
- jsonwebtoken: login ke baad token generate karne ke liye.


2. Registration ka flow
register function likhte waqt ye steps follow karo:
1. req.body se name, email, password, role, rollNumber aur semester lo.
2. Check karo ki required fields available hain.
3. Check karo ki email pehle se registered toh nahi hai.
4. Agar role student hai, toh roll number aur semester validate karo.
5. Password ko bcrypt.hash() se hash karo.
6. User model se user create karo.
7. HTTP 201 response return karo. Password response mein kabhi mat bhejna.


3. Login ka flow
login function mein:
1. Email aur password request se lo.
2. Email se user search karo.
3. bcrypt.compare() se password verify karo.
4. Agar credentials galat hain, toh 401 response do.
5. jwt.sign() se token generate karo, jisme user ID aur role ho.
6. Token aur safe user details return karo.


- JWT generate karne ke liye pehle banayi hui .env file mein JWT_SECRET set hona chahiye.



