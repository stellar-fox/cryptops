#!/bin/node




// inject compiled module to repl context
Object.assign(
    require("repl").start({}).context, {
        cryptops: require("../dist/cryptops.js"),
    }
)