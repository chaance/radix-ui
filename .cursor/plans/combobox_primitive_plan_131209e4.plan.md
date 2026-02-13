---
name: Combobox Primitive Plan
overview: Build a new `@radix-ui/react-combobox` primitive that combines a text input with a positioned listbox, using virtual focus (aria-activedescendant). The API follows established Radix patterns (context scoping, controllable state, collection system, Popper positioning) while achieving feature parity with Ariakit Combobox and React Aria ComboBox.
todos:
  - id: scaffold
    content: Create package directory structure, package.json, tsconfig, eslint config
    status: completed
  - id: core-state
    content: Implement Combobox root with createContextScope, createCollection, discriminated union props (multiple), and three controllable states (inputValue, value, open)
    status: completed
  - id: input-anchor-label
    content: Implement ComboboxInput (role=combobox, aria-activedescendant, aria-autocomplete from autocompleteBehavior), ComboboxAnchor (Popper anchor), ComboboxLabel
    status: completed
  - id: content-positioning
    content: Implement ComboboxPortal, ComboboxContent (Popper + DismissableLayer + role=listbox + Presence), ComboboxArrow
    status: completed
  - id: items-selection
    content: Implement ComboboxItem, ComboboxItemText, ComboboxItemIndicator with selection behavior and data attributes
    status: completed
  - id: keyboard-nav
    content: Implement virtual focus keyboard navigation (ArrowUp/Down, Home/End, Enter, Escape, Tab) with aria-activedescendant, initialHighlight strategy, scroll-into-view, openOnInput/openOnFocus
    status: completed
  - id: supporting-parts
    content: Implement ComboboxTrigger (open-only, focuses input), ComboboxCancel, ComboboxGroup, ComboboxGroupLabel, ComboboxSeparator
    status: completed
  - id: multi-select
    content: Implement multi-select via multiple prop (discriminated union types), toggle behavior, no bubble inputs
    status: completed
  - id: autocomplete-both
    content: Implement autocompleteBehavior="both" inline completion (auto-fill input with best match, select completed portion, handle backspace/IME)
    status: completed
  - id: tests-stories
    content: Write unit tests (vitest + testing-library + axe), Storybook stories, Cypress e2e tests. Document manual test matrix for screen readers (VoiceOver, NVDA, JAWS, TalkBack), speech dictation (Voice Control, Voice Access), virtual keyboards (iOS/Android), and touch interactions. Register in radix-ui umbrella package.
    status: pending
isProject: false
---

# Combobox Primitive

## Proposed Component API

Following the Radix documentation convention of dot-notation parts (`import * as Combobox from '@radix-ui/react-combobox'`), mirroring how [Select](packages/react/select/src/select.tsx) and [Popover](packages/react/popover/src/popover.tsx) are structured:

```tsx
<Combobox.Root>
  <Combobox.Label />
  <Combobox.Anchor>
    <Combobox.Input />
    <Combobox.Trigger />
    <Combobox.Cancel />
  </Combobox.Anchor>
  <Combobox.Portal>
    <Combobox.Content>
      <Combobox.Group>
        <Combobox.GroupLabel />
        <Combobox.Item>
          <Combobox.ItemText />
          <Combobox.ItemIndicator />
        </Combobox.Item>
        <Combobox.Separator />
      </Combobox.Group>
      <Combobox.Arrow />
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
```

### Export Pattern

Following the established convention (same as Select, Popover, etc.), `index.ts` exports both prefixed names, short aliases, and all prop type interfaces:

```typescript
'use client';
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
  Root,
  Label,
  Anchor,
  Input,
  Trigger,
  Cancel,
  Portal,
  Content,
  Group,
  GroupLabel,
  Item,
  ItemText,
  ItemIndicator,
  Separator,
  Arrow,
} from './combobox';

export type {
  ComboboxProps,
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
} from './combobox';
```

## Component Parts Reference

