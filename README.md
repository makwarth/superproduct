# superproduct
Browser agent for superproduct.io

## Basic usage

**Add the package**

```
npm install superproduct
```

**Import the package**

```
import superproduct from "superproduct";
```

**Initialize the agent**
```
superproduct.init({
  appId: <APP ID>
});
```

_Options: `debug (true|false)`_


**Identify the logged-in account**
```
superproduct.identify({
  company: <ACCOUNT UNIQUE IDENTIFIER>,
  attributes: {
    plan: "pro",
    members: 7,
    has_done_x: true
    anotherAttribue: "anotherValue"
  }
});
```

**Track account events**
```
superproduct.event("Interacted with key feature");
```
