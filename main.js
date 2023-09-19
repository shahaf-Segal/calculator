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
    if (calcScreen.value.length>=55){
        changeDisableSimpleBtn(true)
    }
}

function changeDisableSimpleBtn(disableValue){
    document.querySelectorAll('.simpleBtn').forEach( (simpleBtnEl)=>{simpleBtnEl.disabled=disableValue})
}

//calculate
function getTranslateCalculation(mathStr){
    let mathArr=splitMathStr(mathStr)
    if(mathArr[0].startsWith("ERROR")){
        return mathArr[0];
    }
    return getTranslateMthArr(mathArr)
}

function getTranslateMthArr(mthArr){
    if (mthArrValid(mthArr))
    {
        return calcMathArr(mthArr)
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

    newTempArr=calcPrioOp(newTempArr,'^','√')
    if (newTempArr[0].startsWith("ERROR")){
        return newTempArr[0];
    }

    nextmathOpp=minIfNotNegative(newTempArr.indexOf('*'),newTempArr.indexOf('/'))
    while(nextmathOpp!=-1){

        let operationValue=calcOnMathOp(newTempArr[nextmathOpp],+newTempArr[nextmathOpp-1], +newTempArr[nextmathOpp+1])
        if(operationValue.startsWith("ERROR")){
            return operationValue;
        }

        newTempArr[nextmathOpp-1]= operationValue
        newTempArr.splice(nextmathOpp,2)

        nextmathOpp=minIfNotNegative(newTempArr.indexOf('*'),newTempArr.indexOf('/'))
    }


    nextmathOpp= minIfNotNegative(newTempArr.indexOf('-'),newTempArr.indexOf('+'))
    while(nextmathOpp!=-1){
        let operationValue=calcOnMathOp(newTempArr[nextmathOpp],+newTempArr[nextmathOpp-1], +newTempArr[nextmathOpp+1])
        if(operationValue.startsWith("ERROR")){
            return operationValue;
        }

        newTempArr[nextmathOpp-1]= operationValue
        newTempArr.splice(nextmathOpp,2)

        nextmathOpp= minIfNotNegative(newTempArr.indexOf('-'),newTempArr.indexOf('+'))
    }

    return `${(Math.floor(newTempArr[0]*1000))/1000}`

}


function calcPrioOp(newMthArr,op1,op2){
    let nextmathOpp=minIfNotNegative(newMthArr.indexOf(op1),newMthArr.indexOf(op2))
    while(nextmathOpp!=-1){

        let operationValue=calcOnMathOp(newMthArr[nextmathOpp],+newMthArr[nextmathOpp-1], +newMthArr[nextmathOpp+1])
        if(operationValue.startsWith("ERROR")){
            return [operationValue];
        }

        newMthArr[nextmathOpp-1]= operationValue
        newMthArr.splice(nextmathOpp,2)

        nextmathOpp=minIfNotNegative(newMthArr.indexOf(op1),newMthArr.indexOf(op2))
    }
    return newMthArr
}

function calcOnMathOp(mathOpChar,num1,num2){
    switch(mathOpChar){
        case '-': return `${num1-num2}`;
        case '+': return `${num1+num2}`;
        case '*':return `${num1*num2}`;
        case '/':
            if(num2==0){
                return "ERROR:cant divide by 0";
            }
        return num1/num2;
        case '^': return `${Math.pow(num1,num2)}`;
        case '√': 
            if(num2<0){
                if(num1%2==0){
                    return "ERROR:unsupported imaginary number"
                }
                return `${-(Math.pow(-num2,1/num1))}`
            }
            else if(num1==0){
                return "ERROR:root 0 is not valid"
            }
        return `${Math.pow(num2,1/num1)}`
        
    }
    return "ERROR: not math operation";
}

function splitMathStr(mthStr){
    let newArr=[];
    let newStr="";
    let afterCloseParan=false;
    for(let i=0;i<mthStr.length;i++)
    {
        switch(mthStr[i])
        {
            case '(': 
                if(newStr!=""){
                    return["ERROR:number before paranthasis"]
                }
                newArr.push('(')
            break;
            case ')':
                
                let paranOpenBefore= newArr.lastIndexOf('(')
                if(paranOpenBefore==-1){
                    return ["ERROR:paranthasis closed before opening"]
                }
                newArr.push(newStr)
                const paranValue= getTranslateMthArr(newArr.slice(paranOpenBefore+1))
                if(paranValue.startsWith('ERROR')){
                    return [paranValue]
                }
                newArr.splice(paranOpenBefore)
                afterCloseParan=true;
                newStr=paranValue;
            break;
            case '-':
                if(i==0|| isMathOper(mthStr[i-1])){
                    newStr+=mthStr[i];
                    break;
                }
            case '+':
            case '*':
            case '/':
            case '^':
            case '√':
                newArr.push(newStr)
                newArr.push(mthStr[i])
                newStr=""
                afterCloseParan=false
            break;

            default:
                if(afterCloseParan){
                    return ["ERROR: number after paranthasis"]
                }
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
        case '^':
        case '√':
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
    timeoutID=setTimeout(function(){btnClear.style.background='orange'},1000)
}
function endClearTimer(){
    if (new Date().getTime()-timePressedDown>1000){
        calcScreen.value=""
        changeToCurrentCalc()
        crntValue.innerText='='
    }
    else{
        removeToCurrentCalc()
    }
    btnClear.style.background=''
    clearTimeout(timeoutID)
    btnClear.removeEventListener('mouseup',endClearTimer)
    btnClear.removeEventListener('mouseout',endClearTimer)
}


//run at start
const simpleButtonArr=['+','-','*','/','√','^','.','(',')']
const altNameArr=['Plus',"Minus","Multi","Divide",'Root','Powered',"Dot",'OpenParan','CloseParan']
for (let i = 0; i < 10; i++) {
    simpleButtonArr.push(`${i}`)    
}

simpleButtonArr.forEach((simpleButton,smpBtnIndex)=>{ createButtons(simpleButton,smpBtnIndex)})

addEvLstnSimpleBtn()
let timePressedDown;
let timeoutID;
btnClear.addEventListener('mousedown',startClearTimer)
btnEquals.addEventListener('click',pressedEqual)