| Part (dot-notation)      | Prefixed Export         | Element         | Description                                                                                                                               |
| ------------------------ | ----------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `Combobox.Root`          | `Combobox`              | none (provider) | Root. Manages all state and context.                                                                                                      |
| `Combobox.Label`         | `ComboboxLabel`         | `<label>`       | Accessible label linked to the input.                                                                                                     |
| `Combobox.Anchor`        | `ComboboxAnchor`        | `<div>`         | Wraps input + buttons. Popper anchor for positioning the content popover. Follows pattern from `PopoverAnchor`.                           |
| `Combobox.Input`         | `ComboboxInput`         | `<input>`       | Text input. Renders `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `aria-autocomplete`. Focus stays here during navigation. |
| `Combobox.Trigger`       | `ComboboxTrigger`       | `<button>`      | Optional disclosure button to open the popover and focus the input. `aria-label="Show suggestions"` (default).                            |
| `Combobox.Cancel`        | `ComboboxCancel`        | `<button>`      | Optional button to clear the input value.                                                                                                 |
| `Combobox.Portal`        | `ComboboxPortal`        | React Portal    | Portals content into `document.body` (or custom container).                                                                               |
| `Combobox.Content`       | `ComboboxContent`       | `<div>`         | Positioned popover containing the listbox. Wraps `PopperPrimitive.Content` + `DismissableLayer`. Renders `role="listbox"`.                |
| `Combobox.Group`         | `ComboboxGroup`         | `<div>`         | Groups items. `role="group"`, `aria-labelledby`.                                                                                          |
| `Combobox.GroupLabel`    | `ComboboxGroupLabel`    | `<div>`         | Label for a group.                                                                                                                        |
| `Combobox.Item`          | `ComboboxItem`          | `<div>`         | Individual option. `role="option"`, `aria-selected`, `aria-disabled`. Receives `data-radix-combobox-highlighted` when virtually focused.  |
| `Combobox.ItemText`      | `ComboboxItemText`      | `<span>`        | Text content of an item (used for textValue extraction).                                                                                  |
| `Combobox.ItemIndicator` | `ComboboxItemIndicator` | `<span>`        | Renders only when item is selected (check mark, etc.).                                                                                    |
| `Combobox.Separator`     | `ComboboxSeparator`     | `<div>`         | Visual separator between items/groups.                                                                                                    |
| `Combobox.Arrow`         | `ComboboxArrow`         | `<svg>`         | Arrow pointing to the anchor. Wraps `PopperPrimitive.Arrow`.                                                                              |

## State Model

Three independent pieces of controllable state, each managed via `useControllableState` (same pattern as [Select](packages/react/select/src/select.tsx)):

### 1. Input Value (text in the input field)

- `inputValue` / `defaultInputValue` / `onInputValueChange`
- Type: `string`
- Default: `""`

### 2. Selected Value (the chosen item)

- `value` / `defaultValue` / `onValueChange`
- Type: `string` when `multiple` is `false` (default), `string[]` when `multiple` is `true`
- Default: `""` (single) or `[]` (multi)
- When an item is selected, `onValueChange` fires. For single select, the input value is typically updated to the selected item's text.
- The `multiple` prop acts as a type discriminant. When `multiple` is `true`, `value` and `onValueChange` use `string[]`. When `multiple` is `false` or omitted, they use `string`.

### 3. Open State (popover visibility)

- `open` / `defaultOpen` / `onOpenChange`
- Type: `boolean`
- Default: `false`

## Props Interfaces

All DOM-rendering parts extend the corresponding `Primitive.*` element props (which include all standard HTML attributes, `ref`, `asChild`, etc.). The `__scopeCombobox` prop is injected by the scoping system and omitted below for brevity.

### `Combobox.Root` (`ComboboxProps`)

No DOM element rendered (provider only).

```typescript
interface ComboboxBaseProps {
  children: React.ReactNode;

  // Input value (text in the input field)
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;

  // Open state (popover visibility)
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Behavior
  /**
   * When `true`, the input value is reverted to the selected item's text on blur
   * if it doesn't match a valid item. When `false` (default), any typed value is
   * preserved on blur.
   */
  enforceMatchingInputValue?: boolean;
  /** Reset input text after selecting an item (defaults to true for multi-select) */
  resetInputOnSelect?: boolean;
  /** Open popover when input receives focus */
  openOnFocus?: boolean;
  /** Open popover when the user types into the input (default: true). Not mutually exclusive with `openOnFocus`. */
  openOnInput?: boolean;

  /**
   * Controls the autocomplete behavior and the corresponding `aria-autocomplete` value on the input.
   * - `"list"` (default): Suggestions are presented in a popup list. The input value is not auto-completed.
   * - `"both"`: Suggestions are presented in a popup list AND the input auto-completes with the best inline match.
   * - `"none"`: The component provides no autocomplete behavior; the popup acts as a generic container.
   */
  autocompleteBehavior?: 'list' | 'both' | 'none';

  /**
   * Controls which item is highlighted when the popover opens.
   * - `"none"` (default): No item is highlighted until the user navigates with arrow keys.
   * - `"selected"`: Highlights the currently selected item. If no item is selected, highlights the first enabled item.
   * - `"first"`: Always highlights the first enabled item.
   */
  initialHighlight?: 'selected' | 'first' | 'none';

  /** Disables the entire combobox (input + trigger + cancel) */
  disabled?: boolean;

  /** Wrap arrow key navigation from last item to first and vice versa */
  loop?: boolean;

  /** Reading direction */
  dir?: 'ltr' | 'rtl';
}

interface ComboboxSingleProps extends ComboboxBaseProps {
  /** Whether the combobox allows multiple selections. */
  multiple?: false;
  /** The controlled selected value. Set to `null` to clear; `undefined` = uncontrolled. */
  value?: string | null;
  /** The default selected value (uncontrolled). */
  defaultValue?: string | null;
  /** Event handler called when the selected value changes. */
  onValueChange?: (value: string | null) => void;
}

interface ComboboxMultipleProps extends ComboboxBaseProps {
  /** Whether the combobox allows multiple selections. */
  multiple: true;
  /** The controlled selected values. */
  value?: string[];
  /** The default selected values (uncontrolled). */
  defaultValue?: string[];
  /** Event handler called when the selected values change. */
  onValueChange?: (value: string[]) => void;
}

