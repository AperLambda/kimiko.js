/*
 * Copyright © 2020 LambdAurora <aurora42lambda@gmail.com>, Shad <adrien.burgun@orange.fr>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import CommandBuilder from "./CommandBuilder.mjs";
import {parse_arguments} from "./command_parser.mjs";
import {CommandNotFoundError} from "./error.mjs";
import CommandResult from "./CommandResult.mjs";

class CommandManager 
{
    constructor() {
        this.commands = [];
        this._prefix = '/';
        this.error_callback = (_, result) => { if (result.is_runtime_error()) throw result.data; }; // You really should change that in your implementation.
        this._notice_command_not_found = false;
    }

    /**
     * Sets the command prefix.
     * @param {String} prefix The command prefix.
     * @return {CommandManager} Current manager instance.
     */
    prefix(prefix) {
        this._prefix = prefix;
        return this;
    }

    on_error(callback) {
        this.error_callback = callback;
        return this;
    }

    notice_command_not_found(notice) {
        this._notice_command_not_found = notice;
        return this;
    }

    /**
     * Creates a command builder.
     * @param {String} cmd Command syntax.
     */
    command(cmd) {
        return new CommandBuilder(cmd);
    }

    /**
     * Registers the specified command.
     * @param {Command} command The command to register.
     * @return {CommandManager} Current manager instance.
     * @throws If the command is undefined.
     */
    register(command) {
        if (command === undefined)
            throw new Error("kimiko.js ; CommandManager#register(command): Cannot register an undefined command.");
        this.commands.push(command);
        return this;
    }

    get_command(name) {
        return this.commands.filter(cmd => cmd.matches_name(name, true))[0];
    }

    process_input(context, input, prefix = true) {
        let result = this._process_input();
        if (!result.is_ok())
            this.error_callback(context, result);
        try {
            this._process_input(input, prefix);
        } catch (e) {
            this.error_callback(context, e);
        }
    }

    _process_input(input, prefix = true) {
        if (prefix && !input.startsWith(_prefix))
            return;
        else if (prefix) {
            input = input.substr(prefix.length - 1);
        }

        let first_space = input.indexOf(' ');
        let cmd_name = input.substr(0, first_space);
        
        let command = get_command(cmd_name);
        if (command === undefined) {
            if (this._notice_command_not_found)
                return CommandResult.ERROR_NOT_FOUND.with(cmd_name);
            return CommandResult.SUCCESS;
        }

        let args = [];
        try {
            args = parse_arguments(command, input.substr(first_space + 1));
        } catch (error) {
            return CommandResult.ERROR_USAGE.with({command: command, error: error.name, details: error.user_message});
        }

        // Handler execution.
        try {
            return command.handle(context, cmd_name, args);
        } catch (error) {
            return CommandResult.ERROR_RUNTIME.with(error);
        }
    }
}

export default CommandManager = new CommandManager();
