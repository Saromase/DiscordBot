const read = require('fs-readdir-recursive');
const {
	REST,
} = require('@discordjs/rest');
const {
	Routes,
} = require('discord-api-types/v9');
const {
	clientId,
	guildId,
	token,
} = require('./config.json');

const commands = [];
const commandsPermissions = [];
const commandFiles = read('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if (command.permissions) {
		commandsPermissions.push({ permissions : command.permissions, name : command.data.toJSON().name });
	}
	commands.push(command.data.toJSON());
}

const rest = new REST({
	version: '9',
}).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		const createdCommands = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		commandsPermissions.forEach(async commandP => {
			const current = createdCommands.filter(command => command.name === commandP.name);
			await rest.put(
				Routes.applicationCommandPermissions(clientId, guildId, current[0].id),
				{ body: { permissions : commandP.permissions } },
			);
			console.log(current);
		});
		console.log('Successfully reloaded application (/) commands.');
	}
	catch (error) {
		console.error(error);
	}
})();