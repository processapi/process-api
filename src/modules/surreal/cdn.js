var __defProp = Object.defineProperty;
var __export = (target, all) => {
	for (var name in all) {
		__defProp(target, name, { get: all[name], enumerable: !0 });
	}
};
var Emitter = class {
	collectable = {};
	listeners = {};
	interceptors;
	constructor({ interceptors } = {}) {
		this.interceptors = interceptors ?? {};
	}
	subscribe(event, listener, historic = !1) {
		if (
			this.listeners[event] || (this.listeners[event] = []),
				!this.isSubscribed(event, listener) &&
				(this.listeners[event]?.push(listener),
					historic && this.collectable[event])
		) {
			let buffer = this.collectable[event];
			this.collectable[event] = [];
			for (let args of buffer) listener(...args);
		}
	}
	subscribeOnce(event, historic = !1) {
		return new Promise((resolve) => {
			let resolved = !1,
				listener = (...args) => {
					resolved ||
						(resolved = !0, this.unSubscribe(event, listener), resolve(args));
				};
			this.subscribe(event, listener, historic);
		});
	}
	unSubscribe(event, listener) {
		if (this.listeners[event]) {
			let index = this.listeners[event]?.findIndex((v) => v === listener);
			index && this.listeners[event]?.splice(index, 1);
		}
	}
	isSubscribed(event, listener) {
		return !!this.listeners[event]?.includes(listener);
	}
	async emit(event, args, collectable = !1) {
		let interceptor = this.interceptors[event],
			computedArgs = interceptor ? await interceptor(...args) : args;
		this.listeners[event]?.length === 0 && collectable &&
			(this.collectable[event] || (this.collectable[event] = []),
				this.collectable[event]?.push(args));
		for (let listener of this.listeners[event] ?? []) listener(...computedArgs);
	}
	reset({ collectable, listeners }) {
		if (Array.isArray(collectable)) {
			for (let k of collectable) delete this.collectable[k];
		} else {typeof collectable == "string"
				? delete this.collectable[collectable]
				: collectable !== !1 && (this.collectable = {});}
		if (Array.isArray(listeners)) {
			for (let k of listeners) delete this.listeners[k];
		} else {typeof listeners == "string"
				? delete this.listeners[listeners]
				: listeners !== !1 && (this.listeners = {});}
	}
	scanListeners(filter) {
		let listeners = Object.keys(this.listeners);
		return filter && (listeners = listeners.filter(filter)), listeners;
	}
};
var cbor_exports = {};
__export(cbor_exports, {
	CborBreak: () => CborBreak,
	CborError: () => CborError,
	CborFillMissing: () => CborFillMissing,
	CborInvalidMajorError: () => CborInvalidMajorError,
	CborNumberError: () => CborNumberError,
	CborPartialDisabled: () => CborPartialDisabled,
	CborRangeError: () => CborRangeError,
	Encoded: () => Encoded,
	Gap: () => Gap,
	POW_2_53: () => POW_2_53,
	POW_2_64: () => POW_2_64,
	PartiallyEncoded: () => PartiallyEncoded,
	Reader: () => Reader,
	Tagged: () => Tagged,
	Writer: () => Writer,
	decode: () => decode,
	encode: () => encode,
	infiniteBytes: () => infiniteBytes,
	partiallyEncodeObject: () => partiallyEncodeObject,
});
var POW_2_53 = 9007199254740992, POW_2_64 = BigInt(18446744073709552e3);
var Encoded = class {
	constructor(encoded) {
		this.encoded = encoded;
	}
};
var SurrealDbError = class extends Error {},
	NoActiveSocket = class extends SurrealDbError {
		name = "NoActiveSocket";
		message =
			"No socket is currently connected to a SurrealDB instance. Please call the .connect() method first!";
	},
	NoConnectionDetails = class extends SurrealDbError {
		name = "NoConnectionDetails";
		message =
			"No connection details for the HTTP api have been provided. Please call the .connect() method first!";
	},
	UnexpectedResponse = class extends SurrealDbError {
		name = "UnexpectedResponse";
		message =
			"The returned response from the SurrealDB instance is in an unexpected format. Unable to process response!";
	},
	InvalidURLProvided = class extends SurrealDbError {
		name = "InvalidURLProvided";
		message =
			"The provided string is either not a URL or is a URL but with an invalid protocol!";
	},
	EngineDisconnected = class extends SurrealDbError {
		name = "EngineDisconnected";
		message = "The engine reported the connection to SurrealDB has dropped";
	},
	UnexpectedServerResponse = class extends SurrealDbError {
		constructor(response) {
			super();
			this.response = response;
			this.message = `${response}`;
		}
		name = "UnexpectedServerResponse";
	},
	UnexpectedConnectionError = class extends SurrealDbError {
		constructor(error) {
			super();
			this.error = error;
			this.message = `${error}`;
		}
		name = "UnexpectedConnectionError";
	},
	UnsupportedEngine = class extends SurrealDbError {
		constructor(engine) {
			super();
			this.engine = engine;
		}
		name = "UnsupportedEngine";
		message =
			"The engine you are trying to connect to is not supported or configured.";
	},
	ConnectionUnavailable = class extends SurrealDbError {
		name = "ConnectionUnavailable";
		message = "There is no connection available at this moment.";
	},
	MissingNamespaceDatabase = class extends SurrealDbError {
		name = "MissingNamespaceDatabase";
		message = "There is no namespace and/or database selected.";
	},
	HttpConnectionError = class extends SurrealDbError {
		constructor(message, status, statusText, buffer) {
			super();
			this.message = message;
			this.status = status;
			this.statusText = statusText;
			this.buffer = buffer;
		}
		name = "HttpConnectionError";
	},
	ResponseError = class extends SurrealDbError {
		constructor(message) {
			super();
			this.message = message;
		}
		name = "ResponseError";
	},
	NoNamespaceSpecified = class extends SurrealDbError {
		name = "NoNamespaceSpecified";
		message = "Please specify a namespace to use.";
	},
	NoDatabaseSpecified = class extends SurrealDbError {
		name = "NoDatabaseSpecified";
		message = "Please specify a database to use.";
	},
	NoTokenReturned = class extends SurrealDbError {
		name = "NoTokenReturned";
		message = "Did not receive an authentication token.";
	},
	UnsupportedVersion = class extends SurrealDbError {
		name = "UnsupportedVersion";
		version;
		supportedRange;
		constructor(version, supportedRange) {
			super(),
				this.version = version,
				this.supportedRange = supportedRange,
				this.message =
					`The version "${version}" reported by the engine is not supported by this library, expected a version that satisfies "${supportedRange}".`;
		}
	},
	VersionRetrievalFailure = class extends SurrealDbError {
		constructor(error) {
			super();
			this.error = error;
		}
		name = "VersionRetrievalFailure";
		message =
			"Failed to retrieve remote version. If the server is behind a proxy, make sure it's configured correctly.";
	};
var CborError = class extends SurrealDbError {
		message;
		constructor(message) {
			super(), this.message = message;
		}
	},
	CborNumberError = class extends CborError {
		name = "CborNumberError";
	},
	CborRangeError = class extends CborError {
		name = "CborRangeError";
	},
	CborInvalidMajorError = class extends CborError {
		name = "CborInvalidMajorError";
	},
	CborBreak = class extends CborError {
		name = "CborBreak";
		constructor() {
			super("Came across a break which was not intercepted by the decoder");
		}
	},
	CborPartialDisabled = class extends CborError {
		name = "CborPartialDisabled";
		constructor() {
			super(
				"Tried to insert a Gap into a CBOR value, while partial mode is not enabled",
			);
		}
	},
	CborFillMissing = class extends CborError {
		name = "CborFillMissing";
		constructor() {
			super("Fill for a gap is missing, and gap has no default");
		}
	};
