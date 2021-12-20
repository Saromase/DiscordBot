module.exports = (interaction, selectedShop, open) => {

	if (open) {
		return {
			title : ':green_circle: Commerce Ouvert',
			description : `Le commerce ${selectedShop.name} vient d'ouvrir.`,
			type : 'rich',
			color : '#0bcf02',
		};
	}
	else {
		return {
			title : ':red_circle: Commerce Fermé',
			description : `Le commerce ${selectedShop.name} vient de fermer.`,
			type : 'rich',
			color : '#de0000',
		};
	}

};