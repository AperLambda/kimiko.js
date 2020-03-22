import {TestUnit} from "lambdacommonjs";
import * as kimiko from "../lib/kimiko.mjs";

let test_command_syntax = "chloe:remindme <event> <date> [repeat:boolean] [users:int...]";
let test_message = "\"this is an event\" 23:35:20 yes 5050 0o56";

function compareMap(map1, map2) {
    if (map1.length != map2.length)
        return false;

    return map1.every((key, value) => key in map2 && map2[key] === value);
}

let result = new TestUnit()
    .section("kimiko:parser", section => {
        let parsed_cmd;
        section.add("parse_command_syntax", () => {
            return JSON.stringify(parsed_cmd = kimiko.parse_command_syntax(test_command_syntax));
        }, JSON.stringify({ 
            name: "chloe:remindme",
            args: [
                new kimiko.CommandArgument(true, "event", kimiko.Argument.STRING_ARGUMENT, false),
                new kimiko.CommandArgument(true, "date", kimiko.Argument.STRING_ARGUMENT, false),
                new kimiko.CommandArgument(false, "repeat", kimiko.Argument.BOOLEAN_ARGUMENT, false),
                new kimiko.CommandArgument(false, "users", kimiko.Argument.INT_ARGUMENT, true)
            ]
        }));

        let res = [];
        res["event"] = "this is an event";
        res["date"] = "23:35:20";
        res["repeat"] = true;
        res["users"] = [5050, 0o56];
        section.add("parse_arguments", () => {
            let command = new kimiko.Command(parsed_cmd.name);
            command.arguments = parsed_cmd.args;
            return compareMap(kimiko.parse_arguments(command, test_message), res);
        }, true);
    })
    .test();

if (!result)
    process.exit(1);

class Context
{
    constructor(name, message) {
        this.name = name;
        this.message = message;
    }

    send_message(message) {
        console.log(message);
    }

    // Required
    has_permission(permission) {
        return true;
    }
}

test_message = "c&remindme \"A random event\" 22/03/2020 true";

kimiko.get()
    .verbose(true)
    .prefix("c&")
    .on_error((ctx, result) => {
        if (result.is_runtime_error()) throw result.data;
        else if (result.is_usage_error()) ctx.send_message(result.translate(ctx) + ": " + JSON.stringify(result.data));
        else ctx.send_message(result.translate(ctx) + ": " + result.data);
    })
    .notice_command_not_found(true)
    .command("chloe:remindme <event> <date> [repeat:boolean]")
        .description("Remind later an event.")
        .permission(null)
        .aliases("remind")
        .handler((ctx, label, args) => {
            ctx.send_message(`Remind you: "${args["event"]}" at ${args["date"]}`);
            return kimiko.CommandResult.SUCCESS;
        })
        .register()
    .process_input(new Context("Pierre", test_message), test_message);
