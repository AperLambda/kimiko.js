/*
 * Copyright © 2020 LambdAurora <aurora42lambda@gmail.com>, Shad <adrien.burgun@orange.fr>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import {Identifier} from "lambdacommonjs";

/**
 * Represents the result of a command call.
 */
export default class CommandResult 
{
    constructor(id) {
        this.id = new Identifier(id);
    }

    /**
     * Translates the result to a human readable message.
     * 
     * @param context The context of the command execution.
     * @return {string} The translated message.
     */
    translate(context) {
        return CommandResult.translate_callback(context, this.id);
    }

    /**
     * Returns a derived command result with extra data.
     * 
     * @param data The extra data.
     * @return {CommandResult} The derived result with the extra data.
     */
    with(data) {
        let result = new CommandResult(this.id, this.translate_callback);
        result.data = data;
        return result;
    }

    /**
     * Returns whether this command result is a success or not.
     * 
     * @return {boolean} True if this result is a success, else false.
     */
    is_ok() {
        return this.id.equals(CommandResult.SUCCESS.id);
    }

    /**
     * Returns whether this command result is a runtime error or not.
     * 
     * @return {boolean} True if this result is a runtime error, else false.
     */
    is_runtime_error() {
        return this.id.equals(CommandResult.ERROR_RUNTIME.id);
    }
}

CommandResult.translate_callback = (ctx, id) => id.to_string();
CommandResult.set_translate_callback = callback => {
    CommandResult.translate_callback = callback;
};

/**
 * The command result representing a success.
 * @constant {CommandResult} CommandResult.SUCCESS
 */
CommandResult.SUCCESS = new CommandResult("kimiko:success");

/**
 * The command result representing a command not found error.
 * @constant {CommandResult} CommandResult.ERROR_NOT_FOUND
 */
CommandResult.ERROR_NOT_FOUND = new CommandResult("kimiko:error/not_found");

/**
 * The command result representing a permission error.
 * @constant {CommandResult} CommandResult.ERROR_PERMISSION
 */
CommandResult.ERROR_PERMISSION = new CommandResult("kimiko:error/permission");

/**
 * The command result representing a runtime error.
 * @constant {CommandResult} CommandResult.ERROR_RUNTIME
 */
CommandResult.ERROR_RUNTIME = new CommandResult("kimiko:error/runtime");

/**
 * The command result representing an usage error.
 * @constant {CommandResult} CommandResult.ERROR_USAGE
 */
CommandResult.ERROR_USAGE = new CommandResult("kimiko:error/usage");
