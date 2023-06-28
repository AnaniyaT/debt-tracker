# debt-tracker

The name is pretty self explanatory.

You track what you borrowed. (also what other people borrowed from you)

Especially helpful if you're forgetful.

# API Documentation

# Response Objects

## UserInterface

An interface used to represent a user. Included in responses if the requesting user is the user itself.

#### Attributes

- `name`
- `username`
- `email`
- `password`: is always empty in responses
- `profilePicture`: as a string
- `bio`
- `amountOwed`: amount of money the user has lended to other users
- `amountOwing`: amount of money the user has borrowed from other users
- `debts`: a list containing the ids of active debts associated with the user
- `history`: a list containing the ids of paid (or declined if the user is the borrower but not if the user is the lender) debts associated with the user
- `_id`: id of the user

## Profile

Represents users but contains less information than userInterface

#### Attributes

- `name`
- `username`
- `email`
- `profilePicture`: as a string
- `bio`
-  `_id`: id of the user associated with this profile

## DebtInterface

An interface used to represent a debt

#### Attributes

- `lender`: id of the lending user
- `borrower`: id of the borrowing user
- `amount`
- `description`
- `requestedDate`: date object of when it was requested in UTC
- `approvedDate`: date object of when it was approved in UTC (present only if the debt has been approved)
- `declinedDate`: date object of when it was declined in UTC (present only if the debt has been declined)
- `paidDate`: date object of when it was confirmed to be paid in UTC (present only if the debt has been confirmed)
- `status`: is one of the following `'pending'`, `'approved'`, `'declined'` or `'paid'`
- `paid`: boolean value representing whether it has been paid or not (true for paid)
- `_id`: id of the debt

# Authentication

Allows the creation and authentication of user accounts.

## Check Username

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


# User

Allows managing users

## Get all users

Returns a list of users

- URL: `/user`
- Method: GET

#### Request Headers

- `authorization`: `bearer {token}`

#### Success Response

- Code: 200
- Content: `[ Profile ]`

## Get me

Returns a user object representing the requesting user

- URL: `/user/me`
- Method: GET

#### Request Headers

- `authorization`: `bearer {token}`

#### Success Response

- Code: 200
- Content: `UserInterface`

## Get user by id

Returns a profile object of the user with the provided id

- URL: `/user/id/:id`
- Method: GET

#### Request Headers

- `authorization`: `bearer {token}`

#### Request Params

- `id`: user id of the required user

#### Success Response

- Code: 200
- Content: `Profile`

## Get user by username

Returns a profile object of the user with the provided username

- URL: `/user/username/:username`
- Method: GET

#### Request Headers

- `authorization`: `bearer {token}`

#### Request Params

- `username`: username of the required user

#### Success Response

- Code: 200
- Content: `Profile`

## Edit Profile

Edit the profile of a user

- URL: `/user/edit`
- Method: PATCH

#### Request Headers

- `authorization`: `bearer {token}`

#### Request Body

All are optional. Only include ones you want to edit

- `username`
- `name`
- `email`
- `profilePicture` in string format

#### Success Response

- Code: 200
- Content: `UserInterface` of the new edited user

## Change Password

Allows to change the password of the requesting user

- URL: `/user/changePassword`
- Method: PATCH

#### Request Headers

- `authorization`: `bearer {token}`

#### Request Body

- `oldPassword`: The old password of the user
- `newPassword`: The new password the user wants to change to

#### Success Response

- Code: 200
- Content: `{ message: 'Password changed successfully.' }`

## Delete User

Allows to delete the account of the requesting user

- URL: `/user/delete`
- Method: DELETE

#### Request Headers

- `authorization`: `bearer {token}`

#### Success Response

- Code: 200
- Content: `{ message: 'User deleted successfully.' }`

# Debt

Managing debts

## Get Debts

Returns all the debts associated with the requesting user

- URL: `/debt`
- Method: GET

#### Request Headers

- `authorization`: `bearer {token}`

#### Success Response

- Code: 200
- Content: `[DebtInterface]`

## Get Debt by Id

Returns the debt with the given id

- URL: `debt/:id`
- Method: GET

#### Requirements

- Requesting user must be either the `borrower` or the `lender` of the debt

#### Request Headers

- `authorization`: `bearer {token}`

#### Request Params

- `id`: id of the requiered debt

#### Success Response

- Code: 200
- Content: `DebtInterface`

## Request Debt

Creates a debt request

- URL: `/debt/request`
- Method: POST

#### Request Headers

- `authorization`: `bearer {token}`

#### Request Body

- `lenderId`: id of the user the debt is being requested from (the lender)
- `amount`: amount of money
- `description`

#### Success Response

- Code: 200
- Content: `DebtInterface` of the newly created debt

## Approve debt

Allows to approve (accept) a debt request

- URL: `/debt/approve/:debtId`
- Method: PATCH

#### Requirements

- Requesting user must be  `lender` of the debt
- The status of the debt must be `'pending'`

#### Request Headers

- `authorization`: `bearer {token}`

#### Request Params

- `debtId`: id of the debt to be approved

#### Success Response

- Code: 200
- Content: `{ message: "Debt approved." }`

## Decline debt

Allows to decline a debt request

- URL: `/debt/decline/:debtId`
- Method: PATCH

#### Requirements

- Requesting user must be  `lender` of the debt
- The status of the debt must be `'pending'`

#### Request Headers

- `authorization`: `bearer {token}`

#### Request Params

- `debtId`: id of the debt to be declined

#### Success Response

- Code: 200
- Content: `{ message: "Debt declined." }`

## Confirm payment

Allows to confirm that the debt has been paid

- URL: `/debt/confirm/:debtId`
- Method: PATCH

#### Requirements

- Requesting user must be  `lender` of the debt
- The status of the debt must be `'approved'`

#### Request Headers

- `authorization`: `bearer {token}`

#### Request Params

- `debtId`: id of the debt to be confirmed

#### Success Response

- Code: 200
- Content: `{ message: "Debt paid." }`

## Delete a requested debt

Allows to delete a debt request that hasn't yet been approved

- URL: `/debt/deleteRequest/:debtId`
- Method: Delete

#### Requirements

- Requesting user must be  `borrower` of the debt
- The status of the debt must be `'pending'`

#### Request Headers

- `authorization`: `bearer {token}`

#### Request Params

- `debtId`: id of the debt to be deleted

#### Success Response

- Code: 200
- Content: `{ message: "Debt deleted." }`

## Delete an approved debt

Allows to delete a debt that has been approved

- URL: `/debt/deleteApproved/:debtId`
- Method: Delete

#### Requirements

- Requesting user must be  `lender` of the debt
- The status of the debt must be `'approved'`

#### Request Headers

- `authorization`: `bearer {token}`

#### Request Params

- `debtId`: id of the debt to be deleted

#### Success Response

- Code: 200
- Content: `{ message: "Debt deleted." }`







