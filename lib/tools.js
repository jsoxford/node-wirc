var tools = module.exports;

tools.hex2num = function(hexString) {
    // do i want to chop off leading 0x bits?
    return parseInt(hexString, 16);
}

tools.num2hex = function(num) {
    return num.toString(16);
}
