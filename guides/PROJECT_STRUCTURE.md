# Project Structure

This guide explains the project structure of the template and the reasoning behind it. You're free to change the structure to whatever suits your needs, but it's recommended to stick to this structure as much as possible to keep your code organized and maintainable.

## File Structure

> While you can change the structure to whatever suits your needs, note that keeping the current structure will allow you to use certain convenience [scripts](./SCRIPTS.md), like the `create:command` script, which relies on this structure to work properly.

The bot is organized into the following main folders (inside the `src` folder).

- `commands`: Contains all slash commands of the bot. (`@SlashCommand`)
- `listeners`: Contains all event listeners of the bot. (`@On`, `@Once`)

Each folder is a module responsible to aggregate all of their respective handlers (in their `handlers` folder). This brings dependencies closer together, instead of importing everything into the root `app.module.ts` file.

Each handler is in its own file, following the Single Responsibility Principle. This keeps files small and focused, making them easier to read and maintain. Their name contains the type of handler (e.g: `ping.command.ts`, `ready.event.ts`). This makes it easier to find specific handlers (in VS Code, for example, when using the `Go to File...` command).

Handlers are then imported and provided in their respective module file (e.g: `commands.module.ts`, `listeners.module.ts`). You'll find a `HANDLERS` array in each module file, which is a list of all the handlers in that module. This makes it easy to see all the handlers in one place and to add new ones.

## Environment variables

Environment variables are strongly typed using a Zod schema. This ensures that all required environment variables are present and have the correct type at runtime, otherwise the app will refuse to start in an incorrect state. You can add new environment variables to the schema in [`src/env/env.ts`](../src/env/env.ts).

Environment variables can be accessed from anywhere in the app by using the `EnvService` provider.

```ts
import { EnvService } from "../env/env.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SomeService {
  constructor(private readonly envService: EnvService) {}

  someMethod() {
    const value = this.envService.get("SOME_ENV_VARIABLE");
  }
}
```

If you need to access environment variables outside of a NestJS context, you can use `process.env` directly. However, note that all environment variables are always strings when accessed this way, so you'll need to parse them to the correct type manually.

```ts
const someValue = process.env.SOME_ENV_VARIABLE; // string | undefined
const someNumber = Number(process.env.SOME_NUMBER_VARIABLE); // number | NaN
const someBoolean = process.env.SOME_BOOLEAN_VARIABLE === "true"; // boolean
```