type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;
```

### `Combobox.Label` (`ComboboxLabelProps`)

Renders `<label>`. Extends `Primitive.label` props.

```typescript
type PrimitiveLabelProps = React.ComponentPropsWithoutRef<typeof Primitive.label>;
interface ComboboxLabelProps extends PrimitiveLabelProps {}
```

### `Combobox.Anchor` (`ComboboxAnchorProps`)

Renders `<div>`. Extends `Primitive.div` props. Serves as the Popper anchor for positioning the content.

```typescript
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ComboboxAnchorProps extends PrimitiveDivProps {}
```

Automatically receives:

- `data-radix-combobox-open-state="open" | "closed"`

### `Combobox.Input` (`ComboboxInputProps`)

Renders `<input>`. Extends `Primitive.input` props. Standard HTML input attributes (`name`, `required`, `disabled`, `form`, `placeholder`, `autoComplete`, etc.) are passed directly to the underlying `<input>`.

```typescript
type PrimitiveInputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface ComboboxInputProps extends PrimitiveInputProps {}
```

Automatically receives the following ARIA attributes (not user-specified):

- `role="combobox"`
- `aria-expanded` (from open state)
- `aria-activedescendant` (from highlighted item)
- `aria-autocomplete` (derived from Root's `autocompleteBehavior` prop: `"list"`, `"both"`, or `"none"`)
- `aria-controls` (pointing to content listbox ID)
- `aria-labelledby` or `aria-label` (from Label association)
- `data-radix-combobox-open-state="open" | "closed"`
- `data-radix-combobox-disabled` (when disabled)

### `Combobox.Trigger` (`ComboboxTriggerProps`)

Renders `<button>`. Extends `Primitive.button` props. Optional disclosure button that **opens** the popover (does not close it — outside click or Escape handles closing). Clicking the trigger also moves focus to the input.

```typescript
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface ComboboxTriggerProps extends PrimitiveButtonProps {}
```

Automatically receives:

- `aria-controls` (pointing to content listbox ID)
- `aria-expanded` (from open state)
- `aria-label="Show suggestions"` (default, overridable by consumer)
- `tabIndex={-1}` (not in tab order; input is the primary focusable element)
- `data-radix-combobox-open-state="open" | "closed"`
- `data-radix-combobox-disabled` (when disabled)

### `Combobox.Cancel` (`ComboboxCancelProps`)

Renders `<button>`. Extends `Primitive.button` props. Clears the input value when clicked.

```typescript
interface ComboboxCancelProps extends PrimitiveButtonProps {}
```

Automatically receives:

- `data-radix-combobox-disabled` (when disabled)

### `Combobox.Portal` (`ComboboxPortalProps`)

No DOM element rendered (React Portal).

```typescript
interface ComboboxPortalProps {
  children?: React.ReactNode;
  /** Target container for the portal. Defaults to `document.body`. */
  container?: Element | DocumentFragment | null;
  /** Force mounting for animation control. */
  forceMount?: true;
}
```

### `Combobox.Content` (`ComboboxContentProps`)

Renders `<div>`. Extends Popper positioning props and DismissableLayer callbacks (following the Popover pattern from [popover.tsx](packages/react/popover/src/popover.tsx)).

```typescript
type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;

