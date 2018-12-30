/*
 * Copyright © 2018 AperLambda <aperlambda@gmail.com>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

const CommandManager = module.exports = class CommandManager
{
  constructor()
  {
    this.commands = [];
  }

  register(command)
  {
    this.commands.push(command);
  }

  hasCommand(command)
  {
    if (typeof command == "string")
    {
      return !!this.commands.find((c) => c.matchesName(command));
    }
    else if (typeof command == "object")
    {
      return this.commands.includes(command);
    }
    return false;
  }

  getCommand(name)
  {
    if (typeof name != "string")
    {
      throw new Error(`kimiko.js, CommandManager::getCommand(name): 'name' should be a string, got ${typeof name}`);
    }
    return this.commands.find((c) => c.matchesName(name));
  }

  getCommands()
  {
    return this.commands;
  }

  clearCommands()
  {
    this.commands = [];
  }
}
