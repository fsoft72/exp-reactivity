# ReactiveJS Documentation

A comprehensive guide to using the ReactiveJS reactive state management library in your projects.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Advanced Examples](#advanced-examples)
- [Best Practices](#best-practices)

## Installation

ReactiveJS is a single JavaScript file with no dependencies. Simply include it in your project:

```html
<script src="path/to/reactive.js"></script>
```

Or copy the `reactive.js` file into your project directory.

## Basic Usage

### Creating a Store

```javascript
// Create a reactive store with initial state
const store = ReactiveJS.createStore({
  count: 0,
  name: "",
  items: [],
});
```

### Updating State

```javascript
// Direct assignment triggers reactivity
store.count = 42;
store.name = "Alice";
store.items = [...store.items, { id: 1, text: "New item" }];
```

### DOM Binding

Bind state to DOM elements using the `data-reactive` attribute:

```html
<div>
  <p>Count: <span data-reactive="count">0</span></p>
  <p>Name: <span data-reactive="name">-</span></p>
</div>
```

When state changes, these elements automatically update.

## API Reference

### ReactiveJS.createStore(initialState)

Creates a new reactive store with the given initial state.

**Parameters:**

- `initialState` (Object): The initial state object

**Returns:** A reactive store proxy

**Example:**

```javascript
const store = ReactiveJS.createStore({
  counter: 0,
  todos: [],
  user: { name: "", email: "" },
});
```

### store.computed(name, computeFn)

Defines a computed property that automatically recalculates when its dependencies change.

**Parameters:**

- `name` (String): The name of the computed property
- `computeFn` (Function): Function that returns the computed value

**Example:**

```javascript
store.computed("doubleCount", () => store.counter * 2);
store.computed("todoCount", () => store.todos.length);
store.computed("fullName", () => `${store.firstName} ${store.lastName}`);

// Access computed values
console.log(store.doubleCount); // Automatically updates when counter changes
```

### store.watch(property, callback)

Watches for changes to a specific property and executes a callback.

**Parameters:**

- `property` (String): The property name to watch
- `callback` (Function): Called with `(newValue, oldValue)` when property changes

**Returns:** Unsubscribe function

**Example:**

```javascript
const unsubscribe = store.watch("count", (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

// Later, stop watching
unsubscribe();
```

### store.autoBind()

Automatically binds all `data-reactive` elements in the DOM to their corresponding store properties.

**Example:**

```html
<span data-reactive="username">Loading...</span>
<div data-reactive="status">Ready</div>

<script>
  // Initialize bindings
  store.autoBind();

  // Now changes automatically reflect in DOM
  store.username = "John Doe";
  store.status = "Online";
</script>
```

### store.bind(property, selector)

Manually bind a property to DOM elements using a CSS selector.

**Parameters:**

- `property` (String): The store property name
- `selector` (String): CSS selector for target elements

**Example:**

```javascript
store.bind("message", ".status-text");
store.bind("errorCount", "#error-counter");
```

### store.get(property)

Gets the current value of a property (alternative to direct access).

**Example:**

```javascript
const currentCount = store.get("count");
// Equivalent to: const currentCount = store.count;
```

### store.set(property, value)

Sets a property value (alternative to direct assignment).

**Example:**

```javascript
store.set("count", 42);
// Equivalent to: store.count = 42;
```

### store.update(updates)

Updates multiple properties at once.

**Parameters:**

- `updates` (Object): Object with property-value pairs to update

**Example:**

```javascript
store.update({
  count: 10,
  name: "Alice",
  status: "active",
});
```

### store.reset(initialState)

Resets the store to a new initial state.

**Parameters:**

- `initialState` (Object): The new initial state

**Example:**

```javascript
store.reset({
  count: 0,
  name: "",
  items: [],
});
```

## Advanced Examples

### Todo Application

```javascript
// Create store for todo app
const todoStore = ReactiveJS.createStore({
  todos: [],
  filter: "all", // 'all', 'active', 'completed'
  newTodoText: "",
});

// Computed properties
todoStore.computed("activeTodos", () =>
  todoStore.todos.filter((todo) => !todo.completed)
);

todoStore.computed("completedTodos", () =>
  todoStore.todos.filter((todo) => todo.completed)
);

todoStore.computed("filteredTodos", () => {
  switch (todoStore.filter) {
    case "active":
      return todoStore.activeTodos;
    case "completed":
      return todoStore.completedTodos;
    default:
      return todoStore.todos;
  }
});

todoStore.computed("remainingCount", () => todoStore.activeTodos.length);

// Functions
function addTodo() {
  if (todoStore.newTodoText.trim()) {
    todoStore.todos = [
      ...todoStore.todos,
      {
        id: Date.now(),
        text: todoStore.newTodoText.trim(),
        completed: false,
      },
    ];
    todoStore.newTodoText = "";
  }
}

function toggleTodo(id) {
  todoStore.todos = todoStore.todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

function deleteTodo(id) {
  todoStore.todos = todoStore.todos.filter((todo) => todo.id !== id);
}

// Watch for changes and update UI
todoStore.watch("filteredTodos", () => renderTodos());
todoStore.watch("remainingCount", (count) => {
  document.getElementById("remaining").textContent = count;
});
```

### Shopping Cart with Calculations

```javascript
const cartStore = ReactiveJS.createStore({
  items: [],
  taxRate: 0.08,
  discountCode: "",
  shippingCost: 5.99,
});

// Computed properties for cart calculations
cartStore.computed("subtotal", () =>
  cartStore.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

cartStore.computed("discountAmount", () => {
  const discounts = {
    SAVE10: 0.1,
    WELCOME: 0.15,
    STUDENT: 0.2,
  };
  const rate = discounts[cartStore.discountCode.toUpperCase()] || 0;
  return cartStore.subtotal * rate;
});

cartStore.computed(
  "taxAmount",
  () => (cartStore.subtotal - cartStore.discountAmount) * cartStore.taxRate
);

cartStore.computed("shipping", () =>
  cartStore.subtotal > 50 ? 0 : cartStore.shippingCost
);

cartStore.computed(
  "total",
  () =>
    cartStore.subtotal -
    cartStore.discountAmount +
    cartStore.taxAmount +
    cartStore.shipping
);

cartStore.computed("itemCount", () =>
  cartStore.items.reduce((sum, item) => sum + item.quantity, 0)
);

// Functions
function addToCart(product, quantity = 1) {
  const existingItem = cartStore.items.find((item) => item.id === product.id);

  if (existingItem) {
    updateQuantity(product.id, existingItem.quantity + quantity);
  } else {
    cartStore.items = [...cartStore.items, { ...product, quantity }];
  }
}

function updateQuantity(id, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(id);
    return;
  }

  cartStore.items = cartStore.items.map((item) =>
    item.id === id ? { ...item, quantity: newQuantity } : item
  );
}

function removeFromCart(id) {
  cartStore.items = cartStore.items.filter((item) => item.id !== id);
}

function applyDiscount(code) {
  cartStore.discountCode = code;
}
```

### Form Validation

```javascript
const formStore = ReactiveJS.createStore({
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  agreedToTerms: false,
  isSubmitting: false,
});

// Validation computed properties
formStore.computed("emailValid", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(formStore.email);
});

formStore.computed("passwordValid", () => {
  return formStore.password.length >= 8;
});

formStore.computed("passwordsMatch", () => {
  return (
    formStore.password === formStore.confirmPassword &&
    formStore.confirmPassword.length > 0
  );
});

formStore.computed("nameValid", () => {
  return (
    formStore.firstName.trim().length > 0 &&
    formStore.lastName.trim().length > 0
  );
});

formStore.computed("formValid", () => {
  return (
    formStore.emailValid &&
    formStore.passwordValid &&
    formStore.passwordsMatch &&
    formStore.nameValid &&
    formStore.agreedToTerms
  );
});

// Real-time validation feedback
formStore.watch("emailValid", (isValid) => {
  const field = document.getElementById("email-field");
  field.classList.toggle("error", !isValid && formStore.email.length > 0);
});

formStore.watch("passwordsMatch", (matches) => {
  const field = document.getElementById("confirm-password-field");
  field.classList.toggle(
    "error",
    !matches && formStore.confirmPassword.length > 0
  );
});

formStore.watch("formValid", (isValid) => {
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = !isValid || formStore.isSubmitting;
});
```

### Theme Switcher with Persistence

```javascript
const themeStore = ReactiveJS.createStore({
  theme: localStorage.getItem("theme") || "light",
  fontSize: parseInt(localStorage.getItem("fontSize")) || 16,
  sidebarCollapsed: localStorage.getItem("sidebarCollapsed") === "true",
});

// Apply theme changes
themeStore.watch("theme", (theme) => {
  document.body.className = `theme-${theme}`;
  localStorage.setItem("theme", theme);
});

themeStore.watch("fontSize", (size) => {
  document.documentElement.style.fontSize = `${size}px`;
  localStorage.setItem("fontSize", size.toString());
});

themeStore.watch("sidebarCollapsed", (collapsed) => {
  document.body.classList.toggle("sidebar-collapsed", collapsed);
  localStorage.setItem("sidebarCollapsed", collapsed.toString());
});

// Theme functions
function toggleTheme() {
  themeStore.theme = themeStore.theme === "light" ? "dark" : "light";
}

function increaseFontSize() {
  themeStore.fontSize = Math.min(themeStore.fontSize + 2, 24);
}

function decreaseFontSize() {
  themeStore.fontSize = Math.max(themeStore.fontSize - 2, 12);
}

function toggleSidebar() {
  themeStore.sidebarCollapsed = !themeStore.sidebarCollapsed;
}

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", () => {
  themeStore.autoBind();
  // Trigger initial state application
  themeStore.theme = themeStore.theme;
  themeStore.fontSize = themeStore.fontSize;
  themeStore.sidebarCollapsed = themeStore.sidebarCollapsed;
});
```

## Best Practices

### 1. Use Computed Properties for Derived State

Instead of manually updating derived values:

```javascript
// ❌ Bad: Manual updates
store.watch("items", () => {
  store.itemCount = store.items.length;
  store.totalPrice = store.items.reduce((sum, item) => sum + item.price, 0);
});

// ✅ Good: Computed properties
store.computed("itemCount", () => store.items.length);
store.computed("totalPrice", () =>
  store.items.reduce((sum, item) => sum + item.price, 0)
);
```

### 2. Use Immutable Updates for Arrays and Objects

```javascript
// ❌ Bad: Mutating arrays directly
store.items.push(newItem); // Won't trigger reactivity

// ✅ Good: Immutable updates
store.items = [...store.items, newItem];

// ✅ Good: For object updates
store.user = { ...store.user, name: "New Name" };
```

### 3. Group Related State

```javascript
// ✅ Good: Organized state structure
const store = ReactiveJS.createStore({
  user: {
    profile: { name: "", email: "" },
    preferences: { theme: "light", notifications: true },
  },
  ui: {
    loading: false,
    errors: [],
    modals: { login: false, settings: false },
  },
  data: {
    posts: [],
    comments: {},
    cache: {},
  },
});
```

### 4. Use Watchers for Side Effects

```javascript
// ✅ Good: Side effects in watchers
store.watch("user", (newUser) => {
  // Save to localStorage
  localStorage.setItem("user", JSON.stringify(newUser));

  // Send analytics
  analytics.identify(newUser.id, newUser.profile);
});

store.watch("errors", (errors) => {
  // Display notifications for new errors
  errors.forEach((error) => showNotification(error));
});
```

### 5. Initialize DOM Bindings Early

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const store = ReactiveJS.createStore(/* initial state */);

  // Set up computed properties
  store.computed(/* ... */);

  // Set up watchers
  store.watch(/* ... */);

  // Initialize DOM bindings
  store.autoBind();
});
```

### 6. Clean Up Watchers When Needed

```javascript
// Store unsubscribe functions
const unsubscribers = [];

