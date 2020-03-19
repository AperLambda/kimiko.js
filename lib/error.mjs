/*
 * Copyright © 2020 LambdAurora <aurora42lambda@gmail.com>, Shad <adrien.burgun@orange.fr>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

class KimikoError extends Error
{
    constructor(prefix, message) {
        super(prefix + message);
        this.user_message = message;
    }
}

/**
 * Represents a command not found error.
 */
export class CommandNotFoundError extends KimikoError
{
    constructor(cmd, message, prefix) {
        super(prefix, message);
        this.name = "CommandNotFoundError";
        this.cmd = cmd;
    }
}

/**
 * Represents a command syntax error.
 */
export class SyntaxError extends KimikoError
{
    constructor(cmd, message, prefix) {
        super(prefix, message);
        this.name = "SyntaxError";
        this.cmd = cmd;
    }
}
