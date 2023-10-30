/**
 * @returns {[Promise, (value) => void]} tuple containing promise instance and a resolver to resolve the promise later.
 */
const promisify = () => {
  let resolver;
  const promise = new Promise((resolve) => {
    resolver = resolve;
  });
  return [promise, resolver];
};

/**
 * @returns {[{ subscribe: (callback: Function) => () => void; reset: () => void }, (value) => void]} tuple containing object with subscribe (to register subscribers. this returns an unsubscribe method), reset (to clear all subscribers and resolvers) methods and a resolver to emit values to subscribers.
 */
const promisedPubSub = () => {
  let instance,
    resolver,
    callbackRegistery = Object.create(null);

  const subscriptions = {
    subscribe: (fn) => {
      const token = `uid_${Math.random().toString(36).substring(2)}`;
      callbackRegistery[token] = fn;
      return () => {
        delete callbackRegistery[token];
      };
    },
    reset: () => {
      instance = null;
      resolver = null;
      callbackRegistery = Object.create(null);
    },
  };

  function initiate() {
    instance = null;
    resolver = null;
    instance = new Promise((resolve) => {
      resolver = resolve;
    });
    instance.then((val) => {
      const callbacks = Object.values(callbackRegistery);
      callbacks.forEach((callback) => {
        callback(val);
      });
      setTimeout(() => {
        initiate();
      });
    });
  }
  initiate();
  return [
    subscriptions,
    (val) => {
      if(resolver) {
        resolver(val);
      }
    },
  ];
};

export { promisify, promisedPubSub };
