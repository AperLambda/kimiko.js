/*
 * Copyright © 2018 AperLambda <aperlambda@gmail.com>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

const CommandResult = require("./CommandResult");
const ResourceName = require("./ResourceName");

const Command = module.exports = class Command
{
  constructor(name, parent)
  {
    this.name = new ResourceName(name);
    if (parent) {
      this.setParent(parent);
    }
    this.usage = null;
    this.description = null;
    this.aliases = [];
    this.permissionRequired = "";
    this.executor = null;
    this.tabCompleter = null;
    this.subCommands = [];
  }

  getParent()
  {
    return this.parent;
  }

  setParent(parent)
  {
    this.parent = parent;
  }

  hasParent()
  {
    return !!this.parent;
  }

  getUsage(sender)
  {
    if (sender && typeof this.usage == "function") {
      return this.usage(sender);
    }
    return this.usage;
  }

  setUsage(usage)
  {
    if (typeof usage == "string") {
      this.usage = usage.replace("<command>", this.name);
    } else if (typeof usage == "function") {
      this.usage = usage;
    } else {
      throw new Error(`kimiko.js, Command::setUsage(usage): 'usage' should be either a string, or a function, got ${typeof usage}.`);
    }
  }

  getDescription(sender)
  {
    if (sender && typeof this.description == "function") {
      return this.description(sender);
    }
    return this.description; // TODO: default description?
  }

  setDescription(description)
  {
    if (typeof description == "string" || typeof description == "function") {
      this.description = description;
    } else {
      throw new Error(`kimiko.js, Command::setDescription(description): 'description' should be either a string, or a function, got ${typeof description}.`);
    }
  }

  getAliases()
  {
    return this.aliases;
  }

  setAliases(...aliases)
  {
    this.aliases = this.aliases.concat(...aliases);
  }

  matchesName(name, aliases = true)
  {
    return this.name.equals(name) || aliases && this.aliases.includes(name);
  }

  getPermissionRequired()
  {
    return this.permissionRequired;
  }

  setPermissionRequired(permissionRequired)
  {
    if (typeof permissionRequired != "string") {
      throw new Error(`kimiko.js, Command::setPermissionRequired(permissionRequired): 'permissionRequired' should be a string, got ${typeof permissionRequired}.`);
    }
    this.permissionRequired = permissionRequired;
  }

  getExecutor()
  {
    return this.executor;
  }

  setExecutor(executor)
  {
    if (!executor) {
      throw new Error(`kimiko.js, Command::setExecutor(executor): 'executor' should not be null.`);
    }
    this.executor = executor;
  }

  getTabCompleter()
  {
    return this.tabCompleter;
  }

  setTabCompleter(tabCompleter)
  {
    if (!tabCompleter) {
      throw new Error(`kimiko.js, Command::setTabCompleter(tabCompleter): 'tabCompleter' should not be null.`);
    }
    this.tabCompleter = tabCompleter;
  }

  execute(context, label, args = [])
  {
    if (!this.executor) {
      throw new Error(`kimiko.js, Command::execute(...): Command::executor hasn't been defined yet.`);
    }
    return this.executor(context, this, label, args);
  }

  _handleLocalExecution(context, label, args = [])
  {
    if (this.permissionRequired && !context.hasPermission(this.permissionRequired)) {
      return CommandResult.ERROR_PERMISSION;
    }
    return this.execute(context, label, args);
  }

  handleExecution(context, label, args = [])
  {
    let result = 0;

    if (!args.length) {
      result = this._handleLocalExecution(context, label, args);
    } else {
      let subLabel = args[0];
      let subCommand = this.getSubCommand(subLabel);
      if (subCommand) {
        // no permission check: the subcommand may do it by itself
        return subCommand.handleExecution(context, subLabel, args.slice(1));
      }
      else {
        result = this._handleLocalExecution(context, label, args);
      }
    }

    if (result == CommandResult.ERROR_USAGE)
    {
      let usage = this.getUsage(context.getSender()).replace("<command>", this.getName());
      return [result, usage];
    }

    return [result];
  }

  onTabComplete(context, label, args = [])
  {
    if (args.length == 1) {
      let subCommands = this.getSubCommands();

      if (!subCommands.length) {
        return this.tabCompleter(context, this, label, args);
      }

      let subCommandsArray = subCommands.filter((sc) => {
          let permission = sc.getPermissionRequired();
          return !permission || context.hasPermission(permission);
        })
        .map(sc => sc.getName();

      let additionalCompletion = this.tabCompleter(context, this, label, args);
      if (additionalCompletion) {
        subCommandsArray = subCommandsArray.concat(additionalCompletion)
      }
      return subCommandsArray.filter((sc) => sc.startsWith(args[0])).sort();
    } else {
      let subCommand = this.getSubCommand(args[0]);
      if (subCommand) {
        let permission = subCommand.getPermissionRequired();
        if (!permission || context.hasPermission(permission)) {
          return subCommand.onTabComplete(context, label, args.slice(1));
        }
      }
    }

    return this.tabCompleter(context, this, label, args);
  }

  addSubCommand(subCommand)
  {
    if (subCommand.hasParent() || this.hasSubCommand(subCommand)) return;
    subCommand.setParent(this);
    this.subCommands.push(subCommand);
  }

  hasSubCommand(subCommand = "")
  {
    if (typeof subCommand == "string" || subCommand instanceof ResourceName) {
      return this.subCommands.find((sc) => sc.matchesName(subCommand));
    } else if (typeof subCommand == "object") {
      return this.subCommands.includes(subCommand);
    }
    return false;
  }

  removeSubCommand(subCommand)
  {
    let index = this.subCommands.indexOf(subCommand);
    if (~index) this.subCommands.splice(index, 1); // if the subCommand is present, remove it
  }

  getSubCommand(label)
  {
    return this.subCommands.find((sc) => sc.matchesName(label));
  }

  getSubCommands()
  {
    return this.subCommands;
  }
}
