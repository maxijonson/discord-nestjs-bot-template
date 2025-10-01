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

## I edited a command file, but the changes are not reflected when I use the command in Discord. Why?

First of all, try to reload Discord (Hit `Cmd+R` / `Ctrl+R` or close and reopen the app). The commands could be cached on your side only.

If that doesn't work and you are writing a global command (`@SlashCommand` without `guilds` property), keep in mind that global commands can take up to an hour to propagate (See [Global Commands](https://necord.org/interactions/slash-commands#global-commands)).
You can set the `DISCORD_DEVELOPMENT_GUILD_ID` environment variable with the server ID you are using for testing for instant propagation of your commands to that server (See [Dev Mode](https://necord.org/start#module-setup)).

## I have components with different custom IDs, but the wrong component handler is being called. Why?

This is likely due to the fact that you are using a colon (`:`) in your custom IDs. Discord.js (and by extension, Necord) uses colons for dynamic parameters in custom IDs. For example, two buttons, one with custom ID `vote:yes` and another with `vote:no`, would both match a handler decorated with `@Button("vote:response")`, where `response` would be either `yes` or `no` depending on which button was clicked. You can't have `@Button("vote:yes")` and `@Button("vote:no")` because both would match the first handler.

Instead, use a different separator, such as a slash (`/`). For example, `vote/yes` and `vote/no` would work fine with `@Button("vote/yes")` and `@Button("vote/no")`.
