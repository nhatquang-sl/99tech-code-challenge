- [How to run](#how-to-run)
- [Folder Structure](#folder-structure)
   * [application](#application)
   * [controllers](#controllers)
- [Libraries:](#libraries)

# How to run
- Using node version v20.19.5
- `npm i`: run at the root folder to install dependencies
- `npm run p5`: run at the root folder to start

# Folder Structure
```text
problem5/
├── application/
├── config/
├── controllers/
├── database/
└── index.ts 
```
There are two main folders that we need to focus on: **application** and **controllers**.

## application
- The application folder is where we isolate all our use cases and other logic such as logging and performance.
- With this folder, our logic is independent of the infrastructure, meaning it can run anywhere for example, in a web API or a worker that listens to a message queue.
- Each use case is isolated in its own folder, which contains everything related to a specific piece of logic, such as the request, handler, validator, and unit tests.
- Besides that, I am also using the mediator pattern, so we can have our middlewares implemented as behaviors, such as **PerformanceBehavior** and **RequestLoggingBehavior**.

## controllers
- The controllers folder is where we expose our logic as Web APIs.
- The main responsibility of a controller is to parse the HTTP request and map it to the corresponding application request.

# Libraries:
- `tsconfig-paths`: load modules whose location is specified in the paths section of tsconfig.json or jsconfig.json. Both loading at run-time and via API are supported.
- `tsc-alias`: replace alias paths with relative paths after typescript compilation. Compile time (no runtime dependencies)