interface ComboboxContentProps
  extends Omit<PopperContentProps, 'onPlaced'>,
    Omit<DismissableLayerProps, 'onDismiss'> {
  /** Force mounting for animation control. */
  forceMount?: true;
  /** Event handler called when auto-focusing on close. Can be prevented. */
  onCloseAutoFocus?: (event: Event) => void;
}
```

Popper props inherited (with defaults):

- `side` (default: `"bottom"`)
- `sideOffset` (default: `0`)
- `align` (default: `"start"`)
- `alignOffset`
- `collisionBoundary`
- `collisionPadding` (default: `10`)
- `avoidCollisions` (default: `true`)
- `sticky`
- `hideWhenDetached`

DismissableLayer callbacks inherited:

- `onEscapeKeyDown`
- `onPointerDownOutside`
- `onFocusOutside`
- `onInteractOutside`

Automatically receives:

- `role="listbox"`
- `aria-multiselectable="true"` (when `multiple` is `true` on Root)
- `aria-labelledby` (pointing to the label or input)
- `data-radix-combobox-open-state="open" | "closed"`

CSS custom properties exposed:

- `--radix-combobox-content-available-width`
- `--radix-combobox-content-available-height`
- `--radix-combobox-anchor-width`
- `--radix-combobox-anchor-height`
- `--radix-combobox-content-transform-origin`

### `Combobox.Group` (`ComboboxGroupProps`)

Renders `<div>`. Extends `Primitive.div` props.

```typescript
interface ComboboxGroupProps extends PrimitiveDivProps {}
```

Automatically receives:

- `role="group"`
- `aria-labelledby` (pointing to the associated GroupLabel)

### `Combobox.GroupLabel` (`ComboboxGroupLabelProps`)

Renders `<div>`. Extends `Primitive.div` props.

```typescript
interface ComboboxGroupLabelProps extends PrimitiveDivProps {}
```

### `Combobox.Item` (`ComboboxItemProps`)

Renders `<div>`. Extends `Primitive.div` props.

```typescript
interface ComboboxItemProps extends PrimitiveDivProps {
  /** The value submitted when this item is selected. Required. */
  value: string;
  /** Whether the item is disabled. Disabled items are skipped during keyboard navigation. */
  disabled?: boolean;
  /** Optional text used for matching during typeahead. Defaults to the text content of ComboboxItemText. */
  textValue?: string;
}
```

Automatically receives:

- `role="option"`
- `aria-selected` (true when this item's value matches the selected value)
- `aria-disabled` (when disabled)
- `data-radix-combobox-highlighted` (when virtually focused via aria-activedescendant)
- `data-radix-combobox-selected-state="checked" | "unchecked"` (based on selection)
- `data-radix-combobox-disabled` (when disabled)

### `Combobox.ItemText` (`ComboboxItemTextProps`)

Renders `<span>`. Extends `Primitive.span` props. Text content used for `textValue` extraction.

```typescript
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface ComboboxItemTextProps extends PrimitiveSpanProps {}
```

### `Combobox.ItemIndicator` (`ComboboxItemIndicatorProps`)

Renders `<span>`. Extends `Primitive.span` props. Only renders children when the parent item is selected.

```typescript
interface ComboboxItemIndicatorProps extends PrimitiveSpanProps {
  /** Force mounting for animation control. */
  forceMount?: true;
}
```

### `Combobox.Separator` (`ComboboxSeparatorProps`)

Renders `<div>`. Extends `Primitive.div` props.

```typescript
interface ComboboxSeparatorProps extends PrimitiveDivProps {}
```

Automatically receives:

- `aria-hidden="true"`

### `Combobox.Arrow` (`ComboboxArrowProps`)

Renders `<svg>`. Extends `PopperPrimitive.Arrow` props.

```typescript
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>;
interface ComboboxArrowProps extends PopperArrowProps {}
```

## Key Architectural Decisions

### Virtual Focus via `aria-activedescendant`

Unlike Select (which uses roving tabindex), Combobox must use **virtual focus**. DOM focus stays on the `<input>` at all times so the user can keep typing. Arrow key navigation updates `aria-activedescendant` on the input to point to the highlighted item's `id`. The highlighted item receives a `data-radix-combobox-highlighted` attribute for styling.

This is a critical difference from Select and means we do NOT use `@radix-ui/react-roving-focus`. Instead, we manage a `highlightedItem` ref/state internally, tracking which item ID is active.

### Filtering is Userland

Following Radix's headless philosophy (consistent with Select having no built-in filter), **no built-in filtering**. The consumer filters their rendered items based on `inputValue`:

```tsx
import * as Combobox from '@radix-ui/react-combobox';

const [inputValue, setInputValue] = React.useState('');
const filtered = items.filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()));

