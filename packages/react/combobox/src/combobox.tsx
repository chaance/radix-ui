import * as React from 'react';
import { createCollection } from '@radix-ui/react-collection';
import { createContextScope } from '@radix-ui/react-context';
import { useDirection } from '@radix-ui/react-direction';
import type { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { useId } from '@radix-ui/react-id';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { createPopperScope } from '@radix-ui/react-popper';
import type { Primitive } from '@radix-ui/react-primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';

import type { Scope } from '@radix-ui/react-context';

type Direction = 'ltr' | 'rtl';

/* -------------------------------------------------------------------------------------------------
 * Combobox (Root)
 * -----------------------------------------------------------------------------------------------*/

const COMBOBOX_NAME = 'Combobox';

type ItemData = { value: string; disabled: boolean; textValue: string };
type ComboboxItemElement = HTMLDivElement;
type ComboboxInputElement = HTMLInputElement;
type ComboboxTriggerElement = HTMLButtonElement;
type ComboboxContentElement = HTMLDivElement;

const [Collection, useCollection, createCollectionScope] = createCollection<
  ComboboxItemElement,
  ItemData
>(COMBOBOX_NAME);

type ScopedProps<P> = P & { __scopeCombobox?: Scope };
const [createComboboxContext, createComboboxScope] = createContextScope(COMBOBOX_NAME, [
  createCollectionScope,
  createPopperScope,
]);
const usePopperScope = createPopperScope();

type ComboboxContextValue = {
  contentId: string;
  inputId: string;
  labelId: string;
  disabled: boolean;
  multiple: boolean;
  open: boolean;
  onOpenChange(open: boolean): void;
  inputValue: string;
  onInputValueChange(value: string): void;
  value: string | string[];
  onValueChange(value: string | string[]): void;
  dir: Direction;
  allowCustomValue: boolean;
  resetInputOnSelect: boolean;
  openOnFocus: boolean;
  openOnInput: boolean;
  autocompleteBehavior: 'list' | 'both' | 'none';
  initialHighlight: 'selected' | 'first' | 'none';
  loop: boolean;
  highlightedItemId: string;
  onHighlightedItemIdChange(id: string): void;
  inputRef: React.RefObject<ComboboxInputElement | null>;
  triggerRef: React.RefObject<ComboboxTriggerElement | null>;
  contentRef: React.RefObject<ComboboxContentElement | null>;
};

const [ComboboxProvider, useComboboxContext] =
  createComboboxContext<ComboboxContextValue>(COMBOBOX_NAME);

/* -------------------------------------------------------------------------------------------------
 * ComboboxProps
 * -----------------------------------------------------------------------------------------------*/

interface ComboboxBaseProps {
  children: React.ReactNode;

  /** Controlled value for the input */
  inputValue?: string;

  /** Default value for the input */
  defaultInputValue?: string;

  /** Event handler called when the input value changes */
  onInputValueChange?: (value: string) => void;

  /** Controlled open state for the popover */
  open?: boolean;

  /** Default value for the popover's open state */
  defaultOpen?: boolean;

  /** Reading direction */
  dir?: Direction;

  /** Event handler called when the popover's open state changes */
  onOpenChange?: (open: boolean) => void;

  /**
   * Allow values not matching any item.
   *
   * - When `false` (default), the input value is reverted to the selected
   *   item's text on blur.
   * - When `true`, any typed value is preserved on blur even if it doesn't
   *   match an item.
   *
   * @default false
   */
  allowCustomValue?: boolean;

  /**
   * Reset input text after selecting an item
   * @default true for multi-select, false for single-select
   */
  resetInputOnSelect?: boolean;

  /**
   * Whether or not to open the popover when the input receives focus
   * @default false
   */
  openOnFocus?: boolean;

  /**
   * Whether or not to open the popover when the user types into the input
   * @default true
   */
  openOnInput?: boolean;

  /**
   * Controls the autocomplete behavior and the corresponding
   * `aria-autocomplete` value on the input.
   *
   * - `"list"` (default): Suggestions are presented in a popup list.
   * - `"both"`: Suggestions are presented in a popup list AND the input
   *   auto-completes with the best inline match.
   * - `"none"`: No autocomplete behavior; the popup acts as a generic
   *   container.
   *
   * @default "list"
   */
  autocompleteBehavior?: 'list' | 'both' | 'none';

  /**
   * Controls which item is highlighted when the popover opens.
   *
   * - `"selected"` (default): Highlights the currently selected item, falling
   *   back to the first enabled item.
   * - `"first"`: Always highlights the first enabled item.
   * - `"none"`: No item is highlighted until the user navigates with arrow
   *   keys.
   *
   * @default "selected"
   */
  initialHighlight?: 'selected' | 'first' | 'none';

  /**
   * Whether or not to disable the entire combobox
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether or not to wrap arrow key navigation from last item to first and
   * vice versa.
   * @default false
   */
  loop?: boolean;
}

interface ComboboxSingleProps extends ComboboxBaseProps {
  /**
   * Whether or not the combobox allows multiple selections
   * @default false
   */
  multiple?: false;
  /** The controlled selected value */
  value?: string;
  /** The default selected value */
  defaultValue?: string;
  /** Event handler called when the selected value changes */
  onValueChange?: (value: string) => void;
}

interface ComboboxMultipleProps extends ComboboxBaseProps {
  /**
   * Whether or not the combobox allows multiple selections
   * @default false
   */
  multiple: true;
  /** The controlled selected values */
  value?: string[];
  /** The default selected values */
  defaultValue?: string[];
  /** Event handler called when the selected values change */
  onValueChange?: (value: string[]) => void;
}

type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

const Combobox: React.FC<ComboboxProps> = (props: ScopedProps<ComboboxProps>) => {
  const {
    __scopeCombobox,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    inputValue: inputValueProp,
    defaultInputValue,
    onInputValueChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    multiple = false,
    allowCustomValue = false,
    resetInputOnSelect = multiple,
    openOnFocus = false,
    openOnInput = true,
    autocompleteBehavior = 'list',
    initialHighlight = 'selected',
    disabled = false,
    loop = false,
    dir,
  } = props;

  const popperScope = usePopperScope(__scopeCombobox);
  const direction = useDirection(dir);

  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: COMBOBOX_NAME,
  });

  const [inputValue, setInputValue] = useControllableState({
    prop: inputValueProp,
    defaultProp: defaultInputValue ?? '',
    onChange: onInputValueChange,
    caller: COMBOBOX_NAME,
  });

  const [value, setValue] = useControllableState({
    prop: valueProp as string | string[] | undefined,
    defaultProp: (defaultValue as string | string[] | undefined) ?? (multiple ? [] : ''),
    onChange: onValueChange as ((value: string | string[]) => void) | undefined,
    caller: COMBOBOX_NAME,
  });

  const [highlightedItemId, setHighlightedItemId] = React.useState('');

  const inputRef = React.useRef<ComboboxInputElement>(null);
  const triggerRef = React.useRef<ComboboxTriggerElement>(null);
  const contentRef = React.useRef<ComboboxContentElement>(null);

  const contentId = useId();
  const inputId = useId();
  const labelId = useId();

  return (
    <PopperPrimitive.Root {...popperScope}>
      <ComboboxProvider
        scope={__scopeCombobox}
        contentId={contentId}
        inputId={inputId}
        labelId={labelId}
        disabled={disabled}
        multiple={multiple}
        open={open}
        onOpenChange={setOpen}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        value={value}
        onValueChange={setValue}
        dir={direction}
        allowCustomValue={allowCustomValue}
        resetInputOnSelect={resetInputOnSelect}
        openOnFocus={openOnFocus}
        openOnInput={openOnInput}
        autocompleteBehavior={autocompleteBehavior}
        initialHighlight={initialHighlight}
        loop={loop}
        highlightedItemId={highlightedItemId}
        onHighlightedItemIdChange={setHighlightedItemId}
        inputRef={inputRef}
        triggerRef={triggerRef}
        contentRef={contentRef}
      >
        <Collection.Provider scope={__scopeCombobox}>{children}</Collection.Provider>
      </ComboboxProvider>
    </PopperPrimitive.Root>
  );
};

