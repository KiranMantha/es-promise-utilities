# promise-utilities
A collection of helper methods based on promises

## Utility Functions
### 1. promisify

`promisify` is very useful method to create a promise and resolve it later.
#### Usage
```javascript
const [promise, resolver] = promisify();

promise.then(() => {
    console.log('this promise is resolved');
});

....

resolver(); // Also pass a value for above subscription.
```

### 2. promisedPubSub

`promisedPubSub` is another useful method to create a pub-sub model out of promises.

#### Usage
```javascript
const [promise, resolver] = promisedPubSub();

function Method1() {
    return promise.then((val) => {
        console.log('subscriber 1', val);
    });
}

function Method2() {
    return promise.then((val) => {
        console.log('subscriber 2', val);
    });
}

const unsubscribeMeth1 = Method1();
const unsubscribeMeth2 = Method1();

....


resolver('value 1'); // logs subscriber 1 value 1, subscriber 2 value 1

resolver('value 2'); // logs subscriber 1 value 2, subscriber 2 value 2

unsubscribeMeth1();

resolver('value 3'); // logs subscriber 2 value 3
```

