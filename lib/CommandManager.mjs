/*
 * Copyright © 2020 LambdAurora <aurora42lambda@gmail.com>, Shad <adrien.burgun@orange.fr>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import {parse_arguments} from "./command_parser.mjs";
import {CommandNotFoundError} from "./error.mjs";

class CommandManager 
{
    constructor() {
        this.commands = [];
        this._prefix = '/';
        this.error_callback = (_, error) => { throw error; }; // You really should change that in your implementation.
        this._notice_command_not_found = false;
    }

    /**
     * Sets the command prefix.
     * @param prefix The command prefix.
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

    get_command(name) {
        return this.commands.filter(cmd => cmd.matchesName(name, true))[0];
    }

    process_input(context, input, prefix = true) {
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
                throw new CommandNotFoundError(cmd_name, `Command ${cmd_name} was not found.`, "kimiko.js ; CommandManager#process_input(input,prefix): ");
            return;
        }

        let args = parse_arguments(command, input.substr(first_space + 1));

        // Handler execution.
    }
}

export default CommandManager = new CommandManager();
