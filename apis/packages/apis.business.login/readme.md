
## APIS.BUSINESS.LOGIN

Logic and components related to Login.

### Security Issues

We are working with Json WebTokens to operate with the API. After login, you'll receive a token to add in every request.

For security reasons all personal data is encrypted with AES (name, surname, email, etc...). It only apply to `production` environment.
In `development` user's personal is stored without encryption. Obviously, for debug purpose. 

Field: 
    login -> just obfuscation
    password -> hash
    Other fields -> AES

Be aware ENV variables: 
    - PASSWORD_SALT
    - PASSWORD_JWT
    - PASSWORD_AES 

Have been filled correctly in .env file.