Combobox.displayName = COMBOBOX_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'ComboboxLabel';

type PrimitiveLabelProps = React.ComponentPropsWithoutRef<typeof Primitive.label>;
interface ComboboxLabelProps extends PrimitiveLabelProps {}

const ComboboxLabel = React.forwardRef<HTMLLabelElement, ComboboxLabelProps>(
  (_props: ScopedProps<ComboboxLabelProps>, _ref) => {
    throw new Error(`${LABEL_NAME}: not implemented`);
  },
);

ComboboxLabel.displayName = LABEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'ComboboxAnchor';

type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ComboboxAnchorProps extends PrimitiveDivProps {}

const ComboboxAnchor = React.forwardRef<HTMLDivElement, ComboboxAnchorProps>(
  (_props: ScopedProps<ComboboxAnchorProps>, _ref) => {
    throw new Error(`${ANCHOR_NAME}: not implemented`);
  },
);

ComboboxAnchor.displayName = ANCHOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxInput
 * -----------------------------------------------------------------------------------------------*/

const INPUT_NAME = 'ComboboxInput';

type PrimitiveInputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface ComboboxInputProps extends PrimitiveInputProps {}

const ComboboxInput = React.forwardRef<ComboboxInputElement, ComboboxInputProps>(
  (_props: ScopedProps<ComboboxInputProps>, _ref) => {
    throw new Error(`${INPUT_NAME}: not implemented`);
  },
);

