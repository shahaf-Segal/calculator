//general
function getTextInTag(strTag, strText=""){
    return `<${strTag}>${strText}</${strTag}>`
}
function getTextInTagWithAtt(strTag, strAtt ,strText=""){
    return `<${strTag} ${strAtt}>${strText}</${strTag}>`
}
//simple buttons
function createButtons(buttonValue,btnIndex){
    if(btnIndex<altNameArr.length)
    {
        calcDiv.innerHTML+=getTextInTagWithAtt('button',
        `class="simpleBtn" style="grid-area:btn${altNameArr[btnIndex]};"`,
        `${buttonValue}`)
    }
    else
    {
        calcDiv.innerHTML+=getTextInTagWithAtt('button',
        `class="simpleBtn" style="grid-area:btn${buttonValue};"`,
        `${buttonValue}`)
    }

}

function addEvLstnSimpleBtn(){
    document.querySelectorAll('.simpleBtn').forEach(
        (simpleBtnEl)=>{
            simpleBtnEl.addEventListener('click',function(){addToCurrentCalc(simpleBtnEl.innerText)})
        }
    )
}

function addToCurrentCalc(textToAdd){
    calcScreen.value +=textToAdd
    changeToCurrentCalc()
}
function removeToCurrentCalc(){
    calcScreen.value= calcScreen.value.slice(0,-1)
    changeToCurrentCalc()
}

function changeToCurrentCalc(){
    let calcValue=getTranslateCalculation(calcScreen.value)
    console.log()
    crntValue.innerText= `=${calcValue}`
    btnEquals.disabled=calcValue.startsWith("ERROR")
    if (calcScreen.value.length>=30){
        changeDisableSimpleBtn(true)
    }
}

function changeDisableSimpleBtn(disableValue){
    document.querySelectorAll('.simpleBtn').forEach( (simpleBtnEl)=>{simpleBtnEl.disabled=disableValue})
}

//calculate
function getTranslateCalculation(mathStr){
    let mathArr=splitMathStr(mathStr)
    if (mthArrValid(mathArr))
    {
        return calcMathArr(mathArr)
    }
    return "ERROR:Couldn't calculate"
}
function mthArrValid(arr1){
    for (let i = 0; i < arr1.length; i+=2) {
        if (isNaN(arr1[i])||arr1[i]=='')
        {
            return false
        }

    }
    return true

}
function minIfNotNegative(num1,num2){
    if(num1==-1){
        if(num2==-1){
            return -1;
        }
        return num2
    }
    else if(num2==-1){
        return num1
    }
    return Math.min(num1,num2)
}

function calcMathArr(mthArr){
    let newTempArr=mthArr;

    let nextmathOpp=minIfNotNegative(newTempArr.indexOf('*'),newTempArr.indexOf('/'))
    while(nextmathOpp!=-1){
        if(newTempArr[nextmathOpp]=='/'){
            if(newTempArr[nextmathOpp+1]==0)
            {
                return "ERROR:cant divide by 0"
            }
            newTempArr[nextmathOpp-1]= `${(+newTempArr[nextmathOpp-1])/(+newTempArr[nextmathOpp+1])}`

        }
        else{
            newTempArr[nextmathOpp-1]= `${(+newTempArr[nextmathOpp-1])*(+newTempArr[nextmathOpp+1])}`
        }
        newTempArr.splice(nextmathOpp,2)

        nextmathOpp=minIfNotNegative(newTempArr.indexOf('*'),newTempArr.indexOf('/'))
    }


    nextmathOpp= minIfNotNegative(newTempArr.indexOf('-'),newTempArr.indexOf('+'))
    while(nextmathOpp!=-1){
        if(newTempArr[nextmathOpp]=='-'){
            newTempArr[nextmathOpp-1]= `${(+newTempArr[nextmathOpp-1])-(+newTempArr[nextmathOpp+1])}`
        }
        else{
            newTempArr[nextmathOpp-1]= `${(+newTempArr[nextmathOpp-1])+(+newTempArr[nextmathOpp+1])}`
        }
        newTempArr.splice(nextmathOpp,2)
        nextmathOpp= minIfNotNegative(newTempArr.indexOf('-'),newTempArr.indexOf('+'))
    }

    return `${(Math.floor(newTempArr[0]*1000))/1000}`

}

function splitMathStr(mthStr){
    const newArr=[];
    let newStr="";
    for(let i=0;i<mthStr.length;i++)
    {
        switch(mthStr[i])
        {
            case '-':
                if(i==0|| isMathOper(mthStr[i-1])){
                    newStr+=mthStr[i];
                    break;
                }
            case '+':
            case '*':
            case '/':
                newArr.push(newStr)
                newArr.push(mthStr[i])
                newStr=""
            break;

            default:
                newStr+=mthStr[i]
            break;
        }
    }
    newArr.push(newStr)

    return newArr

}
function isMathOper(mathOperStr){
    switch(mathOperStr)
    {
        case '-':
        case '+':
        case '*':
        case '/':
        return true;
    }
    return false;
}
//equals
function pressedEqual(){
    if(!btnEquals.disabled){
        calcScreen.value=getTranslateCalculation(calcScreen.value)
        changeToCurrentCalc()
    }
}


//clear
function startClearTimer()
{
    timePressedDown=new Date().getTime()
    btnClear.addEventListener('mouseup',endClearTimer)
    btnClear.addEventListener('mouseout',endClearTimer)
}
function endClearTimer(){
    if (new Date().getTime()-timePressedDown>1000){
        calcScreen.value=""
        changeToCurrentCalc()
    }
    else{
        removeToCurrentCalc()
    }
    btnClear.removeEventListener('mouseup',endClearTimer)
    btnClear.removeEventListener('mouseout',endClearTimer)
}


//run at start
const simpleButtonArr=['+','-','*','/','.']
const altNameArr=['Plus',"Minus","Multi","Divide","Dot"]
for (let i = 0; i < 10; i++) {
    simpleButtonArr.push(`${i}`)    
}

simpleButtonArr.forEach((simpleButton,smpBtnIndex)=>{ createButtons(simpleButton,smpBtnIndex)})

addEvLstnSimpleBtn()
let timePressedDown;
btnClear.addEventListener('mousedown',startClearTimer)
btnEquals.addEventListener('click',pressedEqual)


