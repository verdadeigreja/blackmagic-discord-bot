const { Atem } = require('atem-connection')
const myAtem = new Atem()
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const { generateDependencyReport } = require('@discordjs/voice');

const token = "MTAwMDgzNzI2ODEyODQwMzQ2Ng.GuLglD.z12-Wv7ublXKPlkvOE4I6luYYJCQ9XaRDqVSzs";
const atemIp = '192.168.0.111';

console.log(generateDependencyReport());

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

myAtem.on('info', console.log)
myAtem.on('error', console.error)

myAtem.connect(atemIp)

myAtem.on('connected', () => {
	console.log("Connected")
})
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const player = createAudioPlayer();

client.on("ready", () => {
    const channel = client.channels.cache.get("1000838623400296462");
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false // this may also be needed
    }).subscribe(player);
  });
  
myAtem.on('stateChanged', (state, pathToChange) => {

    if (pathToChange.includes('video.mixEffects.0.programInput'))
    {
        const cam = state.video.mixEffects[0].programInput;
        player.play(createAudioResource(`camera${cam}.mp3`));
        console.log("Camera in air: ", cam);
    }
})

// Login to Discord with your client's token
client.login(token);