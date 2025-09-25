  const originalLog = console.log;
  // Overwriting
  console.error = function () {
    var args = [].slice.call(arguments);
    originalLog.apply(console.log,[getCurrentDateString()].concat(args));
  };
  console.warn = function () {
    var args = [].slice.call(arguments);
    originalLog.apply(console.log,[getCurrentDateString()].concat(args));
  };
  console.debug = function () {
    var args = [].slice.call(arguments);
    originalLog.apply(console.log,[getCurrentDateString()].concat(args));
  };
  console.log = function () {
    var args = [].slice.call(arguments);
    originalLog.apply(console.log,[getCurrentDateString()].concat(args));
  };
  // Returns current timestamp
  function getCurrentDateString() {
    return (new Date()).toISOString() + ' ::';
  };
