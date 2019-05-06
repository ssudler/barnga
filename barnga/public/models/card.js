//
//  public/models/card.js
//  Barnga
//
//  Created by Robert May on 5/3/19.
//  Copyright © 2019 Robert May. All rights reserved.
//

/*
	* Helpful functions for loading cards
	* - load card image at coords
	* - get mouse click in card (flip card)
	* - get mouse click and drag in card (move card without flipping)
 */
const config = require('.../config');

// Load all card images ONLY ONCE
var images = {};

for (var i = 0; i < 4; i++) {
	var suit = ['hearts', 'diamonds', 'clubs', 'spades'][i];
	for (var j = 0; j < 13; j++) {
		images[i+'.'+j] = new Image();
		images[i+'.'+j].src = '/images/cards/' + suit + '/' + j + '.svg'
	}
}

class Card {

	constructor(suit, number, flipped, pos) {
		// These might never be used
		this.suit = suit;
		this.number = number;

		this.flipped = flipped;

		// Get image reference from images json
		this.image = images[suit+'.'+number];

		// Position on page
		this.pos = pos;
	}

	didClickInside(pos) {
		// Relative position
		var relativePos = {
			x: pos.x - this.pos.x,
			y: pos.y - this.pos.y
		}

		// Image is square; click should be in rect (middle 2/3)
	}

	draw(ctx) {

	}

}
