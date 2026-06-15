# Motivation Catalyst UI Context

Definitions for the user interface and display strategy of the application.

## Language

**Responsive Design Strategy**:
We use responsive CSS (Tailwind breakpoints) within the same React components, rather than maintaining separate component trees for different devices.
_Avoid_: Adaptive components, separate mobile/desktop files

**Mobile Display**:
The layout applied to screens below the `md` (768px) breakpoint.

**Desktop Display**:
The layout applied to screens at or above the `md` (768px) breakpoint.

**Tablet Display**:
Tablets are treated as part of the Desktop Display strategy (they receive the desktop layout, scaled or wrapped as necessary).
_Avoid_: Dedicated tablet layout
