import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createCollection } from '@radix-ui/react-collection';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useDirection } from '@radix-ui/react-direction';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { useId } from '@radix-ui/react-id';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { createPopperScope } from '@radix-ui/react-popper';
import { Portal as PortalPrimitive } from '@radix-ui/react-portal';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
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
  value: string | string[] | null;
  onValueChange(value: string | string[] | null): void;
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
  isClosingRef: React.RefObject<boolean>;
  isComposingRef: React.RefObject<boolean>;
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
  /**
   * The controlled selected value. Set to `null` to clear the selection.
   * Use `undefined` (or omit) for uncontrolled behavior.
   */
  value?: string | null;
  /** The default selected value */
  defaultValue?: string | null;
  /** Event handler called when the selected value changes */
  onValueChange?: (value: string | null) => void;
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
    prop: valueProp as string | string[] | null | undefined,
    defaultProp: (defaultValue as string | string[] | null | undefined) ?? (multiple ? [] : null),
    onChange: onValueChange as ((value: string | string[] | null) => void) | undefined,
    caller: COMBOBOX_NAME,
  });

  const [highlightedItemId, setHighlightedItemId] = React.useState('');

  const inputRef = React.useRef<ComboboxInputElement>(null);
  const triggerRef = React.useRef<ComboboxTriggerElement>(null);
  const contentRef = React.useRef<ComboboxContentElement>(null);

  // Re-entrancy guard for openOnFocus: prevents the popover from reopening
  // when focus returns to the input after an intentional close
  const isClosingRef = React.useRef(false);

  // IME composition guard: prevents keyboard navigation/selection during
  // active composition
  const isComposingRef = React.useRef(false);

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
        isClosingRef={isClosingRef}
        isComposingRef={isComposingRef}
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
  (props: ScopedProps<ComboboxLabelProps>, forwardedRef) => {
    const { __scopeCombobox, ...labelProps } = props;
    const context = useComboboxContext(LABEL_NAME, __scopeCombobox);
    return (
      <Primitive.label
        id={context.labelId}
        htmlFor={context.inputId}
        {...labelProps}
        ref={forwardedRef}
      />
    );
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
  (props: ScopedProps<ComboboxAnchorProps>, forwardedRef) => {
    const { __scopeCombobox, ...anchorProps } = props;
    const popperScope = usePopperScope(__scopeCombobox);
    return <PopperPrimitive.Anchor {...popperScope} {...anchorProps} ref={forwardedRef} />;
  },
);

ComboboxAnchor.displayName = ANCHOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxInput
 * -----------------------------------------------------------------------------------------------*/

const INPUT_NAME = 'ComboboxInput';

type PrimitiveInputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface ComboboxInputProps
  extends Omit<PrimitiveInputProps, 'value' | 'defaultValue' | 'checked'> {}

