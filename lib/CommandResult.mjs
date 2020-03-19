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
    constructor(id, translate_callback = (context, id) => id.to_string()) {
        this.id = new Identifier(id);
        this.translate_callback = translate_callback;
    }

    /**
     * Translates the result to a human readable message.
     * @param context The context of the command execution.
     * @return {string} The translated message.
     */
    translate(context) {
        return this.translate_callback(context, this.id);
    }

    with(data) {
        let result = new CommandResult(this.id, this.translate_callback);
        result.data = data;
        return data;
    }
}

/**
 * The command result representing a success.
 * @constant {CommandResult} CommandResult.SUCCESS
 */
CommandResult.SUCCESS = new CommandResult("kimiko:success");

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
