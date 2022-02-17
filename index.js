const ws = require("ws"); // yarn add ws
const Crypto = require("crypto");
const { createClient } = require("graphql-ws");
const complist = ['gg', 'Gg', 'bravo','Bravo', 'nice', 'Nice', 'wp', 'Wp', 'jolie', 'Jolie', 'propre', 'Propre'];


/*
const ws = new WebSocket('wss://api.stake.bet/websockets', {
  perMessageDeflate: false
});
*/
const url = "wss://api.stake.bet/websockets";

const client = createClient({
    url: url,
    webSocketImpl: ws,
    /**
     * Generates a v4 UUID to be used as the ID.
     * Reference: https://gist.github.com/jed/982883
     */
    generateID: () =>
        ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            (c ^ (Crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
        ),
});

client.on("connected", (args) => {
    console.log("CONNECTED");
});

// (async() => {
//     const result = await new Promise((resolve, reject) => {
//         let result;
//         client.subscribe({
//             query: "subscription OnlineCountSubscription {\n  onlineCount\n}\n",
//         }, {
//             next: (data) => {
//                 console.log(data);
//             },
//             error: reject,
//             complete: () => resolve(result),
//         });
//     });
// })();

(async() => {
    const result = await new Promise((resolve, reject) => {
        var result;
        let tenLastMessages = [];
        client.subscribe({
            query: "subscription ChatMessages($chatId: String!) {\n  chatMessages(chatId: $chatId) {\n    ...ChatMessage\n    __typename\n  }\n}\n\nfragment ChatMessage on ChatMessage {\n  id\n  data {\n    __typename\n    ... on ChatMessageDataRace {\n      race {\n        id\n        name\n        status\n        startTime\n        leaderboard(limit: 10) {\n          ...RacePosition\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on ChatMessageDataTrivia {\n      status\n      question\n      answer\n      currency\n      amount\n      winner {\n        ...UserTags\n        __typename\n      }\n      __typename\n    }\n    ... on ChatMessageDataText {\n      message\n      __typename\n    }\n    ... on ChatMessageDataBot {\n      message\n      __typename\n    }\n    ... on ChatMessageDataTip {\n      tip {\n        id\n        amount\n        currency\n        sender: sendBy {\n          ...UserTags\n          __typename\n        }\n        receiver: user {\n          ...UserTags\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on ChatMessageDataRain {\n      rain {\n        amount\n        currency\n        rainUsers {\n          user {\n            id\n            name\n            __typename\n          }\n          __typename\n        }\n        giver: user {\n          ...UserTags\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n  createdAt\n  user {\n    ...UserTags\n    __typename\n  }\n}\n\nfragment RacePosition on RacePosition {\n  position\n  user {\n    id\n    name\n    __typename\n  }\n  wageredAmount\n  payoutAmount\n  percentage\n  currency\n}\n\nfragment UserTags on User {\n  id\n  name\n  isMuted\n  isRainproof\n  isIgnored\n  isHighroller\n  isSportHighroller\n  leaderboardDailyProfitRank\n  leaderboardDailyWageredRank\n  leaderboardWeeklyProfitRank\n  leaderboardWeeklyWageredRank\n  flags {\n    flag\n    rank\n    createdAt\n    __typename\n  }\n  roles {\n    name\n    expireAt\n    message\n    __typename\n  }\n  createdAt\n}\n",
            variables: { chatId: "5a6e5063-0154-47eb-9064-f69547213fe5" },
        }, {
            next: (data) => {
                // console.log(JSON.stringify(data.data.chatMessages.user.name));
                // console.log(JSON.stringify(data.data.chatMessages), "\n");

                if (data.data.chatMessages.data.__typename == "ChatMessageDataText") {
                    // console.log(data.data.chatMessages.data.message);
                    tenLastMessages.push(data.data.chatMessages.data.message);
                    if ((tenLastMessages.length) == 20) {
                        tenLastMessages.shift();
                        console.log(data.data.chatMessages.createdAt);
                        console.log(radar(tenLastMessages, complist), "\n");
                    }
                }
                // if ((tenLastMessages.length) == 10) {
                //     tenLastMessages.shift();
                // }
                // console.log(tenLastMessages);
                // console.log(radar(tenLastMessages, complist));


            },
            error: reject,
            complete: () => resolve(result),
        });
    });
})();

function radar (message_array, compliment) {
    var regex = /[@]\w+/;
    var match3 = message_array[0].match(regex);
        
    if (match3 != null) {
        var nickname = match3[0].slice(1);
        var result = countBothMatch(message_array, nickname, complist);
        return result;
    }
    return "Pas de '@' dans le premier string";
}

// Renvois True si le "message" contiens un compliment
function compliment (message, comp) {
    var length2 = comp.length;
    var idx = 0;
    for (idx = 0; idx < length2; idx++) {
        var compword = comp[idx];
        var regex = new RegExp("" + compword + "");
        var match2 = message.match(regex);
        if (match2 != null) {
            return true;
        }
    }
    return null;
}

// Renvois false si l'array ne contiens pas 3 réponses comprenant le même tag et un compliment
function countBothMatch (message_array, nicknametag, complist) {
    var length = message_array.length;
    var regex = new RegExp("[@]" + nicknametag + "");
    var countmatch = 0;
    var index = 0;
    for (index = 0; index < length; index++) {
        var match = message_array[index].match(regex);
        if (match) {
            var matchcomp = compliment(message_array[index], complist);
        }

        if (match && matchcomp) {
            countmatch = countmatch + 1;
        }
        if (countmatch == 3) {
            return nicknametag;
        }
    }
    return "Pas de combinaison dans les 10 strings";
}

/*
ws.on('open', function open() {
    console.log('authentification');
    ws.send(JSON.stringify({"type":"connection_init","payload":{"accessToken":"4f26025334a268246b900ec1e44dd622e4975c15d3fc87f113d1ffe33dbfa58a3300348750e21f5e2fbf000fd5eaadb9","language":"fr","lockdownToken":"s5MNWtjTM5TvCMkAzxov"}}));
});
ws.on('message', function message(data) {
    console.log('received: %s', data);
});
ws.on('close', function clear() {
    console.log('disconnected');
});
*/