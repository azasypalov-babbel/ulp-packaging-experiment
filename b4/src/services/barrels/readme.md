Service Barrels
---

A service barrel is a module which provides a configuration of services. 
It can be a subset of all services, meant to be composed with other service barrels.

> context on the term: [Barrel - TypeScript Deep Dive](https://basarat.gitbook.io/typescript/main-1/barrel)

Example:
```js
// index.default.js

// service barrel must use default export 
export default {
  navigationService: {
    navigate(params){
      // ...
    }
  },
  dataProvider: {
    fetch(){
      // ...
    }
  }
  // ...
  // other services
}
```