<Combobox.Root inputValue={inputValue} onInputValueChange={setInputValue}>
  <Combobox.Anchor>
    <Combobox.Input />
  </Combobox.Anchor>
  <Combobox.Portal>
    <Combobox.Content>
      {filtered.map((item) => (
        <Combobox.Item key={item} value={item}>
          <Combobox.ItemText>{item}</Combobox.ItemText>
        </Combobox.Item>
      ))}
      {filtered.length === 0 && <div>No results</div>}
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>;
```

### Collection System

Uses the **legacy** `createCollection` API from `@radix-ui/react-collection` (same as [Select](packages/react/select/src/select.tsx)) to track items. The codebase also has an `unstable_createCollection` API, but we use the legacy one for consistency with all existing primitives. Item data:

```typescript
type ItemData = {
  value: string;
  disabled: boolean;
  textValue: string;
};
```

The collection is used for:

- Arrow key navigation (finding next/previous enabled item)
- Home/End navigation
- Mapping selected value to item text (e.g., updating input text on selection)

### Context Architecture

Uses `createContextScope` with three context layers (following Select's pattern):

1. **ComboboxContext** - Root state: `inputValue`, `value`, `open`, `disabled`, refs, callbacks
2. **ComboboxContentContext** - Content-specific: `contentRef`, `highlightedItemRef`, positioning state
3. **ComboboxItemContext** - Per-item: `value`, `disabled`, `isSelected`, `isHighlighted`, `textId`

### Popover Positioning

Composes `@radix-ui/react-popper` (same as Popover and Select in popper mode). `ComboboxContent` props include all Popper positioning props:

- `side` / `sideOffset` / `align` / `alignOffset`
- `collisionBoundary` / `collisionPadding` / `avoidCollisions`
- `sticky` / `hideWhenDetached`

Exposes CSS custom properties:

- `--radix-combobox-content-available-width`
- `--radix-combobox-content-available-height`
- `--radix-combobox-anchor-width` / `--radix-combobox-anchor-height`
- `--radix-combobox-content-transform-origin`

### Dismissal

Uses `@radix-ui/react-dismissable-layer` (non-modal, matching Popover non-modal behavior):

- Escape key closes the popover (returns focus to input, which already has it)
- Click outside closes the popover
- Clicking the Trigger while the popover is open does **not** close it (Trigger is open-only); DismissableLayer's `onPointerDownOutside` must treat the trigger as part of the combobox to prevent dismiss-then-reopen flicker
- `onEscapeKeyDown`, `onPointerDownOutside`, `onFocusOutside`, `onInteractOutside` callbacks exposed

### `openOnFocus` Re-entrancy Guard

When the popover closes (via Escape, selection, blur, etc.), focus remains on — or returns to — the input. If `openOnFocus` is `true`, this must **not** cause the popover to immediately reopen. The implementation must track whether a close was intentional (e.g., via a `isClosingRef` flag set before closing and cleared in a microtask or `requestAnimationFrame`) so that the focus handler can distinguish between a user-initiated focus and a close-triggered refocus.

### Scroll Into View

When keyboard navigation changes the highlighted item, the newly highlighted item must be scrolled into view within the content's scrollable container. This is handled explicitly using `element.scrollIntoView({ block: 'nearest' })` on the highlighted item's DOM node after each highlight change. Using `block: 'nearest'` ensures minimal scrolling — only scrolling when the item is outside the visible area, and scrolling just enough to bring it into view (rather than centering or snapping to the top).

This must account for:

- Items at the top/bottom edges of a scrollable `ComboboxContent`
- Grouped items where `ComboboxGroupLabel` elements may need to remain visible
- Dynamic item lists where the scroll container height may change as items are filtered
- The `loop` prop wrapping from last to first (or vice versa), which requires a full scroll jump

### Form Integration

Since `Combobox.Input` renders a standard `<input>` element, native form submission works automatically. The `name`, `required`, `disabled`, and `form` attributes can be passed directly to `Combobox.Input` — no hidden bubble input is needed (unlike Select, which uses a `<button>` trigger and requires a hidden `<select>`).

For multi-select or more complex submission scenarios, consumers should control the `value` state and render their own hidden inputs (or use a different submission strategy like `FormData` manipulation). This keeps the primitive lean and avoids prescribing a form submission pattern that would vary too much across use cases.

## Keyboard Interaction

### Input Focused (popover closed)

- **ArrowDown / ArrowUp / Alt+ArrowDown**: Open popover, highlight item per `initialHighlight` strategy
- **Enter**: Always allows native form submission (does not `preventDefault`). If `enforceMatchingInputValue` is `true` and the current input value does not match any item's value, the input value is cleared before submission so that an invalid value is never submitted.
- **Typing**: Updates input value. Opens popover if `openOnInput` is `true` (the default).

### Input Focused (popover open)

- **ArrowDown**: Move highlight to next enabled item (wrap if `loop`). Scrolls the newly highlighted item into view.
- **ArrowUp**: Move highlight to previous enabled item (wrap if `loop`). Scrolls the newly highlighted item into view.
- **Home**: Highlight first enabled item. Scrolls into view.
- **End**: Highlight last enabled item. Scrolls into view.
- **Enter**: Select highlighted item, close popover. When `autocompleteBehavior` is `"both"`, also accepts the inline completion.
- **Escape**: Close popover. When `enforceMatchingInputValue` is `true`, revert input value to the selected item's text (or clear if no selection).
- **Tab**: Close popover, move focus naturally. If `autocompleteBehavior` is `"both"` and an inline completion is pending, accepts it before closing.
- **Typing**: Updates input value, resets highlight to first matching item

### Item (via virtual focus)

- **Enter / Click**: Select item, close popover (single-select) or toggle item (multi-select)
- `data-radix-combobox-highlighted` attribute applied to the virtually focused item
- `data-radix-combobox-selected-state="checked" | "unchecked"` on items based on selection
- `data-radix-combobox-disabled` on disabled items

## Data Attributes

The Combobox primitive uses **primitive-prefixed data attributes** (`data-radix-combobox-*`) to avoid collisions when composing components via `asChild`. This is a new convention that future Radix primitives will adopt; existing primitives will be migrated in a future major version.

| Attribute                            | Used on                         | Values                         |
| ------------------------------------ | ------------------------------- | ------------------------------ |
| `data-radix-combobox-open-state`     | Anchor, Input, Trigger, Content | `"open"` \| `"closed"`         |
| `data-radix-combobox-disabled`       | Input, Trigger, Cancel, Item    | present when disabled          |
| `data-radix-combobox-highlighted`    | Item                            | present when virtually focused |
| `data-radix-combobox-selected-state` | Item                            | `"checked"` \| `"unchecked"`   |

## File Structure

```
packages/react/combobox/
  src/
    index.ts           # Public exports
    combobox.tsx        # Full implementation (single file, matching Select pattern)
  package.json
  tsconfig.json
  eslint.config.mjs
  README.md

apps/storybook/src/stories/
  Combobox.stories.tsx  # Storybook stories
