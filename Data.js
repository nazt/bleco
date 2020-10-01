const orig = {};
let validator = {
  set: function (target, key, value, receiver) {
    console.log("====================");
    console.log(target[key]);
    target[key] = value;
    console.log(target[key]);
    console.log("property set: " + key);
    console.log("---------------------");
    return true;
  },
};
let store = new Proxy(orig, validator);
module.exports = {
  set: (key, val) => {
    if (store[key] === undefined) {
      store[key] = val;
    } else {
      if (store[key].counter !== val.counter) {
        console.log(`counter: ${store[key].counter}=>${val.counter}`);
        store[key] = val;
      }
    }
  },
};
