// function a() {
//     console.log('A');
// }

let a = () => {
    console.log('A');
}

function slow(callback) {
    callback();
}

show(a);