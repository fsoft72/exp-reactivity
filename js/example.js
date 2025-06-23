// Initialize the store
const store = ReactiveJS.createStore( {
	count: 0,
	todos: [],
	firstName: '',
	lastName: '',
	age: 0,
	cart: []
} );

// Define computed properties
store.computed( 'doubleCount', () => store.count * 2 );
store.computed( 'squareCount', () => store.count * store.count );
store.computed( 'parity', () => store.count % 2 === 0 ? 'even' : 'odd' );

store.computed( 'totalTodos', () => store.todos.length );
store.computed( 'completedTodos', () => store.todos.filter( todo => todo.completed ).length );
store.computed( 'pendingTodos', () => store.todos.filter( todo => !todo.completed ).length );

store.computed( 'fullName', () => {
	const full = `${ store.firstName } ${ store.lastName }`.trim();
	return full || '-';
} );

store.computed( 'ageGroup', () => {
	if ( !store.age ) return '-';
	if ( store.age < 18 ) return 'Minor';
	if ( store.age < 65 ) return 'Adult';
	return 'Senior';
} );

store.computed( 'greeting', () => {
	const name = store.firstName || 'there';
	return `Hello, ${ name }!`;
} );

store.computed( 'cartCount', () => store.cart.length );
store.computed( 'cartSubtotal', () =>
	store.cart.reduce( ( sum, item ) => sum + item.price, 0 )
);
store.computed( 'cartTax', () => store.cartSubtotal * 0.08 );
store.computed( 'cartTotal', () => store.cartSubtotal + store.cartTax );

// Watch for changes
store.watch( 'count', ( newVal, oldVal ) => {
	console.log( `Count changed from ${ oldVal } to ${ newVal }` );
} );

store.watch( 'todos', () => {
	renderTodos();
} );

store.watch( 'cart', () => {
	renderCart();
} );

// Application functions
function addTodo () {
	const input = document.getElementById( 'todoInput' );
	const text = input.value.trim();

	if ( text ) {
		const newTodos = [ ...store.todos ];
		newTodos.push( {
			id: Date.now(),
			text: text,
			completed: false
		} );
		store.todos = newTodos;
		input.value = '';
	}
}

function toggleTodo ( id ) {
	store.todos = store.todos.map( todo =>
		todo.id === id ? { ...todo, completed: !todo.completed } : todo
	);
	// store.todos = newTodos;
}

function deleteTodo ( id ) {
	store.todos = store.todos.filter( todo => todo.id !== id );
}

function renderTodos () {
	const container = document.getElementById( 'todoList' );
	container.innerHTML = '';

	store.todos.forEach( todo => {
		const div = document.createElement( 'div' );
		div.className = `todo-item ${ todo.completed ? 'completed' : '' }`;
		div.innerHTML = `
                    <span onclick="toggleTodo(${ todo.id })" style="cursor: pointer; flex: 1;">
                        ${ todo.completed ? '✅' : '⏳' } ${ todo.text }
                    </span>
                    <button onclick="deleteTodo(${ todo.id })" class="btn-danger">Delete</button>
                `;
		container.appendChild( div );
	} );
}

function addToCart () {
	const nameEl = document.getElementById( 'itemName' );
	const priceEl = document.getElementById( 'itemPrice' );

	const name = nameEl.value.trim();
	const price = parseFloat( priceEl.value ) || 0;

	if ( name && price > 0 ) {
		// const newCart = [ ...store.cart ];
		store.cart.push( {
			id: Date.now(),
			name: name,
			price: price
		} );
		// store.cart = newCart;
		store.cart = [ ...store.cart ]; // Trigger reactivity

		nameEl.value = '';
		priceEl.value = '';
	}
}

function removeFromCart ( id ) {
	store.cart = store.cart.filter( item => item.id !== id );
}

function renderCart () {
	const container = document.getElementById( 'cartItems' );
	container.innerHTML = '';

	store.cart.forEach( item => {
		const div = document.createElement( 'div' );
		div.className = 'todo-item';
		div.innerHTML = `
                    <span>🛍️ ${ item.name }</span>
                    <span>$${ item.price.toFixed( 2 ) }</span>
                    <button onclick="removeFromCart(${ item.id })" class="btn-danger">Remove</button>
                `;
		container.appendChild( div );
	} );
}

// Allow Enter key for inputs
document.getElementById( 'todoInput' ).addEventListener( 'keypress', ( e ) => {
	if ( e.key === 'Enter' ) addTodo();
} );

document.getElementById( 'itemName' ).addEventListener( 'keypress', ( e ) => {
	if ( e.key === 'Enter' ) addToCart();
} );

document.getElementById( 'itemPrice' ).addEventListener( 'keypress', ( e ) => {
	if ( e.key === 'Enter' ) addToCart();
} );

// Initialize DOM bindings
store.autoBind();

console.log( 'ReactiveJS Demo loaded! Try: store.count = 42' );