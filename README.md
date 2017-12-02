# Development setup

Install NodeJS (at least version 8.2.1) from http://nodejs.org.

Now prepare the folder containing the sources (e.g. D:\\gitlab\\avorium) and checkout the sources from GitLab in this directory.

```
git clone https://gitlab.com/avorium/arrange.git
```

Now you need to install some helper tools globally, which are used for compiling.

```
npm install -g typescript
```

# Application parts

The application is separated into the following parts. The development of each part is described behind the links.

- [User interface](src/client/README.md)
- [Server](src/server/README.md)
- [Database layer](src/server/README.md)
- [Tests](src/test/README.md)

# Debugging

Open the application root folder in Visual Studio Code, do an `npm install` and then click on `Debug` in the debug panel. This will start the server and watch the client side typescript files for changes so that webpack will recompile them instantly. Doing so you don't need to restart the server to see the client script changes in the browser.

# Best practices

* *Do not use private class members.* For unit testing it is easier to have public members so that you can mock (inject) another testing functionality. Declare in the comments, that a member variable or function should not be used from outside the class.