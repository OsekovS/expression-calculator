function eval() {
    // Do not use eval!!!
    return;
}
class Changeble_string{
    constructor(string){
        this.value = string;
    }
    cut(end){
        let cutted = this.value.slice(0,end)
        this.value = this.value.slice(end)
        return cutted
    }
}
function Token(kind,value='0'){
    if(value==='0'){
        this.kind=kind;
        this.value='0';
    }
    else{
        this.kind=kind;
        this.value=value;
    }
}
function Token_stream(){
    this.brackets_count = 0;
    this.get=function(custom_string){

        if(this.full){
           
            this.full=false;
            // console.log('from buf: '+this.full+this.buffer.value+' '+this.buffer.kind);
            return this.buffer;
        }
        if(custom_string.value===''){
            return new Token('expression_end')
        }
        while(true){
            switch(custom_string.value[0]){
            case ';':
            case 'q': 
            case '(': case ')': case '+': case '-': case '*': case '/':
                return new Token(custom_string.cut(1))

            case '.':
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                let cut_index=1;
                for(let i=1;i<custom_string.value.length;i++){
                    let number = parseInt(custom_string.value[i]);
                    if(isNaN(number)){
                        break
                    }            
                    cut_index++;    
                    }
                    return new Token('8',parseInt(custom_string.cut(cut_index)))
            case ' ':
                custom_string.cut(1);
                break;
            default:
                console.log('Bad Token')
                return 0;
            }
        }
        
    }
    this.putback=function(token){
        //console.log('putback :'+this.full,token.value,token.kind)
        if(this.full===true) {console.log("putback() into a full buffer");}
        else{
        this.buffer=token;
        this.full=true;
        }
    }
    this.full=false;
    this.buffer=null;
}

const primary=  function primary(ts,custom_string){
    // console.log(custom_string)
    let Token = ts.get(custom_string);
    let kind = Token.kind;
    // console.log(custom_string)
    //  console.log('primary go to while: '+Token.kind+' '+Token.value)
    switch(kind){
        case 'expression_end':
            return 'expression_end';
        case '(':
                // console.log('skobka')
            let d = expression(ts,custom_string);
            //console.log('aui')
            // console.log(ts.buffer)
            Token = ts.get(custom_string);
            if(Token.kind !== ')') throw("ExpressionError: Brackets must be paired")
            return d;

        case '8':
            
            // console.log(Token.value)
            return Token.value
        default:
            console.log("primary expected")
    }
};

const term=  function term(ts,custom_string){
    let Left = primary(ts,custom_string),
        Right;
    // console.log(custom_string)
    if(Left==='expression_end')
    return 'expression_end';
    let Token = ts.get(custom_string);

    //  console.log(Token)
    // console.log('aaaaaaaaaa =>'+Token)
    
    while(true){    
        //console.log(Token.kind)
        switch(Token.kind){
            case '*':
                    Right = primary(ts,custom_string);
                    if(Right === 'expression_end') return Left;
                Left *= Right//primary(ts,custom_string);
                Token = ts.get(custom_string);
                break;
            case '/':
                Right = primary(ts,custom_string);
                if(Right === 'expression_end') return Left;
                let divider = Right//primary(ts,custom_string);
                if(divider===0){
                    throw("TypeError: Division by zero.")
                    break;
                }
                Left /= divider;
                Token = ts.get(custom_string);
                break;
            default:
                    // console.log('kladem')
                if(!Token.kind!=='expression_end')
                ts.putback(Token);
                // console.log('term'+Left)
                return Left;
        }
    }
};


const expression= function expression(ts,custom_string){
    let Left = term(ts,custom_string),
        Token = ts.get(custom_string),
        Right;
    // console.log('exp go to while: '+Left+' '+Token.kind)
    // console.log(Token)
    while(true){    
        
        switch(Token.kind){
            case '+':
                // console.log(custom_string)
                Right = term(ts,custom_string);
                if(Right === 'expression_end') return Left;
                Left += Right//term(ts,custom_string);              
                Token = ts.get(custom_string);
                break;
            case '-':
                Right = term(ts,custom_string);
                if(Right === 'expression_end') return Left;
                Left -= Right//term(ts,custom_string);
                Token = ts.get(custom_string);
                break;

            default:
                if(Token.kind === 'expression_end') return Left;
                // console.log('aauuee')
                ts.putback(Token);
                //console.log(Left)
                return Left;
        }
    }
};

function expressionCalculator(exp) {
    const expr = new Changeble_string(exp);

    const ts = new Token_stream();
    const val = expression(ts,expr)
    //console.log(ts.buffer)
    if(ts.buffer.kind===')'){
     throw("ExpressionError: Brackets must be paired")
    }
    return val
}
// window.onload = function(e){
//     console.log(expressionCalculator("1 + 41) * 3"))
// }
module.exports = {
    expressionCalculator
}

