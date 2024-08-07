const { EmbedBuilder } = require("discord.js");
const logger = require("../modules/logger");
const err_embed = require("../utils/error-embed");
const config = require("../utils/get-config");
const color = require("../utils/color-code");

exports.run = (client, message) => {
    try {
        const license = "MIT License \nCopyright (c) 2022 NamagomiNetwork";
        const license_1 =
            "Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the Software), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions";
        const license_2 =
            "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software";
        const license_3 =
            "THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE";
        const embed = new EmbedBuilder({
            title: "Bot License",
            color: color.DETAIL,
            fields: [
                {
                    name: "License",
                    value: "```\n" + license + "\n```",
                },
                {
                    name: "\u200b",
                    value: "```\n" + license_1 + "\n```",
                },
                {
                    name: "\u200b",
                    value: "```\n" + license_2 + "\n```",
                },
                {
                    name: "\u200b",
                    value: "```\n" + license_3 + "\n```",
                },
                {
                    name: "Repository",
                    value: "https://github.com/NamagomiNetwork/Namagomi-bot",
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

exports.name = "license";