const ComboboxInput = React.forwardRef<ComboboxInputElement, ComboboxInputProps>(
  (props: ScopedProps<ComboboxInputProps>, forwardedRef) => {
    const {
      __scopeCombobox,
      // @ts-expect-error: Value is passed from the root. We destructure it here
      // to prevent incorrect usage from causing weird bugs.
      value: _value,
      // @ts-expect-error
      defaultValue: _defaultValue,
      ...inputProps
    } = props;
    const {
      autocompleteBehavior,
      contentId,
      disabled,
      highlightedItemId,
      inputId,
      inputRef,
      inputValue,
      isClosingRef,
      labelId,
      onInputValueChange,
      onOpenChange,
      open: isOpen,
      openOnFocus,
      openOnInput,
      triggerRef,
      contentRef,
      allowCustomValue,
      multiple,
      value,
      isComposingRef,
    } = useComboboxContext(INPUT_NAME, __scopeCombobox);
    const getItems = useCollection(__scopeCombobox);
    const composedRef = useComposedRefs(forwardedRef, inputRef);

    return (
      <Primitive.input
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        role="combobox"
        type="text"
        id={inputId}
        aria-expanded={isOpen}
        aria-activedescendant={highlightedItemId || undefined}
        aria-autocomplete={autocompleteBehavior}
        aria-controls={isOpen ? contentId : undefined}
        aria-labelledby={labelId}
        data-radix-combobox-open-state={isOpen ? 'open' : 'closed'}
        data-radix-combobox-disabled={disabled ? '' : undefined}
        disabled={disabled}
        {...inputProps}
        ref={composedRef}
        value={inputValue}
        onChange={composeEventHandlers(inputProps.onChange, (event) => {
          const nativeEvent = event.nativeEvent as InputEvent;
          onInputValueChange(event.target.value);

          // Open the popover when the user types, unless mid-composition
          if (openOnInput && !isOpen && !nativeEvent.isComposing) {
            onOpenChange(true);
          }
        })}
        onFocus={composeEventHandlers(inputProps.onFocus, () => {
          // Re-entrancy guard: don't reopen if we just closed intentionally
          if (openOnFocus && !isOpen && !isClosingRef.current) {
            onOpenChange(true);
          }
        })}
        onBlur={composeEventHandlers(inputProps.onBlur, (event) => {
          // Don't close if focus moves to the trigger or content (still within
          // the combobox). This prevents close-then-reopen flicker when
          // clicking the trigger button.
          const relatedTarget = event.relatedTarget as Node | null;
          if (relatedTarget) {
            if (
              triggerRef.current?.contains(relatedTarget) ||
              contentRef.current?.contains(relatedTarget)
            ) {
              return;
            }
          }

          if (isOpen) {
            isClosingRef.current = true;
            onOpenChange(false);
            requestAnimationFrame(() => {
              isClosingRef.current = false;
            });
          }

          // When allowCustomValue is false, revert the input to the selected
          // item's text (single-select) or clear it (multi-select) on blur
          if (!allowCustomValue) {
            if (multiple) {
              onInputValueChange('');
            } else {
              const selectedValue = value as string | null;
              if (selectedValue !== null) {
                const items = getItems();
                const selectedItem = items.find((item) => item.value === selectedValue);
                onInputValueChange(selectedItem?.textValue ?? '');
              } else {
                onInputValueChange('');
              }
            }
          }
        })}
        onCompositionStart={composeEventHandlers(inputProps.onCompositionStart, () => {
          isComposingRef.current = true;
        })}
        onCompositionEnd={composeEventHandlers(inputProps.onCompositionEnd, () => {
          isComposingRef.current = false;
        })}
      />
    );
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

type PortalContextValue = { forceMount?: true };
const [PortalProvider, usePortalContext] = createComboboxContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
});

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>;
interface ComboboxPortalProps {
  children?: React.ReactNode;
  /**
   * Target container for the portal
   * @default document.body
   */
  container?: PortalProps['container'];
  /** Force mount the portal */
  forceMount?: true;
}

const ComboboxPortal: React.FC<ComboboxPortalProps> = (props: ScopedProps<ComboboxPortalProps>) => {
  const { __scopeCombobox, forceMount, children, container } = props;
  const context = useComboboxContext(PORTAL_NAME, __scopeCombobox);
  return (
    <PortalProvider scope={__scopeCombobox} forceMount={forceMount}>
      <Presence present={forceMount || context.open}>
        <PortalPrimitive asChild container={container}>
          {children}
        </PortalPrimitive>
      </Presence>
    </PortalProvider>
  );
};

ComboboxPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ComboboxContent';

type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;

interface ComboboxContentImplProps
  extends Omit<PopperContentProps, 'onPlaced'>,
    Omit<DismissableLayerProps, 'onDismiss'> {}

interface ComboboxContentProps extends ComboboxContentImplProps {
  /** Force mount the content */
  forceMount?: true;
}

const ComboboxContent = React.forwardRef<ComboboxContentElement, ComboboxContentProps>(
  (props: ScopedProps<ComboboxContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeCombobox);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useComboboxContext(CONTENT_NAME, props.__scopeCombobox);
    return (
      <Presence present={forceMount || context.open}>
        <ComboboxContentImpl {...contentProps} ref={forwardedRef} />
      </Presence>
    );
  },
);

ComboboxContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ComboboxContentImpl
 * -----------------------------------------------------------------------------------------------*/

