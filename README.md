# ReactiveJS Experiment

A lightweight experiment in building a reactive global store using vanilla JavaScript. This project demonstrates how to implement Svelte.js-like reactivity without any frameworks or dependencies.

## What is this?

This is just an experimental implementation of a reactive state management system in vanilla JavaScript. It showcases how you can build reactive data binding, computed properties, and watchers without relying on external libraries.

## Features

- **Reactive State**: Automatic DOM updates when state changes
- **Computed Properties**: Derived values that automatically recalculate when dependencies change
- **Watchers**: Listen to state changes and execute custom callbacks
- **Data Binding**: Declarative DOM binding using `data-reactive` attributes
- **Zero Dependencies**: Pure vanilla JavaScript implementation

## Quick Demo

The project includes several interactive examples:

- 🔢 **Counter Demo**: Basic reactivity with computed values
- ✅ **Todo App**: Complex state management with arrays
- 👤 **User Profile**: Form binding and computed full names
- 🛒 **Shopping Cart**: Advanced example with calculations

## Getting Started

Simply open `index.html` in your browser to see the reactive system in action. No build step or installation required!

## Browser Console Fun

Try these commands in your browser's developer console:

```javascript
// Change the counter
store.count = 42;

// Add a todo programmatically
store.todos = [
  ...store.todos,
  { id: Date.now(), text: "Learn ReactiveJS", completed: false },
];

// Update user info
store.firstName = "John";
store.lastName = "Doe";
store.age = 25;
```

Watch how the UI automatically updates in real-time!

## Why This Experiment?

This project was created to:

- Understand the internals of reactive systems
- Explore how Svelte.js-style reactivity works under the hood
- Build something useful with pure vanilla JavaScript
- Demonstrate that complex reactive behavior doesn't always need heavy frameworks

## File Structure

```
exp-reactivity/
├── index.html          # Demo page with examples
├── js/
│   ├── reactive.js     # The reactive system implementation
│   └── example.js      # Demo examples and initialization
└── css/
    └── styles.css      # Simple styling for demos
```

## Educational Value

This experiment is perfect for:

- Learning how reactive systems work internally
- Understanding JavaScript Proxies and their applications
- Exploring state management patterns
- Building foundation knowledge before diving into frameworks like Vue.js or MobX

## License

This repo is licensed under the MIT License. Feel free to use, modify, and distribute it as you wish.

**NOTE**: if you find this project useful, please consider giving it a star on GitHub! 🌟

**NOTE**: if you use this code in your projects, I'd like to hear about it! Open an issue or drop a comment :-)

---

**Note**: This is an experiment and not intended for production use. For production applications, consider using established reactive libraries like React or Svelte.
