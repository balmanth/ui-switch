/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as DOM from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import { Properties } from './properties';
import { Element } from './element';

/**
 * Switch template class.
 */
@Class.Describe()
export class Template extends Control.Component<Properties> {
  /**
   * Switch states.
   */
  @Class.Private()
  private states = {
    name: ''
  };

  /**
   * Input element.
   */
  @Class.Private()
  private input: HTMLInputElement = <input type="checkbox" /> as HTMLInputElement;

  /**
   * Yes mark element.
   */
  @Class.Private()
  private yesMarkSlot: HTMLSlotElement = <slot name="yes" class="mark yes" /> as HTMLSlotElement;

  /**
   * No mark element.
   */
  @Class.Private()
  private noMarkSlot: HTMLSlotElement = <slot name="no" class="mark no" /> as HTMLSlotElement;

  /**
   * Switch slider element.
   */
  @Class.Private()
  private slider = (
    <div class="slider">
      {this.yesMarkSlot}
      {this.noMarkSlot}
    </div>
  ) as HTMLDivElement;

  /**
   * Switch element.
   */
  @Class.Private()
  private switch: HTMLLabelElement = (
    <label class="switch">
      {this.input}
      {this.slider}
    </label>
  ) as HTMLLabelElement;

  /**
   * Switch styles.
   */
  @Class.Private()
  private styles: HTMLStyleElement = (
    <style>
      {`:host > .switch > input {
  position: absolute;
  opacity: 0;
}
:host > .switch > input:not([disabled]):not([readonly]) ~ .slider {
  cursor: pointer;
}
:host > .switch > .slider {
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
}
:host > .switch > .slider > .mark {
  position: relative;
  display: inline-block;
  min-width: 1em;
  width: 100%;
}
:host > .switch > .slider > .yes {
  text-align: left;
  margin-left: -100%;
}
:host > .switch > .slider > .no {
  text-align: right;
}
:host > .switch > .slider > .no::slotted(*) {
  padding-right: 1rem;
}
:host > .switch > .slider > .no::slotted(*):before {
  content: '';
  position: absolute;
  display: inline-block;
  width: 1.25em;
  bottom: 0.25rem;
  top: 0.25rem;
  left: 0.25rem;
  border: 0.0625rem solid black;
  border-radius: 50%;
}
:host > .switch > input:checked ~ .slider > .yes {
  margin-left: 0;
}
:host > .switch > input:checked ~ .slider > .yes::slotted(*) {
  padding-left: 1rem;
}
:host > .switch > input:checked ~ .slider > .no::slotted(*):before {
  left: auto;
  right: 100%;
  margin-right: 0.25rem;
}`}
    </style>
  ) as HTMLStyleElement;

  /**
   * Switch skeleton.
   */
  @Class.Private()
  private skeleton: Element = (
    <div slot={this.properties.slot} class={this.properties.class}>
      {this.children}
    </div>
  ) as Element;

