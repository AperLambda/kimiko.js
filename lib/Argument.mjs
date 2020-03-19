/*
 * Copyright © 2020 LambdAurora <aurora42lambda@gmail.com>, Shad <adrien.burgun@orange.fr>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

/**
 * Represents an argument type.
 * 
 * An argument type holds the validator and the parser.
 */
export default class Argument 
{
    constructor(name, regex, mapper) {
        this.name = name;
        this.regex = regex;
        this.mapper = mapper;
    }

    /**
     * Checks whether the input is a valid value.
     * 
     * @param input The input string.
     */
    is_valid(input) {
        return input.match(this.regex) !== null;
    }

    /**
     * Parses the input to a value.
     * 
     * @param input The input string.
     */
    parse(input) {
        return this.mapper(input.match(this.regex));
    }

    toString() {
        return this.name;
    }

    toJSON() {
        return this.name;
    }
}

Argument.ARGUMENTS = [];
Argument.register = (argument, regex, mapper) => {
    if (regex !== undefined && mapper !== undefined) {
        return Argument.register(new Argument(argument, regex, mapper));
    }
    Argument.ARGUMENTS[argument.name] = argument;
    return argument;
};
Argument.from_name = name => (name !== undefined ? Argument.ARGUMENTS[name] : Argument.STRING_ARGUMENT);

/**
 * Match any string.
 * @constant {Argument} Argument.STRING_ARGUMENT
 */
Argument.STRING_ARGUMENT = Argument.register("string", /.*/, matched => matched[0]);

/**
 * Match a word (string with no whitespace).
 * @constant {Argument} Argument.WORD_ARGUMENT
 */
Argument.WORD_ARGUMENT = Argument.register("word", /^\S+$/, matched => matched[0]);

/**
 * Match a boolean (case insensitive)
 * - True: 1, true, y, yes
 * - False: 0, false, n, no
 * @constant {Argument} Argument.BOOLEAN_ARGUMENT
 */
Argument.BOOLEAN_ARGUMENT = Argument.register("boolean", /^(?<f>false|no?|0)|(?<t>true|y(es)?|1)$/i, matched => matched.groups.f === undefined);

/**
 * Match a number and convert it to an int.
 * @constant {Argument} Argument.INT_ARGUMENT
 */
Argument.INT_ARGUMENT = Argument.register("int", /^[-+]?\d+|0x[0-9A-Fa-f]+|0o[0-7]+$/, matched => parseInt(matched[0]));

/**
 * Match a floating point number and convert it to a float.
 * @constant {Argument} Argument.FLOAT_ARGUMENT
 */
Argument.FLOAT_ARGUMENT = Argument.register("float", /^-?\d+(\.\d+])?$/, matched => parseFloat(matched[0]));

/**
 * Match an URI.
 * @constant {Argument} Argument.URI_ARGUMENT
 */
Argument.URI_ARGUMENT = Argument.register("uri", /^[a-z]+\:.+$/, matched => matched[0]);

/**
 * Match an URL.
 * @constant {Argument} Argument.URL_ARGUMENT
 */
Argument.URL_ARGUMENT = Argument.register("url", /^[a-z]+\:\/\/.+$/, matched => matched[0]);
