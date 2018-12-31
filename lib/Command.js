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

/**
 * The Command class, represents an executable command. It handles usage definition, subcommands, tab completion and aliases.
 */
class Command
{

  /**
   * @param {(String|ResourceName)} name Name of the Command
   * @param {Command=} parent Parent Command, used by {@link Command#addSubCommand}
   */
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

  /**
   * Returns the parent command, if set
   * @return {?Command}
   */
  getParent()
  {
    return this.parent;
  }

  /**
   * Sets the parent command
   * @param {Command} parent
   */
  setParent(parent)
  {
    this.parent = parent;
  }

  /**
   * Returns whether or not the command is a child command
   * @return {boolean}
   */
  hasParent()
  {
    return !!this.parent;
  }

  /**
   * Returns the usage of the command
   * @param {*=} sender The sender/author-representing object, will be passed to the {@link Command~usageCallback}
   * @return {String}
   */
  getUsage(sender)
  {
    if (typeof this.usage == "function") {
      return this.usage(sender);
    }
    return this.usage;
  }

  /**
   * Sets the usage for the command
   * @param {(String|Command~usageCallback)} usage
   * @throws Will throw an Error if `usage` is neither a string nor a function
   */
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


  /**
   * Returns the description of the command
   * @param {*=} sender If {@link Command#description} is a function, it will call this function with `sender` as argument. Represents the sender/author of the command call
   * @return {String}
   */
  getDescription(sender)
  {
    if (typeof this.description == "function") {
      return String(this.description(sender));
    }
    return this.description; // TODO: default description?
  }

  /**
   * Sets the description of a command
   * @param {(String|Command~descriptionCallback)} description
   * @throws Will throw an Error if `description` is neither a string nor a function
   */
  setDescription(description)
  {
    if (typeof description == "string" || typeof description == "function") {
      this.description = description;
    } else {
      throw new Error(`kimiko.js, Command::setDescription(description): 'description' should be either a string, or a function, got ${typeof description}.`);
    }
  }

  /**
   * Returns all the aliases
   * @return {String[]}
   */
  getAliases()
  {
    return this.aliases;
  }

  /**
   * Adds aliases to the `Command`
   * @param {...(String|String[])} aliases
   */
  setAliases(...aliases)
  {
    this.aliases = this.aliases.concat(...aliases);
  }

  /**
   * Returns whether or not the `name` matches the name and optionally any alias
   * @param {(String|ResourceName)} name The name to compare to
   * @param {boolean=} aliases=true Whether or not it should search within the aliases aswell
   * @return {boolean}
   */
  matchesName(name, aliases = true)
  {
    return this.name.equals(name) || aliases && this.aliases.includes(name.toString());
  }

  /**
   * Returns the permission required for the `Command`
   * @return {String}
   */
  getPermissionRequired()
  {
    return this.permissionRequired;
  }

  /**
   * Sets the required permission for the `Command`
   * @param {String} permissionRequired The required permission
   * @throws Will throw an Error if the `permissionRequired` is not a String
   */
  setPermissionRequired(permissionRequired)
  {
    if (typeof permissionRequired != "string") {
      throw new Error(`kimiko.js, Command::setPermissionRequired(permissionRequired): 'permissionRequired' should be a string, got ${typeof permissionRequired}.`);
    }
    this.permissionRequired = permissionRequired;
  }

  /**
   * Returns the `executor` of this command, if set
   * @return {?Command#executor}
   */
  getExecutor()
  {
    return this.executor;
  }

  /**
   * Sets the `executor` of this command
   * @param {Command#executor} executor
   * @throws Will throw an Error if the `executor` isn't valid
   */
  setExecutor(executor)
  {
    if (typeof executor != "function") {
      throw new Error(`kimiko.js, Command::setExecutor(executor): 'executor' should be a function.`);
    }
    this.executor = executor;
  }

  /**
   * Returns the tab completion callback of the command, if set
   * @return {?Command#tabCompleter}
   */
  getTabCompleter()
  {
    return this.tabCompleter;
  }

  /**
   * Sets the tab completer of the command
   * @param {Command#tabCompleter} tabCompleter The tab completer callback to be set
   * @throws Will throw an Error if `tabCompleter` isn't valid
   */
  setTabCompleter(tabCompleter)
  {
    if (typeof tabCompleter != "function") {
      throw new Error(`kimiko.js, Command::setTabCompleter(tabCompleter): 'tabCompleter' should be a function.`);
    }
    this.tabCompleter = tabCompleter;
  }