unsubscribers.push(
  store.watch("data", handleDataChange),
  store.watch("errors", handleErrors)
);

// Clean up when component/page is destroyed
function cleanup() {
  unsubscribers.forEach((unsubscribe) => unsubscribe());
}
```

## Performance Considerations

### 1. Avoid Deep Object Watching

ReactiveJS watches at the top level. For deep object changes:

```javascript
// ❌ Won't trigger reactivity
store.user.profile.name = "New Name";

// ✅ Will trigger reactivity
store.user = {
  ...store.user,
  profile: {
    ...store.user.profile,
    name: "New Name",
  },
};
```

### 2. Batch Multiple Updates

```javascript
// ❌ Multiple separate updates
store.loading = true;
store.error = null;
store.data = [];

// ✅ Single batch update
store.update({
  loading: true,
  error: null,
  data: [],
});
```

### 3. Use Computed Properties Wisely

Computed properties recalculate when dependencies change. Keep them lightweight:

```javascript
// ✅ Good: Simple calculations
store.computed("total", () => store.price * store.quantity);

// ⚠️ Careful: Expensive operations
store.computed("processedData", () => {
  // Consider caching for heavy computations
  return heavyDataProcessing(store.rawData);
});
```

## Limitations

- **No Deep Reactivity**: Only top-level properties are reactive
- **Array Methods**: Direct array methods like `push()`, `pop()` won't trigger updates
- **Nested Objects**: Changes to nested object properties require full object replacement
- **No Time Travel**: No built-in undo/redo or state history
- **Single Store**: Each `createStore()` call creates an independent store

## Troubleshooting

### DOM Elements Not Updating

1. Ensure `store.autoBind()` is called after DOM is ready
2. Check that `data-reactive` attribute matches exact property name
3. Verify property changes are triggering (use watchers to debug)

### Computed Properties Not Recalculating

1. Ensure computed property accesses store properties (creates dependencies)
2. Check that dependent properties are being updated immutably
3. Verify computed property is defined before first property access

### Performance Issues

1. Check for expensive operations in computed properties
2. Verify you're not creating infinite update loops
3. Consider debouncing rapid state changes

---

This documentation covers the core functionality of ReactiveJS. For more examples, check the `example.js` file in the project repository.
