# debt-tracker

The name is pretty self explanatory.

You track what you borrowed. (also what other people borrowed from you)

Especially helpful if you're forgetful.

#API Documentation
## Authentication API

The Authentication API allows you to authenticate users and manage user sessions.

#### Check Username

Checks if a username is available for registration.

- URL: `/auth/checkUsername/:username`
- Method: GET

#### URL Params

- `username`: The username to check.

#### Success Response

- Code: 200
- Content: `{ "message": "Username is available." }`

#### Error Responses

- Code: 400
- Content: `{ "message": "Please enter a username." }`

- Code: 400
- Content: `{ "message": "Username must be at least 3 characters long." }`

- Code: 400
- Content: `{ "message": "Username already exists." }`

- Code: 500
- Content: `{ "message": "Internal server error." }`

## Register User

Registers a new user account.

- URL: `/auth/signup`
- Method: POST

#### Request Body

- `name`: The name of the new user.
- `username`: The username for the new user.
- `email`: The email address for the new user.
- `password`: The password for the new user.

#### Success Response

- Code: 201
- Content: `{ "user": UserInterface, "token": string }`

#### Error Responses

- Code: 400
- Content: `{ "message": "Please enter all fields." }`

- Code: 400
- Content: `{ "message": "Please enter a valid email address." }`

- Code: 400
- Content: `{ "message": "Email already exists." }`

- Code: 400
- Content: `{ "message": "Username must be at least 3 characters long." }`

- Code: 400
- Content: `{ "message": "Username can only contain letters and numbers." }`

- Code: 400
- Content: `{ "message": "Password must be at least 6 characters long." }`

- Code: 400
- Content: `{ "message": "Password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol." }`

- Code: 400
- Content: `{ "message": "Username already exists." }`

- Code: 500
- Content: `{ "message": "Internal server error." }`

## Login User

Authenticates a user and returns a JWT token.

- URL: `/auth/signin`
- Method: POST

#### Request Body

- `usernameOrEmail`: The username or email address of the user to authenticate.
- `password`: The password of the user to authenticate.
- `remember`: A boolean indicating whether to remember the user's session. If it is set to true, token will be valid for 7 days otherwise for 2 hours.

#### Success Response

- Code: 201
- Content: `{ "user": UserInterface, "token": string }`

#### Error Responses

- Code: 401
- Content: `{ "message": "Invalid credentials." }`

- Code: 500
- Content: `{ "message": "Internal server error." }`


