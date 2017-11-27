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