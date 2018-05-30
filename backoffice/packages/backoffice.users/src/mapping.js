
import user from './userModel'

export const userFromApiToModel = (userApi) =>
{
    const result = new user();

    result.Id = userApi.id;
    result.Name = userApi.name;
    result.Surname = userApi.surname;
    result.Email = userApi.email; 

    return result;

}

export const userFromModelToApi = (user) =>
{
    const result = {
        id: user.Id,
        name: user.Name,
        surname: user.Surname,
        email: user.Email
    }
    return result;
}

export const listOfUserFromApiToModel = (usersApi) =>
{
    return usersApi.map ( x=> userFromApiToModel(x) )
}

export const listOfUserFromModelToApi = (users) =>
{
    return users.map ( x=> userFromModelToApi(x) )
}