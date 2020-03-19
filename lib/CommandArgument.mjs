/*
 * Copyright © 2020 LambdAurora <aurora42lambda@gmail.com>, Shad <adrien.burgun@orange.fr>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

export default class CommandArgument 
{
    constructor(required, name, type, list) {
        this.required = required;
        this.name = name;
        this.type = type;
        this.list = list;
    }

    toString() {
        return (this.required ? '<' : '[') + this.name + ':' + this.type + (this.required ? '>' : ']');
    }

    toJSON() {
    }
}
