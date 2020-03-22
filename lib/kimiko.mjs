/*
 * Copyright © 2020 LambdAurora <aurora42lambda@gmail.com>, Shad <adrien.burgun@orange.fr>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import kimiko_Argument from "./Argument.mjs";
export const Argument = kimiko_Argument;
import kimiko_Command from "./Command.mjs";
export const Command = kimiko_Command;
import kimiko_CommandArgument from "./CommandArgument.mjs";
export const CommandArgument = kimiko_CommandArgument;
import kimiko_CommandManager from "./CommandManager.mjs";
export const CommandManager = kimiko_CommandManager;
import kimiko_CommandResult from "./CommandResult.mjs";
export const CommandResult = kimiko_CommandResult;

import * as kimiko_parser from "./command_parser.mjs";
export const parse_command_syntax = kimiko_parser.parse_command_syntax;
export const parse_arguments = kimiko_parser.parse_arguments;

export function get() {
    return kimiko_CommandManager;
}