const ComboboxContentImpl = React.forwardRef<ComboboxContentElement, ComboboxContentImplProps>(
  (props: ScopedProps<ComboboxContentImplProps>, forwardedRef) => {
    const {
      __scopeCombobox,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      ...contentProps
    } = props;
    const {
      contentId,
      labelId,
      multiple,
      open,
      contentRef,
      inputRef,
      triggerRef,
      isClosingRef,
      onOpenChange,
    } = useComboboxContext(CONTENT_NAME, __scopeCombobox);
    const popperScope = usePopperScope(__scopeCombobox);
    const composedRef = useComposedRefs(forwardedRef, contentRef);
    const hasPointerDownOutsideRef = React.useRef(false);

    return (
      <Collection.Slot scope={__scopeCombobox}>
        <DismissableLayer
          asChild
          disableOutsidePointerEvents={false}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onFocusOutside={onFocusOutside}
          onInteractOutside={(event) => {
            onInteractOutside?.(event);

            if (!event.defaultPrevented) {
              if (event.detail.originalEvent.type === 'pointerdown') {
                hasPointerDownOutsideRef.current = true;
              }
            }

            // Prevent dismissing when clicking the input or trigger, as those
            // have their own open/close logic. Without this, clicking the
            // trigger would dismiss and immediately reopen the content.
            const target = event.target as HTMLElement;
            if (inputRef.current?.contains(target) || triggerRef.current?.contains(target)) {
              event.preventDefault();
            }

            // On Safari if the trigger is inside a container with tabIndex={0},
            // when clicked we will get the pointer down outside event on the
            // trigger, but then a subsequent focus outside event on the
            // container. We ignore any focus outside event when we've already
            // had a pointer down outside event.
            if (event.detail.originalEvent.type === 'focusin' && hasPointerDownOutsideRef.current) {
              event.preventDefault();
            }
          }}
          onDismiss={() => {
            isClosingRef.current = true;
            onOpenChange(false);
            requestAnimationFrame(() => {
              isClosingRef.current = false;
            });
          }}
        >
          <PopperPrimitive.Content
            role="listbox"
            id={contentId}
            aria-labelledby={labelId}
            aria-multiselectable={multiple || undefined}
            data-radix-combobox-open-state={open ? 'open' : 'closed'}
            {...popperScope}
            {...contentProps}
            ref={composedRef}
            style={{
              ...contentProps.style,
              // Re-namespace Popper's CSS custom properties for the combobox
              ...{
                '--radix-combobox-content-transform-origin': 'var(--radix-popper-transform-origin)',
                '--radix-combobox-content-available-width': 'var(--radix-popper-available-width)',
                '--radix-combobox-content-available-height': 'var(--radix-popper-available-height)',
                '--radix-combobox-anchor-width': 'var(--radix-popper-anchor-width)',
                '--radix-combobox-anchor-height': 'var(--radix-popper-anchor-height)',
              },
            }}
            onPointerDown={composeEventHandlers(contentProps.onPointerDown, (event) => {
              // Prevent focus from moving to content when clicking items. Focus
              // must stay on the input for the virtual focus pattern.
              event.preventDefault();
            })}
          />
        </DismissableLayer>
      </Collection.Slot>
    );
  },
);

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

interface ComboboxItemContextValue {
  value: string;
  disabled: boolean;
  textId: string;
  isSelected: boolean;
  onItemTextChange(node: HTMLSpanElement | null): void;
}

