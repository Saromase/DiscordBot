module.exports = (user, role, open) => {

	if (open) {
		return {
			title : ':green_circle: Commerce Ouvert',
			description : `Ouverture de ${role} par ${user}.`,
			type : 'rich',
			color : '#0bcf02',
		};
	}
	else {
		return {
			title : ':red_circle: Commerce Fermé',
			description : `Le commerce ${role} vient de fermer.`,
			type : 'rich',
			color : '#de0000',
		};
	}

};