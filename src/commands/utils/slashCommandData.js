const command_data = [
    {
        name: "omikuji",
        description: "おみくじをします",
    },
    {
        name: "vote",
        description: "投票を行います",
        options: [
            {
                type: "STRING",
                name: "タイトル",
                description: "投票タイトルを入力してね",
            },
        ],
    },
    {
        name: "ping",
        description: "ping値を表示します",
    },
];

exports.data = command_data;