```

## Dependencies

Based on Select's dependencies (from [package.json](packages/react/select/package.json)), the Combobox will need:

- `@radix-ui/primitive` - `composeEventHandlers`
- `@radix-ui/react-primitive` - base `Primitive` elements
- `@radix-ui/react-context` - `createContextScope`
- `@radix-ui/react-collection` - item tracking
- `@radix-ui/react-compose-refs` - ref composition
- `@radix-ui/react-use-controllable-state` - controlled/uncontrolled state
- `@radix-ui/react-use-callback-ref` - stable callbacks
- `@radix-ui/react-use-layout-effect` - layout effects
- `@radix-ui/react-use-previous` - previous value tracking
- `@radix-ui/react-popper` - popover positioning
- `@radix-ui/react-portal` - portaling
- `@radix-ui/react-presence` - mount/unmount transitions
- `@radix-ui/react-dismissable-layer` - outside interaction dismissal
- `@radix-ui/react-id` - unique ID generation
- `@radix-ui/react-direction` - RTL support
- `@radix-ui/react-slot` - slot composition

Does NOT need:

- `@radix-ui/react-roving-focus` (uses virtual focus instead)
- `@radix-ui/react-focus-scope` (non-modal, focus stays on input)
- `@radix-ui/react-focus-guards` (non-modal)
- `react-remove-scroll` (non-modal, no scroll lock)
- `aria-hidden` (non-modal, no `hideOthers`)

## Reference Implementations

During implementation, carefully study the Ariakit and React Aria combobox implementations. Both projects contain extensive browser/device/AT workarounds that we must account for. Edge cases to pay close attention to include:

- Touch device interactions (pointer type detection, virtual keyboard behavior)
- Screen reader announcements across VoiceOver (macOS/iOS), NVDA, JAWS, TalkBack
- IME (Input Method Editor) composition handling for CJK and other languages
- Browser-specific quirks (Safari focus behavior, Firefox `aria-activedescendant` handling)
- Scroll-into-view behavior for highlighted items in overflow containers
- Interaction between the combobox and native autofill/autocomplete
- Race conditions between input changes, filtering, and highlight state

### Ariakit (MIT License)

Repository: [https://github.com/ariakit/ariakit](https://github.com/ariakit/ariakit)

Key source files to study:

- `packages/ariakit-react-core/src/combobox/` -- all combobox component files
  - `combobox.tsx` -- the input element, keyboard handling, IME composition, `aria-activedescendant`
  - `combobox-item.tsx` -- item rendering, click/pointer handling, virtual focus
  - `combobox-popover.tsx` -- popover behavior, dismiss logic
  - `combobox-provider.tsx` -- state management, store setup
  - `combobox-cancel.tsx`, `combobox-disclosure.tsx`, `combobox-group.tsx`, `combobox-group-label.tsx`, `combobox-item-check.tsx`, `combobox-item-value.tsx`, `combobox-label.tsx`, `combobox-list.tsx`, `combobox-row.tsx`, `combobox-separator.tsx`
- `packages/ariakit-core/src/combobox/combobox-store.ts` -- core state logic
- `packages/ariakit-react-core/src/composite/` -- virtual focus / `aria-activedescendant` management (combobox extends composite)

### React Aria (Apache 2.0 License)

Repository: [https://github.com/adobe/react-spectrum](https://github.com/adobe/react-spectrum)

Key source files to study:

- `packages/@react-aria/combobox/src/useComboBox.ts` -- the main hook: ARIA attributes, keyboard handling, touch interactions, focus management
- `packages/@react-stately/combobox/src/useComboBoxState.ts` -- state management, selection, input value synchronization
- `packages/@react-aria/listbox/src/` -- listbox item behavior, virtual focus
- `packages/@react-aria/selection/src/` -- selection logic shared across Select/ComboBox/ListBox
- `packages/react-aria-components/src/ComboBox.tsx` -- higher-level component API (useful for understanding the intended DX)
- `packages/@react-aria/i18n/` -- internationalization patterns (e.g., announcement strings)

### Attribution Policy

If code is adapted or copied directly from either project, include a comment at the point of use:

```typescript
// Adapted from Ariakit (MIT License)
// https://github.com/ariakit/ariakit/blob/main/packages/ariakit-react-core/src/combobox/combobox.tsx
// Copyright (c) Diego Haz

// Adapted from React Aria (Apache 2.0 License)
// https://github.com/adobe/react-spectrum/blob/main/packages/@react-aria/combobox/src/useComboBox.ts
// Copyright (c) Adobe, Inc.
```

Always link to the specific file and include the copyright holder. For React Aria (Apache 2.0), note that the Apache License requires preservation of the copyright notice, license text, and any NOTICE file contents for substantial portions of code.

## Implementation Phases

### Phase 1: Package scaffolding and core state

Set up the package directory, `package.json`, `tsconfig.json`, `eslint.config.mjs`. Implement the `Combobox` root with `createContextScope`, legacy `createCollection`, and controllable state for `inputValue`, `value`, and `open`. Implement the `ComboboxProps` discriminated union (`ComboboxSingleProps | ComboboxMultipleProps`) with the `multiple` prop as the discriminant. Wire up `autocompleteBehavior`, `initialHighlight`, `openOnFocus`, `openOnInput`, `enforceMatchingInputValue`, and `resetInputOnSelect` props in context.

### Phase 2: Input, Anchor, Label

Implement `ComboboxInput` (the `<input>` with `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `aria-autocomplete` derived from `autocompleteBehavior`), `ComboboxAnchor` (Popper anchor wrapper), and `ComboboxLabel` (linked via `htmlFor`). Study Ariakit's `combobox.tsx` and React Aria's `useComboBox.ts` closely for IME composition handling, touch device behavior, and ARIA attribute edge cases.

### Phase 3: Content and positioning

Implement `ComboboxPortal`, `ComboboxContent` (Popper + DismissableLayer + `role="listbox"` + `aria-multiselectable` when `multiple`), and `ComboboxArrow`. Handle open/close transitions via `Presence`.

