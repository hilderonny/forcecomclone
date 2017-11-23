# Creating modules

Modules are loaded automatically by the application. For that the application must be initialiazed with `app.init()` where you define the `modulePath` which contains the source files for the modules.

Each module you want to define must reside in a separate ts-file and must be of the following structure.

```typescript
import { Module } from "../core/module";
export default Module.create((app) => {
    // Your module code comes here
})
```

The `app` parameter is a reference to the application itself and can be used to define APIs with `app.registerDefaultApi()`.

# Defining APIs

By default you have an entity type (like "user" or "document") and want to have some default actions like creating, editing and deleting them. For such easy use cases simply call `app.registerDefaultApi(EntityClassName)` in your module instanziation code block and the framework will create these default API actions for you.

| API Method | Description |
|-|-|
| GET /api/typename/ | List all entities of the given typename. When no entities of the given typename exist, an empty array is returned |
| GET /api/typename/:id | Retrieve an antity with a given id. When there is no entity with the id in the database, a 404 error is returned |
| POST /api/typename | Creates a new entity and returns it including a newly generated id |
| PUT /api/typename/:id | Update an entity with the given id. Only those attributes of the entity are updated which are set in the request body, all others keep untouched. When there is no entity with the id in the database, a 404 error is returned |
| DELETE /api/typename/:id | Deletes an entity of the given id. By default no dependency checks are performed. When there is no entity with the id in the database, a 404 error is returned |

## Extending API default behaviour

Sometimes you need to do special checks before an API function is performed. For example such checks can be unique constraint checks or dependency checks like the following examples. Or you need to filter the results sent back to the client.

### Uniqueness check

Assume that you want to create an API for users and want to make sure, that the user's names are unique. For this purpose you would define a `beforePost` check for the users API:

```typescript
app.registerDefaultApi(User, {

    beforePost: async (req, res, next) => {
        // Extract the posted user from the request
        let user = req.body as User
        // Find an user with the same name in the database
        let existingUser = await app.db.findOne(User, { name : user.name } as User)
        // When there is an user with the same name, abort the request with an error code
        if (existingUser) {
            res.sendStatus(409) // Conflict
        } else {
            // Proceed with the default API behaviour
            next()
        }
    }

})
```

```typescript
app.registerDefaultApi(UserGroup, {

    beforeDelete: async (req, res, next) => {
        let id = req.params.id
        // Find users shich are assigned to the usergroup
        let count = await app.db.count(User, {usergroupid:req.params.id})
        // When there is any user assigned to the usergroup, abort the request with an error code
        if (count > 0) {
            res.sendStatus(403) // Forbidden
        } else {
            // Proceed with the default API behaviour
            next()
        }
    }

})
```

### Result filter

When retrieving users from the database it is a bad idea to propose their passwords to the requester. So you need to remove them from the database result before sending them to the client. For this you can use the `filter`... functions.

```typescript
app.registerDefaultApi(User, {

    // Removes the password from the returned user
    filterGetId: (user: User) => {
        delete user.password
        return user
    }

}
```