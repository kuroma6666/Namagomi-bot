const { EmbedBuilder } = require("discord.js");
const logger = require("../modules/logger");
const err_embed = require("../utils/error-embed");
const config = require("../utils/get-config");
const color = require("../utils/color-code");

exports.run = (client, message) => {
    try {
        const embed = new EmbedBuilder({
            title: "🏓pong!",
            description: "ping値を表示します",
            color: color.DETAIL,
            timestamp: new Date(),
            fields: [
                {
                    name: "WebSocket",
                    value: client.ws.ping + "ms",
                },
            ],
        });
        message.channel.send({ embeds: [embed] });
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

exports.name = "ping";
