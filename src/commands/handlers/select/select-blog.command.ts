/**
 * This example shows a more realistic use of a select menu: start by selecting an author, then a post by that author.
 * It uses https://jsonplaceholder.typicode.com/ as a fake API.
 *
 * In order to prevent cluttering the project with this example's code, everything is in a single file.
 * However, in a real scenario, there are many things in here that should be moved to separate files.
 * This file will outline where I would have put the files if this was a real scenario, but here's an overview:
 * - Authors module (`src/authors/author.module.ts`) provides the AuthorsService and exports it
 *   - Authors service (`src/authors/author.service.ts`)
 *   - Author schema (`src/authors/types/author.schema.ts`)
 * - Posts module (`src/posts/post.module.ts`) provides the PostsService and exports it
 *   - Posts service (`src/posts/post.service.ts`)
 *   - Post schema (`src/posts/types/post.schema.ts`)
 *
 * Then, import both modules in the `command.module.ts` file and in this command's `constructor`, inject both services and use them in the handlers.
 * ```ts
 * class SelectBlogCommand {
 *   constructor(
 *     private readonly authorsService: AuthorsService,
 *     private readonly postsService: PostsService,
 *   ) {}
 * }
 * ```
 */
import { Injectable } from "@nestjs/common";
import axios, { isAxiosError } from "axios";
import { Context, SelectedStrings, type SlashCommandContext, StringSelect, Subcommand } from "necord";
import z from "zod";
import { SelectCommandGroup } from "./select.command";
import {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  type SelectMenuComponentOptionData,
} from "discord.js";
import { InteractionError } from "src/common/errors/interaction-error";

@Injectable()
@SelectCommandGroup()
export class SelectBlogCommand {
  private static readonly AUTHOR_SELECT_ID = "select-blog/author";
  private static readonly POST_SELECT_ID = "select-blog/post";

  // If this was a real project, the constructor would be uncommented and the services would be injected, not instantiated directly.
  // constructor(
  //   private readonly authorsService: AuthorsService,
  //   private readonly postsService: PostsService,
  // ) {}
  private readonly authorsService: AuthorsService = new AuthorsService();
  private readonly postsService: PostsService = new PostsService();

  @Subcommand({
    name: "blog",
    description: "Search blog posts",
  })
  async handleSelectBlog(@Context() [interaction]: SlashCommandContext) {
    const authors = await this.authorsService.findAll();

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(SelectBlogCommand.AUTHOR_SELECT_ID)
      .setPlaceholder("Select an author")
      .addOptions(
        ...authors.map(
          (author): SelectMenuComponentOptionData => ({
            label: author.name,
            value: author.id.toString(),
            description: `@${author.username} (${author.email})`,
          }),
        ),
      )
      .setMinValues(1)
      .setMaxValues(1);
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    return interaction.reply({
      content: "Select an author to see their posts:",
      components: [row],
    });
  }

  @StringSelect(SelectBlogCommand.AUTHOR_SELECT_ID)
  async handleSelectedAuthor(@Context() [interaction]: SlashCommandContext, @SelectedStrings() [authorId]: [string]) {
    const author = await this.authorsService.findById(Number(authorId));
    if (!author) {
      throw new InteractionError("Author not found");
    }

    const authorEmbed = new EmbedBuilder()
      .setTitle(author.name)
      .setDescription(`${author.username} (${author.email})`)
      .addFields(
        { name: "Address", value: `${author.address.street}, ${author.address.suite}, ${author.address.city}` },
        { name: "Phone", value: author.phone, inline: true },
        { name: "Website", value: author.website, inline: true },
        { name: "Company", value: author.company.name },
      )
      .setFooter({ text: `Author ID: ${author.id}` });

    const posts = await this.postsService.findByAuthor(author.id);
    if (!posts || posts.length === 0) {
      throw new InteractionError("This author has no posts");
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(SelectBlogCommand.POST_SELECT_ID)
      .setPlaceholder(`Select a post by ${author.name}`)
      .addOptions(
        ...posts.map(
          (post): SelectMenuComponentOptionData => ({
            label: post.title.length > 100 ? post.title.slice(0, 97) + "..." : post.title,
            value: post.id.toString(),
            description: `By ${author.name} (${author.username})`,
          }),
        ),
      )
      .setMinValues(1)
      .setMaxValues(1);
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    return interaction.reply({
      content: "Select a post to view:",
      components: [row],
      embeds: [authorEmbed],
    });
  }

  @StringSelect(SelectBlogCommand.POST_SELECT_ID)
  async handleSelectedPost(@Context() [interaction]: SlashCommandContext, @SelectedStrings() [postId]: [string]) {
    const post = await this.postsService.findById(Number(postId));
    if (!post) {
      throw new InteractionError("Post not found");
    }

    const author = await this.authorsService.findById(post.userId);
    if (!author) {
      throw new InteractionError("Author not found");
    }

    const postEmbed = new EmbedBuilder()
      .setTitle(post.title)
      .setDescription(`By ${author.name} (${author.username})\n\n${post.body}`)
      .setFooter({ text: `Post ID: ${post.id} | Author ID: ${post.userId}` });

    return interaction.reply({
      content: "Here is the post you selected:",
      embeds: [postEmbed],
    });
  }
}

// Everything below this comment would be in separate files in a real project

// `src/authors/types/author.schema.ts`
const Author = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  address: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
    geo: z.object({ lat: z.string(), lng: z.string() }),
  }),
  phone: z.string(),
  website: z.string(),
  company: z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
  }),
});
type Author = z.infer<typeof Author>;

// `src/authors/author.service.ts`
// @Injectable()
class AuthorsService {
  private readonly client = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com/users",
  });

  async findAll() {
    const { data } = await this.client.get("/");
    return Author.array().parse(data);
  }

  async findById(id: Author["id"]) {
    try {
      const { data } = await this.client.get(`/${id}`);
      if (Object.keys(data).length === 0) {
        return null;
      }
      return Author.parse(data);
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 404) {
        return null;
      }
      throw e;
    }
  }
}

// `src/authors/author.module.ts`
// @Module({
//   providers: [AuthorsService],
//   exports: [AuthorsService],
// })
// class AuthorsModule {}

// `src/posts/types/post.schema.ts`
const Post = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});
type Post = z.infer<typeof Post>;

// `src/posts/post.service.ts`
// @Injectable()
class PostsService {
  private readonly client = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com/posts",
  });

  async findByAuthor(authorId: Author["id"]) {
    try {
      const { data } = await this.client.get("/", {
        params: { userId: authorId },
      });
      return Post.array().parse(data);
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 404) {
        return null;
      }
      throw e;
    }
  }

  async findById(id: Post["id"]) {
    try {
      const { data } = await this.client.get(`/${id}`);
      if (Object.keys(data).length === 0) {
        return null;
      }
      return Post.parse(data);
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 404) {
        return null;
      }
      throw e;
    }
  }
}

// `src/posts/post.module.ts`
// @Module({
//   providers: [PostsService],
//   exports: [PostsService],
// })
// class PostsModule {}
