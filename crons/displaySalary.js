const {
	Works,
} = require('../dbObjects');

module.exports = async (client) => {
	const channel = client.channels.cache.find(chan => chan.id === '920098604474048554');
	channel.bulkDelete(1);
	const works = await Works.findAll();
	const fields = [];
	works.forEach(work => {
		const role = client.guilds.cache.find(guilds => guilds.id === '919699719163367444').roles.cache.get(work.role_id);
		fields.push({
			name: `${work.pay} $`,
			value: `${role}`,
		});
	});

	channel.send({
		embeds: [{
			title: 'Paiement pour tout les métiers',
			description: 'Liste des salaires versé de manière hebdomadaire',
			fields: fields,
			type: 'rich',
			color: '#0099ff',
			allowed_mentions: {
				parse: [works],
			},
		}],
	});
};