# React Framework(name must be changed)

### What is it?

An attempt to create a framework over React (like NextJs), but using rspack instead of webpack and using BunJs.

And make it different from NextJs, even make it more easier to use.

### Getting started

#### Install

```bash
bun install
```

#### Run in dev mode

You need to run the client and server first

This command will start the client in dev mode and creates the routes.ts file that is needed to handle the routes in the app

```bash
bun run dev:client
```

And then:

```bash
bun run dev:server
```

<br />

And then you can start using the app like a normal react app.

Project is using directory-based routing to handle the routes.

Every page/route goes inside ./pages folder with the file named page.tsx