  /**
   * Internal execution function, which you should **NOT** use, unless you don't care about the permission and argument check
   * @private
   * @param {Command~Context} context Context of the command call
   * @param {String} label Name by which the command was called
   * @param {String[]} args Arguments for the call
   * @throws Will throw an error if the command does not have an executor
   * @return {CommandResult}
   */
  _execute(context, label, args = [])
  {
    if (!this.executor) {
      throw new Error(`kimiko.js, Command::_execute(...): Command::executor hasn't been defined yet.`);
    }
    return this.executor(context, this, label, args);
  }

  /**
   * Internal function, checks for the required permission and executes the command's executor through {@link Command#_execute}
   * @private
   * @param {Command~Context} context Context of the command call
   * @param {String} label Name by which the command was called
   * @param {String[]} args Arguments for the call
   * @throws Will throw if `executor` was not set
   * @return {CommandResult} The result of the executor or, if the permissions aren't valid, {@link CommandResult.ERROR_PERMISSION}
   */
  _handleLocalExecution(context, label, args = [])
  {
    if (this.permissionRequired && !context.hasPermission(this.permissionRequired)) {
      return CommandResult.ERROR_PERMISSION;
    }
    return this._execute(context, label, args);
  }

  /**
   * Execution handler; the function you should call when the command has been invoked. It does argument and permission checks and propagates the call to subCommands
   * @param {Command~Context} context Context of the call
   * @param {String} label Name by which the command was invoked
   * @param {String[]} args Arguments for the command
   * @throws Will throw if the `executor` wasn't set
   * @return {CommandResult} the result of the call. If the arguments are invalid, a {@link CommandResult.ERROR_USAGE} will be returned and if the permissions are invalid, the return value will be {@link CommandResult.ERROR_PERMISSION}.
   */
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

  /**
   * The handler for the tab completion event, it will return all of the possibilities as a String array
   * @param {Command~Context} context Context of the tab completion call
   * @param {String} label Label of the command
   * @param {String[]} args Arguments already typed in
   * @return {String[]} Possible values for the completion
   */
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
        .map(sc => sc.getName());

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

  /**
   * Adds a subCommand to the command, will do nothing if the subCommand already has a parent or if there is already another subCommand with the same name or alias
   * @param {Command} subCommand SubCommand to be added
   */
  addSubCommand(subCommand)
  {
    if (subCommand.hasParent() || this.hasSubCommand(subCommand)) return;
    subCommand.setParent(this);
    this.subCommands.push(subCommand);
  }

  /**
   * Returns whether or not a subCommand is present in the command
   * @param {(String|ResourceName|Command)} subCommand
   * @return {boolean}
   */
  hasSubCommand(subCommand = "")
  {
    if (typeof subCommand == "string" || subCommand instanceof ResourceName) {
      return this.subCommands.find((sc) => sc.matchesName(subCommand));
    } else if (typeof subCommand == "object") {
      return this.subCommands.includes(subCommand);
    }
    return false;
  }

  /**
   * Removes, if present, a subCommand from the command
   * @param {Command} subCommand
   */
  removeSubCommand(subCommand)
  {
    let index = this.subCommands.indexOf(subCommand);
    if (~index) this.subCommands.splice(index, 1); // if the subCommand is present, remove it
  }

  /**
   * Returns, if found, a subCommand matching `label` (name or alias)
   * @param {(String|ResourceName)} label
   */
  getSubCommand(label)
  {
    return this.subCommands.find((sc) => sc.matchesName(label));
  }

  /**
   * Returns all the subCommands of a command
   * @return {Command[]}
   */
  getSubCommands()
  {
    return this.subCommands;
  }
}

/**
 * @callback Command#executor The executor function: the code the command will execute once called
 * @param {Context} context
 * @param {Command} command This `Command`'s instance
 * @param {String} label With which name the `Command` instance was invoked
 * @param {String[]} args The arguments for the command
 * @return {?CommandResult} The result of the command
 */

/**
 * @callback Command#tabCompleter The tab completer function: it will be called within the {@link Command#onTabComplete} handler and should return the possible completions disponible
 * @param {Context} context
 * @param {Command} command This `Command`'s instance
 * @param {String} label With which name the `Command` instance was invoked
 * @param {String[]} args The arguments for the command
 * @return {String[]} The possible completions
 */

/**
 * @callback Command~descriptionCallback
 * @param {*=} sender If given as argument to {@link Command#getDescription}, the sender/author
 * @return {String}
 */

/**
 * @callback Command~usageCallback
 * @param {*=} sender If given as argument to {@link Command#getUsage}, the sender/author
 * @return {String}
 */

/**
 * @typedef {Object} Command~Context A flexible object representing a command call or tab completion context
 * @property {function} hasPermission A function which should return wether or not the sender has a specific permission
 * @property {function} getSender A function which should return the sender of the command call
 */

module.exports = Command;
