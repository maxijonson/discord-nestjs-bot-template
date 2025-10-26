# Setup

This guide will walk you through the steps to get your Discord bot up and running using this template. By the end of this guide, you will have a functional Discord bot that already is setup in the cloud (not just your computer), can start being customized to your needs and that will automatically update whenever you push new code to your GitHub repository.

## 1. Register a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click on the "New Application" button.
3. Give your application a name and click "Create".
4. Take note of your **Application ID** on the page that follows, or in the URL, e.g: `https://discord.com/developers/applications/<YOUR_APPLICATION_ID>/information`.

## 2. Create a Bot User

1. On the left sidebar, click on "Bot". Alternatively, you can navigate to `https://discord.com/developers/applications/<YOUR_APPLICATION_ID>/bot`.
2. Click on the "Reset Token" button to generate a bot token. Take note of this token, as you'll need it later.

## 3. Invite your Bot to a Server

1. On the left sidebar of the Discord Developer Portal, click on "Installation". Alternatively, you can navigate to `https://discord.com/developers/applications/<YOUR_APPLICATION_ID>/installation`.
2. Scroll down to "Default Install Settings" and under "Guild Install", make sure the scopes are set to `application.commands` and `bot`.
3. Under "Permissions", select the permissions your bot will need. 
   > Note that this template, in its current state, requires the following permissions for the example features to work properly:
   > - Send Messages
   > - Manage Messages
   > - Use Slash Commands
4. Click on "Save Changes".
5. Copy the "Install Link" and open it in a new browser tab. Select the server you want to invite your bot to and click "Continue", then "Authorize".
6. You should now have the offline bot in your server's member list.

## 4. Get your Bot online

> **Prerequisites**:
>
> - A [GitHub](https://github.com/) account to host your code repository. This will be used to sign in to Railway and will also let Railway watch for changes to your code and automatically redeploy your bot whenever you push new code.

1. Deploy the bot on [Railway](https://railway.com/deploy/discord-nestjs-bot?referralCode=maxijonson) using the button below and pressing "Deploy Now". Using this button will grant you a **$20 Railway credit** (that's 4 months of free hosting!).

   [![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/discord-nestjs-bot?referralCode=maxijonson)

2. When prompted, add the token you generated in step `2.2`.
3. Once your first deployment is complete, you should see your bot come online in the Discord server you invited it to! Try sending the `/ping` slash command to see if it responds with "Pong!".

> By default, this template does not expose a REST API. If you want to make your bot interactive with an external web application or API, you can read the [REST_API](guides/REST_API.md) guide for instructions on how to enable the REST API functionality.

## 5. Setup local development environment

Now that your bot is online and production ready, you can setup your local development environment to start customizing your bot to your needs. In order to start making your own changes, you'll need to disconnect your Railway project from this template. This will duplicate the template in its current state into your own GitHub account, which you can then clone to your computer and start making changes.

> **Prerequisites**:
>
> - [Node.js](https://nodejs.org/en/download/) (v18 or higher)
>   - **Recommended**: Use [Volta](https://volta.sh/) ([Windows](https://docs.volta.sh/guide/getting-started#windows-installation) / [Mac](https://docs.volta.sh/guide/getting-started#unix-installation) / [Linux](https://docs.volta.sh/guide/getting-started#unix-installation)) to manage your Node version, instead of installing it manually from the official website. Volta is supported out of the box in this template!
> - [Git](https://git-scm.com/downloads) for version control.
> - A code editor, such as [Visual Studio Code](https://code.visualstudio.com/).

1. On your Railway project dashboard, under the "Architecture" tab, select your bot's service, then click on the "Settings" tab.
2. Under the "Source" section, click on the red "Eject" button. This will disconnect this template's GitHub repository from your Railway project and duplicate it into your own GitHub account.
   > Note: This automatically attempts to create a **PUBLIC** repository named `discord-nestjs-bot-template` in your GitHub account. You should immediately go to your GitHub account and change the repository to private if you don't want others to see your code. You can also rename the repository to something else if you want. If `discord-nestjs-bot-template` is already taken in your account, Railway will fail to duplicate the repository correctly.
3. From this point, only you will be able to push changes to your own GitHub repository, which Railway will automatically pick up and redeploy your bot.
4. You can now clone your new GitHub repository to your computer.
   ```bash
   git clone <YOUR_GITHUB_REPOSITORY_URL>
   ```
5. Open the cloned repository in your code editor.
6. Install the dependencies:
   ```bash
   # Run this command in the terminal, from the root of the cloned repository
   npm install
   ```
7. Create a new Discord Application from the Discord Developer Portal, following steps `1` to `3` from this guide. This will be your development bot, which you can invite to a separate Discord server for testing purposes. This way, you won't accidentally mess up your production bot while developing new features. Also, Discord doesn't really like having two bots running at the same time with the same token (remember you should have the one in Railway running at this point!).
8. Copy the [`.env.example`](../.env.example) file to a new `.env` file in the root of the project and fill in the `DISCORD_BOT_TOKEN` variable with the token of your **development bot**.
9. Start the bot in development mode:

   ```bash
   npm run dev
   ```

10. Change the `/ping` command to `/hello` and change the response to `"World!"` in `src/commands/ping/ping.command.ts`:

    ```ts
    @SlashCommand("hello", { description: "Replies with 'World!'" })
    async ping(interaction: CommandInteraction) {
        await interaction.reply("World!");
    }
    ```

11. Save the file and go back to your Discord server. Try sending the `/hello` command to see if it responds with "World!".
12. Commit your changes and push them to your GitHub repository:
    ```bash
    git add .
    git commit -m "Changed /ping to /hello"
    git push origin main
    ```
13. Go back to your Railway project dashboard and wait for the new deployment to complete. Once it's done, try sending the `/hello` command again in your Discord server to see if it still responds with "World!".

## 6. Next Steps

Now that you have your bot up and running, you can start customizing it to your needs. Here are some suggestions on what to do next.

### 6.1 Intents

Intents tell Discord what events your bot intends on handling, so that your bot isn't overwhelmed with events it doesn't care about. For example, having the `GUILD_MEMBERS` intent enabled will allow your bot to receive events related to guild members, such as when a member joins or leaves a guild.

Set the correct intents for your bot in the [`src/bot/bot.module.ts`](../src/bot/bot.module.ts) file. By default, only those required for the example features to work properly were set. Your bot might need more or less intents depending on what you want to do. Note that some intents are considered "Privileged Intents" by Discord and require you to enable them in the Discord Developer Portal for your bot. Privileged intents require your bot to go through Discord's verification process if your bot is in more than 100 servers. If it's in less than 100 servers, you can enable them without verification.

You can find a list of all the available intents in the [Discord.js documentation](https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits) and on [Discord's official documentation](https://discord.com/developers/docs/events/gateway#list-of-intents).

### 6.2 Explore the examples

Each handler for a feature (command, event, etc.) was created with the intention of being a quick example of how to use one specific feature. I recommend that you glance over each of them to get a general idea of what you can do! The examples are purposely kept simple, short and not meant to be kept as-is in your bot.
