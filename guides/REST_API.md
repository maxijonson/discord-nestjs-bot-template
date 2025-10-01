# REST API Integration

> 💡 **Initial Version** \
> This section will eventually be rewritten and the overall REST API integration may change in the future. I initially spent a short amount of time focusing on REST API integration and wanted to get support for it out quickly. Expect this section to be improved over time, after the core of the template is built.

> This template makes use of NestJS under the hood, which is actually primarily a web framework for building REST APIs! This template won't teach you how to build a NestJS application, since the focus is on building a Discord bot, not a web server. However, you'll find that [NestJS' docs](https://docs.nestjs.com/) are very well written and include a lot of examples to help solve common problems, such as authentication, validation, database integration, etc.

This template is already setup to accept incoming HTTP requests! You can test this right now by starting your bot locally and going to `http://localhost:3000/health` in your web browser. You should see a JSON response like this:

```json
{
  "status": "ok"
}
```

However, if you're using the Railway template, you'll need to make a small change to your Railway project settings to allow incoming HTTP requests. Follow the steps below to enable the REST API functionality.

## 1. Railway Configuration

After you've deployed your bot with Railway as suggested in the main README, you need to make a small change to your Railway project settings to allow incoming HTTP requests.

1. Go to your Railway project dashboard.
2. In the "Architecture" tab, click on your bot's service, then click on the "Settings" tab.
3. Under the "Networking" section, choose either "Generate Domain" to get a free Railway subdomain, or "Custom Domain" if you have your own domain name.
4. When prompted for the port, you may choose whatever port you want. If you're not sure, just use `3000`, which is a common default port for NestJS applications.
5. Save your changes. Once the changes are saved, Railway will automatically redeploy your bot with the new settings. You can visit the `/health` endpoint at your new domain to verify that it's working.