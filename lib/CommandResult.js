/*
 * Copyright © 2018 AperLambda <aperlambda@gmail.com>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

/**
 * The CommandResult class, it represents the result of a command call, which is a callback returning a String ({@link CommandResult#callable})
 */
class CommandResult {
  /**
   * @param {CommandResult#callable} callable The callback function
   */
  constructor(callable)
  {
    if (!typeof callable == "function") {
      throw new Error(`kimiko.js, new CommandResult(callable): 'callable' should be a function, got ${typeof callable}.`);
    }
    this.callable = callable;
  }

  /**
   * Calls the callback function, logs the error if the callback failed
   * @return {String}
   */
  call()
  {
    try {
      return this.callable();
    } catch (e) {
      console.error("kimiko.js: CommandResult execution failed", e);
    }
  }
}


/**
 * @callback CommandResult#callable The callback for the result of a command call; it should return a String representing what the result was
 * @return {String}
 */


/**
 * The command result representing a permission error, its callback will return `"translate:error.permission"`.
 * @constant {CommandResult} CommandResult.ERROR_PERMISSION
 */
CommandResult.ERROR_PERMISSION = new CommandResult(() => "translate:error.permission");

/**
 * The command result representing a usage error, its callback will return `"translate:error.usage"`.
 * @constant {CommandResult} CommandResult.ERROR_USAGE
 */
CommandResult.ERROR_USAGE = new CommandResult(() => "translate:error.usage");

/**
 * The command result representing a runtime error during the command execution, its callback will return `"translate:error.runtime"`.
 * @constant {CommandResult} CommandResult.ERROR_RUNTIME
 */
CommandResult.ERROR_RUNTIME = new CommandResult(() => "translate:error.runtime");

module.exports = CommandResult;
