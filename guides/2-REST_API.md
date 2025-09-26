# REST API Integration

> This template makes use of NestJS under the hood, which is actually primarily a web framework for building REST APIs! This template won't teach you how to build a NestJS application, since the focus is on building a Discord bot, not a web server. However, you'll find that [NestJS' docs](https://docs.nestjs.com/) are very well written and include a lot of examples to help solve common problems, such as authentication, validation, database integration, etc.
>
> 

By default, this template only assumes you want to build a Discord bot that can only be interacted with through Discord. Most bots don't need a REST API. However, if you want to make your bot interactive with an external web application or API, you can follow the steps below to enable the REST API functionality. Since this template is built with NestJS and NestJS is primarily a web framework, adding a REST API is very straightforward.

## Railway Configuration

After you've deployed your bot with Railway as suggested in the main README, you need to make a small change to your Railway project settings to allow incoming HTTP requests.

1. Go to your Railway project dashboard.
2. In the "Architecture" tab, click on your bot's service, then click on the "Settings" tab.
3. Under the "Networking" section, choose either "Generate Domain" to get a free Railway subdomain, or "Custom Domain" if you have your own domain name.
4. When prompted for the port, you may choose whatever port you want. If you're not sure, just use `3000`, which is a common default port for NestJS applications.
5. (Optional) Under the "Deploy" section, you can set a health check path, e.g. `/health`. (you'll need to implement this endpoint yourself to return a `200 OK` response to Railway).

## Add a port listener

1. Open the `src/main.ts` file.
2. Uncomment the line that starts with `await _app.listen(...)` to enable the REST API listener.
    ```diff
    - const _app = await NestFactory.create(AppModule);
    - // await _app.listen(process.env.PORT ?? 3000);

    + const app = await NestFactory.create(AppModule);
    + await app.listen(process.env.PORT ?? 3000);
    ```
3. (Optional) Change the port number if you want to use a different port than `3000`.
4. Save the file.

## Add a simple health check endpoint

1. Create a new file `src/app.controller.ts` with the following content:
    ```ts
    import { Controller, Get } from "@nestjs/common";

    @Controller()
    export class AppController {
      @Get("health")
      healthCheck() {
        return { status: "ok" };
      }
    }
    ```
2. Open the `src/app.module.ts` file and import the `AppController`:
    ```diff
    import { Module } from "@nestjs/common";
    + import { AppController } from "./app.controller";
    import { DiscordModule } from "./discord/discord.module";

    @Module({
      imports: [DiscordModule],
    +  controllers: [AppController],
    })
    export class AppModule {}
    ```

3. Save the file and test your new health check endpoint locally by running:
    ```bash
    npm run dev
    ```
    ```bash
    # In a separate terminal window, run:
    curl http://localhost:3000/health
    ```