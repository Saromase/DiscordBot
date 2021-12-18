module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		let commandName;
		if (interaction.isButton()) {
			return;
		}
		else if (interaction.commandName) {
			commandName = interaction.commandName;
		}
		else {
			return;
		}
		const command = interaction.client.commands.get(commandName);

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	},
};