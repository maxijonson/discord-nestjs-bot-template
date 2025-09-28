# FAQ

Here are some questions you may have when working with this template (or just NestJS, Necord and DiscordJS in general).

## I'm getting an `UnknownDependenciesException`, but I'm pretty sure I correctly registered the injected provider. What gives?

Make sure the `import` of your injected provider does not have a `type` keyword in front of it.
This is a common mistake that can lead to this error.
For example, you can reproduce this error by changing the following line in [`config-set.command.ts`](../src/commands/handlers/config/config-set.command.ts) from:

```diff
-import { ConfigEditCommandGroup, ConfigCommand } from "./config.command";
+import { ConfigEditCommandGroup, type ConfigCommand } from "./config.command";
```

You'll get the following error when trying to run the command:

```
UnknownDependenciesException [Error]: Nest can't resolve dependencies of the ConfigSetCommand (?). Please make sure that the argument Function at index [0] is available in the CommandsModule context.
```

Removing the `type` keyword will fix the issue.

> Fun fact: I'm using this example because this is exactly what happened to me while writing the config command and it was driving me nuts for a while!

## How do I mention a command/user/role/channel in an interaction response?

See [Message Formatting](https://discord.com/developers/docs/reference#message-formatting)
