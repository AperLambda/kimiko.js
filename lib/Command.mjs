/*
 * Copyright © 2020 LambdAurora <aurora42lambda@gmail.com>, Shad <adrien.burgun@orange.fr>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import CommandResult from "./CommandResult.mjs"
import {Identifier} from "lambdacommonjs";

export default class Command 
{
    constructor(id, parent) {
        this.id = new Identifier(id);
        this.parent = parent;
        this.arguments = [];
        this.aliases = [];
        this.description = "";
        this.handler = (cmd, context, args) => CommandResult.SUCCESS;
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
     * Returns whether or not the `name` matches the name and optionally any alias.
     * @param {(String|Identifier)} name The name to compare to.
     * @param {boolean=} aliases=true Whether or not it should search within the aliases aswell.
     * @return {boolean}
     */
    matchesName(name, aliases = true)
    {
        return this.id.equals(name) || this.id.name === name || aliases && this.aliases.includes(name.toString());
    }

    /**
     * Internal execution function, which you should **NOT** use, unless you don't care about the permission and argument check.
     * @private
     * @param {Command~Context} context Context of the command call.
     * @param {String} label Name by which the command was called.
     * @param {String[]} args Arguments for the call.
     * @throws Will throw an error if the command does not have an executor.
     * @return {CommandResult} The result of the execution.
     */
    _execute(context, label, args = [])
    {
        if (!this.executor) {
            throw new Error(`kimiko.js ; Command::_execute(...): Command::handler hasn't been defined yet.`);
        }
        context.cmd = this;
        return this.handler(context, label, args);
    }
}