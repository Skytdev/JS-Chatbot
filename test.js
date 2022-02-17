const complist = ['gg', 'nice', 'bravo', 'nice', 'jolie'];
const array = ['gg @khyss', 'nice win @gras', 'nice @khyss', 'what a gg', 'jean @boulgour', 'bravo @khyss'];


function radar (message_array, compliment) {
    var regex = /[@]\w+/;
    var match3 = message_array[0].match(regex);
        
    if (match3 != null) {
        var nickname = match3[0].slice(1);
        var result = countBothMatch(message_array, nickname, complist);
    }
    return match3;
}

console.log(radar(array, complist));