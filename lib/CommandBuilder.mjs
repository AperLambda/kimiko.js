/*
 * Copyright © 2020 LambdAurora <aurora42lambda@gmail.com>, Shad <adrien.burgun@orange.fr>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import Command from "./Command.mjs";
import CommandManager from "./CommandManager.mjs";
import {parse_command_syntax} from "./command_parser.mjs";

export default class CommandBuilder 
{
    constructor(command, applier = cmd => CommandManager.register(cmd)) {
        let cmd = parse_command_syntax(command);
        this.id = cmd.name;
        this.arguments = cmd.arguments;
        this.subcommands = [];
        this.applier = applier;
    }

    description(descr) {
        this._description = descr;
        return this;
    }

    permission(perm) {
        this._permission = perm;
        return this;
    }

    handler(callback) {
        this._handler = callback;
        return this;
    }

    suggestion_handler(callback) {
        this._suggestion_handler = callback;
        return this;
    }

    /**
     * Adds a subcommand.
     * @param {Command|String} command The subcommand (syntax) to add.
     */
    command(command) {
        if (command instanceof String) {
            return new CommandBuilder(command, this.subcommand);
        } else {
            return this.subcommand(command);
        }
    }

    /**
     * Adds a subcommand.
     * @param {Command} command The subcommand to add.
     */
    subcommand(command) {
        if (this.subcommands.some(registered => registered.id.equals(command.id)))
            throw new Error("kimiko.js ; CommandBuilder#subcommand(command): Cannot register an already registered subcommand.");

        this.subcommands[command.id.path] = command;
        return this;
    }

    build() {
        let cmd = new Command(this.id);
        cmd.arguments = this.arguments;
        if (this._permission) cmd.permission = this._permission;
        this.subcommands.forEach(sub => cmd.addSubCommand(sub));
        return cmd;
    }

    register() {
        let cmd = this.build();
        return this.applier(cmd);
    }
}
