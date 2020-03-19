/*
 * Copyright © 2020 LambdAurora <aurora42lambda@gmail.com>, Shad <adrien.burgun@orange.fr>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import Command from "./Command.mjs";

export default class CommandBuilder 
{
    constructor(command) {

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

    build() {
        let cmd = new Command();
        if (this._permission) cmd.permission = this._permission;
        return cmd;
    }
}