### Phase 4: Items and selection

Implement `ComboboxItem`, `ComboboxItemText`, `ComboboxItemIndicator`. Wire up selection on Enter/click. Handle `data-radix-combobox-highlighted`, `data-radix-combobox-selected-state`, and `data-radix-combobox-disabled` attributes.

### Phase 5: Keyboard navigation (virtual focus)

Implement arrow key navigation maintaining `aria-activedescendant`. Handle Home/End, Enter to select, Escape to close (with input revert when `enforceMatchingInputValue` is `true`), Tab to close. Use the collection to find next/previous enabled items. Implement the `initialHighlight` strategy (`"selected"`, `"first"`, `"none"`) to determine which item is highlighted when the popover opens. Implement explicit scroll-into-view (`element.scrollIntoView({ block: 'nearest' })`) on every highlight change. Handle `openOnInput` and `openOnFocus` for popover open triggers, including the **re-entrancy guard** for `openOnFocus` to prevent the popover from reopening when focus returns to the input after an intentional close. Study Ariakit's composite system (`packages/ariakit-react-core/src/composite/`) and React Aria's `useComboBox.ts` keyboard handler for browser-specific workarounds (e.g., Firefox `aria-activedescendant` behavior, preventing scroll on arrow keys, IME composition guards).

### Phase 6: Supporting components

Implement `ComboboxTrigger` (open-only — does not close the popover; moves focus to the input; default `aria-label="Show suggestions"`), `ComboboxCancel`, `ComboboxGroup`, `ComboboxGroupLabel`, `ComboboxSeparator`.

### Phase 7: Multi-select support

Implement multi-select mode via the `multiple` prop. When `multiple` is `true`, `value` and `onValueChange` use `string[]`. Toggle behavior on item selection (popover stays open). `resetInputOnSelect` defaults to `true` for multi-select. `ComboboxItemIndicator` shows for each selected item. Content receives `aria-multiselectable="true"`.

### Phase 8: Inline completion (`autocompleteBehavior="both"`)

Implement inline completion behavior when `autocompleteBehavior` is `"both"`: auto-fill the input with the best match (first item whose text starts with the current input value), select the completed portion using `input.setSelectionRange()` so further typing replaces it. Handle Backspace/Delete to remove just the completion. Suppress inline completion during IME composition (`compositionstart` / `compositionend`). On Enter, accept the completion and select the item. On Tab, accept the completion before closing. Study Ariakit and React Aria for edge cases.

### Phase 9: Tests, stories, and accessibility verification

#### Unit tests (`vitest` + `@testing-library/react`)

- **Automated a11y audits**: Run `vitest-axe` (`axe-core`) on every meaningful state (closed, open, item highlighted, item selected, disabled, empty, grouped).
- **ARIA contract tests**: Assert correct roles (`combobox`, `listbox`, `option`, `group`), `aria-expanded`, `aria-activedescendant` (points to highlighted item ID), `aria-autocomplete`, `aria-controls`, `aria-selected`, `aria-disabled`, `aria-labelledby` on groups.
- **Keyboard navigation**: ArrowDown/ArrowUp cycling (with and without `loop`), Home/End, Enter to select, Escape to close, Tab to close and move focus, Alt+ArrowDown to open. Verify no-ops on disabled items.
- **IME composition**: Simulate `compositionstart` / `compositionupdate` / `compositionend` events. Verify that keyboard navigation and selection are suppressed during active composition, and that the input value updates correctly on `compositionend`.
- **Selection behavior**: Single select (value updates, input text updates, popover closes). Multi-select (value toggles, popover stays open, `resetInputOnSelect`). `enforceMatchingInputValue` (input value reverted on blur when true, preserved when false).
- **Open/close triggers**: Typing opens popover (when `openOnInput` is true). `openOnFocus` opens on focus (with re-entrancy guard — does not reopen after intentional close). `openOnInput` opens on typing. Both can be enabled simultaneously. Trigger button opens (does not toggle/close). Outside click closes. Escape closes. Blur closes (with input value revert behavior governed by `enforceMatchingInputValue`).
- **Initial highlight**: `initialHighlight="selected"` highlights selected item on open, falls back to first. `initialHighlight="first"` always highlights first. `initialHighlight="none"` highlights nothing until arrow key press.
- **Autocomplete behavior**: `autocompleteBehavior="list"` sets `aria-autocomplete="list"`. `autocompleteBehavior="both"` sets `aria-autocomplete="both"` and inline-completes the input. `autocompleteBehavior="none"` sets `aria-autocomplete="none"`.
- **Scroll into view**: Highlighted item scrolls into view on every arrow key navigation, Home/End, and initial highlight on open.
- **Disabled state**: Entire combobox disabled via Root `disabled` prop. Individual items disabled via `disabled` prop. Verify disabled items are skipped during navigation and not selectable.
- **Form integration** (no hidden inputs — `Combobox.Input` is the native form field):
  - Enter key submits the enclosing form when the popover is closed.
  - `name` attribute on `Combobox.Input` is included in submitted `FormData`.
  - `required` prevents form submission when the input is empty (native validation).
  - `enforceMatchingInputValue` clears non-matching input before form submission on Enter.
  - `disabled` excludes the input value from `FormData`.
  - `form` attribute associates the input with a `<form>` outside its DOM ancestry.
  - Multi-select: the native input value reflects search text, not selected values. Consumers handle submission of selected values themselves.
