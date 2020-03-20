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
        this.handler = (context, label, args) => CommandResult.SUCCESS;
    }

    /**
     * Returns whether or not the command is a child command
     * @return {boolean}
     */
    has_parent()
    {
        return !!this.parent;
    }

    /**
     * Returns whether or not the `name` matches the name and optionally any alias.
     * @param {(String|Identifier)} name The name to compare to.
     * @param {boolean=} aliases=true Whether or not it should search within the aliases aswell.
     * @return {boolean}
     */
    matches_name(name, aliases = true)
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

    /**
     * Internal function, checks for the required permission and executes the command's executor through {@link Command#_execute}
     * @private
     * @param {Command~Context} context Context of the command call
     * @param {String} label Name by which the command was called
     * @param {String[]} args Arguments for the call
     * @throws Will throw if `executor` was not set
     * @return {CommandResult} The result of the executor or, if the permissions aren't valid, {@link CommandResult.ERROR_PERMISSION}
     */
    _handle_local_execution(context, label, args = [])
    {
        if (this.permission && !context.has_permission(this.permission)) {
            return CommandResult.ERROR_PERMISSION.with(this.permission);
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
    handle(context, label, args = [])
    {
      let result = 0;

        if (!args.length) {
            result = this._handle_local_execution(context, label, args);
        } else {
            let sub_label = args[0];
            let sub_command = this.get_sub_command(sub_label);
            if (sub_command) {
                // no permission check: the subcommand may do it by itself
                return sub_command.handle(context, sub_label, args.slice(1));
            } else {
                result = this._handle_local_execution(context, label, args);
            }
        }

        if (result == CommandResult.ERROR_USAGE) {
            let usage = this.getUsage(context.getSender()).replace("<command>", this.getName());
            return [result, usage];
        }

        return result;
    }
}
