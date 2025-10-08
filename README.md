<p align="center">
    <h1 align="center">Discord NestJS Bot Template</h1>
</p>

<p align="center">
A Discord bot template powered by <a href="https://nestjs.com/" target="_blank">NestJS</a> using <a href="https://necord.org/" target="_blank">Necord</a> and <a href="https://discord.js.org/" target="_blank">Discord.js</a>.
</p>

<p align="center">
    <a href="https://railway.com/deploy/discord-nestjs-bot?referralCode=maxijonson" target="_blank">
        <img src="https://railway.com/button.svg" alt="Deploy on Railway" />
    </a>
</p>

## ⚠️ Usable, but still a work in progress! ⚠️

This template is still very much in development. You're welcome to use it as-is, but there are still a lot of features, examples and documentation missing that I plan to add soon.

That being said, the current state of the template is perfectly usable, it's just not very useful at the moment. If you use it now, you'll still have a working bot, but you won't have many examples to build upon yet. Consider starring the repo to show your interest and watch for updates!

## Why NestJS instead of plain Discord.js?

Most Discord bot templates out there use Discord.js on its own, inside a plain Node app. This is fine for small bots, but as your bot grows, you might find yourself struggling to keep your code organized and maintainable. NestJS is a progressive Node.js framework that helps you build efficient, reliable, and scalable server-side applications. It provides a modular architecture, dependency injection, and a powerful CLI, making it easier to manage complex applications. Necord is a framework built on top of Discord.js that leverages the power of NestJS to create Discord bots with a clean and structured approach.

## Motivation

With this template, you can quickly set up a Discord bot using NestJS and have a solid foundation to build upon. Additionally, having a NestJS-based bot can be beneficial if you plan to integrate your bot with a web application or API, as you can share code and services between the two. This means that using this template, you can eventually expand your bot's functionality to include a REST API, letting your interact with your bot outside of Discord!

## Who is this template for?

This template aims to provide a concise yet comprehensive starting point for building a Discord bot. However, in order to be flexible to a wide range of use cases, it is **not** a fully featured bot with a lot of built-in commands. In other words, while you can simply use this template as-is and deploy it successfully, it won't be very useful on in its current state. It is up to you to implement your own commands and logic, built around your use-case. This template will provide you with short examples of everything that is possible, but you'll most likely end up removing a lot of the example code to make it your own.

This template is for you if:
- You have some experience with TypeScript (or just JavaScript) and Node.js.
- You want an opinionated file structure and architecture to build your bot on, instead of getting lost in a sea of files and folders that don't make sense.
- You want to build a bot that can eventually be expanded to include a REST API and be interacted with outside of Discord. See the [REST_API](guides/REST_API.md) guide for more information.
- You want a bot that scales well as your bot's complexity grows.
- (Optional) You have some experience with NestJS. If you don't, that's okay! There are a lot of examples you can rely on to just copy/paste the same patterns over. NestJS makes patterns emerge naturally, so it's hard to sway too far from the recommended way of doing things.

## Template Features

**📦 Modular Structure**: Organized codebase with a clear separation of concerns, preventing spaghetti code and making it easier to maintain. \
**⚒️ Incredible Tooling**: Using DiscordJS on its own can be a pain, this template makes building multi-stage interactions a breeze. \
**💪 DiscordJS on Steroids**: Necord is built **on top of** DiscordJS. This means you can still fallback to what you'd be doing without it at any time. \
**💡 Learn by Example**: This template includes a variety of examples to help you understand how to use Necord effectively.

## Guides

This template comes with guides to help you get started and extend your bot with more features:

1. [Setup](guides/SETUP.md): This guide will walk you through the steps of getting your bot online, starting from nothing and ending with a production-ready bot hosted on Railway.
2. [Project Structure](guides/PROJECT_STRUCTURE.md): Overview of the project's folder structure and organization.
3. [Utilities](guides/UTILITIES.md): Explanation of the various utility features provided by the template, including guards, interceptors, and filters that enhance the functionality and robustness of your Discord bot.
4. [REST API](guides/REST_API.md): Instructions on how to set up a REST API alongside your bot, allowing you to interact with it outside of Discord.
5. [Scripts](guides/SCRIPTS.md): Explanation of the NPM scripts included in this template to help you automate tasks like creating new commands.

## One-Click Deploy

Get a **$20 Railway credit** by deploying your Discord bot with this button (that's 4 months of free hosting!). This is also an effortless way of showing your support for this template, as I get a small commission! Thank you for your support ♥️

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/discord-nestjs-bot?referralCode=maxijonson)
