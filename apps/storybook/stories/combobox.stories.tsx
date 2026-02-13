import * as React from 'react';
import { Combobox } from 'radix-ui';
import styles from './combobox.stories.module.css';

export default { title: 'Components/Combobox' };

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

export const Basic = () => {
  const [inputValue, setInputValue] = React.useState('');
  const matches = inputValue
    ? FRUITS.filter((fruit) => fruit.toLowerCase().includes(inputValue.toLowerCase()))
    : FRUITS;

  return (
    <div style={{ padding: 50 }}>
      <Combobox.Root inputValue={inputValue} onInputValueChange={setInputValue}>
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
              <div style={{ padding: '8px 12px', color: '#999', fontSize: 14 }}>No results</div>
            )}
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>

      <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        <div>
          Input value: <code>{JSON.stringify(inputValue)}</code>
        </div>
        <div>Matching items: {matches.length}</div>
      </div>
    </div>
  );
};

export const Controlled = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [value, setValue] = React.useState<string | null>('Banana');
  const matches = inputValue
    ? FRUITS.filter((fruit) => fruit.toLowerCase().includes(inputValue.toLowerCase()))
    : FRUITS;

  return (
    <div style={{ padding: 50 }}>
      <Combobox.Root
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        value={value}
        onValueChange={setValue}
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
              <div style={{ padding: '8px 12px', color: '#999', fontSize: 14 }}>No results</div>
            )}
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>

      <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        <div>
          Input value: <code>{JSON.stringify(inputValue)}</code>
        </div>
        <div>
          Selected value: <code>{JSON.stringify(value)}</code>
        </div>
        <div>Matching items: {matches.length}</div>
      </div>
    </div>
  );
};

export const OpenOnFocus = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const matches = inputValue
    ? FRUITS.filter((fruit) => fruit.toLowerCase().includes(inputValue.toLowerCase()))
    : FRUITS;

  return (
    <div style={{ padding: 50 }}>
      <Combobox.Root
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        open={open}
        onOpenChange={setOpen}
        openOnFocus
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

      <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        <div>
          Open: <code>{JSON.stringify(open)}</code>
        </div>
        <div>
          Input value: <code>{JSON.stringify(inputValue)}</code>
        </div>
      </div>
    </div>
  );
};

export const HighlightMatches = () => {
  const [inputValue, setInputValue] = React.useState('');
  const matches = inputValue
    ? FRUITS.filter((fruit) => fruit.toLowerCase().includes(inputValue.toLowerCase()))
    : FRUITS;

  return (
    <div style={{ padding: 50 }}>
      <Combobox.Root inputValue={inputValue} onInputValueChange={setInputValue}>
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
              <div style={{ padding: '8px 12px', color: '#999', fontSize: 14 }}>No results</div>
            )}
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>

      <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        <div>
          Input value: <code>{JSON.stringify(inputValue)}</code>
        </div>
        <div>Matching items: {matches.length}</div>
      </div>
    </div>
  );
};

export const DisabledItems = () => {
  const [inputValue, setInputValue] = React.useState('');
  const matches = inputValue
    ? FRUITS.filter((fruit) => fruit.toLowerCase().includes(inputValue.toLowerCase()))
    : FRUITS;
  const disabledFruits = new Set(['Cherry', 'Grape', 'Lemon']);

  return (
    <div style={{ padding: 50 }}>
      <Combobox.Root inputValue={inputValue} onInputValueChange={setInputValue}>
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
              <div style={{ padding: '8px 12px', color: '#999', fontSize: 14 }}>No results</div>
            )}
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
};

export const WithTriggerAndCancel = () => {
  const [inputValue, setInputValue] = React.useState('');
  const matches = inputValue
    ? FRUITS.filter((fruit) => fruit.toLowerCase().includes(inputValue.toLowerCase()))
    : FRUITS;

  return (
    <div style={{ padding: 50 }}>
      <Combobox.Root inputValue={inputValue} onInputValueChange={setInputValue}>
        <Combobox.Label className={styles.label}>Favorite fruit (with trigger + cancel)</Combobox.Label>
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
                  <Combobox.ItemIndicator className={styles.itemIndicator}>✓</Combobox.ItemIndicator>
                </Combobox.Item>
              ))
            ) : (
              <div style={{ padding: '8px 12px', color: '#999', fontSize: 14 }}>No results</div>
            )}
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
};

const FOOD_GROUPS = {
  Fruits: ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Grape'],
  Vegetables: ['Carrot', 'Celery', 'Lettuce', 'Spinach', 'Tomato'],
  Grains: ['Barley', 'Oats', 'Rice', 'Wheat'],
};

export const Grouped = () => {
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
      <Combobox.Root inputValue={inputValue} onInputValueChange={setInputValue}>
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
                    <Combobox.GroupLabel className={styles.groupLabel}>{group}</Combobox.GroupLabel>
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
              <div style={{ padding: '8px 12px', color: '#999', fontSize: 14 }}>No results</div>
            )}
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
};

export const Disabled = () => {
  return (
    <div style={{ padding: 50 }}>
      <Combobox.Root disabled>
        <Combobox.Label className={styles.label}>Disabled combobox</Combobox.Label>
        <Combobox.Anchor className={styles.anchor}>
          <Combobox.Input className={styles.input} placeholder="Can't type here…" />
        </Combobox.Anchor>
      </Combobox.Root>
    </div>
  );
};
