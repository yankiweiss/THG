const items = [
    {name : 'pencil' , price: 5},
    {name : 'pen' , price: 15},
    {name : 'scissor' , price: 20},
    {name : 'sharpener' , price: 30},
]



const totalPrice = items.reduce((total , item) => {
return total + item.price
}, 0)

console.log(totalPrice)

function Test () {
    console.log('from test')
    return (
        <h1>hi and hello</h1>
    )

}

export default Test