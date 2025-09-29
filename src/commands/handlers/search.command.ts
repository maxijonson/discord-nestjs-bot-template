/**
 * Search through a dataset of data with autocomplete suggestions.
 *
 * This command demonstrates the use of autocomplete in slash commands.
 */
import { Injectable, UseInterceptors } from "@nestjs/common";
import { CommandInteraction, type AutocompleteInteraction } from "discord.js";
import { AutocompleteInterceptor, Context, Options, SlashCommand, StringOption } from "necord";
import { InteractionError } from "src/common/errors/interaction-error";

// A mock dataset – you could replace this with an API or database call
const DATABASE = {
  frontend: ["React", "Vue", "Angular", "Svelte", "Ember"],
  backend: ["Node.js", "Django", "Flask", "Spring", "Rails"],
  database: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite"],
  devops: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Travis CI"],
  languages: ["JavaScript", "Python", "Java", "C#", "Ruby", "Go", "Rust"],
};

class SearchOptions {
  @StringOption({
    name: "category",
    description: "Category to search in",
    required: true,
    autocomplete: true,

    // This would be an alternative if you know the choices ahead of time. For the purpose of this demo, we assume we don't. This allows us to do autocomplete on two fields, where one depends on the other.
    // choices: [
    //   { name: "Frontend", value: "frontend" },
    //   { name: "Backend", value: "backend" },
    //   { name: "Database", value: "database" },
    //   { name: "DevOps", value: "devops" },
    //   { name: "Languages", value: "languages" },
    // ],
  })
  category: string;

  @StringOption({
    name: "term",
    description: "Search term",
    autocomplete: true,
    required: true,
    min_length: 1,
    max_length: 32,
  })
  term: string;
}

// If this becomes too large, consider moving it to its own file to keep things tidy.
@Injectable()
class SearchTermAutocompleteInterceptor extends AutocompleteInterceptor {
  // Simulate async operation, e.g. fetching from a database or API
  async searchCategories(search: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return Object.keys(DATABASE).filter((key) => key.toLowerCase().includes(search.toLowerCase()));
  }
  async searchTerms(category: string, search: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return DATABASE[category]?.filter((item) => item.toLowerCase().includes(search.toLowerCase())) || [];
  }

  public async transformOptions(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused(true);
    const choices: string[] = [];

    switch (focused.name) {
      case "category": {
        const results = await this.searchCategories(focused.value.toString());
        choices.push(...results);
        break;
      }
      case "term": {
        // Here we set required=false even though it's required in the command. This makes the type `string | null` instead of just `string`.
        // I recommend you ALWAYS set required=false in autocomplete interceptors, as users may not have filled out all required fields yet when they are using autocomplete, resulting in `null` values even for required fields.
        const category = interaction.options.get("category", false);
        if (!category || !category.value || typeof category.value !== "string") break;

        const results = await this.searchTerms(category.value, focused.value.toString());
        choices.push(...results);
        break;
      }
    }

    return interaction.respond(
      choices
        .filter((choice) => choice.includes(focused.value.toString()))
        .map((choice) => ({ name: choice, value: choice })),
    );
  }
}

@Injectable()
export class SearchCommand {
  @UseInterceptors(SearchTermAutocompleteInterceptor)
  @SlashCommand({
    name: "search",
    description: "Search through a dataset with autocomplete",
  })
  async onSearch(@Context() [interaction]: [CommandInteraction], @Options() { term, category }: SearchOptions) {
    const results = DATABASE[category]?.filter((item) => item.toLowerCase().includes(term.toLowerCase())) || [];

    if (results.length === 0) {
      throw new InteractionError(`❌ No results found for \`${term}\` in category \`${category}\`.`);
    }

    return interaction.reply({
      content: `🔎 Results for \`${term}\` in category \`${category}\`: ${results.join(", ")}`,
    });
  }
}
