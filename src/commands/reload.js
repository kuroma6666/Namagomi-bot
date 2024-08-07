const logger = require("../modules/logger");
const config = require("../utils/get-config");
const check_admin = require("../utils/check-admin");
const { EmbedBuilder } = require("discord.js");
const err_embed = require("../utils/error-embed");
const color = require("../utils/color-code");

exports.run = (client, message, args) => {
    try {
        const permission_check = check_admin(message, client);

        if (permission_check == "owner: no") {
            return;
        }

        const not_args = new EmbedBuilder({
            title: "リロード失敗",
            description: "コマンドのリロードに失敗しました...",
            color: 13632027,
            fields: [
                {
                    name: "理由:",
                    value: "リロードするコマンドが入力されていません",
                },
            ],
        });

        if (!args || args.length < 1) return message.channel.send({ embeds: [not_args] });
        const commandName = args[0];
        const reload_success = new EmbedBuilder({
            title: "リロード成功",
            description: commandName + "コマンドをリロードしました",
            color: color.NOTIFY,
            timestamp: new Date(),
        });

        const reload_unknown = new EmbedBuilder({
            title: "リロード失敗",
            description: commandName + "コマンドのリロードに失敗しました...",
            color: 13632027,
            fields: [
                {
                    name: "理由:",
                    value: "存在しないコマンド",
                },
            ],
        });

        // Check if the command exists and is valid
        if (!client.commands.has(commandName)) {
            logger.error("コマンドのreloadに失敗しました... unknown_command 実行者ID: " + message.author.id);
            return message.channel.send({ embeds: [reload_unknown] });
        }

        delete require.cache[require.resolve(`./${commandName}.js`)];

        client.commands.delete(commandName);
        const props = require(`./${commandName}.js`);
        client.commands.set(commandName, props);
        message.channel.send({ embeds: [reload_success] });
        logger.info(
            "コマンドのreloadに成功しました! 実行者ID: " + message.author.id + " リロードされたコマンド: " + commandName
        );
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

exports.name = "reload";
