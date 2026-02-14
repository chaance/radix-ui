/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Combobox from '.';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Test constants
// ---------------------------------------------------------------------------
const FRUITS = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Orange', 'Peach', 'Pear'];
const LABEL_TEXT = 'Favorite fruit';
const PLACEHOLDER_TEXT = 'Select a fruit…';

// ---------------------------------------------------------------------------
// Test components
// ---------------------------------------------------------------------------

// TODO: Implement ComboboxTest, ComboboxMultiTest, ComboboxGroupedTest,
// ComboboxFormTest, and other helpers used by the test cases below.

// ---------------------------------------------------------------------------
// Accessibility audits
// ---------------------------------------------------------------------------

describe('Accessibility', () => {
  afterEach(cleanup);

  it.todo('should have no accessibility violations when closed');

  it.todo('should have no accessibility violations when open');

  it.todo('should have no accessibility violations when an item is highlighted');

  it.todo('should have no accessibility violations when an item is selected');

  it.todo('should have no accessibility violations when disabled');

  it.todo('should have no accessibility violations with grouped items');

  it.todo('should have no accessibility violations in multi-select mode');
});

// ---------------------------------------------------------------------------
// ARIA contract
// ---------------------------------------------------------------------------

describe('ARIA attributes', () => {
  afterEach(cleanup);

  it.todo('should have role="combobox" on the input');

  it.todo('should have aria-expanded="false" when closed');

  it.todo('should have aria-expanded="true" when open');

  it.todo('should have aria-controls pointing to the listbox id when open');

  it.todo('should not have aria-controls when closed');

  it.todo('should have role="listbox" on the content');

  it.todo('should have role="option" on each item');

  it.todo('should set aria-activedescendant to the highlighted item id');

  it.todo('should clear aria-activedescendant when no item is highlighted');

  it.todo('should set aria-selected="true" on the selected item');

  it.todo('should set aria-disabled="true" on disabled items');

  it.todo('should have aria-autocomplete="list" when autocompleteBehavior is "list"');

  it.todo('should have aria-autocomplete="both" when autocompleteBehavior is "both"');

  it.todo('should have aria-autocomplete="none" when autocompleteBehavior is "none"');

  it.todo('should have role="group" on item groups');

  it.todo('should set aria-labelledby on groups pointing to the group label');

  it.todo('should have aria-multiselectable="true" on the listbox in multi-select mode');

  it.todo('should set aria-selected="true" on all selected items in multi-select mode');
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

describe('Keyboard navigation', () => {
  afterEach(cleanup);

  describe('when the popover is closed', () => {
    it.todo('should open the popover on ArrowDown');

    it.todo('should open the popover on ArrowUp');

    it.todo('should open the popover on Alt+ArrowDown');

    it.todo('should not open the popover on Escape');

    it.todo('should not open the popover on Tab');

    it.todo('should not open the popover on Enter');
  });

  describe('when the popover is open', () => {
    it.todo('should highlight the next item on ArrowDown');

    it.todo('should highlight the previous item on ArrowUp');

    it.todo('should highlight the first item on Home');

    it.todo('should highlight the last item on End');

    it.todo('should skip disabled items when navigating with ArrowDown');

    it.todo('should skip disabled items when navigating with ArrowUp');

    it.todo('should wrap from last to first when loop is true and pressing ArrowDown');

    it.todo('should wrap from first to last when loop is true and pressing ArrowUp');

    it.todo('should not wrap when loop is false');

    it.todo('should select the highlighted item and close on Enter');

    it.todo('should not select a disabled item on Enter');

    it.todo('should close the popover on Escape');

    it.todo('should close the popover on Tab');

    it.todo('should move focus naturally on Tab');

    it.todo('should scroll the highlighted item into view on ArrowDown');

    it.todo('should scroll the highlighted item into view on ArrowUp');

    it.todo('should scroll the highlighted item into view on Home');

    it.todo('should scroll the highlighted item into view on End');
  });
});

// ---------------------------------------------------------------------------
// IME composition
// ---------------------------------------------------------------------------

describe('IME composition', () => {
  afterEach(cleanup);

  it.todo('should suppress keyboard navigation during active composition');

  it.todo('should suppress selection during active composition');

  it.todo('should update input value correctly on compositionend');

  it.todo('should not open the popover during composition if openOnInput is false');
});

// ---------------------------------------------------------------------------
// Selection behavior — single select
// ---------------------------------------------------------------------------

describe('Single select', () => {
  afterEach(cleanup);

  it.todo('should update the value when an item is selected');

  it.todo('should update the input text to the selected item text');

  it.todo('should close the popover after selection');

  it.todo('should call onValueChange with the selected value');

  it.todo('should call onInputValueChange with the selected item text');

  it.todo('should support controlled value');

  it.todo('should support uncontrolled value with defaultValue');

  it.todo('should display the selected item indicator for the selected item');

  it.todo('should clear the value when set to null (controlled)');

  it.todo('should select an item when clicked');

  it.todo('should close the popover after clicking an item');
});

// ---------------------------------------------------------------------------
// Selection behavior — multi-select
// ---------------------------------------------------------------------------

describe('Multi-select', () => {
  afterEach(cleanup);

  it.todo('should toggle item selection on Enter');

  it.todo('should keep the popover open after selection');

  it.todo('should reset the input text after selection when resetInputOnSelect is true');

  it.todo('should preserve the input text after selection when resetInputOnSelect is false');

  it.todo('should call onValueChange with the updated array of selected values');

  it.todo('should set aria-selected="true" on all selected items');

  it.todo('should set aria-multiselectable="true" on the listbox');

  it.todo('should clear all selected values when set to empty array (controlled)');

  it.todo('should toggle an item when clicked');

  it.todo('should keep the popover open after clicking an item');
});

// ---------------------------------------------------------------------------
// blurValidationBehavior
// ---------------------------------------------------------------------------

describe('blurValidationBehavior', () => {
  afterEach(cleanup);

  describe('when "validate" + multi select', () => {
    // TODO
  });

  describe('when "validate" + single select', () => {
    describe('with no selection value + un-matched input value', () => {
      it.todo('should have empty input and selection value on blur', async () => {
        const inputValue = ''; // TODO
        const selectionValue = null; // TODO
        // 1. Focus the input
        // 2. Type 'lalalalaaaa'
        // 3. Blur the input
        expect(inputValue).toBe('');
        expect(selectionValue).toBe(null);
      });
    });

    describe('with no selection value + matched input value', () => {
      it.todo('should update the selection value to match the input value on blur', async () => {
        const inputValue = ''; // TODO
        const selectionValue = null; // TODO
        // 1. Focus the input
        // 2. Type 'Banana'
        // 3. Blur the input
        expect(inputValue).toBe('Banana');
        expect(selectionValue).toBe('Banana');
      });
    });

    describe('with selection value + un-matched input value', () => {
      it.todo('should revert input to the selected item text on blur', () => {
        const inputValue = 'Banana'; // TODO
        const selectionValue = 'Banana'; // TODO
        // 1. Focus the input
        // 2. Type 'lalalalaaaa'
        // 3. Blur the input
        expect(inputValue).toBe('Banana');
        expect(selectionValue).toBe('Banana');
      });
    });

    describe('with selection value + cleared input value', () => {
      it.todo('should revert input to the selected item text on blur', () => {
        const inputValue = 'Banana'; // TODO
        const selectionValue = 'Banana'; // TODO
        // 1. Focus the input
        // 2. Clear the input
        // 3. Blur the input
        expect(inputValue).toBe('Banana');
        expect(selectionValue).toBe('Banana');
      });
    });

    describe('with selection value + matched input value', () => {
      it.todo('should update the selection value and input value on blur', () => {
        const inputValue = 'Banana'; // TODO
        const selectionValue = 'Banana'; // TODO
        // 1. Focus the input
        // 2. Type 'Apple'
        // 3. Blur the input
        expect(inputValue).toBe('Apple');
        expect(selectionValue).toBe('Apple');
      });
    });

    it.todo('should clear input on blur if no item is selected');

    it.todo('should revert input on Escape');

    it.todo('should clear non-matching input before form submission on Enter');

    it.todo('should allow an empty input as intentional deselection on blur');
  });

  describe('when "none" + single select', () => {
    describe('with no selection value + un-matched input value', () => {
      it.todo('should preserve input value and clear selection value on blur', async () => {
        const inputValue = ''; // TODO
        const selectionValue = null; // TODO
        // 1. Focus the input
        // 2. Type 'lalalalaaaa'
        // 3. Blur the input
        expect(inputValue).toBe('lalalalaaaa');
        expect(selectionValue).toBe(null);
      });
    });

    describe('with no selection value + matched input value', () => {
      it.todo('should update the selection value to match the input value on blur', async () => {
        const inputValue = ''; // TODO
        const selectionValue = null; // TODO
        // 1. Focus the input
        // 2. Type 'Banana'
        // 3. Blur the input
        expect(inputValue).toBe('Banana');
        expect(selectionValue).toBe('Banana');
      });
    });

    describe('with selection value + un-matched input value', () => {
      it.todo('should preserve input value and clear selection value on blur', () => {
        const inputValue = 'Banana'; // TODO
        const selectionValue = 'Banana'; // TODO
        // 1. Focus the input
        // 2. Type 'lalalalaaaa'
        // 3. Blur the input
        expect(inputValue).toBe('lalalalaaaa');
        expect(selectionValue).toBe(null);
      });
    });

    describe('with selection value + cleared input value', () => {
      it.todo('should preserve input value and clear selection value on blur', () => {
        const inputValue = 'Banana'; // TODO
        const selectionValue = 'Banana'; // TODO
        // 1. Focus the input
        // 2. Clear the input
        // 3. Blur the input
        expect(inputValue).toBe('');
        expect(selectionValue).toBe(null);
      });
    });

    describe('with selection value + matched input value', () => {
      it.todo('should update the selection value and input value on blur', () => {
        const inputValue = 'Banana'; // TODO
        const selectionValue = 'Banana'; // TODO
        // 1. Focus the input
        // 2. Type 'Apple'
        // 3. Blur the input
        expect(inputValue).toBe('Apple');
        expect(selectionValue).toBe('Apple');
      });
    });

    it.todo('should preserve any typed value on blur');

    it.todo('should preserve any typed value on Escape when popover is closed');

    it.todo('should not clear non-matching input on form submission');
  });
});

// ---------------------------------------------------------------------------
// Open/close triggers
// ---------------------------------------------------------------------------

describe('Open/close triggers', () => {
  afterEach(cleanup);

  describe('openOnInput', () => {
    it.todo('should open the popover when typing if openOnInput is true');

    it.todo('should not open the popover when typing if openOnInput is false');
  });

  describe('openOnFocus', () => {
    it.todo('should open the popover when the input receives focus');

    it.todo('should not reopen the popover after intentional close (re-entrancy guard)');

    it.todo('should not reopen the popover after Escape closes it while focus stays on input');

    it.todo('should not reopen the popover after selecting an item that returns focus to input');
  });

  describe('trigger button', () => {
    it.todo('should open the popover when the trigger button is clicked');

    it.todo('should move focus to the input when the trigger button is clicked');

    it.todo('should not reopen the popover when clicked after an outside pointer-down dismissal');
  });

  describe('cancel button', () => {
    it.todo('should clear the input value when the cancel button is clicked');

    it.todo('should move focus to the input when clicked');

    it.todo('should be reachable via Tab key');
  });

  describe('closing', () => {
    it.todo('should close the popover on outside click');

    it.todo('should close the popover on blur');

    it.todo('should close the popover on Escape');
  });
});

// ---------------------------------------------------------------------------
// Initial highlight
// ---------------------------------------------------------------------------

describe('initialHighlight', () => {
  afterEach(cleanup);

  describe('when set to "selected"', () => {
    it.todo('should highlight the selected item when the popover opens');

    it.todo('should fall back to the first item if no item is selected');

    it.todo('should highlight the previously selected item when reopening the popover');
  });

  describe('when set to "first"', () => {
    it.todo('should always highlight the first item when the popover opens');
  });

  describe('when set to "none" (default)', () => {
    it.todo('should not highlight any item when the popover opens');

    it.todo('should highlight the first item on the first ArrowDown press');
  });
});

// ---------------------------------------------------------------------------
// Autocomplete behavior
// ---------------------------------------------------------------------------

describe('autocompleteBehavior', () => {
  afterEach(cleanup);

  describe('when set to "list"', () => {
    it.todo('should set aria-autocomplete="list" on the input', () => {});
  });

  describe('when set to "none"', () => {
    it.todo('should set aria-autocomplete="none" on the input', () => {});
  });

  describe('when set to "both"', () => {
    it.todo('should set aria-autocomplete="both" on the input', () => {});

    it.todo('should inline-complete the input with the first matching item text', () => {});

    it.todo('should select the completion range in the input', () => {});

    it.todo('should update inline completion when ArrowDown changes the highlight', () => {});

    it.todo('should accept inline completion on Tab and close the popover', () => {});

    it.todo('should accept inline completion on blur', () => {});

    it.todo('should not inline-complete if the input is empty', () => {});

    it.todo('should not inline-complete during IME composition', () => {});

    it.todo('should clear inline completion text when the popover closes', () => {});
  });
});

// ---------------------------------------------------------------------------
// Disabled state
// ---------------------------------------------------------------------------

describe('Disabled state', () => {
  afterEach(cleanup);

  it.todo('should disable the input when the root is disabled', () => {});

  it.todo('should not open the popover when the root is disabled', () => {});

  it.todo('should skip disabled items during keyboard navigation', () => {});

  it.todo('should not select a disabled item on click', () => {});

  it.todo('should not select a disabled item on Enter', () => {});

  it.todo('should render aria-disabled="true" on disabled items', () => {});
});

// ---------------------------------------------------------------------------
// Form integration
// ---------------------------------------------------------------------------

describe('Form integration', () => {
  afterEach(cleanup);

  it.todo('should submit the form on Enter when the popover is closed', () => {});

  it.todo('should include the input name and value in submitted FormData', () => {});

  it.todo('should prevent form submission when required and input is empty', () => {});

  it.todo(
    'should clear non-matching input before submission when blurValidationBehavior is "validate"',
    () => {},
  );

  it.todo('should exclude the input from FormData when disabled', () => {});

  it.todo(
    'should associate with a form outside its DOM hierarchy via the form attribute',
    () => {},
  );
});

// ---------------------------------------------------------------------------
// Dynamic items
// ---------------------------------------------------------------------------

describe('Dynamic items', () => {
  afterEach(cleanup);

  it.todo('should handle items added while the popover is open', () => {});

  it.todo('should handle items removed while the popover is open', () => {});

  it.todo(
    'should move highlight to the nearest valid item when the highlighted item is removed',
    () => {},
  );

  it.todo('should open the popover even when there are no items', () => {});
});

// ---------------------------------------------------------------------------
// ItemText highlight matches
// ---------------------------------------------------------------------------

describe('ItemText highlightMatches', () => {
  afterEach(cleanup);

  it.todo(
    'should wrap matching text in a span with data-radix-combobox-highlighted-text',
    () => {},
  );

  it.todo('should not wrap text when highlightMatches is false', () => {});

  it.todo('should handle case-insensitive matching', () => {});

  it.todo('should not wrap when the input is empty', () => {});

  it.todo('should update highlights when the input value changes', () => {});
});

// ---------------------------------------------------------------------------
// Data attributes
// ---------------------------------------------------------------------------

describe('Data attributes', () => {
  afterEach(cleanup);

  it.todo('should set data-radix-combobox-open-state on the anchor', () => {});

  it.todo('should set data-radix-combobox-open-state on the input', () => {});

  it.todo('should set data-radix-combobox-open-state on the trigger', () => {});

  it.todo('should set data-radix-combobox-open-state on the content', () => {});

  it.todo('should set data-radix-combobox-highlighted on the highlighted item', () => {});

  it.todo('should set data-radix-combobox-selected-state on the selected item', () => {});

  it.todo('should set data-radix-combobox-disabled on disabled items', () => {});
});

// ---------------------------------------------------------------------------
// Pointer interactions
// ---------------------------------------------------------------------------

describe('Pointer interactions', () => {
  afterEach(cleanup);

  describe('mouse', () => {
    it.todo('should highlight an item on mouse hover', () => {});

    it.todo('should clear highlight when the pointer leaves an item', () => {});

    it.todo('should not highlight disabled items on hover', () => {});
  });

  describe('touch', () => {
    it.todo('should not highlight items on touch pointer move', () => {});

    it.todo('should select an item on tap', () => {});
  });
});

// ---------------------------------------------------------------------------
// Controlled state
// ---------------------------------------------------------------------------

describe('Controlled state', () => {
  afterEach(cleanup);

  it.todo('should respect a controlled open prop', () => {});

  it.todo('should respect a controlled inputValue prop', () => {});

  it.todo('should call onOpenChange when the popover opens or closes', () => {});

  it.todo('should call onInputValueChange when the input value changes', () => {});
});

// ---------------------------------------------------------------------------
// Component parts rendering
// ---------------------------------------------------------------------------

describe('Component parts rendering', () => {
  afterEach(cleanup);

  describe('Label', () => {
    it.todo('should render with htmlFor pointing to the input id', () => {});

    it.todo('should focus the input when the label is clicked', () => {});
  });

  describe('Separator', () => {
    it.todo('should render with aria-hidden', () => {});
  });

  describe('Portal', () => {
    it.todo('should render content into a custom container', () => {});
  });

  describe('forceMount', () => {
    it.todo('should render content when forceMount is true even when closed', () => {});

    it.todo(
      'should render item indicator when forceMount is true even when not selected',
      () => {},
    );
  });
});

// ---------------------------------------------------------------------------
// DismissableLayer callbacks
// ---------------------------------------------------------------------------

describe('DismissableLayer callbacks', () => {
  afterEach(cleanup);

  it.todo('should call onEscapeKeyDown when Escape is pressed while open', () => {});

  it.todo('should call onPointerDownOutside when clicking outside', () => {});

  it.todo(
    'should allow preventing dismiss via event.preventDefault() in onPointerDownOutside',
    () => {},
  );

  it.todo('should call onInteractOutside on outside interaction', () => {});
});
