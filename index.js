const discord = require('discord.js')
const mathjs = require("mathjs")
const config = require("./env.json")

const client = new discord.Client({
    intents:[
        "Guilds",
        "DirectMessages",
        "GuildMessages"
    ],
    partials:[
        discord.Partials.Channel
    ]
})

const act = discord.ApplicationCommandType
const acot = discord.ApplicationCommandOptionType

client.on('ready',() => {
    console.log("Welcome to the MathMaster bot!")

    client.user.setActivity({
        type:discord.ActivityType.Listening,
        name:"/calculator"
    })

    client.application.commands.create({
        type:act.ChatInput,
        name:"calculator",
        description:"Open the calulator"
    })

    client.application.commands.create({
        type:act.ChatInput,
        name:"calculate",
        description:"Run a formula",
        options:[
            {
                type:acot.String,
                name:"formula",
                description:"The formula to run",
                required:true
            }
        ]
    })
    
})


client.on("interactionCreate",(interaction) => {
    if (!interaction.isChatInputCommand()) return
    if (interaction.commandName != "calculator") return

    if (interaction.guild){
        const channelPermissions = interaction.guild.members.cache.find(u => u.id == client.user.id).permissionsIn(interaction.channel)
        if (!channelPermissions.has("ViewChannel") && !channelPermissions.has("Administrator")) return interaction.reply({
            content:"**I have no permissions to edit & view messages in this channel!**\nThe calculator bot needs view & write permissions to edit the embed."
        })
    }

    console.log("used /calculator")

    //create embed & buttons
    const screenEmbed = new discord.EmbedBuilder()
        .setColor(discord.Colors.Blurple)
        .setTitle('Calculator')
        .setDescription('=>')

    const buttonRow1 = new discord.ActionRowBuilder()
    .addComponents([
        new discord.ButtonBuilder()
            .setCustomId("NR1")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("1"),
        new discord.ButtonBuilder()
            .setCustomId("NR2")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("2"),
        new discord.ButtonBuilder()
            .setCustomId("NR3")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("3"),
        new discord.ButtonBuilder()
            .setCustomId("MULTIPLY")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Primary)
            .setLabel("*")
    ])

    const buttonRow2 = new discord.ActionRowBuilder()
    .addComponents([
        new discord.ButtonBuilder()
            .setCustomId("NR4")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("4"),
        new discord.ButtonBuilder()
            .setCustomId("NR5")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("5"),
        new discord.ButtonBuilder()
            .setCustomId("NR6")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("6"),
        new discord.ButtonBuilder()
            .setCustomId("DIVIDE")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Primary)
            .setLabel("/")
    ])

    const buttonRow3 = new discord.ActionRowBuilder()
    .addComponents([
        new discord.ButtonBuilder()
            .setCustomId("NR7")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("7"),
        new discord.ButtonBuilder()
            .setCustomId("NR8")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("8"),
        new discord.ButtonBuilder()
            .setCustomId("NR9")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("9"),
        new discord.ButtonBuilder()
            .setCustomId("PLUS")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Primary)
            .setLabel("+")
    ])

    const buttonRow4 = new discord.ActionRowBuilder()
    .addComponents([
        new discord.ButtonBuilder()
            .setCustomId("HOOKOPEN")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("("),
        new discord.ButtonBuilder()
            .setCustomId("HOOKCLOSE")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel(")"),
        new discord.ButtonBuilder()
            .setCustomId("NR0")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("0"),
        new discord.ButtonBuilder()
            .setCustomId("MIN")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Primary)
            .setLabel("-")
    ])

    const buttonRow5 = new discord.ActionRowBuilder()
    .addComponents([
        new discord.ButtonBuilder()
            .setCustomId("SQUARECARROT")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("√"),
        new discord.ButtonBuilder()
            .setCustomId("EXPONENT")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel("^"),
        new discord.ButtonBuilder()
            .setCustomId("RESET")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Danger)
            .setLabel("reset"),
        new discord.ButtonBuilder()
            .setCustomId("IS")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Success)
            .setLabel("=")
    ])

    interaction.reply({
        embeds:[screenEmbed],
        components:[buttonRow1,buttonRow2,buttonRow3,buttonRow4,buttonRow5]
    })
})

client.on("interactionCreate",interaction => {
    if (!interaction.isChatInputCommand()) return
    if (interaction.commandName != "calculate") return

    //calculate
    try{
        var formula = mathjs.evaluate(interaction.options.getString("formula",true))
        var output = "**The output is: **`"+formula+"`"
    }catch{
        var output = "Syntax Error!"
    }
        
    interaction.reply({content:output})
})

client.on("interactionCreate",interaction => {
    if (!interaction.isButton()) return
    if (interaction.message.author.id != client.user.id) return
    if (!interaction.message.embeds[0] || interaction.message.embeds[0].title != "Calculator") return
    
    if (interaction.guild){
        const channelPermissions = interaction.guild.members.cache.find(u => u.id == client.user.id).permissionsIn(interaction.channel)
        if (!channelPermissions.has("ViewChannel") && !channelPermissions.has("Administrator")) return interaction.reply({
            content:"**I have no permissions to edit & view messages in this channel!**\nThe calculator bot needs view & write permissions to edit the embed."
        })
    }

    //manage buttons
    var currentDisplay = interaction.message.embeds[0].description.substring(2)

    if (interaction.customId == "PLUS") var newDisplay = currentDisplay + "+"
    else if (interaction.customId == "MIN") var newDisplay = currentDisplay + "-"
    else if (interaction.customId == "MULTIPLY") var newDisplay = currentDisplay + "*"
    else if (interaction.customId == "DIVIDE") var newDisplay = currentDisplay + "/"
    else if (interaction.customId == "SQUARECARROT") var newDisplay = currentDisplay + "sqrt("
    else if (interaction.customId == "EXPONENT") var newDisplay = currentDisplay + "^"
    else if (interaction.customId == "HOOKOPEN") var newDisplay = currentDisplay + "("
    else if (interaction.customId == "HOOKCLOSE") var newDisplay = currentDisplay + ")"

    if (interaction.customId.startsWith("NR") && interaction.customId.length == 3){
        var newDisplay = currentDisplay + interaction.customId.substring(2)
    }
    
    if (interaction.customId == "RESET") var newDisplay = ""

    if (interaction.customId == "IS"){
        try{
            var newDisplay = mathjs.evaluate(currentDisplay)
        }catch{
            var newDisplay = "Syntax Error (Click RESET please!)"
        }
    }
    
    //edit message
    const newScreenEmbed = new discord.EmbedBuilder()
        .setColor(discord.Colors.Blurple)
        .setTitle('Calculator')
        .setDescription('=> '+newDisplay)
    
    interaction.message.edit({embeds:[newScreenEmbed]})
    interaction.deferUpdate()
})

process.on("uncaughtException",(error,origin) => {
    console.log("there was an error:",error)
})

client.login(config.token)