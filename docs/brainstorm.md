### Security

- Users are granted access to particular objects, and collections. This is specified in the server-side model, or "access.js" perhaps.
- objects can be shared with other users. This needs to be set in a "permissions" table.
- When querying in an unsafe environment, the server executes a query against a test object. If the query is not permitted, or any data is invalid, an error is returned. If true, the selector / modifier is applied to the rest to the sandboxed collection.

#### Qs

- How do we prevent people from creating collections on the fly?
- How do we prevent people from calling Profiles.find()?
- How do we limit what queries people can call? required query parameters? RPC methods? dnode?

### Caching

- the server, and client both cache collections up to N items. 


### Transports

- mongodblite will interface a couple of transports. 1. localstore, memory store, and mongodb persistence. Each store is a decorator. 