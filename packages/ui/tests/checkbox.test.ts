import { describe, expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Checkbox } from '../src/primitives/checkbox';
import { CheckboxCard } from '../src/primitives/checkbox-card';
import { getCheckboxBoxClassName, getCheckboxDataState } from '../src/primitives/checkbox.utils';

import type { CheckboxCardProps } from '../src/primitives/checkbox-card';

function count(markup: string, needle: string): number {
  return markup.split(needle).length - 1;
}

/** The opening tag of the first element carrying the given `data-slot`. */
function openingTag(markup: string, slot: string): string {
  const match = new RegExp(`<[a-z]+[^>]*data-slot="${slot}"[^>]*>`).exec(markup);
  if (!match) throw new Error(`no element with data-slot="${slot}"`);
  return match[0];
}

function renderCard(props: Partial<CheckboxCardProps> = {}): string {
  return renderToStaticMarkup(createElement(CheckboxCard, { title: 'Newsletter', ...props }));
}

describe('getCheckboxDataState', () => {
  test('maps the checked value to the data-state attribute', () => {
    expect(getCheckboxDataState(true)).toBe('checked');
    expect(getCheckboxDataState(false)).toBe('unchecked');
    expect(getCheckboxDataState('indeterminate')).toBe('indeterminate');
  });

  test('no value is unchecked', () => {
    expect(getCheckboxDataState(undefined)).toBe('unchecked');
  });
});

describe('getCheckboxBoxClassName', () => {
  test('the default square is 16px, lg is 24px', () => {
    expect(getCheckboxBoxClassName().split(' ')).toContain('size-4');
    expect(getCheckboxBoxClassName('default').split(' ')).toContain('size-4');
    expect(getCheckboxBoxClassName('lg').split(' ')).toContain('size-6');
    expect(getCheckboxBoxClassName('lg').split(' ')).not.toContain('size-4');
  });

  test('fills with the primary colour when checked and keeps the input border otherwise', () => {
    const classes = getCheckboxBoxClassName().split(' ');
    expect(classes).toContain('border-input');
    expect(classes).toContain('data-[state=checked]:bg-primary');
    expect(classes).toContain('data-[state=checked]:border-primary');
  });
});

describe('Checkbox', () => {
  test('renders one unchecked checkbox button by default', () => {
    const markup = renderToStaticMarkup(createElement(Checkbox, { 'aria-label': 'Accept' }));
    const root = openingTag(markup, 'checkbox');

    expect(root.startsWith('<button')).toBe(true);
    expect(root).toContain('type="button"');
    expect(root).toContain('role="checkbox"');
    expect(root).toContain('aria-checked="false"');
    expect(root).toContain('data-state="unchecked"');
    expect(root).toContain('aria-label="Accept"');
    expect(markup).not.toContain('<svg');
  });

  test('checked draws the tick', () => {
    const markup = renderToStaticMarkup(createElement(Checkbox, { checked: true }));

    expect(openingTag(markup, 'checkbox')).toContain('aria-checked="true"');
    expect(openingTag(markup, 'checkbox')).toContain('data-state="checked"');
    expect(markup).toContain('data-slot="checkbox-indicator"');
    expect(markup).toContain('<svg');
  });

  test('defaultChecked starts checked without a controlled value', () => {
    const markup = renderToStaticMarkup(createElement(Checkbox, { defaultChecked: true }));
    expect(openingTag(markup, 'checkbox')).toContain('aria-checked="true"');
  });

  test('indeterminate is announced as mixed', () => {
    const markup = renderToStaticMarkup(createElement(Checkbox, { checked: 'indeterminate' }));
    const root = openingTag(markup, 'checkbox');

    expect(root).toContain('aria-checked="mixed"');
    expect(root).toContain('data-state="indeterminate"');
  });

  test('disabled disables the button', () => {
    const root = openingTag(renderToStaticMarkup(createElement(Checkbox, { disabled: true })), 'checkbox');

    expect(root).toContain('disabled=""');
    expect(root).toContain('data-disabled=""');
  });

  test('size picks the square and className is merged last', () => {
    const large = openingTag(
      renderToStaticMarkup(createElement(Checkbox, { size: 'lg', className: 'size-8 rounded-none' })),
      'checkbox',
    );

    expect(large).toContain('data-size="lg"');
    expect(large).toContain('size-8');
    expect(large).toContain('rounded-none');
    expect(large).not.toContain('size-6');
    expect(large).not.toContain('rounded-md');
  });
});

