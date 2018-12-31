/*
 * Copyright © 2018 AperLambda <aperlambda@gmail.com>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

const Command = require("./Command");

/**
 * The CommandBuilder class: allows you to simply generate a {@link Command}.
 * @example
 * const kimiko = require("kimiko");
 * 
 * let myCommand = new kimiko.CommandBuilder("josh:help")
 *   .setUsage("<command> [command]")
 *   .setDescription("Prints out all of the help you'd need to use my nice bot!")
 *   .setAliases("help", "joshelp")
 *   .setExecutor(require("commands/josh/help"))
 *   .build();
 */
class CommandBuilder {

  /**
   * @param {(String|ResourceName)} name The name of the generated command
   */
  constructor(name)
  {
    this.name = name;
    this.usage = null;
    this.description = null;
    this.aliases = [];
    this.permissionRequired = null;
    this.executor = null;
  }

  /**
   * Sets the usage for the command
   * @param {String} usage
   * @return {CommandBuilder} This CommandBuilder instance
   */
  setUsage(usage)
  {
    this.usage = usage;
    return this;
  }

  /**
   * Sets the description for the command
   * @param {String} description
   * @return {CommandBuilder} This CommandBuilder instance
   */
  setDescription(description)
  {
    this.description = description;
    return this;
  }

  /**
   * Sets the aliases for the command
   * @param {...String} aliases
   * @return {CommandBuilder} This CommandBuilder instance
   */
  setAliases(...aliases)
  {
    this.aliases = aliases;
    return this;
  }

  /**
   * Sets the required permission for the command
   * @param {String} permissionRequired
   * @return {CommandBuilder} This CommandBuilder instance
   */
  setPermissionRequired(permissionRequired)
  {
    this.permissionRequired = permissionRequired;
    return this;
  }

  /**
   * Sets the executor for the command
   * @param {Command#executor} executor
   * @return {CommandBuilder} This CommandBuilder instance
   */
  setExecutor(executor)
  {
    this.executor = executor;
    return this;
  }

  /**
   * Sets the tab completer for the command
   * @param {Command#tabCompleter} tabCompleter
   * @return {CommandBuilder} This CommandBuilder instance
   */
  setTabCompleter(tabCompleter)
  {
    this.tabCompleter = tabCompleter;
    return this;
  }

  /**
   * Builds the CommandBuilder into a {@link Command}
   * @return {Command} The built command
   */
  build()
  {
    let command = new Command(this.name);
    if (this.usage) command.setUsage(this.usage);
    if (this.description) command.setDescription(this.description);
    if (this.aliases) command.setAliases(...this.aliases);
    if (this.permissionRequired) command.setPermissionRequired(this.permissionRequired);
    if (this.executor) command.setExecutor(this.executor);
    if (this.tabCompleter) command.setTabCompleter(this.tabCompleter);
    return command;
  }
}

module.exports = CommandBuilder;
