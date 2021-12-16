module.exports = (interaction, works) => {
	const fields = [];
	works.forEach(work => {
		const role = interaction.guild.roles.cache.get(work.role_id);
		fields.push({
			name : `${work.pay} $`,
			value : `${role}`,
		});
	});

	return {
		title : 'Salaire hebdomadaire',
		description : 'Salaire en "$" pour chaque métier.',
		fields : fields,
		type : 'rich',
		color : '#0099ff',
	};
};