  /**
   * Switch elements.
   */
  @Class.Private()
  private elements: ShadowRoot = DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles, this.switch) as ShadowRoot;

  /**
   * Enable or disable the specified property in this elements.
   * @param property Property name.
   * @param state Determines whether the property must be enabled or disabled.
   */
  @Class.Protected()
  protected setDataProperty(property: string, state: boolean): void {
    if (state) {
      this.skeleton.dataset[property] = 'on';
    } else {
      delete this.skeleton.dataset[property];
    }
  }

  /**
   * Toggles this switch by the last toggled switch.
   * @param force Determines whether the same switch must be unchecked.
   * @returns Returns the last switch or undefined when there is no last switch.
   */
  @Class.Private()
  private toggleSwitch(force: boolean): Element | undefined {
    const last = Template.groups[this.group];
    if (last === this.skeleton) {
      if (force) {
        Template.groups[this.group] = void 0;
      }
    } else {
      if (last) {
        last.checked = false;
      }
      Template.groups[this.group] = this.skeleton;
    }
    return last;
  }

  /**
   * Click event handler.
   * @param event Event information.
   */
  @Class.Private()
  private clickHandler(event: Event): void {
    if (this.input.readOnly) {
      event.preventDefault();
    } else {
      if (this.group) {
        const last = this.toggleSwitch(!this.checked);
        if (last && last !== this.skeleton) {
          Template.notifyChanges(last);
        }
      }
      this.setDataProperty('checked', this.input.checked);
      Template.notifyChanges(this.skeleton);
    }
  }

  /**
   * Bind event handlers to update the custom element.
   */
  @Class.Private()
  private bindHandlers(): void {
    this.input.addEventListener('click', this.clickHandler.bind(this));
  }

  /**
   * Bind exposed properties to the custom element.
   */
  @Class.Private()
  private bindProperties(): void {
    Object.defineProperties(this.skeleton, {
      name: super.bindDescriptor(this, Template.prototype, 'name'),
      group: super.bindDescriptor(this, Template.prototype, 'group'),
      value: super.bindDescriptor(this, Template.prototype, 'value'),
      checked: super.bindDescriptor(this, Template.prototype, 'checked'),
      required: super.bindDescriptor(this, Template.prototype, 'required'),
      readOnly: super.bindDescriptor(this, Template.prototype, 'readOnly'),
      disabled: super.bindDescriptor(this, Template.prototype, 'disabled')
    });
  }

  /**
   * Assign all element properties.
   */
  @Class.Private()
  private assignProperties(): void {
    Control.assignProperties(this, this.properties, ['name', 'group', 'value', 'checked', 'required', 'readOnly', 'disabled']);
  }

  /**
   * Default constructor.
   * @param properties Checkbox properties.
   * @param children Checkbox children.
   */
  constructor(properties?: Properties, children?: any[]) {
    super(properties, children);
    this.bindHandlers();
    this.bindProperties();
    this.assignProperties();
  }

  /**
   * Get switch name.
   */
  @Class.Public()
  public get name(): string {
    return this.states.name;
  }

  /**
   * Set switch name.
   */
  public set name(name: string) {
    this.states.name = name;
  }

  /**
   * Get switch group.
   */
  @Class.Public()
  public get group(): string {
    return this.input.name;
  }

  /**
   * Set switch group.
   */
  public set group(name: string) {
    this.input.name = name;
  }

  /**
   * Get switch value.
   */
  @Class.Public()
  public get value(): any {
    return this.checked ? this.input.value : void 0;
  }

  /**
   * Set switch value.
   */
  public set value(value: any) {
    this.input.value = value;
  }

  /**
   * Get checked state.
   */
  @Class.Public()
  public get checked(): boolean {
    return this.input.checked;
  }

  /**
   * Set checked state.
   */
  public set checked(state: boolean) {
    this.setDataProperty('checked', state);
    this.input.checked = state;
    if (this.group) {
      this.toggleSwitch(false);
    }
  }

  /**
   * Get required state.
   */
  @Class.Public()
  public get required(): boolean {
    return this.input.required;
  }

  /**
   * Set required state.
   */
  public set required(state: boolean) {
    this.setDataProperty('required', state);
    this.input.required = state;
  }

  /**
   * Get read-only state.
   */
  @Class.Public()
  public get readOnly(): boolean {
    return this.input.readOnly;
  }

  /**
   * Set read-only state.
   */
  public set readOnly(state: boolean) {
    this.setDataProperty('readonly', state);
    this.input.readOnly = state;
  }

  /**
   * Get disabled state.
   */
  @Class.Public()
  public get disabled(): boolean {
    return this.input.disabled;
  }

  /**
   * Set disabled state.
   */
  public set disabled(state: boolean) {
    this.setDataProperty('disabled', state);
    this.input.disabled = state;
  }

  /**
   * Switch element.
   */
  @Class.Public()
  public get element(): Element {
    return this.skeleton;
  }

  /**
   * Switch groups.
   */
  @Class.Private()
  private static groups = {} as any;

  /**
   * Notify element changes.
   */
  @Class.Private()
  private static notifyChanges(element: Element): void {
    if (document.body.contains(element)) {
      element.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
    }
  }
}