ComboboxInput.displayName = INPUT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'ComboboxTrigger';

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface ComboboxTriggerProps extends PrimitiveButtonProps {}

const ComboboxTrigger = React.forwardRef<ComboboxTriggerElement, ComboboxTriggerProps>(
  (_props: ScopedProps<ComboboxTriggerProps>, _ref) => {
    throw new Error(`${TRIGGER_NAME}: not implemented`);
  },
);

ComboboxTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxCancel
 * -----------------------------------------------------------------------------------------------*/

const CANCEL_NAME = 'ComboboxCancel';

interface ComboboxCancelProps extends PrimitiveButtonProps {}

const ComboboxCancel = React.forwardRef<HTMLButtonElement, ComboboxCancelProps>(
  (_props: ScopedProps<ComboboxCancelProps>, _ref) => {
    throw new Error(`${CANCEL_NAME}: not implemented`);
  },
);

ComboboxCancel.displayName = CANCEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'ComboboxPortal';

interface ComboboxPortalProps {
  children?: React.ReactNode;
  /**
   * Target container for the portal
   * @default document.body
   */
  container?: Element | DocumentFragment | null;
  /** Force mount the portal */
  forceMount?: true;
}

const ComboboxPortal: React.FC<ComboboxPortalProps> = (
  _props: ScopedProps<ComboboxPortalProps>,
) => {
  throw new Error(`${PORTAL_NAME}: not implemented`);
};

ComboboxPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ComboboxContent';

type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;

interface ComboboxContentProps
  extends Omit<PopperContentProps, 'onPlaced'>,
    Omit<DismissableLayerProps, 'onDismiss'> {
  /** Force mount the content */
  forceMount?: true;
  /** Event handler called when auto-focusing on close */
  onCloseAutoFocus?: (event: Event) => void;
}

const ComboboxContent = React.forwardRef<ComboboxContentElement, ComboboxContentProps>(
  (_props: ScopedProps<ComboboxContentProps>, _ref) => {
    throw new Error(`${CONTENT_NAME}: not implemented`);
  },
);

ComboboxContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ComboboxGroup';

interface ComboboxGroupProps extends PrimitiveDivProps {}

const ComboboxGroup = React.forwardRef<HTMLDivElement, ComboboxGroupProps>(
  (_props: ScopedProps<ComboboxGroupProps>, _ref) => {
    throw new Error(`${GROUP_NAME}: not implemented`);
  },
);

ComboboxGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxGroupLabel
 * -----------------------------------------------------------------------------------------------*/

const GROUP_LABEL_NAME = 'ComboboxGroupLabel';

interface ComboboxGroupLabelProps extends PrimitiveDivProps {}

const ComboboxGroupLabel = React.forwardRef<HTMLDivElement, ComboboxGroupLabelProps>(
  (_props: ScopedProps<ComboboxGroupLabelProps>, _ref) => {
    throw new Error(`${GROUP_LABEL_NAME}: not implemented`);
  },
);

ComboboxGroupLabel.displayName = GROUP_LABEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ComboboxItem';

