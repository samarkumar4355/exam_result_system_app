# step 2.1 : Register

```js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        // Step 1: Get the required fields from req.body

        // Step 2: Check whether required fields are missing

        // Step 3: Check whether the email already exists

        // Step 4: Hash the password using bcrypt.hash()

        // Step 5: Create the user using the User model

        // Step 6: Return status 201 with safe user details
        // Never return the password or password hash
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { register };

```


Explanation for each step to write code :

Implement the steps
1. Read the form data

- Express provides request data through req.body. Use destructuring to get name, email, password, role, rollNumber, and semester.

2. Validate the input

- Use an if statement to reject missing required fields. Student accounts need a roll number and semester; admin accounts don't.

3. Check duplicate email

- Use User.findOne() to check whether the email is already registered. If it exists, return HTTP 409 Conflict.

4. Hash the password
```js
const hashedPassword = await bcrypt.hash(password, 10);
```

The 10 is the bcrypt cost factor.

5. Create the user
- Use ```js User.create()``` with the validated fields and hashedPassword as the password value. Don't save the original password.

6. Return the response

- Return HTTP 201 Created and safe account details, excluding the password hash.

**One security point:** -  don't allow anyone to register as an admin just by sending "role": "admin" from the frontend. For public registration, force the role to "student"; create admin accounts through a controlled setup or seed script.




# Step 2.2 : Login

```js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        // Step 1: Get email and password from req.body

        // Step 2: Check whether email and password are missing

        // Step 3: Find the user by email

        // Step 4: Verify the password using bcrypt.compare()

        // Step 5: Generate a JWT token using jwt.sign()

        // Step 6: Return status 200 with the token and safe user details
        // Never return the password or password hash

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { login };

```

Explanation for each step
Step 1. Read the form data

- Login form se email aur password receive karo using req.body destructuring.

Step 2. Validate the input

- Check karo ki email aur password provided hain. Agar koi missing hai, toh 400 Bad Request return karo.

Step 3. Find the user

- User.findOne() se email ke basis par user search karo. Email lookup se pehle trim() aur toLowerCase() use karna helpful hai.

Agar user nahi milta, toh 401 Unauthorized response do
```js

return res.status(401).json({
    message: "Invalid email or password"
});
```

Step 4. Verify the password

```js

const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
);
```

- password user ka entered password hai.
- user.password database mein stored hash hai.
- Agar password match nahi karta, toh 401 Unauthorized return karo.


Step 5. Generate the JWT token
```js

const token = jwt.sign(
    {
        id: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

```

JWT_SECRET tumhari backend .env file mein configured hona chahiye. Token baad mein protected API routes par user ki identity aur role verify karne ke kaam aayega.

Step 6. Return the response

Successful login par 200 OK return karo. Response mein ye information honi chahiye:
- Success message
- JWT token
- User ID
- Name
- Email
- Role


Password aur password hash response mein include mat karna.


Example response structure:
```js

return res.status(200).json({
    message: "Login successful",
    token: token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
});

```


**Important note**
Tumhare authController.js mein agar register aur login dono functions hain, toh file ke end mein dono export hone chahiye:

```js
module.exports = { register, login };
```
