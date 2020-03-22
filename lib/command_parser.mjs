/*
 * Copyright © 2020 LambdAurora <aurora42lambda@gmail.com>, Shad <adrien.burgun@orange.fr>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import Argument from "./Argument.mjs";
import Command from "./Command.mjs"
import CommandArgument from "./CommandArgument.mjs";
import {SyntaxError} from "./error.mjs";

// Parse argument in the format <required_arg:type> or [optional_arg:type] and for lists: <required_list:type...> or [optional_list:type...]
const argument_regex = /(?<require>\<|\[)(?<name>[A-z][A-z0-9_]*|_[A-z0-9_]+)(?:\:(?<type>[A-z][A-z0-9_]*|_[A-z0-9_]+))?(?<list>\.\.\.)?(?:\>|\])/;

/**
 * Parses a command syntax from a string.
 * 
 * Everything is seperated by spaces and the first part is the command identifier, the other parts are the arguments.
 * 
 * @param {String} cmd A string representing the command syntax.
 */
export function parse_command_syntax(cmd) {
    let split = cmd.split(' ');
    if (split.length == 0)
        throw new Error("kimiko.js ; parse_command_syntax(cmd): Invalid command syntax.");
    let command = split[0];
    let args = [];

    // Only parse arguments if present.
    if (split.length > 1) {
        split.splice(0, 1);
        let optional_part;
        let list = false;
        args = split.filter(arg => arg.length != 0) // We remove non-valid parts.
            .map(arg => {
                if (list)
                    throw new Error(`kimiko.js ; parse_command_syntax(cmd): Command "${cmd}" is invalid, cannot have another argument after a list.`);

                let match = arg.match(argument_regex); // Let the regex do most of the job.
                if (match === null)
                    throw new Error(`kimiko.js ; parse_command_syntax(cmd): Invalid argument: "${arg}".`);

                let required = match.groups.require === '<';
                let name = match.groups.name;
                let type = Argument.from_name(match.groups.type);
                list = match.groups.list !== undefined;

                if (optional_part && required)
                    throw new Error(`kimiko.js ; parse_command_syntax(cmd): Command "${cmd}" is invalid, cannot have a required argument "${arg}" after an optional argument.`);
                optional_part = !required;

                if (type === undefined) 
                    throw new Error(`kimiko.js ; parse_command_syntax(cmd): Invalid type "${match.groups.type}".`);
                
                return new CommandArgument(required, name, type, list);
            });
    }

    return {
        name: command,
        args: args
    };
}

function split_with_quotes(input) {
    let regex = /[^\s\"]+|\"([^\"]*)\"/g;
    let result = [];
    let match;
    while ((match = regex.exec(input)) !== null) {
        if (match[1])
            result.push(match[1]);
        else
            result.push(match[0]);
    }
    return result;
}

/**
 * Parses arguments for a command.
 * 
 * @param {Command} cmd The command.
 * @param args The arguments as a string.
 * @return An array of the parsed arguments with as key the name of the argument.
 */
export function parse_arguments(cmd, args) {
    let required_args = cmd.arguments.filter(arg => arg.required).length;
    args = split_with_quotes(args);
    if (required_args > args.length)
        throw new SyntaxError(cmd, `Cannot have more required arguments (${required_args}) than specified arguments (${args.length}).`, "kimiko.js ; parse_arguments(cmd, args): ");
    
    let result = [];
    args.forEach((arg, i) => {
        let cmd_arg = cmd.arguments[i];
        let list = false;
        if (i >= cmd.arguments.length) {
            cmd_arg = cmd.arguments[cmd.arguments.length - 1];
            if (!cmd_arg.list)
                throw new SyntaxError(cmd, `Too many arguments provided (${args.length}), max: (${cmd.arguments.length}).`, "kimiko.js ; parse_arguments(cmd,args): ");
            list = true;
        } else if (cmd_arg.list) {
            result[cmd_arg.name] = [];
            list = true;
        }

        if (!cmd_arg.type.is_valid(arg)) {
            throw new SyntaxError(cmd, `Cannot parse argument "${arg}": does not comply with type "${cmd_arg.type}".`, "kimiko.js ; parse_arguments(cmd,arg): ");
        }

        if (list) {
            result[cmd_arg.name].push(cmd_arg.type.parse(arg));
        } else {
            result[cmd_arg.name] = cmd_arg.type.parse(arg);
        }
    });
    return result;
}
