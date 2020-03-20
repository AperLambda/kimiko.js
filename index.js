/*
 * Copyright © 2018 AperLambda <aperlambda@gmail.com>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import * as kimiko from "./lib/kimiko.mjs";
import {parse_command_syntax, parse_arguments} from "./lib/command_parser.mjs";

/*module.exports.Command = require("./lib/Command");
module.exports.CommandResult = require("./lib/CommandResult");
module.exports.CommandBuilder = require("./lib/CommandBuilder");
module.exports.CommandManager = require("./lib/CommandManager");*/

let test_command_syntax = "chloe:remindme <event> <date> [repeat:boolean] [users:int...]";
let parsed_cmd;
console.log(test_command_syntax);
console.log(parsed_cmd = parse_command_syntax(test_command_syntax));
let cmd = new kimiko.Command(parsed_cmd.name);
cmd.arguments = parsed_cmd.args;
console.log(parse_arguments(cmd, '"this is an event" 23:35:20 yes 5050 0o56'))


