# Utilities

This section covers various utility features provided by the template, including guards, interceptors, and filters that enhance the functionality and robustness of your Discord bot. You'll usually find these utilities in the `src/common` directory.

## `AppExceptionFilter`

> Source: [src/common/filters/app-exception.filter.ts](../src/common/filters/app-exception.filter.ts)

The `AppExceptionFilter` is a global exception filter that catches unhandled exceptions in your application. It logs the error and sends a generic error message to the user. This helps ensure that your bot doesn't crash unexpectedly and provides a better user experience.

If the error occurs during an interaction, the filter will attempt to reply to the interaction with an error message.

The filter automatically handles `InteractionError` instances (see below) and `DiscordAPIError` instances, providing user-friendly messages for common Discord API errors.

## `InteractionError`

> Source: [src/common/errors/interaction-error.ts](../src/common/errors/interaction-error.ts)

It's pretty common to want to send an error message back to the user when something goes wrong during an interaction. Usually, without `InteractionError`, you'll do something like this:

```ts
if (!userHasPermission) {
  if (interaction.isRepliable()) {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: "❌ You don't have permission to do that." });
      return;
    }
    await interaction.reply({ content: "❌ You don't have permission to do that.", flags: MessageFlags.Ephemeral });
  }
}
```

This is completely fine, but it can get repetitive and clutter your command handlers. Instead, you can throw an `InteractionError` to achieve the exact same effect, but in a cleaner way:

```ts
if (!userHasPermission) {
  throw new InteractionError("❌ You don't have permission to do that.");
}
```

## `RequiredBotPermission` Guard

> Source: [src/common/guards/require-bot-permission.guard.ts](../src/common/guards/require-bot-permission.guard.ts)

It's pretty common for bots to do things that typically require special permissions (e.g. deleting messages requires the `ManageMessages` permission). The `RequiredBotPermission` guard makes it easy to enforce that your bot has the necessary permissions to execute a command.

Instead of always checking for permissions in your handler, you can use the `@RequiredBotPermission` decorator. This saves you from always making "pre-flight" checks and keeps your command handlers cleaner.

You can also combine this guard with the `@RequiredMemberPermission` guard to ensure that both your bot and the user have the necessary permissions.

```ts
@RequiredBotPermission(PermissionFlagsBits.ManageMessages)
@SlashCommand(/* ... */)
async handle(@Context() [interaction]: SlashCommandContext) {
  // You can rest assured that the bot has the required permissions here
}
```

## `RequiredMemberPermission` Guard

> Source: [src/common/guards/require-member-permission.guard.ts](../src/common/guards/require-member-permission.guard.ts)

Exactly like the `RequiredBotPermission` guard, but for checking that the user invoking the interaction has the necessary permissions instead.

You can also combine this guard with the `@RequiredBotPermission` guard to ensure that both your bot and the user have the necessary permissions.

```ts
@RequiredMemberPermission(PermissionFlagsBits.ManageMessages)
@SlashCommand(/* ... */)
async handle(@Context() [interaction]: SlashCommandContext) {
  // You can rest assured that the user has the required permissions here
}
```