const [ComboboxItemProvider, useComboboxItemContext] =
  createComboboxContext<ComboboxItemContextValue>(ITEM_NAME);

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
  (props: ScopedProps<ComboboxItemProps>, forwardedRef) => {
    const {
      __scopeCombobox,
      value,
      disabled = false,
      textValue: textValueProp,
      ...itemProps
    } = props;
    const {
      multiple,
      value: comboboxValue,
      onValueChange,
      highlightedItemId,
      onHighlightedItemIdChange,
      onInputValueChange,
      resetInputOnSelect,
      isClosingRef,
      inputRef,
      onOpenChange,
    } = useComboboxContext(ITEM_NAME, __scopeCombobox);
    const textId = useId();
    const itemId = useId();
    const [textValue, setTextValue] = React.useState(textValueProp ?? '');

    const isSelected = multiple
      ? Array.isArray(comboboxValue) && comboboxValue.includes(value)
      : comboboxValue === value;
    const isHighlighted = highlightedItemId === itemId;

    const handleSelect = () => {
      if (disabled) return;

      if (multiple) {
        // Multi-select: toggle the value in the array
        const currentValues = Array.isArray(comboboxValue) ? comboboxValue : [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        onValueChange(newValues);
      } else {
        // Single select: set the value
        onValueChange(value);
      }

      // Update input value based on resetInputOnSelect
      if (resetInputOnSelect) {
        onInputValueChange('');
      } else {
        onInputValueChange(textValue);
      }

      // For single select, close the popover after selection
      if (!multiple) {
        isClosingRef.current = true;
        onOpenChange(false);
        requestAnimationFrame(() => {
          isClosingRef.current = false;
        });
      }

      // Clear the highlight after selection
      onHighlightedItemIdChange('');

      // Return focus to the input
      inputRef.current?.focus();
    };

    return (
      <ComboboxItemProvider
        scope={__scopeCombobox}
        value={value}
        disabled={disabled}
        textId={textId}
        isSelected={isSelected}
        onItemTextChange={React.useCallback((node: HTMLSpanElement | null) => {
          setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? '').trim());
        }, [])}
      >
        <Collection.ItemSlot
          scope={__scopeCombobox}
          value={value}
          disabled={disabled}
          textValue={textValue}
        >
          <Primitive.div
            role="option"
            id={itemId}
            aria-selected={
              multiple
                ? isSelected // always true/false for multi-select (per WAI-ARIA)
                : isSelected || undefined // only true or absent for single-select
            }
            aria-disabled={disabled || undefined}
            aria-labelledby={textId}
            data-radix-combobox-highlighted={isHighlighted ? '' : undefined}
            data-radix-combobox-selected-state={isSelected ? 'checked' : 'unchecked'}
            data-radix-combobox-disabled={disabled ? '' : undefined}
            {...itemProps}
            ref={forwardedRef}
            onClick={composeEventHandlers(itemProps.onClick, handleSelect)}
            onPointerMove={composeEventHandlers(itemProps.onPointerMove, (event) => {
              // Highlight the item on pointer move (mouse only). Touch devices
              // use tap-to-select and don't need hover highlighting.
              if (disabled) return;
              if (event.pointerType === 'mouse') {
                onHighlightedItemIdChange(itemId);
              }
            })}
            onPointerLeave={composeEventHandlers(itemProps.onPointerLeave, (event) => {
              // Only clear if this item is still the highlighted one to avoid
              // race conditions when moving between items
              if (event.pointerType === 'mouse' && highlightedItemId === itemId) {
                onHighlightedItemIdChange('');
              }
            })}
          />
        </Collection.ItemSlot>
      </ComboboxItemProvider>
    );
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
   * `inputValue` in a `<span data-radix-combobox-highlighted-text>` element for
   * optional styling.
   *
   * @default false
   */
  highlightMatches?: boolean;
}

const ComboboxItemText = React.forwardRef<HTMLSpanElement, ComboboxItemTextProps>(
  (props: ScopedProps<ComboboxItemTextProps>, forwardedRef) => {
    const { __scopeCombobox, highlightMatches = false, children, ...itemTextProps } = props;
    const context = useComboboxContext(ITEM_TEXT_NAME, __scopeCombobox);
    const itemContext = useComboboxItemContext(ITEM_TEXT_NAME, __scopeCombobox);
    const composedRefs = useComposedRefs(forwardedRef, itemContext.onItemTextChange);

    const renderedChildren =
      highlightMatches && typeof children === 'string' && context.inputValue
        ? highlightTextMatches(children, context.inputValue)
        : children;

    return (
      <Primitive.span id={itemContext.textId} {...itemTextProps} ref={composedRefs}>
        {renderedChildren}
      </Primitive.span>
    );
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
  (props: ScopedProps<ComboboxItemIndicatorProps>, forwardedRef) => {
    const { __scopeCombobox, forceMount, ...itemIndicatorProps } = props;
    const itemContext = useComboboxItemContext(ITEM_INDICATOR_NAME, __scopeCombobox);
    return (
      <Presence present={forceMount || itemContext.isSelected}>
        <Primitive.span aria-hidden {...itemIndicatorProps} ref={forwardedRef} />
      </Presence>
    );
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
  (props: ScopedProps<ComboboxArrowProps>, forwardedRef) => {
    const { __scopeCombobox, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeCombobox);
    return <PopperPrimitive.Arrow {...popperScope} {...arrowProps} ref={forwardedRef} />;
  },
);

ComboboxArrow.displayName = ARROW_NAME;

/* -------------------------------------------------------------------------------------------------
 * Utilities
 * -----------------------------------------------------------------------------------------------*/

/**
 * Splits `text` around case-insensitive occurrences of `query`, wrapping each
 * matched substring in a `<span data-radix-combobox-highlighted-text>` element
 * so consumers can style it. Non-matching parts are returned as plain text.
 */
function highlightTextMatches(text: string, query: string): React.ReactNode {
  if (!query) return text;

  // Escape regex special characters in the query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  // No matches found — return the original text unchanged
  if (parts.length === 1) return text;

  // When splitting by a capturing group, odd-indexed parts are the matches
  return parts.map((part, index) => {
    if (!part) return null;
    return index % 2 === 1 ? (
      <span key={index} data-radix-combobox-highlighted-text="">
        {part}
      </span>
    ) : (
      part
    );
  });
}

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