- **RTL**: Arrow key directions are correct when `dir="rtl"` (primarily relevant if horizontal navigation is ever supported).
- **Dynamic items**: Items added/removed while open. Highlighted item removed (highlight moves to nearest valid item). All items removed (no items in collection; consumer handles empty state rendering). Popover opens even when there are no items.
- **Pointer interactions**: Mouse hover highlights items; pointer leave clears highlight. Disabled items are not highlighted on hover. Touch pointer moves do not highlight items; tap selects.
- **Controlled state**: Controlled `open` prop is respected. Controlled `inputValue` prop is respected. `onOpenChange` and `onInputValueChange` fire correctly.
- **Component parts rendering**: Label renders with `htmlFor` pointing to the input and focuses input on click. Separator renders with `aria-hidden`. Portal renders into a custom container. `forceMount` on Content and ItemIndicator renders even when closed / not selected.
- **DismissableLayer callbacks**: `onEscapeKeyDown`, `onPointerDownOutside`, `onInteractOutside` fire at the correct times. Dismiss can be prevented via `event.preventDefault()` in `onPointerDownOutside`.
- **ItemText `highlightMatches`**: Matching substrings wrapped in `<span data-radix-combobox-highlighted-text>`. Case-insensitive. No wrapping when input is empty or `highlightMatches` is false. Updates when input value changes.
- **Data attributes**: `data-radix-combobox-open-state` on Anchor, Input, Trigger, Content. `data-radix-combobox-highlighted` on highlighted item. `data-radix-combobox-selected-state` on selected item. `data-radix-combobox-disabled` on disabled items.

#### Storybook stories

- Styled, Controlled, Uncontrolled, Grouped items, Multi-select, Custom value, Disabled, RTL, Animated (open/close transitions), Within Dialog, With Trigger, With Cancel button, Large collections (scroll behavior), Autocomplete Both (inline completion), Initial Highlight variants, Open on Focus, Open on Input.

#### Cypress e2e tests

- Full interaction flows matching Storybook stories: open, navigate, select, close. Multi-step scenarios (open, type to filter, arrow to item, select, reopen, verify previous selection).

#### Screen reader testing (manual, documented in a test matrix)

Test across the following screen reader + browser combinations (covering the [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)):

| Screen Reader | Browser | Platform |
| ------------- | ------- | -------- |
| VoiceOver     | Safari  | macOS    |
| VoiceOver     | Safari  | iOS      |
| NVDA          | Firefox | Windows  |
| NVDA          | Chrome  | Windows  |
| JAWS          | Chrome  | Windows  |
| TalkBack      | Chrome  | Android  |

For each combination, verify:

- **Role announcement**: Input announced as "combobox" (or equivalent). Popover list announced as "listbox" with item count where supported.
- **State announcements**: `aria-expanded` state changes announced ("expanded" / "collapsed"). Selected item announced on selection.
- **Active descendant**: Highlighted item name and position (e.g., "Apple, 1 of 5") announced as arrow keys move through items. Both `aria-activedescendant` and `aria-selected` are read correctly.
- **Group labels**: Group names announced when entering a new group during navigation.
- **Disabled items**: Disabled state announced; items correctly skipped or announced as unavailable.
- **Label association**: The combobox label is announced when the input receives focus.

#### Speech dictation / voice control testing (manual)

- **macOS Voice Control**: Verify "Click [label]" focuses the input. "Type [text]" enters text and triggers filtering. "Show numbers" / "Click [number]" can activate items.
- **Windows Voice Access**: Verify similar voice-driven input and item selection workflows.
- **iOS Voice Control**: Verify tap targets are reachable and items can be selected via voice.

#### Virtual / on-screen keyboard testing (manual)

- **iOS Safari**: Verify the popover positions correctly above the virtual keyboard. Input focus triggers the keyboard. Selecting an item closes the popover and dismisses the keyboard appropriately. Scroll behavior works when the popover overlaps the keyboard area.
- **Android Chrome**: Same verification as iOS. Additionally test that `compositionend` / `input` event ordering from Gboard and other IMEs produces correct input values.
- **iPad with external keyboard**: Verify keyboard navigation works the same as desktop.

#### Touch interaction testing (manual)

- Tapping the input opens the virtual keyboard and (if `openOnFocus`) the popover.
- Tapping an item selects it and closes the popover.
- Scrolling within a long item list works without accidentally selecting items.
- Tapping outside the popover closes it.
- Long-press does not trigger unintended behavior.
- The combobox works correctly inside scroll containers and modals on touch devices.

#### Register in umbrella package

- Add `export * as Combobox from '@radix-ui/react-combobox'` to [packages/react/radix-ui/src/index.ts](packages/react/radix-ui/src/index.ts).

## Future Considerations

No features are currently deferred. The `highlightMatches` prop on `ComboboxItemText` (originally planned as a future addition) was implemented during Phase 4 as part of the initial release.