describe('CheckboxCard', () => {
  test('the card is the only checkbox and the only button', () => {
    const markup = renderCard({ description: 'Once a month', badge: 'Optional' });

    expect(count(markup, 'role="checkbox"')).toBe(1);
    expect(count(markup, '<button')).toBe(1);
    expect(openingTag(markup, 'checkbox-card').startsWith('<button')).toBe(true);
    expect(openingTag(markup, 'checkbox-card-indicator')).toContain('aria-hidden="true"');
  });

  test('starts unchecked, with no data-checked attribute and no tick', () => {
    const markup = renderCard();
    const root = openingTag(markup, 'checkbox-card');

    expect(root).toContain('aria-checked="false"');
    expect(root).not.toContain(' data-checked=');
    expect(openingTag(markup, 'checkbox-card-indicator')).toContain('data-state="unchecked"');
    expect(markup).not.toContain('<svg');
  });

  test('checked sets data-checked on the card and ticks the square', () => {
    const markup = renderCard({ checked: true });
    const root = openingTag(markup, 'checkbox-card');

    expect(root).toContain('aria-checked="true"');
    expect(root).toContain('data-checked=""');
    expect(openingTag(markup, 'checkbox-card-indicator')).toContain('data-state="checked"');
    expect(markup).toContain('<svg');
  });

  test('defaultChecked is the initial state when uncontrolled, checked wins over it', () => {
    expect(openingTag(renderCard({ defaultChecked: true }), 'checkbox-card')).toContain('aria-checked="true"');
    expect(openingTag(renderCard({ defaultChecked: true, checked: false }), 'checkbox-card')).toContain(
      'aria-checked="false"',
    );
  });

  test('disabled disables the card and marks the square', () => {
    const markup = renderCard({ disabled: true });

    expect(openingTag(markup, 'checkbox-card')).toContain('disabled=""');
    expect(openingTag(markup, 'checkbox-card-indicator')).toContain('data-disabled=""');
  });

  test('title, badge and description are inside the card, so they name it', () => {
    const markup = renderCard({ description: 'Once a month', badge: 'Optional' });

    expect(markup).toContain('>Newsletter</span>');
    expect(markup).toContain('>Optional</span>');
    expect(markup).toContain('>Once a month</span>');
  });

  test('badge and description are left out when not given', () => {
    const markup = renderCard();

    expect(markup).not.toContain('data-slot="checkbox-card-badge"');
    expect(markup).not.toContain('data-slot="checkbox-card-description"');
  });

  test('classes reach their slots and override the defaults', () => {
    const markup = renderCard({
      checked: true,
      description: 'Once a month',
      badge: 'Optional',
      className: 'w-auto',
      classes: {
        root: 'rounded-none',
        checkbox: 'size-7',
        title: 'text-lg',
        badge: 'text-xs',
        description: 'mt-2',
      },
    });

    const root = openingTag(markup, 'checkbox-card');
    expect(root).toContain('w-auto');
    expect(root).toContain('rounded-none');
    expect(root).not.toContain('rounded-lg');
    expect(root).not.toContain('w-full');

    const square = openingTag(markup, 'checkbox-card-indicator');
    expect(square).toContain('size-7');
    expect(square).not.toContain('size-4');

    expect(openingTag(markup, 'checkbox-card-title')).toContain('text-lg');
    expect(openingTag(markup, 'checkbox-card-title')).not.toContain('text-sm');
    expect(openingTag(markup, 'checkbox-card-badge')).toContain('text-xs');
    expect(openingTag(markup, 'checkbox-card-description')).toContain('mt-2');
    expect(openingTag(markup, 'checkbox-card-description')).not.toContain('mt-0.5');
  });
});
