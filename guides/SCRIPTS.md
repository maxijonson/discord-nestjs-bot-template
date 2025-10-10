# Scripts

This template comes with NPM scripts that help you automate some tasks, like creating new commands.

## Development Mode

Runs the bot in development mode, with hot-reloading on file changes. This is the script you will use the most during development.

```bash
npm run dev
```

## Build for Production

Builds the bot for production. The output files are placed in the `dist/` folder.

```bash
npm run build
```

## Start the Bot in Production Mode

Runs the built bot in production mode. Make sure to run `npm run build` first.

```bash
npm start
```

## Lint the Code

Runs ESLint to check for code style and potential errors in the `src/` folder.

```bash
npm run lint
```

## Format the Code

Formats the code in the `src/` folder using Prettier.

```bash
npm run format
```

## Create a New Command

Creates a new command in the `src/commands/handlers/` folder and updates the `CommandsModule` to include it. You need to provide the command name in kebab-case (e.g., `my-command`). You can also optionally provide a description for the command.

> This script has the following assumptions. If one of them does not hold true, the script may not work as expected:
>
> - Your commands are located in `src/commands/handlers/`
> - In `src/commands/commands.module.ts`, there is a variable named `HANDLERS`, which is an array that contains all command providers.

```bash
npm run create:command -- <command-name> [--description "Command description"]
```

The `command-name` should use kebab-case (e.g., `my-command`). You can also create commands in subfolders of the `handlers` folder by using slashes in the name (e.g., `admin/kick-user`).

## Create a New Listener

Creates a new listener in the `src/listeners/handlers/` folder and updates the `ListenersModule` to include it. You need to provide the listener name in kebab-case (e.g., `my-listener`). You can also optionally provide a description for the listener.

> This script has the following assumptions. If one of them does not hold true, the script may not work as expected:
>
> - Your listeners are located in `src/listeners/handlers/`
> - In `src/listeners/listeners.module.ts`, there is a variable named `HANDLERS`, which is an array that contains all listener providers.

The `<discord-event>` argument should be one of the events from the [Discord.js ClientEvents](https://discord.js.org/docs/packages/discord.js/14.23.2/ClientEvents:Interface) (check latest version, this link may be outdated!). This will ensure that the listener method has the correct parameters for the event. When generating the file, the script will also add the appropriate context parameter names based on the event.

```bash
npm run create:listener -- <listener-name> <discord-event>
```
