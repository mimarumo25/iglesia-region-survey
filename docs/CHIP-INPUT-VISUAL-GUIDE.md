# 🎨 ChipInput - Visual Guide

## 📐 Component Layout

```
┌────────────────────────────────────────────────────────┐
│ Necesidades del Enfermo                                │
│                                                         │
│ ┌──────────────────────────────────────────────────┐  │
│ │ [Medicinas] [✕]  [Fisioterapia] [✕]  [Psic...] [│  │
│ │ ✕]  _input_here_                                  │  │
│ └──────────────────────────────────────────────────┘  │
│                                                         │
│ Escribe una necesidad y presiona Enter...             │
└────────────────────────────────────────────────────────┘
```

## 🎯 Interaction States

### 1. Default State
```
┌─────────────────────────────────────────────────┐
│ [Input field with placeholder text]             │
│ "Escribe y presiona Enter..."                   │
└─────────────────────────────────────────────────┘
    ▲ Border: 2px gray
    ▲ Background: light gray
    ▲ No chips yet
```

### 2. Focus State
```
┌═════════════════════════════════════════════════┐
│ [Input field - FOCUSED]                         │
│ "Escribe y presiona Enter..."                   │
└═════════════════════════════════════════════════┘
    ▲ Border: 2px BLUE (primary color)
    ▲ Ring: 2px blue/20 shadow
    ▲ Background: slightly lighter
    ▲ Transición: 200ms
```

### 3. With Chip
```
┌─────────────────────────────────────────────────┐
│ [Medicinas] [✕]  _input here_                  │
└─────────────────────────────────────────────────┘
    ▲ Chip: Light blue background
    ▲ Chip border: Teal color
    ▲ Text: "Medicinas"
    ▲ X button: Clickeable
```

### 4. Multiple Chips
```
┌─────────────────────────────────────────────────────┐
│ [Medicinas] [✕]  [Fisioterapia] [✕]  _input_...   │
└─────────────────────────────────────────────────────┘
    ▲ Chips wrapped automatically
    ▲ Gap: 8px between each chip
    ▲ Input flexible width
```

### 5. Hover Chip (Desktop)
```
[Medicinas] [✕]  ← Mouse over
    ↓
[Medicinas] [✕ highlighted]
    ▲ X button background highlights
    ▲ Color: slightly darker blue
```

### 6. Dark Mode
```
Light Mode:                 Dark Mode:
┌───────────────────┐      ┌───────────────────┐
│ [Light blue chip] │      │ [Dark blue chip]  │
│ Gray border       │  →   │ Light gray border │
│ Dark text         │      │ Light text        │
└───────────────────┘      └───────────────────┘
```

## ⌨️ Keyboard Interactions

### Scenario 1: Creating Chips
```
User types: "M e d i c i n a s"
Input: [________Medicinas________]

User presses: ENTER
          ↓
Creates chip: [Medicinas] [✕]
Input clears: [_____________________]

User types: "Fisioterapia"
Input: [_____Fisioterapia_________]

User presses: ENTER
          ↓
Adds chip: [Medicinas] [✕] [Fisioterapia] [✕]
Input clears: [_____________________]
```

### Scenario 2: Deleting with X
```
Initial state:
[Medicinas] [✕]  [Fisioterapia] [✕]  [Psicología] [✕]

User clicks: X on Fisioterapia
          ↓
Result:
[Medicinas] [✕]  [Psicología] [✕]
```

### Scenario 3: Deleting with Backspace
```
State with chips:
[Medicinas] [✕]  [Fisioterapia] [✕]  |_____input_____| ← cursor

User presses: BACKSPACE (input is empty)
          ↓
Deletes last chip:
[Medicinas] [✕]  |_____input_____| ← cursor
```

## 🎨 Color Scheme

### Light Mode
```
Container:
  Background: #f3f4f6 (input-bg)
  Border: #d1d5db (input-border)
  Focus border: #1e40af (primary)
  
Chip:
  Background: #eff6ff (primary/10)
  Border: #7dd3fc (primary/30)
  Text: #1f2937 (foreground)
  X button hover: #cffafe (primary/20)

Input:
  Text: #1f2937 (foreground)
  Placeholder: #9ca3af (muted-foreground)
```

### Dark Mode
```
Container:
  Background: #1f2937 (input-bg dark)
  Border: #4b5563 (input-border dark)
  Focus border: #60a5fa (primary dark)
  
Chip:
  Background: #1e3a8a (primary/20)
  Border: #3b82f6 (primary/40)
  Text: #f3f4f6 (foreground dark)
  X button hover: #1e40af (primary/30)

Input:
  Text: #f3f4f6 (foreground dark)
  Placeholder: #9ca3af (muted-foreground dark)
```

## 📏 Dimensions

```
Component Height: 40-80px (variable based on chips)

Chip Dimensions:
  Height: 28px (py-1)
  Padding: 12px (px-3)
  Border radius: 9999px (fully rounded)
  Font size: 14px (sm)

X Button:
  Size: 16px × 16px
  Margin left: 8px (gap-2)
  Border radius: 9999px

Container:
  Padding: 12px (p-3)
  Gap between chips: 8px
  Min height: 44px (touch target)
```

