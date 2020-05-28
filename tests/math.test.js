const {calculateTip ,
    farenhitetoCelcius,
    Celciustofarenhite} = require('../src/math.js')


test('tip calculation test', () => {
    const total = calculateTip(10,3)
     expect(total).toBe(10.3)
    } )



test('default tip calculation test', () => {
        const total = calculateTip(10)
         expect(total).toBe(12)
        } )


test('test for farenhite to celcius', () => {

    const celtemp = farenhitetoCelcius(32)
    expect(celtemp).toBe(0)
})


test('test for celcius to farenhite', () => {

    const celtemp = Celciustofarenhite(0)
    expect(celtemp).toBe(32)
})