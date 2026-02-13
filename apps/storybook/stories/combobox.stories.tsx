import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Combobox } from 'radix-ui';
import styles from './combobox.stories.module.css';

/* ---------------------------------------------------------------------------
 * Shared data
 * -------------------------------------------------------------------------*/

const FRUITS = [
  'Apple',
  'Banana',
  'Blueberry',
  'Cherry',
  'Grape',
  'Lemon',
  'Mango',
  'Orange',
  'Peach',
  'Pear',
  'Pineapple',
  'Plum',
  'Strawberry',
  'Watermelon',
];

const FOOD_GROUPS = {
  Fruits: ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Grape'],
  Vegetables: ['Carrot', 'Celery', 'Lettuce', 'Spinach', 'Tomato'],
  Grains: ['Barley', 'Oats', 'Rice', 'Wheat'],
};

/* ---------------------------------------------------------------------------
 * Shared arg types for Combobox.Root props
 * -------------------------------------------------------------------------*/

interface ComboboxStoryArgs {
  disabled: boolean;
  allowCustomValue: boolean;
  openOnFocus: boolean;
  openOnInput: boolean;
  autocompleteBehavior: 'list' | 'both' | 'none';
  initialHighlight: 'none' | 'selected' | 'first';
  loop: boolean;
}

export default {
  title: 'Components/Combobox',
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disables the entire combobox',
    },
    allowCustomValue: {
      control: 'boolean',
      description: 'Allow values not matching any item',
    },
    openOnFocus: {
      control: 'boolean',
      description: 'Open the popover when the input receives focus',
    },
    openOnInput: {
      control: 'boolean',
      description: 'Open the popover when the user types',
    },
    autocompleteBehavior: {
      control: 'radio',
      options: ['list', 'both', 'none'],
      description: 'Controls the autocomplete behavior',
    },
    initialHighlight: {
      control: 'radio',
      options: ['none', 'selected', 'first'],
      description: 'Which item is highlighted when the popover opens',
    },
    loop: {
      control: 'boolean',
      description: 'Wrap arrow key navigation from last to first and vice versa',
    },
  },
  args: {
    disabled: false,
    allowCustomValue: false,
    openOnFocus: false,
    openOnInput: true,
    autocompleteBehavior: 'list',
    initialHighlight: 'none',
    loop: false,
  },
} satisfies Meta<ComboboxStoryArgs>;

type Story = StoryObj<ComboboxStoryArgs>;

/* ---------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------*/

function filterFruits(query: string) {
  return query
    ? FRUITS.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()))
    : FRUITS;
}

function NoResults() {
  return <div style={{ padding: '8px 12px', color: '#999', fontSize: 14 }}>No results</div>;
}