## 🔄 Responsive Behavior

### Desktop (> 1024px)
```
┌─────────────────────────────────────────────────────────┐
│ [Chip 1] [✕]  [Chip 2] [✕]  [Chip 3] [✕]  _input_...  │
└─────────────────────────────────────────────────────────┘
  Width: 100% of container
  Single line if fits
```

### Tablet (768px - 1024px)
```
┌──────────────────────────────────┐
│ [Chip 1] [✕]  [Chip 2] [✕]       │
│ [Chip 3] [✕]  _input_here_      │
└──────────────────────────────────┘
  Wraps to 2 lines
  Each line fits multiple chips
```

### Mobile (< 768px)
```
┌────────────────────────┐
│ [Chip 1] [✕]           │
│ [Chip 2] [✕]           │
│ [Chip 3] [✕]           │
│ _input_here_           │
└────────────────────────┘
  One chip per line
  Input full width
  Easy touch targets
```

## ✨ Animation

```
Create Chip:
  1. User presses Enter
  2. Chip appears (no transition)
  3. Input clears (immediate)

Delete Chip:
  1. User clicks X
  2. Chip fades/removes (immediate)
  3. Other chips shift (no transition)

Focus Effect:
  1. Border changes color
  2. Ring shadow appears
  3. Duration: 200ms
  4. Easing: ease-in-out
```

## 🎯 Validation Feedback

### Valid Input
```
[Input field]  ← No error styling
✅ Ready to press Enter
```

### Invalid Input (Error)
```
[Input field] ← Potential styling for errors
❌ Error message below (from FormMessage)
```

### Duplicate Attempt
```
User types: "Medicinas"  (already exists)
Presses: ENTER
Result: Nothing happens
  ▲ No error message
  ▲ No visual change
  ▲ Input not cleared
```

## 📱 Mobile Touch Interactions

### Tap on Chip X Button
```
Before: [Medicinas] [✕ normal]
         └─────↓ tap ↓─────┘
After:  [Medicinas] [✕ highlight]
         └─ removes after 200ms
```

### Tap on Input
```
[Chip 1] [✕] |input inactive|
    ↓ tap on input
[Chip 1] [✕] |input ACTIVE| ← keyboard appears
```

## 🎨 Theme Switching

```
Initial Load (Light):
┌─────────────────────────┐
│ Light theme active      │
│ Gray borders, dark text │
└─────────────────────────┘

User toggles Dark Mode:
┌─────────────────────────┐
│ Dark theme active       │
│ Light borders, light... │
└─────────────────────────┘
  ▲ Transition: 200ms
  ▲ Colors auto-update
  ▲ No page reload needed
```

## ♿ Accessibility

### Visual Indicators
```
For keyboard users:
┌─────────────────────────┐
│ [Input] ← :focus visible│
│  ▓▓▓▓▓▓▓▓▓▓            │  ← Blue focus ring
└─────────────────────────┘

For screen readers:
- Input has label: "aria-labelledby"
- Remove button: "aria-label"
- "Eliminar medicinas" text for X
```

### Keyboard Navigation Flow
```
1. User tabs to field
2. Border becomes blue (focus visible)
3. User types text
4. User presses Enter → chip created
5. User presses Backspace → chip deleted
6. User tabs away → focus removed
```

## 📊 State Diagram

```
                ┌──────────────────┐
                │   Initial        │
                │   (empty)        │
                └─────────┬────────┘
                          │ type
                          ↓
                ┌──────────────────┐
                │   Has Input      │
         ┌─────→│   (not empty)    │←─────┐
         │      └─────────┬────────┘      │
         │                │               │ type more
         │                │ Enter         │
         │                ↓               │
         │      ┌──────────────────┐      │
         │      │   Create Chip    │      │
         │      │   + Clear Input  │      │
         │      └────────┬─────────┘      │
         │               │                │
         │               ↓                │
   Backspace ┌──────────────────┐        │
   (delete)  │   Chip Created   │────────┘
             │   (back to input)│
             └──────────────────┘
```

## 🔍 Comparison: Before vs After

### BEFORE (Single String Input)
```
┌─────────────────────────────────────────┐
│ Necesidades del Enfermo                 │
│ ┌───────────────────────────────────┐   │
│ │ Medicinas, Fisioterapia, Psicol...│   │ ← Hard to edit
│ │ (all in one text)                 │   │ ← Unclear structure
│ └───────────────────────────────────┘   │
│ "Describe necesidades especiales"       │
└─────────────────────────────────────────┘
```

### AFTER (Chip Input)
```
┌─────────────────────────────────────────┐
│ Necesidades del Enfermo                 │
│ ┌───────────────────────────────────┐   │
│ │ [Medicinas] ✕  [Fisioterapia] ✕   │   │ ← Easy to see
│ │ [Psicología] ✕  _add_more_...    │   │ ← Easy to manage
│ └───────────────────────────────────┘   │
│ "Escribe una necesidad y presiona..."   │
└─────────────────────────────────────────┘
```

---

**Visual Guide Version**: 1.0  
**Last Updated**: October 27, 2025  
**Component**: ChipInput v1.0
