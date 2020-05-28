const calculateTip = (total, tippercent = 20 ) =>  (tippercent/100)*total + total

    
   const farenhitetoCelcius = (temp) => (temp-32)/1.8
 
   const Celciustofarenhite  = (temp) => (temp*1.8) + 32

module.exports ={
    calculateTip ,
    farenhitetoCelcius,
    Celciustofarenhite
}