let btn = document.querySelector('button')

btn.addEventListener('click', function(){
    let h2 = document.querySelector('h2');
    let randomColur = getRandomColour();
    h2.innerText = randomColur;

    let div = document.querySelector('div')
    div.style.backgroundColor = randomColur;


    console.log("colour updated");
    
});

function getRandomColour(){
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);

    let colour = `rgb(${red} , ${green} , ${blue})`;
    return colour
}
// its showing that how one addeventlitner change multiple things
