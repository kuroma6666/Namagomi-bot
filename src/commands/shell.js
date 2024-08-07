const logger = require("../modules/logger");
const config = require("../utils/get-config");
const check_admin = require("../utils/check-admin");
const { EmbedBuilder } = require("discord.js");
const child = require("child_process");
const err_embed = require("../utils/error-embed");
const color = require("../utils/color-code");

exports.run = (client, message, args) => {
    // configのやばい情報を置き換える
    const clean = async (text) => {
        // If our input is a promise, await it before continuing
        if (text && text.constructor.name == "Promise") text = await text;

        // If the response isn't a string, `util.inspect()`
        // is used to 'stringify' the code in a safe way that
        // won't error out on objects with circular references
        // (like Collections, for example)
        if (typeof text !== "string") text = require("util").inspect(text, { depth: 1 });

        // Replace symbols with character code alternatives
        text = text.replaceAll(config.mongodb.url, "****");
        text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        text = text.replaceAll(config.bot.token, "****");
        // Send off the cleaned up result
        return text;
    };
    async function run(err, res_old, command) {
        const res = await clean(res_old);
        const input = command;
        const input_count = input.length;
        if (input_count >= 1000) {
            const err_input_long = new EmbedBuilder({
                title: "シェルコマンド実行",
                description: "ERROR: 入力値が1000文字を超えました...",
                color: color.ERROR,
                fields: [
                    {
                        name: "入力",
                        value: "```\n" + "ながいよぉ！" + "\n```",
                    },
                    {
                        name: "出力",
                        value: "```sh\n" + "N/A" + "\n```",
                    },
                ],
            });
            message.channel.send({ embeds: [err_input_long] });
            logger.warn(
                "シェルコマンド入力値が1000文字を超えたため処理を中断しました... (文字数: " + input_count + "文字)"
            );
            return;
        }

        const output_1 = res.slice(0, 1000);
        const output_2 = res.slice(1000, 2000);
        const output_3 = res.slice(3000, 4000);
        const output_4 = res.slice(4000, 5000);
        const output_5 = res.slice(5000, 6000);
        if (err) {
            const err_shell = new EmbedBuilder({
                title: "シェルコマンド実行",
                description: "シェルコマンドを実行しました",
                color: color.CMD_RUN,
                fields: [
                    {
                        name: "入力",
                        value: "```\n" + command + "\n```",
                    },
                    {
                        name: "出力",
                        value: "```\n" + err + "\n```",
                    },
                ],
            });
            message.channel.send({ embeds: [err_shell] });
            logger.error("シェルコマンド実行中にエラーが発生しました...");
            logger.error(err);
            return;
        }

        // 実行成功時
        const page1 = new EmbedBuilder({
            title: "シェルコマンド実行",
            description: "シェルコマンドを実行しました (1ページ目)",
            color: color.CMD_RUN,
            fields: [
                {
                    name: "入力",
                    value: "```\n" + command + "\n```",
                },
                {
                    name: "出力",
                    value: "```sh\n" + output_1 + "\n```",
                },
            ],
        });
        const page2 = new EmbedBuilder({
            title: "シェルコマンド実行",
            description: "シェルコマンドを実行しました (2ページ目)",
            color: color.CMD_RUN,
            fields: [
                {
                    name: "2ページ目",
                    value: "```sh\n" + output_2 + "\n```",
                },
            ],
        });
        const page3 = new EmbedBuilder({
            title: "シェルコマンド実行",
            description: "シェルコマンドを実行しました (3ページ目)",
            color: color.CMD_RUN,
            fields: [
                {
                    name: "3ページ目",
                    value: "```sh\n" + output_3 + "\n```",
                },
            ],
        });
        const page4 = new EmbedBuilder({
            title: "シェルコマンド実行",
            description: "シェルコマンドを実行しました (4ページ目)",
            color: color.CMD_RUN,
            fields: [
                {
                    name: "4ページ目",
                    value: "```sh\n" + output_4 + "\n```",
                },
            ],
        });
        const page5 = new EmbedBuilder({
            title: "シェルコマンド実行",
            description: "シェルコマンドを実行しました (最終ページ)",
            color: color.CMD_RUN,
            fields: [
                {
                    name: "5ページ目",
                    value: "```sh\n" + output_5 + "\n```",
                },
            ],
        });

        message.channel.send({ embeds: [page1] });
        if (output_2.length >= 1) {
            message.channel.send({ embeds: [page2] });
        }
        if (output_3.length >= 1) {
            message.channel.send({ embeds: [page3] });
        }
        if (output_4.length >= 1) {
            message.channel.send({ embeds: [page4] });
        }
        if (output_5.length >= 1) {
            message.channel.send({ embeds: [page5] });
        }
    }
    try {
        const permission_check = check_admin(message, client);

        if (permission_check == "owner: no") {
            return;
        }
        const command = args.join(" ");

        const err_argument = new EmbedBuilder({
            title: "シェルコマンド実行",
            description: "ERROR: 引数が指定されていません",
            color: color.ERROR,
            fields: [
                {
                    name: "入力",
                    value: "```\n" + "N/A" + "\n```",
                },
                {
                    name: "出力",
                    value: "```\n" + "N/A" + "\n```",
                },
            ],
        });

        if (!command) {
            message.channel.send({ embeds: [err_argument] });
            return;
        }

        child.exec(command, (err, res_not_replace) => {
            run(err, res_not_replace, command);
        });
    } catch (err) {
        logger.error("コマンド実行エラーが発生しました");
        logger.error(err);
        message.channel.send({ embeds: [err_embed.main] });
        if (config.debug.enable.includes("true")) {
            message.channel.send({ embeds: [err_embed.debug] });
            message.channel.send("エラー内容: ");
            message.channel.send("```\n" + err + "\n```");
        }
    }
};

exports.name = "shell";
