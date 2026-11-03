import {
  KeyboardSensor,
  type DraggableNode,
  type KeyboardCoordinateGetter,
  type KeyboardSensorOptions,
} from '@dnd-kit/core';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

import { isTypingTarget } from './typing-target';

// Space on the focused item picks it up (Enter keeps following links). Keys typed into
// inputs, or pressed on a button inside the item (menu, check-off), are left alone.
const startOnKey = KeyboardSensor.activators[0]?.handler;

export class ItemKeyboardSensor extends KeyboardSensor {
  static override activators = [
    {
      eventName: 'onKeyDown' as const,
      handler: (
        event: ReactKeyboardEvent,
        options: KeyboardSensorOptions,
        context: { active: DraggableNode },
      ) => {
        const target = event.target;
        if (isTypingTarget(target) || (target instanceof HTMLElement && target.closest('button'))) {
          return false;
        }
        return startOnKey?.(event, options, context) ?? false;
      },
    },
  ];
}

export const ITEM_KEYS = { start: ['Space'], cancel: ['Escape'], end: ['Space', 'Enter'] };

// Arrow keys move the dragged item by one row / column / day cell instead of 25px.
type Step = number | (() => number);

export function stepCoordinates(stepX: Step, stepY: Step): KeyboardCoordinateGetter {
  return (event, { currentCoordinates }) => {
    const { x, y } = currentCoordinates;
    const dx = typeof stepX === 'function' ? stepX() : stepX;
    const dy = typeof stepY === 'function' ? stepY() : stepY;
    switch (event.code) {
      case 'ArrowRight':
        return { x: x + dx, y };
      case 'ArrowLeft':
        return { x: x - dx, y };
      case 'ArrowDown':
        return { x, y: y + dy };
      case 'ArrowUp':
        return { x, y: y - dy };
      default:
        return undefined;
    }
  };
}
