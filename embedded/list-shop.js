module.exports = (interaction, shops) => {
	const fields = [];
	shops.forEach(shop => {
		fields.push({
			name : shop.name,
			value : 'Exemple d\'objets à la vente',
		});

		fields.push({
			name : 'Objet 1',
			value : '10 $',
			inline : true,
		});
		fields.push({
			name : 'Objet 2',
			value : '20 $',
			inline : true,
		});
		fields.push({
			name : 'Objet 3',
			value : '50 $',
			inline : true,
		});

		fields.push({
			name : shop.name,
			value : 'Exemple d\'objets à la vente',
		});
	});

	return {
		title : 'Magasins',
		description : 'Liste des magasins.',
		fields : fields,
		type : 'rich',
		color : '#0099ff',
	};
};