import React from 'react';
import { Dropdown } from '@fluentui/react-northstar';

const inputItems = [
  'Bruce Wayne',
  'Natasha Romanoff',
  'Steven Strange',
  'Alfred Pennyworth',
  `Scarlett O'Hara`,
  'Imperator Furiosa',
  'Bruce Banner',
  'Peter Parker',
  'Selina Kyle',
];

export const CustomDropdown = () => (
  <Dropdown
    items={inputItems}
    placeholder="Select your hero"
    checkable
    getA11ySelectionMessage={{
      onAdd: (item) => `${item} has been selected.`,
    }}
  />
);
