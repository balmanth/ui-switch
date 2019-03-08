"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the basic switch element.
 */
const Switch = require("../source");
const DOM = require("@singleware/jsx");
const field = (DOM.create(Switch.Template, null,
    DOM.create("div", { slot: "mark" }),
    DOM.create("div", { slot: "no" }, "No"),
    DOM.create("div", { slot: "yes" }, "Yes")));
// Change disabled property of the element.
field.disabled = true;
// Change read-only property of the element.
field.readOnly = true;
// Change required property of the element.
field.required = true;
// Change name property of the element.
field.name = 'new-name';
// Change group of the element.
field.group = 'name';
// Change value property of the element.
field.value = '1';
