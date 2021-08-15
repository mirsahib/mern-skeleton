## What?
Refresh Tokens are credentials used to obtain access tokens. Refresh tokens are issued to the client by the authorization server and are used to obtain a new access token when the current access token becomes invalid or expires, or to obtain additional access tokens with identical or narrower scope

## Why?
In the current version of this project the jwt token has no expiration date which means if the token is stolen malacious user can access the system without requiring any user credential.

`server/controllers/auth.controllers.js`
```javascript
const token = jwt.sign({
    _id: user._id
}, config.jwtSecret)
```


## How?
## Testing?
## Screenshots (optional)
## Anything Else?