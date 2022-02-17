const { stringifyMessage } = require("graphql-ws");

const array = ['gg @khyss', 'nice win @gras', 'nice @khyss', 'what a gg', 'jean @boulgour', 'bravo @khyss'];

const complist = ['gg', 'nice', 'bravo', 'nice', 'jolie'];

function pop (message_array, compliment) {
    var regex = /[@]\w+/;
    var match = message_array[0].match(regex);
        
    if (match != null) {
        var nickname = match[0].slice(1);
        var result = countBothMatch(message_array, nickname, complist);
    }
    return result;
}

// Renvois True si le "message" contiens un compliment
function compliment (message, comp) {
    var length2 = comp.length
    var idx = 0;
    for (idx = 0; idx < length2; idx++) {
        var compword = comp[idx];
        var regex = new RegExp("" + compword + "");
        var match2 = message.match(regex);
        console.log("[] La phrase contiens un compliment ?", match2);
        if (match2 != null) {
            console.log("[] La fonction compliment envois 'True'");
            return true;
        }
        console.log("[] ON PASSE AU COMP SUIVANT");
    }
    console.log("[] La fonction compliment envois 'False'");
    return null;
}

// Renvois false si l'array ne contiens pas 3 réponses comprenant le même tag et un compliment
function countBothMatch (message_array, nicknametag, complist) {
    var length = message_array.length;
    var regex = new RegExp("[@]" + nicknametag + "");
    var countmatch = 0;

    console.log(regex);
    for (index = 0; index < length; index++) {
        console.log("La phrase est :", message_array[index]);
        var match = message_array[index].match(regex);
        console.log("La phrase contiens '@khyss' ?", match);
        var matchcomp = compliment(message_array[index], complist);
        console.log("La phrase contiens un compliment ?", matchcomp);
        

        if (match && matchcomp) {
            console.log("On incrémente de 1 'countmatch' qui était égal à", countmatch);
            countmatch = countmatch + 1;
            console.log("Sa nouvelle valeur est", countmatch);
        }
        if (countmatch == 3) {
            return nicknametag;
        }
        console.log("fin de la boucle", "\n");
    }
    return false;
}

pop(array, complist);

// let test = "gg @khyss";
// console.log(compliment(test, comp));

