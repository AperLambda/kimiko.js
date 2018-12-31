/*
 * Copyright © 2018 AperLambda <aperlambda@gmail.com>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

const ResourceName = require("./ResourceName");

/**
 * The CommandManager class; it allows you to store several {@link Command}s in one place
 */
class CommandManager
{
  /**
   * Creates a new `CommandManager` instance
   */
  constructor()
  {
    this.commands = [];
  }

  /**
   * Adds a {@link Command} to `CommandManager`'s `Command`s
   * @param {Command} command The command to be added
   */
  register(command)
  {
    this.commands.push(command);
  }

  /**
   * Returns whether a {@link Command} exists within `CommandManager`'s `Command`s
   * @param {(Command|String|ResourceName)} command Command or name/alias to look for
   * @return {boolean} Whether or not the asked command was found
   */
  hasCommand(command)
  {
    if (typeof command == "string" || command instanceof ResourceName) {
      return !!this.commands.find((c) => c.matchesName(command));
    } else if (typeof command == "object")
    {
      return this.commands.includes(command);
    }
    return false;
  }

  /**
   * Matches and returns a {@link Command} from `CommandManager`'s `Command`s if found
   * @param {(String|ResourceName)} name The name or alias of the command to find
   * @return {?Command} The asked command, if found
   */
  getCommand(name)
  {
    if (typeof name != "string" && !(command instanceof ResourceName)) {
      throw new Error(`kimiko.js, CommandManager::getCommand(name): 'name' should be a string or a ResourceName, got ${typeof name}`);
    }
    return this.commands.find((c) => c.matchesName(name));
  }

  /**
   * Returns all of the `CommandManager`'s registered {@link Command}s
   * @return {Command[]} All of them!
   */
  getCommands()
  {
    return this.commands;
  }

  /**
   * Gets rid of all the registered {@link Command}s
   */
  clearCommands()
  {
    this.commands = [];
  }
}

module.exports = CommandManager;