function StateDisplay(props: { items: Record<string, unknown> }) {
  return (
    <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
      {Object.entries(props.items).map(([label, value]) => (
        <div key={label}>
          {label}: <code>{JSON.stringify(value)}</code>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Stories
 * -------------------------------------------------------------------------*/

export const Basic = {
  render: function Basic(args: ComboboxStoryArgs) {
    const [inputValue, setInputValue] = React.useState('');
    const matches = filterFruits(inputValue);

    return (
      <div style={{ padding: 50 }}>
        <Combobox.Root
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          disabled={args.disabled}
          allowCustomValue={args.allowCustomValue}
          openOnFocus={args.openOnFocus}
          openOnInput={args.openOnInput}
          autocompleteBehavior={args.autocompleteBehavior}
          initialHighlight={args.initialHighlight}
          loop={args.loop}
        >
          <Combobox.Label className={styles.label}>Favorite fruit</Combobox.Label>
          <Combobox.Anchor className={styles.anchor}>
            <Combobox.Input className={styles.input} placeholder="Search fruits…" />
          </Combobox.Anchor>
          <Combobox.Portal>
            <Combobox.Content className={styles.content} sideOffset={4}>
              {matches.length > 0 ? (
                matches.map((fruit) => (
                  <Combobox.Item key={fruit} value={fruit} className={styles.item}>
                    <Combobox.ItemText>{fruit}</Combobox.ItemText>
                    <Combobox.ItemIndicator className={styles.itemIndicator}>
                      ✓
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))
              ) : (
                <NoResults />
              )}
            </Combobox.Content>
          </Combobox.Portal>
        </Combobox.Root>

        <StateDisplay items={{ 'Input value': inputValue, 'Matching items': matches.length }} />
      </div>
    );
  },
} satisfies Story;

export const Controlled = {
  render: function Controlled(args: ComboboxStoryArgs) {
    const [inputValue, setInputValue] = React.useState('');
    const [value, setValue] = React.useState<string | null>('Banana');
    const matches = filterFruits(inputValue);

    return (
      <div style={{ padding: 50 }}>
        <Combobox.Root
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          value={value}
          onValueChange={setValue}
          disabled={args.disabled}
          allowCustomValue={args.allowCustomValue}
          openOnFocus={args.openOnFocus}
          openOnInput={args.openOnInput}
          autocompleteBehavior={args.autocompleteBehavior}
          initialHighlight={args.initialHighlight}
          loop={args.loop}
        >
          <Combobox.Label className={styles.label}>Favorite fruit</Combobox.Label>
          <Combobox.Anchor className={styles.anchor}>
            <Combobox.Input className={styles.input} placeholder="Search fruits…" />
          </Combobox.Anchor>
          <Combobox.Portal>
            <Combobox.Content className={styles.content} sideOffset={4}>
              {matches.length > 0 ? (
                matches.map((fruit) => (
                  <Combobox.Item key={fruit} value={fruit} className={styles.item}>
                    <Combobox.ItemText>{fruit}</Combobox.ItemText>
                    <Combobox.ItemIndicator className={styles.itemIndicator}>
                      ✓
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))
              ) : (
                <NoResults />
              )}
            </Combobox.Content>
          </Combobox.Portal>
        </Combobox.Root>

        <StateDisplay
          items={{
            'Input value': inputValue,
            'Selected value': value,
            'Matching items': matches.length,
          }}
        />
      </div>
    );
  },
} satisfies Story;

export const OpenOnFocus = {
  args: { openOnFocus: true },
  render: function OpenOnFocus(args: ComboboxStoryArgs) {
    const [inputValue, setInputValue] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const matches = filterFruits(inputValue);

    return (
      <div style={{ padding: 50 }}>
        <Combobox.Root
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          open={open}
          onOpenChange={setOpen}
          disabled={args.disabled}
          allowCustomValue={args.allowCustomValue}
          openOnFocus={args.openOnFocus}
          openOnInput={args.openOnInput}
          autocompleteBehavior={args.autocompleteBehavior}
          initialHighlight={args.initialHighlight}
          loop={args.loop}
        >
          <Combobox.Label className={styles.label}>Favorite fruit (opens on focus)</Combobox.Label>
          <Combobox.Anchor className={styles.anchor}>
            <Combobox.Input className={styles.input} placeholder="Focus me…" />
          </Combobox.Anchor>
          <Combobox.Portal>
            <Combobox.Content className={styles.content} sideOffset={4}>
              {matches.map((fruit) => (
                <Combobox.Item key={fruit} value={fruit} className={styles.item}>
                  <Combobox.ItemText>{fruit}</Combobox.ItemText>
                  <Combobox.ItemIndicator className={styles.itemIndicator}>✓</Combobox.ItemIndicator>
                </Combobox.Item>
              ))}
            </Combobox.Content>
          </Combobox.Portal>
        </Combobox.Root>

        <StateDisplay items={{ Open: open, 'Input value': inputValue }} />
      </div>
    );
  },
} satisfies Story;

export const HighlightMatches = {
  render: function HighlightMatches(args: ComboboxStoryArgs) {
    const [inputValue, setInputValue] = React.useState('');
    const matches = filterFruits(inputValue);

    return (
      <div style={{ padding: 50 }}>
        <Combobox.Root
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          disabled={args.disabled}
          allowCustomValue={args.allowCustomValue}
          openOnFocus={args.openOnFocus}
          openOnInput={args.openOnInput}
          autocompleteBehavior={args.autocompleteBehavior}
          initialHighlight={args.initialHighlight}
          loop={args.loop}
        >
          <Combobox.Label className={styles.label}>
            Favorite fruit (with highlighted matches)
          </Combobox.Label>
          <Combobox.Anchor className={styles.anchor}>
            <Combobox.Input className={styles.input} placeholder="Type to highlight…" />
          </Combobox.Anchor>
          <Combobox.Portal>
            <Combobox.Content className={styles.content} sideOffset={4}>
              {matches.length > 0 ? (
                matches.map((fruit) => (
                  <Combobox.Item key={fruit} value={fruit} className={styles.item}>
                    <Combobox.ItemText highlightMatches>{fruit}</Combobox.ItemText>
                    <Combobox.ItemIndicator className={styles.itemIndicator}>
                      ✓
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))
              ) : (
                <NoResults />
              )}
            </Combobox.Content>
          </Combobox.Portal>
        </Combobox.Root>

        <StateDisplay items={{ 'Input value': inputValue, 'Matching items': matches.length }} />
      </div>
    );
  },
} satisfies Story;

export const DisabledItems = {
  render: function DisabledItems(args: ComboboxStoryArgs) {
    const [inputValue, setInputValue] = React.useState('');
    const matches = filterFruits(inputValue);
    const disabledFruits = new Set(['Cherry', 'Grape', 'Lemon']);

    return (
      <div style={{ padding: 50 }}>
        <Combobox.Root
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          disabled={args.disabled}
          allowCustomValue={args.allowCustomValue}
          openOnFocus={args.openOnFocus}
          openOnInput={args.openOnInput}
          autocompleteBehavior={args.autocompleteBehavior}
          initialHighlight={args.initialHighlight}
          loop={args.loop}
        >
          <Combobox.Label className={styles.label}>Favorite fruit (some disabled)</Combobox.Label>
          <Combobox.Anchor className={styles.anchor}>
            <Combobox.Input className={styles.input} placeholder="Search fruits…" />
          </Combobox.Anchor>
          <Combobox.Portal>
            <Combobox.Content className={styles.content} sideOffset={4}>
              {matches.length > 0 ? (
                matches.map((fruit) => (
                  <Combobox.Item
                    key={fruit}
                    value={fruit}
                    disabled={disabledFruits.has(fruit)}
                    className={styles.item}
                  >
                    <Combobox.ItemText>{fruit}</Combobox.ItemText>
                    <Combobox.ItemIndicator className={styles.itemIndicator}>
                      ✓
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))
              ) : (
                <NoResults />
              )}
            </Combobox.Content>
          </Combobox.Portal>
        </Combobox.Root>
      </div>
    );
  },
} satisfies Story;

export const WithTriggerAndCancel = {
  render: function WithTriggerAndCancel(args: ComboboxStoryArgs) {
    const [inputValue, setInputValue] = React.useState('');
    const matches = filterFruits(inputValue);

    return (
      <div style={{ padding: 50 }}>
        <Combobox.Root
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          disabled={args.disabled}
          allowCustomValue={args.allowCustomValue}
          openOnFocus={args.openOnFocus}
          openOnInput={args.openOnInput}
          autocompleteBehavior={args.autocompleteBehavior}
          initialHighlight={args.initialHighlight}
          loop={args.loop}
        >
          <Combobox.Label className={styles.label}>
            Favorite fruit (with trigger + cancel)
          </Combobox.Label>
          <Combobox.Anchor className={styles.anchor}>
            <Combobox.Input className={styles.input} placeholder="Search fruits…" />
            {inputValue && (
              <Combobox.Cancel className={styles.cancel} aria-label="Clear input">
                ✕
              </Combobox.Cancel>
            )}
            <Combobox.Trigger className={styles.trigger}>▼</Combobox.Trigger>
          </Combobox.Anchor>
          <Combobox.Portal>
            <Combobox.Content className={styles.content} sideOffset={4}>
              {matches.length > 0 ? (
                matches.map((fruit) => (
                  <Combobox.Item key={fruit} value={fruit} className={styles.item}>
                    <Combobox.ItemText>{fruit}</Combobox.ItemText>
                    <Combobox.ItemIndicator className={styles.itemIndicator}>
                      ✓
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))
              ) : (
                <NoResults />
              )}
            </Combobox.Content>
          </Combobox.Portal>
        </Combobox.Root>
      </div>
    );
  },
} satisfies Story;

export const Grouped = {
  render: function Grouped(args: ComboboxStoryArgs) {
    const [inputValue, setInputValue] = React.useState('');
    const filteredGroups = Object.entries(FOOD_GROUPS)
      .map(([group, items]) => ({
        group,
        items: inputValue
          ? items.filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()))
          : items,
      }))
      .filter(({ items }) => items.length > 0);

    return (
      <div style={{ padding: 50 }}>
        <Combobox.Root
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          disabled={args.disabled}
          allowCustomValue={args.allowCustomValue}
          openOnFocus={args.openOnFocus}
          openOnInput={args.openOnInput}
          autocompleteBehavior={args.autocompleteBehavior}
          initialHighlight={args.initialHighlight}
          loop={args.loop}
        >
          <Combobox.Label className={styles.label}>Favorite food (grouped)</Combobox.Label>
          <Combobox.Anchor className={styles.anchor}>
            <Combobox.Input className={styles.input} placeholder="Search foods…" />
            <Combobox.Trigger className={styles.trigger}>▼</Combobox.Trigger>
          </Combobox.Anchor>
          <Combobox.Portal>
            <Combobox.Content className={styles.content} sideOffset={4}>
              {filteredGroups.length > 0 ? (
                filteredGroups.map(({ group, items }, groupIndex) => (
                  <React.Fragment key={group}>
                    {groupIndex > 0 && <Combobox.Separator className={styles.separator} />}
                    <Combobox.Group>
                      <Combobox.GroupLabel className={styles.groupLabel}>
                        {group}
                      </Combobox.GroupLabel>
                      {items.map((item) => (
                        <Combobox.Item key={item} value={item} className={styles.item}>
                          <Combobox.ItemText>{item}</Combobox.ItemText>
                          <Combobox.ItemIndicator className={styles.itemIndicator}>
                            ✓
                          </Combobox.ItemIndicator>
                        </Combobox.Item>
                      ))}
                    </Combobox.Group>
                  </React.Fragment>
                ))
              ) : (
                <NoResults />
              )}
            </Combobox.Content>
          </Combobox.Portal>
        </Combobox.Root>
      </div>
    );
  },
} satisfies Story;

export const MultiSelect = {
  render: function MultiSelect(args: ComboboxStoryArgs) {
    const [inputValue, setInputValue] = React.useState('');
    const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
    const matches = filterFruits(inputValue);

    return (
      <div style={{ padding: 50 }}>
        <Combobox.Root
          multiple
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          value={selectedValues}
          onValueChange={setSelectedValues}
          disabled={args.disabled}
          allowCustomValue={args.allowCustomValue}
          openOnFocus={args.openOnFocus}
          openOnInput={args.openOnInput}
          autocompleteBehavior={args.autocompleteBehavior}
          initialHighlight={args.initialHighlight}
          loop={args.loop}
        >
          <Combobox.Label className={styles.label}>Favorite fruits (multi-select)</Combobox.Label>
          {selectedValues.length > 0 && (
            <div className={styles.tags}>
              {selectedValues.map((val) => (
                <span key={val} className={styles.tag}>
                  {val}
                  <button
                    className={styles.tagRemove}
                    aria-label={`Remove ${val}`}
                    onClick={() => setSelectedValues((prev) => prev.filter((v) => v !== val))}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
          <Combobox.Anchor className={styles.anchor}>
            <Combobox.Input className={styles.input} placeholder="Search fruits…" />
            {inputValue && (
              <Combobox.Cancel className={styles.cancel} aria-label="Clear input">
                ✕
              </Combobox.Cancel>
            )}
          </Combobox.Anchor>
          <Combobox.Portal>
            <Combobox.Content className={styles.content} sideOffset={4}>
              {matches.length > 0 ? (
                matches.map((fruit) => (
                  <Combobox.Item key={fruit} value={fruit} className={styles.item}>
                    <Combobox.ItemText>{fruit}</Combobox.ItemText>
                    <Combobox.ItemIndicator className={styles.itemIndicator}>
                      ✓
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))
              ) : (
                <NoResults />
              )}
            </Combobox.Content>
          </Combobox.Portal>
        </Combobox.Root>

        <StateDisplay
          items={{ 'Input value': inputValue, 'Selected values': selectedValues }}
        />
      </div>
    );
  },
} satisfies Story;

export const AutocompleteBoth = {
  args: { autocompleteBehavior: 'both' },
  render: function AutocompleteBoth(args: ComboboxStoryArgs) {
    const [inputValue, setInputValue] = React.useState('');
    const matches = filterFruits(inputValue);

    return (
      <div style={{ padding: 50 }}>
        <Combobox.Root
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          disabled={args.disabled}
          allowCustomValue={args.allowCustomValue}
          openOnFocus={args.openOnFocus}
          openOnInput={args.openOnInput}
          autocompleteBehavior={args.autocompleteBehavior}
          initialHighlight={args.initialHighlight}
          loop={args.loop}
        >
          <Combobox.Label className={styles.label}>
            Inline completion (autocompleteBehavior=&quot;both&quot;)
          </Combobox.Label>
          <Combobox.Anchor className={styles.anchor}>
            <Combobox.Input className={styles.input} placeholder="Type to autocomplete…" />
          </Combobox.Anchor>
          <Combobox.Portal>
            <Combobox.Content className={styles.content} sideOffset={4}>
              {matches.length > 0 ? (
                matches.map((fruit) => (
                  <Combobox.Item key={fruit} value={fruit} className={styles.item}>
                    <Combobox.ItemText>{fruit}</Combobox.ItemText>
                    <Combobox.ItemIndicator className={styles.itemIndicator}>
                      ✓
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))
              ) : (
                <NoResults />
              )}
            </Combobox.Content>
          </Combobox.Portal>
        </Combobox.Root>
      </div>
    );
  },
} satisfies Story;

export const Disabled = {
  args: { disabled: true },
  render: function Disabled(args: ComboboxStoryArgs) {
    return (
      <div style={{ padding: 50 }}>
        <Combobox.Root disabled={args.disabled}>
          <Combobox.Label className={styles.label}>Disabled combobox</Combobox.Label>
          <Combobox.Anchor className={styles.anchor}>
            <Combobox.Input className={styles.input} placeholder="Can't type here…" />
          </Combobox.Anchor>
        </Combobox.Root>
      </div>
    );
  },
} satisfies Story;
