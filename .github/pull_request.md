## Summary
In the current version of this repository we use jwt token for login with no expiration date.

`server/controllers/auth.controllers.js`
```javascript
const token = jwt.sign({
    _id: user._id
}, config.jwtSecret) // no expiration date
```
This result to user get logged in for indefinete time unless the user itself logout of the system. It's advisable to use token expiration so that system can recheck user authenticity.

## Fixes
- Create a new field `refreshToken` in `user.model.js` (which store a hash jwt token with 7 days exiration limit)
- Modified current jwt token with expiration time 5m in `server/controllers/auth.controllers.js`
- For `/auth/signin` post request the frontend will receive refreshToken as response body and accessToken in response cookie.
- Created a new api route [GET] `/auth/refresh` which will send a new accessToken when the current token get expired.

