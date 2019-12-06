import GuitarString from './guitar-string';


const STATUS = {
	IDLE:    Symbol('guitar-status-idle'),
	PLAYING: Symbol('guitar-status-playing'),
};

const PLAY_DIRECTION = {
	ASC: Symbol('guitar-play-direction-asc'),
	DSC: Symbol('guitar-play-direction-dsc'),
};

class Guitar {
	static STATUS = STATUS;

	static PLAY_DIRECTION = PLAY_DIRECTION;

	get status() {
		return this._status;
	}

	get strings() {
		return Array.from(this._strings.keys()).sort((a, b) => b - a).map(position => this._strings.get(position));
	}

	/**
	 *
	 * @param {Object} configuration Guitar configuration.
	 * @param {Object} configuration.strings Guitar strings configuration
	 * @param {number} [configuration.strings.distance=5] Distance between strings, mm.
	 */
	constructor(configuration = {}) {
		this._configuration = {
			strings: {
				distance: configuration.strings && configuration.strings.distance || 5,
			},
		};

		this._status = Guitar.STATUS.IDLE;

		/**
		 * @type {Map<number, GuitarString>}
		 * @private
		 */
		this._strings = new Map();
	}

	destroy() {
		Array.from(this._strings.keys()).forEach(position => {
			const string = this._strings.get(position);

			if (!!string && (string instanceof GuitarString)) {
				string.destroy();
			}

			this.removeString(position);
		});
	}

	/**
	 *
	 * @param {number} position
	 *
	 * @return {?GuitarString}
	 */
	getString(position) {
		return this._strings.has(position) ? this._strings.get(position) : null;
	}

	/**
	 *
	 * @param {number} position
	 * @param {GuitarString} string
	 *
	 * @return {Guitar}
	 */
	setString(position, string) {
		if (this._strings.has(position) && this._strings.get(position) === string) {
			return this;
		}

		if (!(string instanceof GuitarString)) {
			return this;
		}

		this._strings.set(position, string);

		return this;
	}

	/**
	 * @param {Number} position
	 *
	 * @return {Guitar}
	 */
	removeString(position) {
		if (!this._strings.has(position)) {
			return this;
		}

		this._strings.delete(position);

		return this;
	}
}