interface ComboboxItemProps extends PrimitiveDivProps {
  /**
   * The value submitted when this item is selected
   * @required
   */
  value: string;
  /**
   * Whether or not the item is disabled. Disabled items are skipped during
   * keyboard navigation and are not selectable.
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional text used for matching during typeahead. Defaults to the text
   * content of `ComboboxItemText`.
   */
  textValue?: string;
}

const ComboboxItem = React.forwardRef<ComboboxItemElement, ComboboxItemProps>(
  (_props: ScopedProps<ComboboxItemProps>, _ref) => {
    throw new Error(`${ITEM_NAME}: not implemented`);
  },
);

ComboboxItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxItemText
 * -----------------------------------------------------------------------------------------------*/

const ITEM_TEXT_NAME = 'ComboboxItemText';

type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface ComboboxItemTextProps extends PrimitiveSpanProps {
  /**
   * When `true`, wraps any substrings of the item's text that match the current
   * `inputValue` in a `<span data-highlighted-text>` element for optional
   * styling.
   *
   * @default false
   */
  highlightMatches?: boolean;
}

const ComboboxItemText = React.forwardRef<HTMLSpanElement, ComboboxItemTextProps>(
  (_props: ScopedProps<ComboboxItemTextProps>, _ref) => {
    throw new Error(`${ITEM_TEXT_NAME}: not implemented`);
  },
);

ComboboxItemText.displayName = ITEM_TEXT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const ITEM_INDICATOR_NAME = 'ComboboxItemIndicator';

interface ComboboxItemIndicatorProps extends PrimitiveSpanProps {
  /** Force mount the indicator */
  forceMount?: true;
}

const ComboboxItemIndicator = React.forwardRef<HTMLSpanElement, ComboboxItemIndicatorProps>(
  (_props: ScopedProps<ComboboxItemIndicatorProps>, _ref) => {
    throw new Error(`${ITEM_INDICATOR_NAME}: not implemented`);
  },
);

ComboboxItemIndicator.displayName = ITEM_INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'ComboboxSeparator';

interface ComboboxSeparatorProps extends PrimitiveDivProps {}

const ComboboxSeparator = React.forwardRef<HTMLDivElement, ComboboxSeparatorProps>(
  (_props: ScopedProps<ComboboxSeparatorProps>, _ref) => {
    throw new Error(`${SEPARATOR_NAME}: not implemented`);
  },
);

ComboboxSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'ComboboxArrow';

type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>;
interface ComboboxArrowProps extends PopperArrowProps {}

const ComboboxArrow = React.forwardRef<SVGSVGElement, ComboboxArrowProps>(
  (_props: ScopedProps<ComboboxArrowProps>, _ref) => {
    throw new Error(`${ARROW_NAME}: not implemented`);
  },
);

ComboboxArrow.displayName = ARROW_NAME;

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/

export {
  createComboboxScope,
  //
  Combobox,
  ComboboxLabel,
  ComboboxAnchor,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxCancel,
  ComboboxPortal,
  ComboboxContent,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxItem,
  ComboboxItemText,
  ComboboxItemIndicator,
  ComboboxSeparator,
  ComboboxArrow,
  //
  Combobox as Root,
  ComboboxLabel as Label,
  ComboboxAnchor as Anchor,
  ComboboxInput as Input,
  ComboboxTrigger as Trigger,
  ComboboxCancel as Cancel,
  ComboboxPortal as Portal,
  ComboboxContent as Content,
  ComboboxGroup as Group,
  ComboboxGroupLabel as GroupLabel,
  ComboboxItem as Item,
  ComboboxItemText as ItemText,
  ComboboxItemIndicator as ItemIndicator,
  ComboboxSeparator as Separator,
  ComboboxArrow as Arrow,
  //
  Collection,
  useCollection,
  usePopperScope,
  useComboboxContext,
  COMBOBOX_NAME,
};

export type {
  ComboboxProps,
  ComboboxSingleProps,
  ComboboxMultipleProps,
  ComboboxLabelProps,
  ComboboxAnchorProps,
  ComboboxInputProps,
  ComboboxTriggerProps,
  ComboboxCancelProps,
  ComboboxPortalProps,
  ComboboxContentProps,
  ComboboxGroupProps,
  ComboboxGroupLabelProps,
  ComboboxItemProps,
  ComboboxItemTextProps,
  ComboboxItemIndicatorProps,
  ComboboxSeparatorProps,
  ComboboxArrowProps,
  ScopedProps,
};
