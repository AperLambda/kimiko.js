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
import {Identifier} from "lambdacommonjs";

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
        if (command == undefined)
            throw new Error("kimiko.js ; CommandManager#register(command): Cannot register an undefined command.");
        this.commands.push(command);
        return this;
    }

    /**
     * Returns whether a {@link Command} exists within `CommandManager`'s `Command`s.
     * @param {(Command|String|Identifier)} command Command or name/alias to look for.
     * @return {boolean} True if the asked command was found, else false.
     */
    has_command(command) {
        if (typeof command == "string" || command instanceof Identifier) {
            return !!this.get_command(command);
        } else if (typeof command == "object") {
            return this.commands.includes(command);
        }
        return false;
    }

    /**
     * Matches and returns a {@link Command} from `CommandManager`'s `Command`s if found.
     * @param {(String|Identifier)} name The name or alias of the command to find.
     * @return {?Command} The asked command, if found.
     */
    get_command(name) {
        if (typeof name != "string" && !(name instanceof Identifier)) {
            throw new Error(`kimiko.js ; CommandManager#get_command(name): 'name' should be a string or an Identifier, got ${typeof name}`);
        }
        return this.commands.find((c) => c.matches_name(name, true));
    }

    /**
     * Gets rid of all the registered {@link Command}s
     */
    clear_commands() {
        this.commands = [];
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
        if (command == undefined) {
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
