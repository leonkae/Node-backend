function greet(name, callback){
    setTimeout(() => {
        const message = `Hello, ${name}!`;
        callback(message);
    },5000 )
}

function displayGreeting(greeting){
    console.log(greeting);
}

greet("Alice", displayGreeting);
console.log('waiting for greeting...');