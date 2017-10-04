'use strict';

const CardsModel = require('../../models/cards/cards');

module.exports = async(ctx) => {
	try {
		const card = {
			cardNumber: ctx.request.body.cardNumber,
			balance: ctx.request.body.balance
		};
		await validationCard(card);
		card.balance *= 1;
		const cardsModel = await new CardsModel();
		const newCard = await cardsModel.create(card);
		ctx.status = 201;
		ctx.body = newCard;
	} catch (err) {
		console.log(err);
		ctx.status = 400;
		ctx.message = '400 Bad request';
	}
};

const validationCard = (card) => new Promise(async(resolve,reject) => {
	try {
		if (card.cardNumber.search(/^(\d{13}|\d{16}|\d{18,19})$/) == -1)
			throw ('Несоответсвие количества цифр номера карты');
		await luna(card.cardNumber);
		if (card.balance.search(/^\d+$/) == -1)
			throw('Баланс должен содержать только цифры');
		resolve(true);
	} catch (err) {
		return reject(err);
	}
});

const luna = (number) => new Promise((resolve, reject) => {
	let sum = 0;
	for (var i = 0; i < number.length; i++) {
		let p = (i % 2) ? number[i]*2 : number[i];
		p = (p>9) ? p - 9 : p;
		sum += p*1;
	}
	let flag = (sum % 10);
	if (!flag) resolve();
	else reject(`Ошибка валидации Luna: ${flag}`);
});
