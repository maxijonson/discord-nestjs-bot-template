/**
 * This folder contains commands to demonstrate the use of the select menu component.
 * Though it also uses subcommands, the focus is on the select menu. See the "config" command for examples/explanations focused on subcommands.
 */
import { createCommandGroupDecorator } from "necord";

export const SelectCommandGroup = createCommandGroupDecorator({
  name: "select",
  description: "Select menu command examples",
});
