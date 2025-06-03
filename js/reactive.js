// ReactiveJS - Simple Reactive Library
const ReactiveJS = ( () => {
	let currentStore = {};
	let computedProperties = {};
	let watchers = {};
	let bindings = {};

	// Track current computation for dependency collection
	let currentComputation = null;
	let dependencies = {};

	const createStore = ( initialState ) => {
		// Reset globals for new store
		computedProperties = {};
		watchers = {};
		bindings = {};
		dependencies = {};

		const storeProxy = new Proxy( initialState, {
			get ( target, prop ) {
				// Return methods if they exist
				if ( storeMethods[ prop ] ) {
					return storeMethods[ prop ];
				}

				// Track dependency for computed properties
				if ( currentComputation ) {
					if ( !dependencies[ currentComputation ] ) {
						dependencies[ currentComputation ] = new Set();
					}
					dependencies[ currentComputation ].add( prop );
				}
				return target[ prop ];
			},

			set ( target, prop, value ) {
				// Don't allow overriding methods
				if ( storeMethods[ prop ] ) {
					console.warn( `Cannot override store method: ${ prop }` );
					return false;
				}

				const oldValue = target[ prop ];
				target[ prop ] = value;

				if ( oldValue !== value ) {
					// Trigger watchers
					if ( watchers[ prop ] ) {
						watchers[ prop ].forEach( callback => callback( value, oldValue ) );
					}

					// Update DOM bindings
					updateDOM( prop, value );

					// Re-compute dependent computed properties
					recomputeDependents( prop );
				}

				return true;
			}
		} );

		currentStore = storeProxy;
		return storeProxy;
	};

	const computed = ( name, computeFn ) => {
		computedProperties[ name ] = computeFn;

		// Initial computation
		currentComputation = name;
		const value = computeFn();
		currentComputation = null;

		currentStore[ name ] = value;
		updateDOM( name, value );
	};

	const recomputeDependents = ( changedProp ) => {
		Object.keys( dependencies ).forEach( computedName => {
			if ( dependencies[ computedName ] && dependencies[ computedName ].has( changedProp ) ) {
				// Re-run the computation
				currentComputation = computedName;
				const newValue = computedProperties[ computedName ]();
				currentComputation = null;

				if ( currentStore[ computedName ] !== newValue ) {
					currentStore[ computedName ] = newValue;
					updateDOM( computedName, newValue );
				}
			}
		} );
	};

	const watch = ( prop, callback ) => {
		if ( !watchers[ prop ] ) {
			watchers[ prop ] = [];
		}
		watchers[ prop ].push( callback );

		// Return unsubscribe function
		return () => {
			const index = watchers[ prop ].indexOf( callback );
			if ( index > -1 ) {
				watchers[ prop ].splice( index, 1 );
			}
		};
	};

	const bind = ( prop, selector ) => {
		if ( !bindings[ prop ] ) {
			bindings[ prop ] = [];
		}
		bindings[ prop ].push( selector );
	};

	const updateDOM = ( prop, value ) => {
		// Update elements with data-reactive attribute
		const elements = document.querySelectorAll( `[data-reactive="${ prop }"]` );
		elements.forEach( el => {
			if ( typeof value === 'number' && ( prop.includes( 'Total' ) || prop.includes( 'Tax' ) || prop.includes( 'Subtotal' ) ) ) {
				el.textContent = value.toFixed( 2 );
			} else {
				el.textContent = value;
			}
		} );

		// Update custom bindings
		if ( bindings[ prop ] ) {
			bindings[ prop ].forEach( selector => {
				const elements = document.querySelectorAll( selector );
				elements.forEach( el => {
					el.textContent = value;
				} );
			} );
		}
	};

	const autoBind = () => {
		const elements = document.querySelectorAll( '[data-reactive]' );
		elements.forEach( el => {
			const prop = el.getAttribute( 'data-reactive' );
			if ( currentStore.hasOwnProperty( prop ) ) {
				updateDOM( prop, currentStore[ prop ] );
			}
		} );
	};

	const get = ( prop ) => {
		return currentStore[ prop ];
	};

	const set = ( prop, value ) => {
		currentStore[ prop ] = value;
	};

	const update = ( updates ) => {
		Object.keys( updates ).forEach( prop => {
			currentStore[ prop ] = updates[ prop ];
		} );
	};

	const reset = ( initialState ) => {
		Object.keys( currentStore ).forEach( key => {
			// Skip methods
			if ( storeMethods[ key ] ) return;

			if ( initialState.hasOwnProperty( key ) ) {
				currentStore[ key ] = initialState[ key ];
			} else {
				delete currentStore[ key ];
			}
		} );
	};

	// Methods that will be attached to the store
	const storeMethods = {
		computed,
		watch,
		bind,
		autoBind,
		get,
		set,
		update,
		reset
	};

	return {
		createStore
	};
} )();