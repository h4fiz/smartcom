export function numberFormat(value, digit = 0, decimalSeparator = ".", thousandSeparator = ","){
    if(isNaN(value)) return 0;
    else{
        var tmp = (value + "").split(".");
        var result = "";

        var idx = 0;
        for(var i=tmp[0].length-1; i>= 0; i--){
            idx++;
            result = tmp[0].substr(i,1) + result;
            if(idx == 3 && i > 0){
                result = thousandSeparator + result;
                idx = 0;
            }
        }
        if(tmp.length > 1){
            result = result + decimalSeparator + tmp[1];
        }
        return result;
    }
    

}