var Gap = class {
	args = [];
	constructor(...args) {
		this.args = args;
	}
	fill(value) {
		return [this, value];
	}
	hasDefault() {
		return this.args.length === 1;
	}
	get default() {
		return this.args[0];
	}
};
var Writer = class {
	constructor(byteLength = 256) {
		this.byteLength = byteLength;
		this._buf = new ArrayBuffer(this.byteLength),
			this._view = new DataView(this._buf),
			this._byte = new Uint8Array(this._buf);
	}
	_chunks = [];
	_pos = 0;
	_buf;
	_view;
	_byte;
	chunk(gap) {
		this._chunks.push([this._buf.slice(0, this._pos), gap]),
			this._buf = new ArrayBuffer(this.byteLength),
			this._view = new DataView(this._buf),
			this._byte = new Uint8Array(this._buf),
			this._pos = 0;
	}
	get chunks() {
		return this._chunks;
	}
	get buffer() {
		return this._buf.slice(0, this._pos);
	}
	claim(length) {
		let pos = this._pos;
		if (this._pos += length, this._pos <= this._buf.byteLength) return pos;
		let newLen = this._buf.byteLength << 1;
		for (; newLen < this._pos;) newLen <<= 1;
		if (newLen > this._buf.byteLength) {
			let oldb = this._byte;
			this._buf = new ArrayBuffer(newLen),
				this._view = new DataView(this._buf),
				this._byte = new Uint8Array(this._buf),
				this._byte.set(oldb);
		}
		return pos;
	}
	writeUint8(value) {
		let pos = this.claim(1);
		this._view.setUint8(pos, value);
	}
	writeUint16(value) {
		let pos = this.claim(2);
		this._view.setUint16(pos, value);
	}
	writeUint32(value) {
		let pos = this.claim(4);
		this._view.setUint32(pos, value);
	}
	writeUint64(value) {
		let pos = this.claim(8);
		this._view.setBigUint64(pos, value);
	}
	writeUint8Array(data) {
		if (data.byteLength === 0) return;
		let pos = this.claim(data.byteLength);
		this._byte.set(data, pos);
	}
	writeArrayBuffer(data) {
		data.byteLength !== 0 && this.writeUint8Array(new Uint8Array(data));
	}
	writePartiallyEncoded(data) {
		for (let [buf, gap] of data.chunks) {
			this.writeArrayBuffer(buf), this.chunk(gap);
		}
		this.writeArrayBuffer(data.end);
	}
	writeFloat32(value) {
		let pos = this.claim(4);
		this._view.setFloat32(pos, value);
	}
	writeFloat64(value) {
		let pos = this.claim(8);
		this._view.setFloat64(pos, value);
	}
	writeMajor(type, length) {
		let base = type << 5;
		length < 24
			? this.writeUint8(base + Number(length))
			: length < 256
			? (this.writeUint8(base + 24), this.writeUint8(Number(length)))
			: length < 65536
			? (this.writeUint8(base + 25), this.writeUint16(Number(length)))
			: length < 4294967296
			? (this.writeUint8(base + 26), this.writeUint32(Number(length)))
			: (this.writeUint8(base + 27), this.writeUint64(BigInt(length)));
	}
	output(partial, replacer2) {
		return partial
			? new PartiallyEncoded(this._chunks, this.buffer, replacer2)
			: this.buffer;
	}
};
var PartiallyEncoded = class {
	constructor(chunks, end, replacer2) {
		this.chunks = chunks;
		this.end = end;
		this.replacer = replacer2;
	}
	build(fills, partial) {
		let writer = new Writer(), map = new Map(fills);
		for (let [buffer, gap] of this.chunks) {
			let hasValue = map.has(gap) || gap.hasDefault();
			if (!partial && !hasValue) throw new CborFillMissing();
			if (writer.writeArrayBuffer(buffer), hasValue) {
				let data = map.get(gap) ?? gap.default;
				encode(data, { writer, replacer: this.replacer });
			} else writer.chunk(gap);
		}
		return writer.writeArrayBuffer(this.end),
			writer.output(!!partial, this.replacer);
	}
};
function partiallyEncodeObject(object, options) {
	return Object.fromEntries(
		Object.entries(object).map((
			[k, v],
		) => [k, encode(v, { ...options, partial: !0 })]),
	);
}
var Tagged = class {
	constructor(tag, value) {
		this.tag = tag;
		this.value = value;
	}
};
var textEncoder;
function encode(input, options = {}) {
	let w = options.writer ?? new Writer(),
		fillsMap = new Map(options.fills ?? []);
	function inner(input2) {
		let value = options.replacer ? options.replacer(input2) : input2;
		if (value === void 0) return w.writeUint8(247);
		if (value === null) return w.writeUint8(246);
		if (value === !0) return w.writeUint8(245);
		if (value === !1) return w.writeUint8(244);
		switch (typeof value) {
			case "number": {
				if (Number.isInteger(value)) {
					if (value >= 0 && value <= 9007199254740992) {
						w.writeMajor(0, value);
					} else if (value < 0 && value >= -9007199254740992) {
						w.writeMajor(1, -(value + 1));
					} else throw new CborNumberError("Number too big to be encoded");
				} else w.writeUint8(251), w.writeFloat64(value);
				return;
			}
			case "bigint": {
				if (value >= 0 && value < POW_2_64) w.writeMajor(0, value);
				else if (value <= 0 && value >= -POW_2_64) {
					w.writeMajor(1, -(value + 1n));
				} else throw new CborNumberError("BigInt too big to be encoded");
				return;
			}
			case "string": {
				textEncoder ??= new TextEncoder();
				let encoded = textEncoder.encode(value);
				w.writeMajor(3, encoded.byteLength), w.writeUint8Array(encoded);
				return;
			}
			default: {
				if (Array.isArray(value)) {
					w.writeMajor(4, value.length);
					for (let v of value) inner(v);
					return;
				}
				if (value instanceof Tagged) {
					w.writeMajor(6, value.tag), inner(value.value);
					return;
				}
				if (value instanceof Encoded) {
					w.writeArrayBuffer(value.encoded);
					return;
				}
				if (value instanceof Gap) {
					if (fillsMap.has(value)) inner(fillsMap.get(value));
					else {
						if (!options.partial) throw new CborPartialDisabled();
						w.chunk(value);
					}
					return;
				}
				if (value instanceof PartiallyEncoded) {
					let res = value.build(options.fills ?? [], options.partial);
					options.partial
						? w.writePartiallyEncoded(res)
						: w.writeArrayBuffer(res);
					return;
				}
				if (
					value instanceof Uint8Array || value instanceof Uint16Array ||
					value instanceof Uint32Array || value instanceof Int8Array ||
					value instanceof Int16Array || value instanceof Int32Array ||
					value instanceof Float32Array || value instanceof Float64Array ||
					value instanceof ArrayBuffer
				) {
					let v = new Uint8Array(value);
					w.writeMajor(2, v.byteLength), w.writeUint8Array(v);
					return;
				}
				let entries = value instanceof Map
					? Array.from(value.entries())
					: Object.entries(value);
				w.writeMajor(5, entries.length);
				for (let v of entries.flat()) inner(v);
			}
		}
	}
	return inner(input), w.output(!!options.partial, options.replacer);
}
var Reader = class {
	_buf;
	_view;
	_byte;
	_pos = 0;
	constructor(buffer) {
		this._buf = new ArrayBuffer(buffer.byteLength),
			this._view = new DataView(this._buf),
			this._byte = new Uint8Array(this._buf),
			this._byte.set(new Uint8Array(buffer));
	}
	read(amount, res) {
		return this._pos += amount, res;
	}
	readUint8() {
		try {
			return this.read(1, this._view.getUint8(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readUint16() {
		try {
			return this.read(2, this._view.getUint16(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readUint32() {
		try {
			return this.read(4, this._view.getUint32(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readUint64() {
		try {
			return this.read(8, this._view.getBigUint64(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readFloat16() {
		let bytes = this.readUint16(),
			s2 = (bytes & 32768) >> 15,
			e = (bytes & 31744) >> 10,
			f2 = bytes & 1023;
		return e === 0
			? (s2 ? -1 : 1) * 2 ** -14 * (f2 / 2 ** 10)
			: e === 31
			? f2 ? Number.NaN : (s2 ? -1 : 1) * Number.POSITIVE_INFINITY
			: (s2 ? -1 : 1) * 2 ** (e - 15) * (1 + f2 / 2 ** 10);
	}
	readFloat32() {
		try {
			return this.read(4, this._view.getFloat32(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readFloat64() {
		try {
			return this.read(8, this._view.getFloat64(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readBytes(amount) {
		let available = this._byte.length - this._pos;
		if (available < amount) {
			throw new CborRangeError(
				`The argument must be between 0 and ${available}`,
			);
		}
		return this.read(amount, this._byte.slice(this._pos, this._pos + amount));
	}
	readMajor() {
		let byte = this.readUint8(), major = byte >> 5;
		if (major < 0 || major > 7) {
			throw new CborInvalidMajorError("Received invalid major type");
		}
		return [major, byte & 31];
	}
	readMajorLength(length) {
		if (length <= 23) return length;
		switch (length) {
			case 24:
				return this.readUint8();
			case 25:
				return this.readUint16();
			case 26:
				return this.readUint32();
			case 27: {
				let read = this.readUint64();
				return read > 9007199254740992 ? read : Number(read);
			}
		}
		throw new CborRangeError("Expected a final length");
	}
};
function infiniteBytes(r2, forMajor) {
	let w = new Writer();
	for (;;) {
		let [major, len] = r2.readMajor();
		if (major === 7 && len === 31) break;
		if (major !== forMajor) {
			throw new CborInvalidMajorError(
				`Expected a resource of the same major (${forMajor}) while processing an infinite resource`,
			);
		}
		if (len === 31) {
			throw new CborRangeError(
				"Expected a finite resource while processing an infinite resource",
			);
		}
		w.writeUint8Array(r2.readBytes(Number(r2.readMajorLength(len))));
	}
	return w.buffer;
}
var textDecoder;
function decode(input, options = {}) {
	let r2 = input instanceof Reader ? input : new Reader(input);
	function inner() {
		let [major, len] = r2.readMajor();
		switch (major) {
			case 0:
				return r2.readMajorLength(len);
			case 1: {
				let l = r2.readMajorLength(len);
				return typeof l == "bigint" ? -(l + 1n) : -(l + 1);
			}
			case 2:
				return len === 31
					? infiniteBytes(r2, 2)
					: r2.readBytes(Number(r2.readMajorLength(len))).buffer;
			case 3: {
				let encoded = len === 31
					? infiniteBytes(r2, 3)
					: r2.readBytes(Number(r2.readMajorLength(len)));
				return textDecoder ??= new TextDecoder(), textDecoder.decode(encoded);
			}
			case 4: {
				if (len === 31) {
					let arr2 = [];
					for (;;) {
						try {
							arr2.push(decode2());
						} catch (e) {
							if (e instanceof CborBreak) break;
							throw e;
						}
					}
					return arr2;
				}
				let l = r2.readMajorLength(len), arr = Array(l);
				for (let i = 0; i < l; i++) arr[i] = decode2();
				return arr;
			}
			case 5: {
				let entries = [];
				if (len === 31) {
					for (;;) {
						let key;
						try {
							key = decode2();
						} catch (e) {
							if (e instanceof CborBreak) break;
							throw e;
						}
						let value = decode2();
						entries.push([key, value]);
					}
				} else {
					let l = r2.readMajorLength(len);
					for (let i = 0; i < l; i++) {
						let key = decode2(), value = decode2();
						entries[i] = [key, value];
					}
				}
				return options.map === "map"
					? new Map(entries)
					: Object.fromEntries(entries);
			}
			case 6: {
				let tag = r2.readMajorLength(len), value = decode2();
				return new Tagged(tag, value);
			}
			case 7:
				switch (len) {
					case 20:
						return !1;
					case 21:
						return !0;
					case 22:
						return null;
					case 23:
						return;
					case 25:
						return r2.readFloat16();
					case 26:
						return r2.readFloat32();
					case 27:
						return r2.readFloat64();
					case 31:
						throw new CborBreak();
				}
		}
		throw new CborInvalidMajorError(
			`Unable to decode value with major tag ${major}`,
		);
	}
	function decode2() {
		return options.replacer ? options.replacer(inner()) : inner();
	}
	return decode2();
}
function dateToCborCustomDate(date) {
	let s2 = Math.floor(date.getTime() / 1e3), ms = date.getTime() - s2 * 1e3;
	return [s2, ms * 1e6];
}
function cborCustomDateToDate([s2, ns]) {
	let date = new Date(0);
	return date.setUTCSeconds(Number(s2)),
		date.setMilliseconds(Math.floor(Number(ns) / 1e6)),
		date;
}
var Decimal = class {
	decimal;
	constructor(decimal) {
		this.decimal = decimal.toString();
	}
	toString() {
		return this.decimal;
	}
	toJSON() {
		return this.decimal;
	}
};
var millisecond = 1,
	microsecond = millisecond / 1e3,
	nanosecond = microsecond / 1e3,
	second = 1e3 * millisecond,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day,
	units = new Map([
		["ns", nanosecond],
		["\xB5s", microsecond],
		["\u03BCs", microsecond],
		["us", microsecond],
		["ms", millisecond],
		["s", second],
		["m", minute],
		["h", hour],
		["d", day],
		["w", week],
	]),
	unitsReverse = Array.from(units).reduce(
		(map, [unit, size]) => (map.set(size, unit), map),
		new Map(),
	),
	durationPartRegex = new RegExp(
		`^(\\d+)(${Array.from(units.keys()).join("|")})`,
	),
	Duration = class _Duration {
		_milliseconds;
		constructor(input) {
			input instanceof _Duration
				? this._milliseconds = input._milliseconds
				: typeof input == "string"
				? this._milliseconds = _Duration.parseString(input)
				: this._milliseconds = input;
		}
		static fromCompact([s2, ns]) {
			s2 = s2 ?? 0, ns = ns ?? 0;
			let ms = s2 * 1e3 + ns / 1e6;
			return new _Duration(ms);
		}
		toCompact() {
			let s2 = Math.floor(this._milliseconds / 1e3),
				ns = Math.floor((this._milliseconds - s2 * 1e3) * 1e6);
			return ns > 0 ? [s2, ns] : s2 > 0 ? [s2] : [];
		}
		toString() {
			let left = this._milliseconds, result = "";
			function scrap(size) {
				let num = Math.floor(left / size);
				return num > 0 && (left = left % size), num;
			}
			for (let [size, unit] of Array.from(unitsReverse).reverse()) {
				let scrapped = scrap(size);
				scrapped > 0 && (result += `${scrapped}${unit}`);
			}
			return result;
		}
		toJSON() {
			return this.toString();
		}
		static parseString(input) {
			let ms = 0, left = input;
			for (; left !== "";) {
				let match = left.match(durationPartRegex);
				if (match) {
					let amount = Number.parseInt(match[1]), factor = units.get(match[2]);
					if (factor === void 0) {
						throw new SurrealDbError(`Invalid duration unit: ${match[2]}`);
					}
					ms += amount * factor, left = left.slice(match[0].length);
					continue;
				}
				throw new SurrealDbError("Could not match a next duration part");
			}
			return ms;
		}
		static nanoseconds(nanoseconds) {
			return new _Duration(Math.floor(nanoseconds * nanosecond));
		}
		static microseconds(microseconds) {
			return new _Duration(Math.floor(microseconds * microsecond));
		}
		static milliseconds(milliseconds) {
			return new _Duration(milliseconds);
		}
		static seconds(seconds) {
			return new _Duration(seconds * second);
		}
		static minutes(minutes) {
			return new _Duration(minutes * minute);
		}
		static hours(hours) {
			return new _Duration(hours * hour);
		}
		static days(days) {
			return new _Duration(days * day);
		}
		static weeks(weeks) {
			return new _Duration(weeks * week);
		}
		get microseconds() {
			return Math.floor(this._milliseconds / microsecond);
		}
		get nanoseconds() {
			return Math.floor(this._milliseconds / nanosecond);
		}
		get milliseconds() {
			return Math.floor(this._milliseconds);
		}
		get seconds() {
			return Math.floor(this._milliseconds / second);
		}
		get minutes() {
			return Math.floor(this._milliseconds / minute);
		}
		get hours() {
			return Math.floor(this._milliseconds / hour);
		}
		get days() {
			return Math.floor(this._milliseconds / day);
		}
		get weeks() {
			return Math.floor(this._milliseconds / week);
		}
	};
var Future = class {
	constructor(inner) {
		this.inner = inner;
	}
	toJSON() {
		return this.toString();
	}
	toString() {
		return `<future> { ${this.inner} }`;
	}
};
var Geometry = class {};
function f(num) {
	return num instanceof Decimal ? Number.parseFloat(num.decimal) : num;
}
var GeometryPoint = class _GeometryPoint extends Geometry {
		point;
		constructor(point) {
			super(),
				point instanceof _GeometryPoint
					? this.point = point.clone().point
					: this.point = [f(point[0]), f(point[1])];
		}
		toJSON() {
			return { type: "Point", coordinates: this.coordinates };
		}
		get coordinates() {
			return this.point;
		}
		is(geometry) {
			return geometry instanceof _GeometryPoint
				? this.point[0] === geometry.point[0] &&
					this.point[1] === geometry.point[1]
				: !1;
		}
		clone() {
			return new _GeometryPoint([...this.point]);
		}
	},
	GeometryLine = class _GeometryLine extends Geometry {
		line;
		constructor(line) {
			super(),
				this.line = line instanceof _GeometryLine ? line.clone().line : line;
		}
		toJSON() {
			return { type: "LineString", coordinates: this.coordinates };
		}
		get coordinates() {
			return this.line.map((g) => g.coordinates);
		}
		close() {
			this.line[0].is(this.line.at(-1)) || this.line.push(this.line[0]);
		}
		is(geometry) {
			if (
				!(geometry instanceof _GeometryLine) ||
				this.line.length !== geometry.line.length
			) return !1;
			for (let i = 0; i < this.line.length; i++) {
				if (!this.line[i].is(geometry.line[i])) return !1;
			}
			return !0;
		}
		clone() {
			return new _GeometryLine(this.line.map((p) => p.clone()));
		}
	},
	GeometryPolygon = class _GeometryPolygon extends Geometry {
		polygon;
		constructor(polygon) {
			super(),
				this.polygon = polygon instanceof _GeometryPolygon
					? polygon.clone().polygon
					: polygon.map((l) => {
						let line = l.clone();
						return line.close(), line;
					});
		}
		toJSON() {
			return { type: "Polygon", coordinates: this.coordinates };
		}
		get coordinates() {
			return this.polygon.map((g) => g.coordinates);
		}
		is(geometry) {
			if (
				!(geometry instanceof _GeometryPolygon) ||
				this.polygon.length !== geometry.polygon.length
			) return !1;
			for (let i = 0; i < this.polygon.length; i++) {
				if (!this.polygon[i].is(geometry.polygon[i])) return !1;
			}
			return !0;
		}
		clone() {
			return new _GeometryPolygon(this.polygon.map((p) => p.clone()));
		}
	},
	GeometryMultiPoint = class _GeometryMultiPoint extends Geometry {
		points;
		constructor(points) {
			super(),
				this.points = points instanceof _GeometryMultiPoint
					? points.points
					: points;
		}
		toJSON() {
			return { type: "MultiPoint", coordinates: this.coordinates };
		}
		get coordinates() {
			return this.points.map((g) => g.coordinates);
		}
		is(geometry) {
			if (
				!(geometry instanceof _GeometryMultiPoint) ||
				this.points.length !== geometry.points.length
			) return !1;
			for (let i = 0; i < this.points.length; i++) {
				if (!this.points[i].is(geometry.points[i])) return !1;
			}
			return !0;
		}
		clone() {
			return new _GeometryMultiPoint(this.points.map((p) => p.clone()));
		}
	},
	GeometryMultiLine = class _GeometryMultiLine extends Geometry {
		lines;
		constructor(lines) {
			super(),
				this.lines = lines instanceof _GeometryMultiLine ? lines.lines : lines;
		}
		toJSON() {
			return { type: "MultiLineString", coordinates: this.coordinates };
		}
		get coordinates() {
			return this.lines.map((g) => g.coordinates);
		}
		is(geometry) {
			if (
				!(geometry instanceof _GeometryMultiLine) ||
				this.lines.length !== geometry.lines.length
			) return !1;
			for (let i = 0; i < this.lines.length; i++) {
				if (!this.lines[i].is(geometry.lines[i])) return !1;
			}
			return !0;
		}
		clone() {
			return new _GeometryMultiLine(this.lines.map((p) => p.clone()));
		}
	},
	GeometryMultiPolygon = class _GeometryMultiPolygon extends Geometry {
		polygons;
		constructor(polygons) {
			super(),
				this.polygons = polygons instanceof _GeometryMultiPolygon
					? polygons.polygons
					: polygons;
		}
		toJSON() {
			return { type: "MultiPolygon", coordinates: this.coordinates };
		}
		get coordinates() {
			return this.polygons.map((g) => g.coordinates);
		}
		is(geometry) {
			if (
				!(geometry instanceof _GeometryMultiPolygon) ||
				this.polygons.length !== geometry.polygons.length
			) return !1;
			for (let i = 0; i < this.polygons.length; i++) {
				if (!this.polygons[i].is(geometry.polygons[i])) return !1;
			}
			return !0;
		}
		clone() {
			return new _GeometryMultiPolygon(this.polygons.map((p) => p.clone()));
		}
	},
	GeometryCollection = class _GeometryCollection extends Geometry {
		collection;
		constructor(collection) {
			super(),
				this.collection = collection instanceof _GeometryCollection
					? collection.collection
					: collection;
		}
		toJSON() {
			return { type: "GeometryCollection", geometries: this.geometries };
		}
		get geometries() {
			return this.collection.map((g) => g.toJSON());
		}
		is(geometry) {
			if (
				!(geometry instanceof _GeometryCollection) ||
				this.collection.length !== geometry.collection.length
			) return !1;
			for (let i = 0; i < this.collection.length; i++) {
				if (!this.collection[i].is(geometry.collection[i])) return !1;
			}
			return !0;
		}
		clone() {
			return new _GeometryCollection(this.collection.map((p) => p.clone()));
		}
	};
var DIGITS = "0123456789abcdef",
	UUID = class _UUID {
		constructor(bytes) {
			this.bytes = bytes;
		}
		static ofInner(bytes) {
			if (bytes.length !== 16) throw new TypeError("not 128-bit length");
			return new _UUID(bytes);
		}
		static fromFieldsV7(unixTsMs, randA, randBHi, randBLo) {
			if (
				!Number.isInteger(unixTsMs) || !Number.isInteger(randA) ||
				!Number.isInteger(randBHi) || !Number.isInteger(randBLo) ||
				unixTsMs < 0 || randA < 0 || randBHi < 0 || randBLo < 0 ||
				unixTsMs > 0xffffffffffff || randA > 4095 || randBHi > 1073741823 ||
				randBLo > 4294967295
			) throw new RangeError("invalid field value");
			let bytes = new Uint8Array(16);
			return bytes[0] = unixTsMs / 2 ** 40,
				bytes[1] = unixTsMs / 2 ** 32,
				bytes[2] = unixTsMs / 2 ** 24,
				bytes[3] = unixTsMs / 2 ** 16,
				bytes[4] = unixTsMs / 2 ** 8,
				bytes[5] = unixTsMs,
				bytes[6] = 112 | randA >>> 8,
				bytes[7] = randA,
				bytes[8] = 128 | randBHi >>> 24,
				bytes[9] = randBHi >>> 16,
				bytes[10] = randBHi >>> 8,
				bytes[11] = randBHi,
				bytes[12] = randBLo >>> 24,
				bytes[13] = randBLo >>> 16,
				bytes[14] = randBLo >>> 8,
				bytes[15] = randBLo,
				new _UUID(bytes);
		}
		static parse(uuid) {
			var _a, _b, _c, _d;
			let hex;
			switch (uuid.length) {
				case 32:
					hex = (_a = /^[0-9a-f]{32}$/i.exec(uuid)) === null || _a === void 0
						? void 0
						: _a[0];
					break;
				case 36:
					hex =
						(_b =
									/^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i
										.exec(uuid)) === null || _b === void 0
							? void 0
							: _b.slice(1, 6).join("");
					break;
				case 38:
					hex =
						(_c =
									/^\{([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\}$/i
										.exec(uuid)) === null || _c === void 0
							? void 0
							: _c.slice(1, 6).join("");
					break;
				case 45:
					hex =
						(_d =
									/^urn:uuid:([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i
										.exec(uuid)) === null || _d === void 0
							? void 0
							: _d.slice(1, 6).join("");
					break;
				default:
					break;
			}
			if (hex) {
				let inner = new Uint8Array(16);
				for (let i = 0; i < 16; i += 4) {
					let n = parseInt(hex.substring(2 * i, 2 * i + 8), 16);
					inner[i + 0] = n >>> 24,
						inner[i + 1] = n >>> 16,
						inner[i + 2] = n >>> 8,
						inner[i + 3] = n;
				}
				return new _UUID(inner);
			} else throw new SyntaxError("could not parse UUID string");
		}
		toString() {
			let text = "";
			for (let i = 0; i < this.bytes.length; i++) {
				text += DIGITS.charAt(this.bytes[i] >>> 4),
					text += DIGITS.charAt(this.bytes[i] & 15),
					(i === 3 || i === 5 || i === 7 || i === 9) && (text += "-");
			}
			return text;
		}
		toHex() {
			let text = "";
			for (let i = 0; i < this.bytes.length; i++) {
				text += DIGITS.charAt(this.bytes[i] >>> 4),
					text += DIGITS.charAt(this.bytes[i] & 15);
			}
			return text;
		}
		toJSON() {
			return this.toString();
		}
		getVariant() {
			let n = this.bytes[8] >>> 4;
			if (n < 0) throw new Error("unreachable");
			if (n <= 7) return this.bytes.every((e) => e === 0) ? "NIL" : "VAR_0";
			if (n <= 11) return "VAR_10";
			if (n <= 13) return "VAR_110";
			if (n <= 15) {
				return this.bytes.every((e) => e === 255) ? "MAX" : "VAR_RESERVED";
			}
			throw new Error("unreachable");
		}
		getVersion() {
			return this.getVariant() === "VAR_10" ? this.bytes[6] >>> 4 : void 0;
		}
		clone() {
			return new _UUID(this.bytes.slice(0));
		}
		equals(other) {
			return this.compareTo(other) === 0;
		}
		compareTo(other) {
			for (let i = 0; i < 16; i++) {
				let diff = this.bytes[i] - other.bytes[i];
				if (diff !== 0) return Math.sign(diff);
			}
			return 0;
		}
	},
	V7Generator = class {
		constructor(randomNumberGenerator) {
			this.timestamp = 0,
				this.counter = 0,
				this.random = randomNumberGenerator ?? getDefaultRandom();
		}
		generate() {
			return this.generateOrResetCore(Date.now(), 1e4);
		}
		generateOrAbort() {
			return this.generateOrAbortCore(Date.now(), 1e4);
		}
		generateOrResetCore(unixTsMs, rollbackAllowance) {
			let value = this.generateOrAbortCore(unixTsMs, rollbackAllowance);
			return value === void 0 &&
				(this.timestamp = 0,
					value = this.generateOrAbortCore(unixTsMs, rollbackAllowance)),
				value;
		}
		generateOrAbortCore(unixTsMs, rollbackAllowance) {
			if (
				!Number.isInteger(unixTsMs) || unixTsMs < 1 || unixTsMs > 0xffffffffffff
			) throw new RangeError("`unixTsMs` must be a 48-bit positive integer");
			if (rollbackAllowance < 0 || rollbackAllowance > 0xffffffffffff) {
				throw new RangeError("`rollbackAllowance` out of reasonable range");
			}
			if (unixTsMs > this.timestamp) {
				this.timestamp = unixTsMs, this.resetCounter();
			} else if (unixTsMs + rollbackAllowance >= this.timestamp) {
				this.counter++,
					this.counter > 4398046511103 &&
					(this.timestamp++, this.resetCounter());
			} else return;
			return UUID.fromFieldsV7(
				this.timestamp,
				Math.trunc(this.counter / 2 ** 30),
				this.counter & 2 ** 30 - 1,
				this.random.nextUint32(),
			);
		}
		resetCounter() {
			this.counter = this.random.nextUint32() * 1024 +
				(this.random.nextUint32() & 1023);
		}
		generateV4() {
			let bytes = new Uint8Array(
				Uint32Array.of(
					this.random.nextUint32(),
					this.random.nextUint32(),
					this.random.nextUint32(),
					this.random.nextUint32(),
				).buffer,
			);
			return bytes[6] = 64 | bytes[6] >>> 4,
				bytes[8] = 128 | bytes[8] >>> 2,
				UUID.ofInner(bytes);
		}
	},
	getDefaultRandom = () => {
		if (typeof crypto < "u" && typeof crypto.getRandomValues < "u") {
			return new BufferedCryptoRandom();
		}
		if (typeof UUIDV7_DENY_WEAK_RNG < "u" && UUIDV7_DENY_WEAK_RNG) {
			throw new Error("no cryptographically strong RNG available");
		}
		return {
			nextUint32: () =>
				Math.trunc(Math.random() * 65536) * 65536 +
				Math.trunc(Math.random() * 65536),
		};
	},
	BufferedCryptoRandom = class {
		constructor() {
			this.buffer = new Uint32Array(8), this.cursor = 65535;
		}
		nextUint32() {
			return this.cursor >= this.buffer.length &&
				(crypto.getRandomValues(this.buffer), this.cursor = 0),
				this.buffer[this.cursor++];
		}
	},
	defaultGenerator;
var uuidv7obj = () =>
	(defaultGenerator || (defaultGenerator = new V7Generator())).generate();
var uuidv4obj = () =>
	(defaultGenerator || (defaultGenerator = new V7Generator())).generateV4();
var Uuid = class _Uuid {
	inner;
	constructor(uuid) {
		uuid instanceof ArrayBuffer
			? this.inner = UUID.ofInner(new Uint8Array(uuid))
			: uuid instanceof Uint8Array
			? this.inner = UUID.ofInner(uuid)
			: uuid instanceof _Uuid
			? this.inner = uuid.inner
			: uuid instanceof UUID
			? this.inner = uuid
			: this.inner = UUID.parse(uuid);
	}
	toString() {
		return this.inner.toString();
	}
	toJSON() {
		return this.inner.toString();
	}
	toUint8Array() {
		return this.inner.bytes;
	}
	toBuffer() {
		return this.inner.bytes.buffer;
	}
	static v4() {
		return new _Uuid(uuidv4obj());
	}
	static v7() {
		return new _Uuid(uuidv7obj());
	}
};
var MAX_i64 = 9223372036854775807n,
	RecordId = class {
		tb;
		id;
		constructor(tb, id2) {
			if (typeof tb != "string") {
				throw new SurrealDbError("TB part is not valid");
			}
			if (!isValidIdPart(id2)) throw new SurrealDbError("ID part is not valid");
			this.tb = tb, this.id = id2;
		}
		toJSON() {
			return this.toString();
		}
		toString() {
			let tb = escape_ident(this.tb), id2 = escape_id_part(this.id);
			return `${tb}:${id2}`;
		}
	},
	StringRecordId = class {
		rid;
		constructor(rid) {
			if (typeof rid != "string") {
				throw new SurrealDbError("String Record ID must be a string");
			}
			this.rid = rid;
		}
		toJSON() {
			return this.rid;
		}
		toString() {
			return this.rid;
		}
	};
function escape_number(num) {
	return num <= MAX_i64 ? num.toString() : `\u27E8${num}\u27E9`;
}
function escape_ident(str) {
	if (isOnlyNumbers(str)) return `\u27E8${str}\u27E9`;
	let code, i, len;
	for (i = 0, len = str.length; i < len; i++) {
		if (
			code = str.charCodeAt(i),
				!(code > 47 && code < 58) && !(code > 64 && code < 91) &&
				!(code > 96 && code < 123) && code !== 95
		) return `\u27E8${str.replaceAll("\u27E9", "\u27E9")}\u27E9`;
	}
	return str;
}
function isOnlyNumbers(str) {
	let parsed = Number.parseInt(str);
	return !Number.isNaN(parsed) && parsed.toString() === str;
}
function isValidIdPart(v) {
	if (v instanceof Uuid) return !0;
	switch (typeof v) {
		case "string":
		case "number":
		case "bigint":
			return !0;
		case "object":
			return Array.isArray(v) || v !== null;
		default:
			return !1;
	}
}
function escape_id_part(id2) {
	return id2 instanceof Uuid
		? `d"${id2}"`
		: typeof id2 == "string"
		? escape_ident(id2)
		: typeof id2 == "bigint" || typeof id2 == "number"
		? escape_number(id2)
		: toSurrealqlString(id2);
}
var Table = class {
	tb;
	constructor(tb) {
		if (typeof tb != "string") {
			throw new SurrealDbError("Table must be a string");
		}
		this.tb = tb;
	}
	toJSON() {
		return this.tb;
	}
	toString() {
		return this.tb;
	}
};
function toSurrealqlString(input) {
	if (typeof input == "string") return `s${JSON.stringify(input)}`;
	if (input === null) return "NULL";
	if (input === void 0) return "NONE";
	if (typeof input == "object") {
		if (input instanceof Date) return `d${JSON.stringify(input.toISOString())}`;
		if (input instanceof Uuid) return `u${JSON.stringify(input.toString())}`;
		if (input instanceof RecordId || input instanceof StringRecordId) {
			return `r${JSON.stringify(input.toString())}`;
		}
		if (input instanceof Geometry) return toSurrealqlString(input.toJSON());
		if (
			input instanceof Decimal || input instanceof Duration ||
			input instanceof Future || input instanceof Range ||
			input instanceof Table
		) return input.toJSON();
		switch (Object.getPrototypeOf(input)) {
			case Object.prototype: {
				let output2 = "{ ", entries = Object.entries(input);
				for (let [i, [k, v]] of entries.entries()) {
					output2 += `${JSON.stringify(k)}: ${toSurrealqlString(v)}`,
						i < entries.length - 1 && (output2 += ", ");
				}
				return output2 += " }", output2;
			}
			case Map.prototype: {
				let output2 = "{ ", entries = Array.from(input.entries());
				for (let [i, [k, v]] of entries.entries()) {
					output2 += `${JSON.stringify(k)}: ${toSurrealqlString(v)}`,
						i < entries.length - 1 && (output2 += ", ");
				}
				return output2 += " }", output2;
			}
			case Array.prototype:
				return `[ ${input.map(toSurrealqlString).join(", ")} ]`;
			case Set.prototype:
				return `[ ${
					[...new Set([...input].map(toSurrealqlString))].join(", ")
				} ]`;
		}
	}
	return `${input}`;
}
var Range = class {
		constructor(beg, end) {
			this.beg = beg;
			this.end = end;
		}
		toJSON() {
			return this.toString();
		}
		toString() {
			let beg = escape_range_bound(this.beg),
				end = escape_range_bound(this.end);
			return `${beg}${getRangeJoin(this.beg, this.end)}${end}`;
		}
	},
	BoundIncluded = class {
		constructor(value) {
			this.value = value;
		}
	},
	BoundExcluded = class {
		constructor(value) {
			this.value = value;
		}
	},
	RecordIdRange = class {
		constructor(tb, beg, end) {
			this.tb = tb;
			this.beg = beg;
			this.end = end;
			if (typeof tb != "string") {
				throw new SurrealDbError("TB part is not valid");
			}
			if (!isValidIdBound(beg)) {
				throw new SurrealDbError("Beg part is not valid");
			}
			if (!isValidIdBound(end)) {
				throw new SurrealDbError("End part is not valid");
			}
		}
		toJSON() {
			return this.toString();
		}
		toString() {
			let tb = escape_ident(this.tb),
				beg = escape_id_bound(this.beg),
				end = escape_id_bound(this.end);
			return `${tb}:${beg}${getRangeJoin(this.beg, this.end)}${end}`;
		}
	};
function getRangeJoin(beg, end) {
	let output2 = "";
	return beg instanceof BoundExcluded && (output2 += ">"),
		output2 += "..",
		end instanceof BoundIncluded && (output2 += "="),
		output2;
}
function isValidIdBound(bound) {
	return bound instanceof BoundIncluded || bound instanceof BoundExcluded
		? isValidIdPart(bound.value)
		: !0;
}
function escape_id_bound(bound) {
	return bound instanceof BoundIncluded || bound instanceof BoundExcluded
		? escape_id_part(bound.value)
		: "";
}
function escape_range_bound(bound) {
	if (bound === void 0) return "";
	let value = bound.value;
	return bound instanceof Range
		? `(${toSurrealqlString(value)})`
		: toSurrealqlString(value);
}
function rangeToCbor([beg, end]) {
	function encodeBound(bound) {
		return bound instanceof BoundIncluded
			? new Tagged(TAG_BOUND_INCLUDED, bound.value)
			: bound instanceof BoundExcluded
			? new Tagged(TAG_BOUND_EXCLUDED, bound.value)
			: null;
	}
	return [encodeBound(beg), encodeBound(end)];
}
function cborToRange(range) {
	function decodeBound(bound) {
		if (bound !== null) {
			if (bound.tag === TAG_BOUND_INCLUDED) {
				return new BoundIncluded(bound.value);
			}
			if (bound.tag === TAG_BOUND_EXCLUDED) {
				return new BoundExcluded(bound.value);
			}
			throw new SurrealDbError("Invalid bound tag");
		}
	}
	return [decodeBound(range[0]), decodeBound(range[1])];
}
var TAG_SPEC_DATETIME = 0,
	TAG_SPEC_UUID = 37,
	TAG_NONE = 6,
	TAG_TABLE = 7,
	TAG_RECORDID = 8,
	TAG_STRING_UUID = 9,
	TAG_STRING_DECIMAL = 10,
	TAG_CUSTOM_DATETIME = 12,
	TAG_STRING_DURATION = 13,
	TAG_CUSTOM_DURATION = 14,
	TAG_FUTURE = 15,
	TAG_RANGE2 = 49,
	TAG_BOUND_INCLUDED = 50,
	TAG_BOUND_EXCLUDED = 51,
	TAG_GEOMETRY_POINT = 88,
	TAG_GEOMETRY_LINE = 89,
	TAG_GEOMETRY_POLYGON = 90,
	TAG_GEOMETRY_MULTIPOINT = 91,
	TAG_GEOMETRY_MULTILINE = 92,
	TAG_GEOMETRY_MULTIPOLYGON = 93,
	TAG_GEOMETRY_COLLECTION = 94,
	replacer = {
		encode(v) {
			return v instanceof Date
				? new Tagged(TAG_CUSTOM_DATETIME, dateToCborCustomDate(v))
				: v === void 0
				? new Tagged(TAG_NONE, null)
				: v instanceof Uuid
				? new Tagged(TAG_SPEC_UUID, v.toBuffer())
				: v instanceof Decimal
				? new Tagged(TAG_STRING_DECIMAL, v.toString())
				: v instanceof Duration
				? new Tagged(TAG_CUSTOM_DURATION, v.toCompact())
				: v instanceof RecordId
				? new Tagged(TAG_RECORDID, [v.tb, v.id])
				: v instanceof StringRecordId
				? new Tagged(TAG_RECORDID, v.rid)
				: v instanceof RecordIdRange
				? new Tagged(TAG_RECORDID, [
					v.tb,
					new Tagged(TAG_RANGE2, rangeToCbor([v.beg, v.end])),
				])
				: v instanceof Table
				? new Tagged(TAG_TABLE, v.tb)
				: v instanceof Future
				? new Tagged(TAG_FUTURE, v.inner)
				: v instanceof Range
				? new Tagged(TAG_RANGE2, rangeToCbor([v.beg, v.end]))
				: v instanceof GeometryPoint
				? new Tagged(TAG_GEOMETRY_POINT, v.point)
				: v instanceof GeometryLine
				? new Tagged(TAG_GEOMETRY_LINE, v.line)
				: v instanceof GeometryPolygon
				? new Tagged(TAG_GEOMETRY_POLYGON, v.polygon)
				: v instanceof GeometryMultiPoint
				? new Tagged(TAG_GEOMETRY_MULTIPOINT, v.points)
				: v instanceof GeometryMultiLine
				? new Tagged(TAG_GEOMETRY_MULTILINE, v.lines)
				: v instanceof GeometryMultiPolygon
				? new Tagged(TAG_GEOMETRY_MULTIPOLYGON, v.polygons)
				: v instanceof GeometryCollection
				? new Tagged(TAG_GEOMETRY_COLLECTION, v.collection)
				: v;
		},
		decode(v) {
			if (!(v instanceof Tagged)) return v;
			switch (v.tag) {
				case TAG_SPEC_DATETIME:
					return new Date(v.value);
				case TAG_SPEC_UUID:
				case TAG_STRING_UUID:
					return new Uuid(v.value);
				case TAG_CUSTOM_DATETIME:
					return cborCustomDateToDate(v.value);
				case TAG_NONE:
					return;
				case TAG_STRING_DECIMAL:
					return new Decimal(v.value);
				case TAG_STRING_DURATION:
					return new Duration(v.value);
				case TAG_CUSTOM_DURATION:
					return Duration.fromCompact(v.value);
				case TAG_TABLE:
					return new Table(v.value);
				case TAG_FUTURE:
					return new Future(v.value);
				case TAG_RANGE2:
					return new Range(...cborToRange(v.value));
				case TAG_RECORDID:
					return v.value[1] instanceof Range
						? new RecordIdRange(v.value[0], v.value[1].beg, v.value[1].end)
						: new RecordId(v.value[0], v.value[1]);
				case TAG_GEOMETRY_POINT:
					return new GeometryPoint(v.value);
				case TAG_GEOMETRY_LINE:
					return new GeometryLine(v.value);
				case TAG_GEOMETRY_POLYGON:
					return new GeometryPolygon(v.value);
				case TAG_GEOMETRY_MULTIPOINT:
					return new GeometryMultiPoint(v.value);
				case TAG_GEOMETRY_MULTILINE:
					return new GeometryMultiLine(v.value);
				case TAG_GEOMETRY_MULTIPOLYGON:
					return new GeometryMultiPolygon(v.value);
				case TAG_GEOMETRY_COLLECTION:
					return new GeometryCollection(v.value);
			}
		},
	};
Object.freeze(replacer);
function encodeCbor(data) {
	return encode(data, { replacer: replacer.encode });
}
function decodeCbor(data) {
	return decode(data, { replacer: replacer.decode });
}
var textEncoder2,
	PreparedQuery = class {
		_query;
		_bindings;
		length;
		constructor(query, bindings) {
			textEncoder2 ??= new TextEncoder(),
				this._query = textEncoder2.encode(query),
				this._bindings = partiallyEncodeObject(bindings ?? {}, {
					replacer: replacer.encode,
				}),
				this.length = Object.keys(this._bindings).length;
		}
		get query() {
			let w = new Writer(this._query.byteLength + 9);
			return w.writeMajor(3, this._query.byteLength),
				w.writeUint8Array(this._query),
				new Encoded(w.output(!1));
		}
		get bindings() {
			return this._bindings;
		}
		build(fills) {
			return encode([this.query, this.bindings], { fills });
		}
		append(query_raw, ...values) {
			let base = this.length;
			this.length += values.length;
			let mapped_bindings = values.map((v, i) => [`bind___${base + i}`, v]);
			for (let [k, v] of mapped_bindings) {
				this._bindings[k] = encode(v, {
					replacer: replacer.encode,
					partial: !0,
				});
			}
			let query = query_raw.flatMap((segment, i) => {
				let variable = mapped_bindings[i]?.[0];
				return [segment, ...variable ? [`$${variable}`] : []];
			}).join("");
			textEncoder2 ??= new TextEncoder();
			let current = new Uint8Array(this._query),
				added = textEncoder2.encode(query);
			return this._query = new Uint8Array(
				current.byteLength + added.byteLength,
			),
				this._query.set(current),
				this._query.set(added, current.byteLength),
				this;
		}
	};
function surrealql(query_raw, ...values) {
	let mapped_bindings = values.map((v, i) => [`bind___${i}`, v]),
		bindings = mapped_bindings.reduce(
			(prev, [k, v]) => (prev[k] = v, prev),
			{},
		),
		query = query_raw.flatMap((segment, i) => {
			let variable = mapped_bindings[i]?.[0];
			return [segment, ...variable ? [`$${variable}`] : []];
		}).join("");
	return new PreparedQuery(query, bindings);
}
function convertAuth(params) {
	let result = {},
		convertString = (a, b, optional) => {
			if (a in params) result[b] = `${params[a]}`, delete result[a];
			else if (optional !== !0) {
				throw new SurrealDbError(
					`Key ${a} is missing from the authentication parameters`,
				);
			}
		};
	return "scope" in params
		? (result = { ...params },
			convertString("scope", "sc"),
			convertString("namespace", "ns"),
			convertString("database", "db"))
		: "variables" in params
		? (result = { ...params.variables },
			convertString("access", "ac"),
			convertString("namespace", "ns"),
			convertString("database", "db"))
		: (convertString("access", "ac", !0),
			convertString("database", "db", !0),
			convertString("namespace", "ns", !("database" in params)),
			convertString("username", "user"),
			convertString("password", "pass")),
		result;
}
var liveActions = ["CREATE", "UPDATE", "DELETE"];
function isLiveResult(v) {
	return !(typeof v != "object" || v === null ||
		!("id" in v && "action" in v && "result" in v) || !(v.id instanceof Uuid) ||
		!liveActions.includes(v.action) || typeof v.result != "object" ||
		v.result === null);
}
function jsonify(input) {
	if (typeof input == "object") {
		if (input === null) return null;
		if (
			input instanceof Date || input instanceof Uuid ||
			input instanceof Decimal || input instanceof Duration ||
			input instanceof Future || input instanceof Range ||
			input instanceof StringRecordId || input instanceof RecordIdRange ||
			input instanceof RecordId || input instanceof Geometry ||
			input instanceof Table
		) return input.toJSON();
		switch (Object.getPrototypeOf(input)) {
			case Object.prototype: {
				let mapped = Object.entries(input).map(([k, v]) => [k, jsonify(v)])
					.filter(([_, v]) => v !== void 0);
				return Object.fromEntries(mapped);
			}
			case Map.prototype: {
				let mapped = Array.from(input).map(([k, v]) => [k, jsonify(v)]).filter((
					[_, v],
				) => v !== void 0);
				return new Map(mapped);
			}
			case Array.prototype:
				return input.map(jsonify);
			case Set.prototype:
				return new Set([...input].map(jsonify));
		}
	}
	return input;
}
var defaultVersionCheckTimeout = 5e3,
	supportedSurrealDbVersionMin = "1.4.2",
	supportedSurrealDbVersionUntil = "3.0.0",
	supportedSurrealDbVersionRange =
		`>= ${supportedSurrealDbVersionMin} < ${supportedSurrealDbVersionUntil}`;
function versionCheck(
	version,
	min = supportedSurrealDbVersionMin,
	until = supportedSurrealDbVersionUntil,
) {
	if (!isVersionSupported(version, min, until)) {
		throw new UnsupportedVersion(version, `>= ${min} < ${until}`);
	}
	return !0;
}
function isVersionSupported(
	version,
	min = supportedSurrealDbVersionMin,
	until = supportedSurrealDbVersionUntil,
) {
	return min.localeCompare(version, void 0, { numeric: !0 }) <= 0 &&
		until.localeCompare(version, void 0, { numeric: !0 }) === 1;
}
async function retrieveRemoteVersion(url, timeout) {
	let protocol = {
		"ws:": "http:",
		"wss:": "https:",
		"http:": "http:",
		"https:": "https:",
	}[url.protocol];
	if (protocol) {
		let basepath = url.pathname.slice(0, -4);
		url = new URL(url),
			url.pathname = `${basepath}/version`,
			url.protocol = protocol;
		let controller = new AbortController(),
			id2 = setTimeout(
				() => controller.abort(),
				timeout ?? defaultVersionCheckTimeout,
			),
			versionPrefix = "surrealdb-";
		return await fetch(url, { signal: controller.signal }).then((res) =>
			res.text()
		).then((version2) => version2.slice(versionPrefix.length)).catch((e) => {
			throw new VersionRetrievalFailure(e);
		}).finally(() => {
			clearTimeout(id2);
		});
	}
	throw new VersionRetrievalFailure();
}
var id = 0;
function getIncrementalID() {
	return id = (id + 1) % Number.MAX_SAFE_INTEGER, id.toString();
}
function s(string, ...values) {
	return string.reduce(
		(prev, curr, i) => `${prev}${curr}${values[i] ?? ""}`,
		"",
	);
}
function d(string, ...values) {
	return new Date(s(string, values));
}
function r(string, ...values) {
	return new StringRecordId(s(string, values));
}
function u(string, ...values) {
	return new Uuid(s(string, values));
}
var ConnectionStatus = ((
		ConnectionStatus2,
	) => (ConnectionStatus2.Disconnected = "disconnected",
		ConnectionStatus2.Connecting = "connecting",
		ConnectionStatus2.Connected = "connected",
		ConnectionStatus2.Error = "error",
		ConnectionStatus2))(ConnectionStatus || {}),
	EngineContext = class {
		emitter;
		encodeCbor;
		decodeCbor;
		constructor({ emitter, encodeCbor: encodeCbor2, decodeCbor: decodeCbor2 }) {
			this.emitter = emitter,
				this.encodeCbor = encodeCbor2,
				this.decodeCbor = decodeCbor2;
		}
	},
	AbstractEngine = class {
		context;
		ready;
		status = "disconnected";
		connection = {
			url: void 0,
			namespace: void 0,
			database: void 0,
			token: void 0,
		};
		constructor(context) {
			this.context = context;
		}
		get emitter() {
			return this.context.emitter;
		}
		get encodeCbor() {
			return this.context.encodeCbor;
		}
		get decodeCbor() {
			return this.context.decodeCbor;
		}
	};
function processAuthVars(vars, fallback) {
	if (
		"scope" in vars || "access" in vars && "variables" in vars && vars.variables
	) {
		if (!vars.namespace) {
			if (!fallback?.namespace) throw new NoNamespaceSpecified();
			vars.namespace = fallback.namespace;
		}
		if (!vars.database) {
			if (!fallback?.database) throw new NoDatabaseSpecified();
			vars.database = fallback.database;
		}
	}
	return vars;
}
var ALWAYS_ALLOW = new Set([
		"signin",
		"signup",
		"authenticate",
		"invalidate",
		"version",
		"use",
		"let",
		"unset",
		"query",
	]),
	HttpEngine = class extends AbstractEngine {
		connection = {
			url: void 0,
			namespace: void 0,
			database: void 0,
			token: void 0,
			variables: {},
		};
		setStatus(status, ...args) {
			this.status = status, this.emitter.emit(status, args);
		}
		version(url, timeout) {
			return retrieveRemoteVersion(url, timeout);
		}
		connect(url) {
			return this.setStatus("connecting"),
				this.connection.url = url,
				this.setStatus("connected"),
				this.ready = new Promise((r2) => r2()),
				this.ready;
		}
		disconnect() {
			return this.connection = {
				url: void 0,
				namespace: void 0,
				database: void 0,
				token: void 0,
				variables: {},
			},
				this.ready = void 0,
				this.setStatus("disconnected"),
				new Promise((r2) => r2());
		}
		async rpc(request) {
			if (await this.ready, !this.connection.url) {
				throw new ConnectionUnavailable();
			}
			if (
				(!this.connection.namespace || !this.connection.database) &&
				!ALWAYS_ALLOW.has(request.method)
			) throw new MissingNamespaceDatabase();
			if (request.method === "use") {
				let [ns, db] = request.params;
				return ns === null && (this.connection.namespace = void 0),
					db === null && (this.connection.database = void 0),
					ns && (this.connection.namespace = ns),
					db && (this.connection.database = db),
					{ result: !0 };
			}
			if (request.method === "let") {
				let [key, value] = request.params;
				return this.connection.variables[key] = value, { result: !0 };
			}
			if (request.method === "unset") {
				let [key] = request.params;
				return delete this.connection.variables[key], { result: !0 };
			}
			request.method === "query" &&
				(request.params = [request.params?.[0], {
					...this.connection.variables,
					...request.params?.[1] ?? {},
				}]);
			let id2 = getIncrementalID(),
				headers = {
					"Content-Type": "application/cbor",
					Accept: "application/cbor",
				};
			this.connection.namespace &&
			(headers["Surreal-NS"] = this.connection.namespace),
				this.connection.database &&
				(headers["Surreal-DB"] = this.connection.database),
				this.connection.token &&
				(headers.Authorization = `Bearer ${this.connection.token}`);
			let raw = await fetch(`${this.connection.url}`, {
					method: "POST",
					headers,
					body: this.encodeCbor({ id: id2, ...request }),
				}),
				buffer = await raw.arrayBuffer();
			if (raw.status === 200) {
				let response = this.decodeCbor(buffer);
				if ("result" in response) {
					switch (request.method) {
						case "signin":
						case "signup": {
							this.connection.token = response.result;
							break;
						}
						case "authenticate": {
							let [token] = request.params;
							this.connection.token = token;
							break;
						}
						case "invalidate": {
							this.connection.token = void 0;
							break;
						}
					}
				}
				return this.emitter.emit(`rpc-${id2}`, [response]), response;
			}
			let dec = new TextDecoder("utf-8");
			throw new HttpConnectionError(
				dec.decode(buffer),
				raw.status,
				raw.statusText,
				buffer,
			);
		}
		get connected() {
			return !!this.connection.url;
		}
	};
function getNativeWebSocket() {
	if (typeof WebSocket < "u") return WebSocket;
	if (typeof global.WebSocket < "u") return global.WebSocket;
	if (typeof window.WebSocket < "u") return window.WebSocket;
	if (typeof self.WebSocket < "u") return self.WebSocket;
	throw new Error("`WebSocket` is not supported in this environment");
}
var WebSocket2 = getNativeWebSocket();
var WebsocketEngine = class extends AbstractEngine {
		pinger;
		socket;
		constructor(context) {
			super(context),
				this.emitter.subscribe("disconnected", () => this.pinger?.stop());
		}
		setStatus(status, ...args) {
			this.status = status, this.emitter.emit(status, args);
		}
		async requireStatus(status) {
			return this.status !== status && await this.emitter.subscribeOnce(status),
				!0;
		}
		version(url, timeout) {
			return retrieveRemoteVersion(url, timeout);
		}
		async connect(url) {
			this.connection.url = url, this.setStatus("connecting");
			let socket = new WebSocket2(url.toString(), "cbor"),
				ready = new Promise((resolve, reject) => {
					socket.addEventListener("open", () => {
						this.setStatus("connected"), resolve();
					}),
						socket.addEventListener("error", (e) => {
							let error = new UnexpectedConnectionError(
								"error" in e ? e.error : "An unexpected error occurred",
							);
							this.setStatus("error", error), reject(error);
						}),
						socket.addEventListener("close", () => {
							this.setStatus("disconnected");
						}),
						socket.addEventListener("message", async ({ data }) => {
							try {
								let decoded = this.decodeCbor(
									data instanceof Blob
										? await data.arrayBuffer()
										: data.buffer.slice(
											data.byteOffset,
											data.byteOffset + data.byteLength,
										),
								);
								if (
									typeof decoded == "object" && decoded != null &&
									Object.getPrototypeOf(decoded) === Object.prototype
								) this.handleRpcResponse(decoded);
								else throw new UnexpectedServerResponse(decoded);
							} catch (detail) {
								socket.dispatchEvent(new CustomEvent("error", { detail }));
							}
						});
				});
			return this.ready = ready,
				await ready.then(() => {
					this.socket = socket,
						this.pinger?.stop(),
						this.pinger = new Pinger(3e4),
						this.pinger.start(() => this.rpc({ method: "ping" }));
				});
		}
		async disconnect() {
			this.connection = {
				url: void 0,
				namespace: void 0,
				database: void 0,
				token: void 0,
			},
				await this.ready?.catch(() => {}),
				this.socket?.close(),
				this.ready = void 0,
				this.socket = void 0,
				await Promise.any([
					this.requireStatus("disconnected"),
					this.requireStatus("error"),
				]);
		}
		async rpc(request) {
			if (await this.ready, !this.socket) throw new ConnectionUnavailable();
			let id2 = getIncrementalID(),
				response = this.emitter.subscribeOnce(`rpc-${id2}`);
			this.socket.send(this.encodeCbor({ id: id2, ...request }));
			let [res] = await response;
			if (res instanceof EngineDisconnected) throw res;
			if ("result" in res) {
				switch (request.method) {
					case "use": {
						let [ns, db] = request.params;
						ns === null && (this.connection.namespace = void 0),
							db === null && (this.connection.database = void 0),
							ns && (this.connection.namespace = ns),
							db && (this.connection.database = db);
						break;
					}
					case "signin":
					case "signup": {
						this.connection.token = res.result;
						break;
					}
					case "authenticate": {
						let [token] = request.params;
						this.connection.token = token;
						break;
					}
					case "invalidate": {
						this.connection.token = void 0;
						break;
					}
				}
			}
			return res;
		}
		handleRpcResponse({ id: id2, ...res }) {
			if (id2) this.emitter.emit(`rpc-${id2}`, [res]);
			else if (res.error) this.setStatus("error", new ResponseError(res.error));
			else if (isLiveResult(res.result)) {
				let { id: id3, action, result } = res.result;
				this.emitter.emit(`live-${id3}`, [action, result], !0);
			} else {this.setStatus(
					"error",
					new UnexpectedServerResponse({ id: id2, ...res }),
				);}
		}
		get connected() {
			return !!this.socket;
		}
	},
	Pinger = class {
		pinger;
		interval;
		constructor(interval = 3e4) {
			this.interval = interval;
		}
		start(callback) {
			this.pinger = setInterval(callback, this.interval);
		}
		stop() {
			clearInterval(this.pinger);
		}
	};
var Surreal = class {
	connection;
	ready;
	emitter;
	engines = {
		ws: WebsocketEngine,
		wss: WebsocketEngine,
		http: HttpEngine,
		https: HttpEngine,
	};
	constructor({ engines } = {}) {
		this.emitter = new Emitter(),
			this.emitter.subscribe("disconnected", () => this.clean()),
			this.emitter.subscribe("error", () => this.close()),
			engines && (this.engines = { ...this.engines, ...engines });
	}
	async connect(url, opts = {}) {
		url = new URL(url),
			url.pathname.endsWith("/rpc") ||
			(url.pathname.endsWith("/") || (url.pathname += "/"),
				url.pathname += "rpc");
		let engineName = url.protocol.slice(0, -1),
			engine = this.engines[engineName];
		if (!engine) throw new UnsupportedEngine(engineName);
		let { prepare, auth, namespace, database } = opts;
		await this.close();
		let context = new EngineContext({
				emitter: this.emitter,
				encodeCbor,
				decodeCbor,
			}),
			connection = new engine(context);
		if (opts.versionCheck !== !1) {
			let version = await connection.version(url, opts.versionCheckTimeout);
			versionCheck(version);
		}
		return this.connection = connection,
			this.ready = new Promise((resolve, reject) =>
				connection.connect(url).then(async () => {
					(namespace || database) && await this.use({ namespace, database }),
						typeof auth == "string"
							? await this.authenticate(auth)
							: auth && await this.signin(auth),
						await prepare?.(this),
						resolve();
				}).catch(reject)
			),
			await this.ready,
			!0;
	}
	async close() {
		return this.clean(), await this.connection?.disconnect(), !0;
	}
	clean() {
		let pending = this.emitter.scanListeners((k) => k.startsWith("rpc-"));
		pending.map((k) => this.emitter.emit(k, [new EngineDisconnected()]));
		let live = this.emitter.scanListeners((k) => k.startsWith("live-"));
		live.map((k) => this.emitter.emit(k, ["CLOSE", "disconnected"])),
			this.emitter.reset({ collectable: !0, listeners: [...pending, ...live] });
	}
	get status() {
		return this.connection?.status ?? "disconnected";
	}
	async ping() {
		let { error } = await this.rpc("ping");
		if (error) throw new ResponseError(error.message);
		return !0;
	}
	async use({ namespace, database }) {
		if (!this.connection) throw new NoActiveSocket();
		if (namespace === null && database !== null) {
			throw new SurrealDbError(
				"Cannot unset namespace without unsetting database",
			);
		}
		let { error } = await this.rpc("use", [namespace, database]);
		if (error) throw new ResponseError(error.message);
		return !0;
	}
	async info() {
		await this.ready;
		let res = await this.rpc("info");
		if (res.error) throw new ResponseError(res.error.message);
		return res.result ?? void 0;
	}
	async signup(vars) {
		if (!this.connection) throw new NoActiveSocket();
		let parsed = processAuthVars(vars, this.connection.connection),
			converted = convertAuth(parsed),
			res = await this.rpc("signup", [converted]);
		if (res.error) throw new ResponseError(res.error.message);
		if (!res.result) throw new NoTokenReturned();
		return res.result;
	}
	async signin(vars) {
		if (!this.connection) throw new NoActiveSocket();
		let parsed = processAuthVars(vars, this.connection.connection),
			converted = convertAuth(parsed),
			res = await this.rpc("signin", [converted]);
		if (res.error) throw new ResponseError(res.error.message);
		if (!res.result) throw new NoTokenReturned();
		return res.result;
	}
	async authenticate(token) {
		let res = await this.rpc("authenticate", [token]);
		if (res.error) throw new ResponseError(res.error.message);
		return !0;
	}
	async invalidate() {
		let res = await this.rpc("invalidate");
		if (res.error) throw new ResponseError(res.error.message);
		return !0;
	}
	async let(variable, value) {
		let res = await this.rpc("let", [variable, value]);
		if (res.error) throw new ResponseError(res.error.message);
		return !0;
	}
	async unset(variable) {
		let res = await this.rpc("unset", [variable]);
		if (res.error) throw new ResponseError(res.error.message);
		return !0;
	}
	async live(table, callback, diff) {
		await this.ready;
		let res = await this.rpc("live", [table, diff]);
		if (res.error) throw new ResponseError(res.error.message);
		return callback && this.subscribeLive(res.result, callback), res.result;
	}
	async subscribeLive(queryUuid, callback) {
		if (await this.ready, !this.connection) throw new NoActiveSocket();
		this.connection.emitter.subscribe(`live-${queryUuid}`, callback, !0);
	}
	async unSubscribeLive(queryUuid, callback) {
		if (await this.ready, !this.connection) throw new NoActiveSocket();
		this.connection.emitter.unSubscribe(`live-${queryUuid}`, callback);
	}
	async kill(queryUuid) {
		if (await this.ready, !this.connection) throw new NoActiveSocket();
		if (Array.isArray(queryUuid)) {
			await Promise.all(queryUuid.map((u2) => this.rpc("kill", [u2])));
			let toBeKilled = queryUuid.map((u2) => `live-${u2}`);
			toBeKilled.map((k) => this.emitter.emit(k, ["CLOSE", "killed"])),
				this.connection.emitter.reset({
					collectable: toBeKilled,
					listeners: toBeKilled,
				});
		} else {await this.rpc("kill", [queryUuid]),
				this.emitter.emit(`live-${queryUuid}`, ["CLOSE", "killed"]),
				this.connection.emitter.reset({
					collectable: `live-${queryUuid}`,
					listeners: `live-${queryUuid}`,
				});}
	}
	async query(...args) {
		return (await this.query_raw(...args)).map(({ status, result }) => {
			if (status === "ERR") throw new ResponseError(result);
			return result;
		});
	}
	async query_raw(...[q, b]) {
		let params = q instanceof PreparedQuery
			? [
				q.query,
				partiallyEncodeObject(q.bindings, {
					fills: b,
					replacer: replacer.encode,
				}),
			]
			: [q, b];
		await this.ready;
		let res = await this.rpc("query", params);
		if (res.error) throw new ResponseError(res.error.message);
		return res.result;
	}
	async select(thing) {
		await this.ready;
		let res = await this.rpc("select", [thing]);
		if (res.error) throw new ResponseError(res.error.message);
		return output(thing, res.result);
	}
	async create(thing, data) {
		await this.ready;
		let res = await this.rpc("create", [thing, data]);
		if (res.error) throw new ResponseError(res.error.message);
		return output(thing, res.result);
	}
	async insert(arg1, arg2) {
		await this.ready;
		let [table, data] = typeof arg1 == "string" || arg1 instanceof Table
				? [arg1, arg2]
				: [void 0, arg1],
			res = await this.rpc("insert", [table, data]);
		if (res.error) throw new ResponseError(res.error.message);
		return res.result;
	}
	async insert_relation(arg1, arg2) {
		await this.ready;
		let [table, data] = typeof arg1 == "string" || arg1 instanceof Table
				? [arg1, arg2]
				: [void 0, arg1],
			res = await this.rpc("insert_relation", [table, data]);
		if (res.error) throw new ResponseError(res.error.message);
		return res.result;
	}
	async update(thing, data) {
		await this.ready;
		let res = await this.rpc("update", [thing, data]);
		if (res.error) throw new ResponseError(res.error.message);
		return output(thing, res.result);
	}
	async upsert(thing, data) {
		await this.ready;
		let res = await this.rpc("upsert", [thing, data]);
		if (res.error) throw new ResponseError(res.error.message);
		return output(thing, res.result);
	}
	async merge(thing, data) {
		await this.ready;
		let res = await this.rpc("merge", [thing, data]);
		if (res.error) throw new ResponseError(res.error.message);
		return output(thing, res.result);
	}
	async patch(thing, data, diff) {
		await this.ready;
		let res = await this.rpc("patch", [thing, data, diff]);
		if (res.error) throw new ResponseError(res.error.message);
		return diff ? res.result : output(thing, res.result);
	}
	async delete(thing) {
		await this.ready;
		let res = await this.rpc("delete", [thing]);
		if (res.error) throw new ResponseError(res.error.message);
		return output(thing, res.result);
	}
	async version() {
		await this.ready;
		let res = await this.rpc("version");
		if (res.error) throw new ResponseError(res.error.message);
		return res.result;
	}
	async run(name, arg2, arg3) {
		await this.ready;
		let [version, args] = Array.isArray(arg2) ? [void 0, arg2] : [arg2, arg3],
			res = await this.rpc("run", [name, version, args]);
		if (res.error) throw new ResponseError(res.error.message);
		return res.result;
	}
	async relate(from, thing, to, data) {
		await this.ready;
		let res = await this.rpc("relate", [from, thing, to, data]);
		if (res.error) throw new ResponseError(res.error.message);
		return output(thing, res.result);
	}
	rpc(method, params) {
		if (!this.connection) throw new NoActiveSocket();
		return this.connection.rpc({ method, params });
	}
};
function output(subject, input) {
	return subject instanceof RecordId || subject instanceof StringRecordId
		? Array.isArray(input) ? input[0] : input
		: Array.isArray(input)
		? input
		: [input];
}
export {
	AbstractEngine,
	BoundExcluded,
	BoundIncluded,
	cbor_exports as cbor,
	CborBreak,
	CborError,
	CborFillMissing,
	CborInvalidMajorError,
	CborNumberError,
	CborPartialDisabled,
	CborRangeError,
	ConnectionStatus,
	ConnectionUnavailable,
	convertAuth,
	d,
	Decimal,
	decodeCbor,
	defaultVersionCheckTimeout,
	Duration,
	Emitter,
	encodeCbor,
	EngineDisconnected,
	escape_ident,
	Future,
	Gap,
	Geometry,
	GeometryCollection,
	GeometryLine,
	GeometryMultiLine,
	GeometryMultiPoint,
	GeometryMultiPolygon,
	GeometryPoint,
	GeometryPolygon,
	getIncrementalID,
	HttpConnectionError,
	InvalidURLProvided,
	isLiveResult,
	isVersionSupported,
	jsonify,
	liveActions,
	MissingNamespaceDatabase,
	NoActiveSocket,
	NoConnectionDetails,
	NoDatabaseSpecified,
	NoNamespaceSpecified,
	NoTokenReturned,
	PreparedQuery,
	r,
	Range,
	RecordId,
	RecordIdRange,
	ResponseError,
	retrieveRemoteVersion,
	s,
	StringRecordId,
	supportedSurrealDbVersionMin,
	supportedSurrealDbVersionRange,
	supportedSurrealDbVersionUntil,
	Surreal,
	Surreal as default,
	SurrealDbError,
	surrealql,
	surrealql as surql,
	Table,
	toSurrealqlString,
	u,
	UnexpectedConnectionError,
	UnexpectedResponse,
	UnexpectedServerResponse,
	UnsupportedEngine,
	UnsupportedVersion,
	Uuid,
	versionCheck,
	VersionRetrievalFailure,
};
/*! Bundled license information:

uuidv7/dist/index.js:
  (**
   * uuidv7: A JavaScript implementation of UUID version 7
   *
   * @license Apache-2.0
   * @copyright 2021-2024 LiosK
   * @packageDocumentation
   *)
*/
