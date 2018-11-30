/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const CafeChallenge = $root.CafeChallenge = (() => {

    /**
     * Properties of a CafeChallenge.
     * @exports ICafeChallenge
     * @interface ICafeChallenge
     * @property {string|null} [address] CafeChallenge address
     */

    /**
     * Constructs a new CafeChallenge.
     * @exports CafeChallenge
     * @classdesc Represents a CafeChallenge.
     * @implements ICafeChallenge
     * @constructor
     * @param {ICafeChallenge=} [properties] Properties to set
     */
    function CafeChallenge(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeChallenge address.
     * @member {string} address
     * @memberof CafeChallenge
     * @instance
     */
    CafeChallenge.prototype.address = "";

    /**
     * Creates a new CafeChallenge instance using the specified properties.
     * @function create
     * @memberof CafeChallenge
     * @static
     * @param {ICafeChallenge=} [properties] Properties to set
     * @returns {CafeChallenge} CafeChallenge instance
     */
    CafeChallenge.create = function create(properties) {
        return new CafeChallenge(properties);
    };

    /**
     * Encodes the specified CafeChallenge message. Does not implicitly {@link CafeChallenge.verify|verify} messages.
     * @function encode
     * @memberof CafeChallenge
     * @static
     * @param {ICafeChallenge} message CafeChallenge message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeChallenge.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.address != null && message.hasOwnProperty("address"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.address);
        return writer;
    };

    /**
     * Encodes the specified CafeChallenge message, length delimited. Does not implicitly {@link CafeChallenge.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeChallenge
     * @static
     * @param {ICafeChallenge} message CafeChallenge message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeChallenge.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeChallenge message from the specified reader or buffer.
     * @function decode
     * @memberof CafeChallenge
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeChallenge} CafeChallenge
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeChallenge.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeChallenge();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.address = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeChallenge message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeChallenge
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeChallenge} CafeChallenge
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeChallenge.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeChallenge message.
     * @function verify
     * @memberof CafeChallenge
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeChallenge.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.address != null && message.hasOwnProperty("address"))
            if (!$util.isString(message.address))
                return "address: string expected";
        return null;
    };

    /**
     * Creates a CafeChallenge message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeChallenge
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeChallenge} CafeChallenge
     */
    CafeChallenge.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeChallenge)
            return object;
        let message = new $root.CafeChallenge();
        if (object.address != null)
            message.address = String(object.address);
        return message;
    };

    /**
     * Creates a plain object from a CafeChallenge message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeChallenge
     * @static
     * @param {CafeChallenge} message CafeChallenge
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeChallenge.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.address = "";
        if (message.address != null && message.hasOwnProperty("address"))
            object.address = message.address;
        return object;
    };

    /**
     * Converts this CafeChallenge to JSON.
     * @function toJSON
     * @memberof CafeChallenge
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeChallenge.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeChallenge;
})();

export const CafeNonce = $root.CafeNonce = (() => {

    /**
     * Properties of a CafeNonce.
     * @exports ICafeNonce
     * @interface ICafeNonce
     * @property {string|null} [value] CafeNonce value
     */

    /**
     * Constructs a new CafeNonce.
     * @exports CafeNonce
     * @classdesc Represents a CafeNonce.
     * @implements ICafeNonce
     * @constructor
     * @param {ICafeNonce=} [properties] Properties to set
     */
    function CafeNonce(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeNonce value.
     * @member {string} value
     * @memberof CafeNonce
     * @instance
     */
    CafeNonce.prototype.value = "";

    /**
     * Creates a new CafeNonce instance using the specified properties.
     * @function create
     * @memberof CafeNonce
     * @static
     * @param {ICafeNonce=} [properties] Properties to set
     * @returns {CafeNonce} CafeNonce instance
     */
    CafeNonce.create = function create(properties) {
        return new CafeNonce(properties);
    };

    /**
     * Encodes the specified CafeNonce message. Does not implicitly {@link CafeNonce.verify|verify} messages.
     * @function encode
     * @memberof CafeNonce
     * @static
     * @param {ICafeNonce} message CafeNonce message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeNonce.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.value != null && message.hasOwnProperty("value"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
        return writer;
    };

    /**
     * Encodes the specified CafeNonce message, length delimited. Does not implicitly {@link CafeNonce.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeNonce
     * @static
     * @param {ICafeNonce} message CafeNonce message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeNonce.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeNonce message from the specified reader or buffer.
     * @function decode
     * @memberof CafeNonce
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeNonce} CafeNonce
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeNonce.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeNonce();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.value = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeNonce message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeNonce
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeNonce} CafeNonce
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeNonce.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeNonce message.
     * @function verify
     * @memberof CafeNonce
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeNonce.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!$util.isString(message.value))
                return "value: string expected";
        return null;
    };

    /**
     * Creates a CafeNonce message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeNonce
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeNonce} CafeNonce
     */
    CafeNonce.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeNonce)
            return object;
        let message = new $root.CafeNonce();
        if (object.value != null)
            message.value = String(object.value);
        return message;
    };

    /**
     * Creates a plain object from a CafeNonce message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeNonce
     * @static
     * @param {CafeNonce} message CafeNonce
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeNonce.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.value = "";
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = message.value;
        return object;
    };

    /**
     * Converts this CafeNonce to JSON.
     * @function toJSON
     * @memberof CafeNonce
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeNonce.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeNonce;
})();

export const CafeRegistration = $root.CafeRegistration = (() => {

    /**
     * Properties of a CafeRegistration.
     * @exports ICafeRegistration
     * @interface ICafeRegistration
     * @property {string|null} [address] CafeRegistration address
     * @property {string|null} [value] CafeRegistration value
     * @property {string|null} [nonce] CafeRegistration nonce
     * @property {Uint8Array|null} [sig] CafeRegistration sig
     */

    /**
     * Constructs a new CafeRegistration.
     * @exports CafeRegistration
     * @classdesc Represents a CafeRegistration.
     * @implements ICafeRegistration
     * @constructor
     * @param {ICafeRegistration=} [properties] Properties to set
     */
    function CafeRegistration(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeRegistration address.
     * @member {string} address
     * @memberof CafeRegistration
     * @instance
     */
    CafeRegistration.prototype.address = "";

    /**
     * CafeRegistration value.
     * @member {string} value
     * @memberof CafeRegistration
     * @instance
     */
    CafeRegistration.prototype.value = "";

    /**
     * CafeRegistration nonce.
     * @member {string} nonce
     * @memberof CafeRegistration
     * @instance
     */
    CafeRegistration.prototype.nonce = "";

    /**
     * CafeRegistration sig.
     * @member {Uint8Array} sig
     * @memberof CafeRegistration
     * @instance
     */
    CafeRegistration.prototype.sig = $util.newBuffer([]);

    /**
     * Creates a new CafeRegistration instance using the specified properties.
     * @function create
     * @memberof CafeRegistration
     * @static
     * @param {ICafeRegistration=} [properties] Properties to set
     * @returns {CafeRegistration} CafeRegistration instance
     */
    CafeRegistration.create = function create(properties) {
        return new CafeRegistration(properties);
    };

    /**
     * Encodes the specified CafeRegistration message. Does not implicitly {@link CafeRegistration.verify|verify} messages.
     * @function encode
     * @memberof CafeRegistration
     * @static
     * @param {ICafeRegistration} message CafeRegistration message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeRegistration.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.address != null && message.hasOwnProperty("address"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.address);
        if (message.value != null && message.hasOwnProperty("value"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.nonce);
        if (message.sig != null && message.hasOwnProperty("sig"))
            writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.sig);
        return writer;
    };

    /**
     * Encodes the specified CafeRegistration message, length delimited. Does not implicitly {@link CafeRegistration.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeRegistration
     * @static
     * @param {ICafeRegistration} message CafeRegistration message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeRegistration.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeRegistration message from the specified reader or buffer.
     * @function decode
     * @memberof CafeRegistration
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeRegistration} CafeRegistration
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeRegistration.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeRegistration();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.address = reader.string();
                break;
            case 2:
                message.value = reader.string();
                break;
            case 3:
                message.nonce = reader.string();
                break;
            case 4:
                message.sig = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeRegistration message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeRegistration
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeRegistration} CafeRegistration
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeRegistration.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeRegistration message.
     * @function verify
     * @memberof CafeRegistration
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeRegistration.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.address != null && message.hasOwnProperty("address"))
            if (!$util.isString(message.address))
                return "address: string expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!$util.isString(message.value))
                return "value: string expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isString(message.nonce))
                return "nonce: string expected";
        if (message.sig != null && message.hasOwnProperty("sig"))
            if (!(message.sig && typeof message.sig.length === "number" || $util.isString(message.sig)))
                return "sig: buffer expected";
        return null;
    };

    /**
     * Creates a CafeRegistration message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeRegistration
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeRegistration} CafeRegistration
     */
    CafeRegistration.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeRegistration)
            return object;
        let message = new $root.CafeRegistration();
        if (object.address != null)
            message.address = String(object.address);
        if (object.value != null)
            message.value = String(object.value);
        if (object.nonce != null)
            message.nonce = String(object.nonce);
        if (object.sig != null)
            if (typeof object.sig === "string")
                $util.base64.decode(object.sig, message.sig = $util.newBuffer($util.base64.length(object.sig)), 0);
            else if (object.sig.length)
                message.sig = object.sig;
        return message;
    };

    /**
     * Creates a plain object from a CafeRegistration message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeRegistration
     * @static
     * @param {CafeRegistration} message CafeRegistration
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeRegistration.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.address = "";
            object.value = "";
            object.nonce = "";
            if (options.bytes === String)
                object.sig = "";
            else {
                object.sig = [];
                if (options.bytes !== Array)
                    object.sig = $util.newBuffer(object.sig);
            }
        }
        if (message.address != null && message.hasOwnProperty("address"))
            object.address = message.address;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = message.value;
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            object.nonce = message.nonce;
        if (message.sig != null && message.hasOwnProperty("sig"))
            object.sig = options.bytes === String ? $util.base64.encode(message.sig, 0, message.sig.length) : options.bytes === Array ? Array.prototype.slice.call(message.sig) : message.sig;
        return object;
    };

    /**
     * Converts this CafeRegistration to JSON.
     * @function toJSON
     * @memberof CafeRegistration
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeRegistration.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeRegistration;
})();

export const CafeSession = $root.CafeSession = (() => {

    /**
     * Properties of a CafeSession.
     * @exports ICafeSession
     * @interface ICafeSession
     * @property {string|null} [access] CafeSession access
     * @property {google.protobuf.ITimestamp|null} [exp] CafeSession exp
     * @property {string|null} [refresh] CafeSession refresh
     * @property {google.protobuf.ITimestamp|null} [rexp] CafeSession rexp
     * @property {string|null} [subject] CafeSession subject
     * @property {string|null} [type] CafeSession type
     * @property {string|null} [httpAddr] CafeSession httpAddr
     * @property {Array.<string>|null} [swarmAddrs] CafeSession swarmAddrs
     */

    /**
     * Constructs a new CafeSession.
     * @exports CafeSession
     * @classdesc Represents a CafeSession.
     * @implements ICafeSession
     * @constructor
     * @param {ICafeSession=} [properties] Properties to set
     */
    function CafeSession(properties) {
        this.swarmAddrs = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeSession access.
     * @member {string} access
     * @memberof CafeSession
     * @instance
     */
    CafeSession.prototype.access = "";

    /**
     * CafeSession exp.
     * @member {google.protobuf.ITimestamp|null|undefined} exp
     * @memberof CafeSession
     * @instance
     */
    CafeSession.prototype.exp = null;

    /**
     * CafeSession refresh.
     * @member {string} refresh
     * @memberof CafeSession
     * @instance
     */
    CafeSession.prototype.refresh = "";

    /**
     * CafeSession rexp.
     * @member {google.protobuf.ITimestamp|null|undefined} rexp
     * @memberof CafeSession
     * @instance
     */
    CafeSession.prototype.rexp = null;

    /**
     * CafeSession subject.
     * @member {string} subject
     * @memberof CafeSession
     * @instance
     */
    CafeSession.prototype.subject = "";

    /**
     * CafeSession type.
     * @member {string} type
     * @memberof CafeSession
     * @instance
     */
    CafeSession.prototype.type = "";

    /**
     * CafeSession httpAddr.
     * @member {string} httpAddr
     * @memberof CafeSession
     * @instance
     */
    CafeSession.prototype.httpAddr = "";

    /**
     * CafeSession swarmAddrs.
     * @member {Array.<string>} swarmAddrs
     * @memberof CafeSession
     * @instance
     */
    CafeSession.prototype.swarmAddrs = $util.emptyArray;

    /**
     * Creates a new CafeSession instance using the specified properties.
     * @function create
     * @memberof CafeSession
     * @static
     * @param {ICafeSession=} [properties] Properties to set
     * @returns {CafeSession} CafeSession instance
     */
    CafeSession.create = function create(properties) {
        return new CafeSession(properties);
    };

    /**
     * Encodes the specified CafeSession message. Does not implicitly {@link CafeSession.verify|verify} messages.
     * @function encode
     * @memberof CafeSession
     * @static
     * @param {ICafeSession} message CafeSession message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeSession.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.access != null && message.hasOwnProperty("access"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.access);
        if (message.exp != null && message.hasOwnProperty("exp"))
            $root.google.protobuf.Timestamp.encode(message.exp, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.refresh != null && message.hasOwnProperty("refresh"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.refresh);
        if (message.rexp != null && message.hasOwnProperty("rexp"))
            $root.google.protobuf.Timestamp.encode(message.rexp, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.subject != null && message.hasOwnProperty("subject"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.subject);
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.type);
        if (message.httpAddr != null && message.hasOwnProperty("httpAddr"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.httpAddr);
        if (message.swarmAddrs != null && message.swarmAddrs.length)
            for (let i = 0; i < message.swarmAddrs.length; ++i)
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.swarmAddrs[i]);
        return writer;
    };

    /**
     * Encodes the specified CafeSession message, length delimited. Does not implicitly {@link CafeSession.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeSession
     * @static
     * @param {ICafeSession} message CafeSession message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeSession.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeSession message from the specified reader or buffer.
     * @function decode
     * @memberof CafeSession
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeSession} CafeSession
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeSession.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeSession();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.access = reader.string();
                break;
            case 2:
                message.exp = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                break;
            case 3:
                message.refresh = reader.string();
                break;
            case 4:
                message.rexp = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                break;
            case 5:
                message.subject = reader.string();
                break;
            case 6:
                message.type = reader.string();
                break;
            case 7:
                message.httpAddr = reader.string();
                break;
            case 8:
                if (!(message.swarmAddrs && message.swarmAddrs.length))
                    message.swarmAddrs = [];
                message.swarmAddrs.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeSession message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeSession
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeSession} CafeSession
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeSession.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeSession message.
     * @function verify
     * @memberof CafeSession
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeSession.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.access != null && message.hasOwnProperty("access"))
            if (!$util.isString(message.access))
                return "access: string expected";
        if (message.exp != null && message.hasOwnProperty("exp")) {
            let error = $root.google.protobuf.Timestamp.verify(message.exp);
            if (error)
                return "exp." + error;
        }
        if (message.refresh != null && message.hasOwnProperty("refresh"))
            if (!$util.isString(message.refresh))
                return "refresh: string expected";
        if (message.rexp != null && message.hasOwnProperty("rexp")) {
            let error = $root.google.protobuf.Timestamp.verify(message.rexp);
            if (error)
                return "rexp." + error;
        }
        if (message.subject != null && message.hasOwnProperty("subject"))
            if (!$util.isString(message.subject))
                return "subject: string expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isString(message.type))
                return "type: string expected";
        if (message.httpAddr != null && message.hasOwnProperty("httpAddr"))
            if (!$util.isString(message.httpAddr))
                return "httpAddr: string expected";
        if (message.swarmAddrs != null && message.hasOwnProperty("swarmAddrs")) {
            if (!Array.isArray(message.swarmAddrs))
                return "swarmAddrs: array expected";
            for (let i = 0; i < message.swarmAddrs.length; ++i)
                if (!$util.isString(message.swarmAddrs[i]))
                    return "swarmAddrs: string[] expected";
        }
        return null;
    };

    /**
     * Creates a CafeSession message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeSession
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeSession} CafeSession
     */
    CafeSession.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeSession)
            return object;
        let message = new $root.CafeSession();
        if (object.access != null)
            message.access = String(object.access);
        if (object.exp != null) {
            if (typeof object.exp !== "object")
                throw TypeError(".CafeSession.exp: object expected");
            message.exp = $root.google.protobuf.Timestamp.fromObject(object.exp);
        }
        if (object.refresh != null)
            message.refresh = String(object.refresh);
        if (object.rexp != null) {
            if (typeof object.rexp !== "object")
                throw TypeError(".CafeSession.rexp: object expected");
            message.rexp = $root.google.protobuf.Timestamp.fromObject(object.rexp);
        }
        if (object.subject != null)
            message.subject = String(object.subject);
        if (object.type != null)
            message.type = String(object.type);
        if (object.httpAddr != null)
            message.httpAddr = String(object.httpAddr);
        if (object.swarmAddrs) {
            if (!Array.isArray(object.swarmAddrs))
                throw TypeError(".CafeSession.swarmAddrs: array expected");
            message.swarmAddrs = [];
            for (let i = 0; i < object.swarmAddrs.length; ++i)
                message.swarmAddrs[i] = String(object.swarmAddrs[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a CafeSession message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeSession
     * @static
     * @param {CafeSession} message CafeSession
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeSession.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.swarmAddrs = [];
        if (options.defaults) {
            object.access = "";
            object.exp = null;
            object.refresh = "";
            object.rexp = null;
            object.subject = "";
            object.type = "";
            object.httpAddr = "";
        }
        if (message.access != null && message.hasOwnProperty("access"))
            object.access = message.access;
        if (message.exp != null && message.hasOwnProperty("exp"))
            object.exp = $root.google.protobuf.Timestamp.toObject(message.exp, options);
        if (message.refresh != null && message.hasOwnProperty("refresh"))
            object.refresh = message.refresh;
        if (message.rexp != null && message.hasOwnProperty("rexp"))
            object.rexp = $root.google.protobuf.Timestamp.toObject(message.rexp, options);
        if (message.subject != null && message.hasOwnProperty("subject"))
            object.subject = message.subject;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.httpAddr != null && message.hasOwnProperty("httpAddr"))
            object.httpAddr = message.httpAddr;
        if (message.swarmAddrs && message.swarmAddrs.length) {
            object.swarmAddrs = [];
            for (let j = 0; j < message.swarmAddrs.length; ++j)
                object.swarmAddrs[j] = message.swarmAddrs[j];
        }
        return object;
    };

    /**
     * Converts this CafeSession to JSON.
     * @function toJSON
     * @memberof CafeSession
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeSession.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeSession;
})();

export const CafeRefreshSession = $root.CafeRefreshSession = (() => {

    /**
     * Properties of a CafeRefreshSession.
     * @exports ICafeRefreshSession
     * @interface ICafeRefreshSession
     * @property {string|null} [access] CafeRefreshSession access
     * @property {string|null} [refresh] CafeRefreshSession refresh
     */

    /**
     * Constructs a new CafeRefreshSession.
     * @exports CafeRefreshSession
     * @classdesc Represents a CafeRefreshSession.
     * @implements ICafeRefreshSession
     * @constructor
     * @param {ICafeRefreshSession=} [properties] Properties to set
     */
    function CafeRefreshSession(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeRefreshSession access.
     * @member {string} access
     * @memberof CafeRefreshSession
     * @instance
     */
    CafeRefreshSession.prototype.access = "";

    /**
     * CafeRefreshSession refresh.
     * @member {string} refresh
     * @memberof CafeRefreshSession
     * @instance
     */
    CafeRefreshSession.prototype.refresh = "";

    /**
     * Creates a new CafeRefreshSession instance using the specified properties.
     * @function create
     * @memberof CafeRefreshSession
     * @static
     * @param {ICafeRefreshSession=} [properties] Properties to set
     * @returns {CafeRefreshSession} CafeRefreshSession instance
     */
    CafeRefreshSession.create = function create(properties) {
        return new CafeRefreshSession(properties);
    };

    /**
     * Encodes the specified CafeRefreshSession message. Does not implicitly {@link CafeRefreshSession.verify|verify} messages.
     * @function encode
     * @memberof CafeRefreshSession
     * @static
     * @param {ICafeRefreshSession} message CafeRefreshSession message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeRefreshSession.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.access != null && message.hasOwnProperty("access"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.access);
        if (message.refresh != null && message.hasOwnProperty("refresh"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.refresh);
        return writer;
    };

    /**
     * Encodes the specified CafeRefreshSession message, length delimited. Does not implicitly {@link CafeRefreshSession.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeRefreshSession
     * @static
     * @param {ICafeRefreshSession} message CafeRefreshSession message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeRefreshSession.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeRefreshSession message from the specified reader or buffer.
     * @function decode
     * @memberof CafeRefreshSession
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeRefreshSession} CafeRefreshSession
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeRefreshSession.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeRefreshSession();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.access = reader.string();
                break;
            case 2:
                message.refresh = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeRefreshSession message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeRefreshSession
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeRefreshSession} CafeRefreshSession
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeRefreshSession.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeRefreshSession message.
     * @function verify
     * @memberof CafeRefreshSession
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeRefreshSession.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.access != null && message.hasOwnProperty("access"))
            if (!$util.isString(message.access))
                return "access: string expected";
        if (message.refresh != null && message.hasOwnProperty("refresh"))
            if (!$util.isString(message.refresh))
                return "refresh: string expected";
        return null;
    };

    /**
     * Creates a CafeRefreshSession message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeRefreshSession
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeRefreshSession} CafeRefreshSession
     */
    CafeRefreshSession.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeRefreshSession)
            return object;
        let message = new $root.CafeRefreshSession();
        if (object.access != null)
            message.access = String(object.access);
        if (object.refresh != null)
            message.refresh = String(object.refresh);
        return message;
    };

    /**
     * Creates a plain object from a CafeRefreshSession message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeRefreshSession
     * @static
     * @param {CafeRefreshSession} message CafeRefreshSession
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeRefreshSession.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.access = "";
            object.refresh = "";
        }
        if (message.access != null && message.hasOwnProperty("access"))
            object.access = message.access;
        if (message.refresh != null && message.hasOwnProperty("refresh"))
            object.refresh = message.refresh;
        return object;
    };

    /**
     * Converts this CafeRefreshSession to JSON.
     * @function toJSON
     * @memberof CafeRefreshSession
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeRefreshSession.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeRefreshSession;
})();

export const CafeStore = $root.CafeStore = (() => {

    /**
     * Properties of a CafeStore.
     * @exports ICafeStore
     * @interface ICafeStore
     * @property {string|null} [token] CafeStore token
     * @property {Array.<string>|null} [cids] CafeStore cids
     */

    /**
     * Constructs a new CafeStore.
     * @exports CafeStore
     * @classdesc Represents a CafeStore.
     * @implements ICafeStore
     * @constructor
     * @param {ICafeStore=} [properties] Properties to set
     */
    function CafeStore(properties) {
        this.cids = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeStore token.
     * @member {string} token
     * @memberof CafeStore
     * @instance
     */
    CafeStore.prototype.token = "";

    /**
     * CafeStore cids.
     * @member {Array.<string>} cids
     * @memberof CafeStore
     * @instance
     */
    CafeStore.prototype.cids = $util.emptyArray;

    /**
     * Creates a new CafeStore instance using the specified properties.
     * @function create
     * @memberof CafeStore
     * @static
     * @param {ICafeStore=} [properties] Properties to set
     * @returns {CafeStore} CafeStore instance
     */
    CafeStore.create = function create(properties) {
        return new CafeStore(properties);
    };

    /**
     * Encodes the specified CafeStore message. Does not implicitly {@link CafeStore.verify|verify} messages.
     * @function encode
     * @memberof CafeStore
     * @static
     * @param {ICafeStore} message CafeStore message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeStore.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.token != null && message.hasOwnProperty("token"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.token);
        if (message.cids != null && message.cids.length)
            for (let i = 0; i < message.cids.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.cids[i]);
        return writer;
    };

    /**
     * Encodes the specified CafeStore message, length delimited. Does not implicitly {@link CafeStore.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeStore
     * @static
     * @param {ICafeStore} message CafeStore message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeStore.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeStore message from the specified reader or buffer.
     * @function decode
     * @memberof CafeStore
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeStore} CafeStore
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeStore.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeStore();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.token = reader.string();
                break;
            case 2:
                if (!(message.cids && message.cids.length))
                    message.cids = [];
                message.cids.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeStore message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeStore
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeStore} CafeStore
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeStore.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeStore message.
     * @function verify
     * @memberof CafeStore
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeStore.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.token != null && message.hasOwnProperty("token"))
            if (!$util.isString(message.token))
                return "token: string expected";
        if (message.cids != null && message.hasOwnProperty("cids")) {
            if (!Array.isArray(message.cids))
                return "cids: array expected";
            for (let i = 0; i < message.cids.length; ++i)
                if (!$util.isString(message.cids[i]))
                    return "cids: string[] expected";
        }
        return null;
    };

    /**
     * Creates a CafeStore message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeStore
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeStore} CafeStore
     */
    CafeStore.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeStore)
            return object;
        let message = new $root.CafeStore();
        if (object.token != null)
            message.token = String(object.token);
        if (object.cids) {
            if (!Array.isArray(object.cids))
                throw TypeError(".CafeStore.cids: array expected");
            message.cids = [];
            for (let i = 0; i < object.cids.length; ++i)
                message.cids[i] = String(object.cids[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a CafeStore message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeStore
     * @static
     * @param {CafeStore} message CafeStore
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeStore.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.cids = [];
        if (options.defaults)
            object.token = "";
        if (message.token != null && message.hasOwnProperty("token"))
            object.token = message.token;
        if (message.cids && message.cids.length) {
            object.cids = [];
            for (let j = 0; j < message.cids.length; ++j)
                object.cids[j] = message.cids[j];
        }
        return object;
    };

    /**
     * Converts this CafeStore to JSON.
     * @function toJSON
     * @memberof CafeStore
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeStore.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeStore;
})();

export const CafeBlockList = $root.CafeBlockList = (() => {

    /**
     * Properties of a CafeBlockList.
     * @exports ICafeBlockList
     * @interface ICafeBlockList
     * @property {Array.<string>|null} [cids] CafeBlockList cids
     */

    /**
     * Constructs a new CafeBlockList.
     * @exports CafeBlockList
     * @classdesc Represents a CafeBlockList.
     * @implements ICafeBlockList
     * @constructor
     * @param {ICafeBlockList=} [properties] Properties to set
     */
    function CafeBlockList(properties) {
        this.cids = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeBlockList cids.
     * @member {Array.<string>} cids
     * @memberof CafeBlockList
     * @instance
     */
    CafeBlockList.prototype.cids = $util.emptyArray;

    /**
     * Creates a new CafeBlockList instance using the specified properties.
     * @function create
     * @memberof CafeBlockList
     * @static
     * @param {ICafeBlockList=} [properties] Properties to set
     * @returns {CafeBlockList} CafeBlockList instance
     */
    CafeBlockList.create = function create(properties) {
        return new CafeBlockList(properties);
    };

    /**
     * Encodes the specified CafeBlockList message. Does not implicitly {@link CafeBlockList.verify|verify} messages.
     * @function encode
     * @memberof CafeBlockList
     * @static
     * @param {ICafeBlockList} message CafeBlockList message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeBlockList.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.cids != null && message.cids.length)
            for (let i = 0; i < message.cids.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cids[i]);
        return writer;
    };

    /**
     * Encodes the specified CafeBlockList message, length delimited. Does not implicitly {@link CafeBlockList.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeBlockList
     * @static
     * @param {ICafeBlockList} message CafeBlockList message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeBlockList.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeBlockList message from the specified reader or buffer.
     * @function decode
     * @memberof CafeBlockList
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeBlockList} CafeBlockList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeBlockList.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeBlockList();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.cids && message.cids.length))
                    message.cids = [];
                message.cids.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeBlockList message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeBlockList
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeBlockList} CafeBlockList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeBlockList.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeBlockList message.
     * @function verify
     * @memberof CafeBlockList
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeBlockList.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.cids != null && message.hasOwnProperty("cids")) {
            if (!Array.isArray(message.cids))
                return "cids: array expected";
            for (let i = 0; i < message.cids.length; ++i)
                if (!$util.isString(message.cids[i]))
                    return "cids: string[] expected";
        }
        return null;
    };

    /**
     * Creates a CafeBlockList message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeBlockList
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeBlockList} CafeBlockList
     */
    CafeBlockList.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeBlockList)
            return object;
        let message = new $root.CafeBlockList();
        if (object.cids) {
            if (!Array.isArray(object.cids))
                throw TypeError(".CafeBlockList.cids: array expected");
            message.cids = [];
            for (let i = 0; i < object.cids.length; ++i)
                message.cids[i] = String(object.cids[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a CafeBlockList message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeBlockList
     * @static
     * @param {CafeBlockList} message CafeBlockList
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeBlockList.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.cids = [];
        if (message.cids && message.cids.length) {
            object.cids = [];
            for (let j = 0; j < message.cids.length; ++j)
                object.cids[j] = message.cids[j];
        }
        return object;
    };

    /**
     * Converts this CafeBlockList to JSON.
     * @function toJSON
     * @memberof CafeBlockList
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeBlockList.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeBlockList;
})();

export const CafeBlock = $root.CafeBlock = (() => {

    /**
     * Properties of a CafeBlock.
     * @exports ICafeBlock
     * @interface ICafeBlock
     * @property {string|null} [token] CafeBlock token
     * @property {Uint8Array|null} [rawData] CafeBlock rawData
     * @property {string|null} [cid] CafeBlock cid
     */

    /**
     * Constructs a new CafeBlock.
     * @exports CafeBlock
     * @classdesc Represents a CafeBlock.
     * @implements ICafeBlock
     * @constructor
     * @param {ICafeBlock=} [properties] Properties to set
     */
    function CafeBlock(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeBlock token.
     * @member {string} token
     * @memberof CafeBlock
     * @instance
     */
    CafeBlock.prototype.token = "";

    /**
     * CafeBlock rawData.
     * @member {Uint8Array} rawData
     * @memberof CafeBlock
     * @instance
     */
    CafeBlock.prototype.rawData = $util.newBuffer([]);

    /**
     * CafeBlock cid.
     * @member {string} cid
     * @memberof CafeBlock
     * @instance
     */
    CafeBlock.prototype.cid = "";

    /**
     * Creates a new CafeBlock instance using the specified properties.
     * @function create
     * @memberof CafeBlock
     * @static
     * @param {ICafeBlock=} [properties] Properties to set
     * @returns {CafeBlock} CafeBlock instance
     */
    CafeBlock.create = function create(properties) {
        return new CafeBlock(properties);
    };

    /**
     * Encodes the specified CafeBlock message. Does not implicitly {@link CafeBlock.verify|verify} messages.
     * @function encode
     * @memberof CafeBlock
     * @static
     * @param {ICafeBlock} message CafeBlock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeBlock.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.token != null && message.hasOwnProperty("token"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.token);
        if (message.rawData != null && message.hasOwnProperty("rawData"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.rawData);
        if (message.cid != null && message.hasOwnProperty("cid"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.cid);
        return writer;
    };

    /**
     * Encodes the specified CafeBlock message, length delimited. Does not implicitly {@link CafeBlock.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeBlock
     * @static
     * @param {ICafeBlock} message CafeBlock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeBlock.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeBlock message from the specified reader or buffer.
     * @function decode
     * @memberof CafeBlock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeBlock} CafeBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeBlock.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeBlock();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.token = reader.string();
                break;
            case 2:
                message.rawData = reader.bytes();
                break;
            case 3:
                message.cid = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeBlock message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeBlock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeBlock} CafeBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeBlock.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeBlock message.
     * @function verify
     * @memberof CafeBlock
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeBlock.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.token != null && message.hasOwnProperty("token"))
            if (!$util.isString(message.token))
                return "token: string expected";
        if (message.rawData != null && message.hasOwnProperty("rawData"))
            if (!(message.rawData && typeof message.rawData.length === "number" || $util.isString(message.rawData)))
                return "rawData: buffer expected";
        if (message.cid != null && message.hasOwnProperty("cid"))
            if (!$util.isString(message.cid))
                return "cid: string expected";
        return null;
    };

    /**
     * Creates a CafeBlock message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeBlock
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeBlock} CafeBlock
     */
    CafeBlock.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeBlock)
            return object;
        let message = new $root.CafeBlock();
        if (object.token != null)
            message.token = String(object.token);
        if (object.rawData != null)
            if (typeof object.rawData === "string")
                $util.base64.decode(object.rawData, message.rawData = $util.newBuffer($util.base64.length(object.rawData)), 0);
            else if (object.rawData.length)
                message.rawData = object.rawData;
        if (object.cid != null)
            message.cid = String(object.cid);
        return message;
    };

    /**
     * Creates a plain object from a CafeBlock message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeBlock
     * @static
     * @param {CafeBlock} message CafeBlock
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeBlock.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.token = "";
            if (options.bytes === String)
                object.rawData = "";
            else {
                object.rawData = [];
                if (options.bytes !== Array)
                    object.rawData = $util.newBuffer(object.rawData);
            }
            object.cid = "";
        }
        if (message.token != null && message.hasOwnProperty("token"))
            object.token = message.token;
        if (message.rawData != null && message.hasOwnProperty("rawData"))
            object.rawData = options.bytes === String ? $util.base64.encode(message.rawData, 0, message.rawData.length) : options.bytes === Array ? Array.prototype.slice.call(message.rawData) : message.rawData;
        if (message.cid != null && message.hasOwnProperty("cid"))
            object.cid = message.cid;
        return object;
    };

    /**
     * Converts this CafeBlock to JSON.
     * @function toJSON
     * @memberof CafeBlock
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeBlock.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeBlock;
})();

export const CafeStoreThread = $root.CafeStoreThread = (() => {

    /**
     * Properties of a CafeStoreThread.
     * @exports ICafeStoreThread
     * @interface ICafeStoreThread
     * @property {string|null} [token] CafeStoreThread token
     * @property {string|null} [id] CafeStoreThread id
     * @property {Uint8Array|null} [ciphertext] CafeStoreThread ciphertext
     */

    /**
     * Constructs a new CafeStoreThread.
     * @exports CafeStoreThread
     * @classdesc Represents a CafeStoreThread.
     * @implements ICafeStoreThread
     * @constructor
     * @param {ICafeStoreThread=} [properties] Properties to set
     */
    function CafeStoreThread(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeStoreThread token.
     * @member {string} token
     * @memberof CafeStoreThread
     * @instance
     */
    CafeStoreThread.prototype.token = "";

    /**
     * CafeStoreThread id.
     * @member {string} id
     * @memberof CafeStoreThread
     * @instance
     */
    CafeStoreThread.prototype.id = "";

    /**
     * CafeStoreThread ciphertext.
     * @member {Uint8Array} ciphertext
     * @memberof CafeStoreThread
     * @instance
     */
    CafeStoreThread.prototype.ciphertext = $util.newBuffer([]);

    /**
     * Creates a new CafeStoreThread instance using the specified properties.
     * @function create
     * @memberof CafeStoreThread
     * @static
     * @param {ICafeStoreThread=} [properties] Properties to set
     * @returns {CafeStoreThread} CafeStoreThread instance
     */
    CafeStoreThread.create = function create(properties) {
        return new CafeStoreThread(properties);
    };

    /**
     * Encodes the specified CafeStoreThread message. Does not implicitly {@link CafeStoreThread.verify|verify} messages.
     * @function encode
     * @memberof CafeStoreThread
     * @static
     * @param {ICafeStoreThread} message CafeStoreThread message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeStoreThread.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.token != null && message.hasOwnProperty("token"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.token);
        if (message.id != null && message.hasOwnProperty("id"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.id);
        if (message.ciphertext != null && message.hasOwnProperty("ciphertext"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.ciphertext);
        return writer;
    };

    /**
     * Encodes the specified CafeStoreThread message, length delimited. Does not implicitly {@link CafeStoreThread.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeStoreThread
     * @static
     * @param {ICafeStoreThread} message CafeStoreThread message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeStoreThread.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeStoreThread message from the specified reader or buffer.
     * @function decode
     * @memberof CafeStoreThread
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeStoreThread} CafeStoreThread
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeStoreThread.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeStoreThread();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.token = reader.string();
                break;
            case 2:
                message.id = reader.string();
                break;
            case 3:
                message.ciphertext = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeStoreThread message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeStoreThread
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeStoreThread} CafeStoreThread
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeStoreThread.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeStoreThread message.
     * @function verify
     * @memberof CafeStoreThread
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeStoreThread.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.token != null && message.hasOwnProperty("token"))
            if (!$util.isString(message.token))
                return "token: string expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.ciphertext != null && message.hasOwnProperty("ciphertext"))
            if (!(message.ciphertext && typeof message.ciphertext.length === "number" || $util.isString(message.ciphertext)))
                return "ciphertext: buffer expected";
        return null;
    };

    /**
     * Creates a CafeStoreThread message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeStoreThread
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeStoreThread} CafeStoreThread
     */
    CafeStoreThread.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeStoreThread)
            return object;
        let message = new $root.CafeStoreThread();
        if (object.token != null)
            message.token = String(object.token);
        if (object.id != null)
            message.id = String(object.id);
        if (object.ciphertext != null)
            if (typeof object.ciphertext === "string")
                $util.base64.decode(object.ciphertext, message.ciphertext = $util.newBuffer($util.base64.length(object.ciphertext)), 0);
            else if (object.ciphertext.length)
                message.ciphertext = object.ciphertext;
        return message;
    };

    /**
     * Creates a plain object from a CafeStoreThread message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeStoreThread
     * @static
     * @param {CafeStoreThread} message CafeStoreThread
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeStoreThread.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.token = "";
            object.id = "";
            if (options.bytes === String)
                object.ciphertext = "";
            else {
                object.ciphertext = [];
                if (options.bytes !== Array)
                    object.ciphertext = $util.newBuffer(object.ciphertext);
            }
        }
        if (message.token != null && message.hasOwnProperty("token"))
            object.token = message.token;
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.ciphertext != null && message.hasOwnProperty("ciphertext"))
            object.ciphertext = options.bytes === String ? $util.base64.encode(message.ciphertext, 0, message.ciphertext.length) : options.bytes === Array ? Array.prototype.slice.call(message.ciphertext) : message.ciphertext;
        return object;
    };

    /**
     * Converts this CafeStoreThread to JSON.
     * @function toJSON
     * @memberof CafeStoreThread
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeStoreThread.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeStoreThread;
})();

export const CafeThread = $root.CafeThread = (() => {

    /**
     * Properties of a CafeThread.
     * @exports ICafeThread
     * @interface ICafeThread
     * @property {string|null} [key] CafeThread key
     * @property {Uint8Array|null} [sk] CafeThread sk
     * @property {string|null} [name] CafeThread name
     * @property {string|null} [schema] CafeThread schema
     * @property {string|null} [initiator] CafeThread initiator
     * @property {number|null} [type] CafeThread type
     * @property {number|null} [state] CafeThread state
     * @property {string|null} [head] CafeThread head
     */

    /**
     * Constructs a new CafeThread.
     * @exports CafeThread
     * @classdesc Represents a CafeThread.
     * @implements ICafeThread
     * @constructor
     * @param {ICafeThread=} [properties] Properties to set
     */
    function CafeThread(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeThread key.
     * @member {string} key
     * @memberof CafeThread
     * @instance
     */
    CafeThread.prototype.key = "";

    /**
     * CafeThread sk.
     * @member {Uint8Array} sk
     * @memberof CafeThread
     * @instance
     */
    CafeThread.prototype.sk = $util.newBuffer([]);

    /**
     * CafeThread name.
     * @member {string} name
     * @memberof CafeThread
     * @instance
     */
    CafeThread.prototype.name = "";

    /**
     * CafeThread schema.
     * @member {string} schema
     * @memberof CafeThread
     * @instance
     */
    CafeThread.prototype.schema = "";

    /**
     * CafeThread initiator.
     * @member {string} initiator
     * @memberof CafeThread
     * @instance
     */
    CafeThread.prototype.initiator = "";

    /**
     * CafeThread type.
     * @member {number} type
     * @memberof CafeThread
     * @instance
     */
    CafeThread.prototype.type = 0;

    /**
     * CafeThread state.
     * @member {number} state
     * @memberof CafeThread
     * @instance
     */
    CafeThread.prototype.state = 0;

    /**
     * CafeThread head.
     * @member {string} head
     * @memberof CafeThread
     * @instance
     */
    CafeThread.prototype.head = "";

    /**
     * Creates a new CafeThread instance using the specified properties.
     * @function create
     * @memberof CafeThread
     * @static
     * @param {ICafeThread=} [properties] Properties to set
     * @returns {CafeThread} CafeThread instance
     */
    CafeThread.create = function create(properties) {
        return new CafeThread(properties);
    };

    /**
     * Encodes the specified CafeThread message. Does not implicitly {@link CafeThread.verify|verify} messages.
     * @function encode
     * @memberof CafeThread
     * @static
     * @param {ICafeThread} message CafeThread message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeThread.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
        if (message.sk != null && message.hasOwnProperty("sk"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.sk);
        if (message.name != null && message.hasOwnProperty("name"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
        if (message.schema != null && message.hasOwnProperty("schema"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.schema);
        if (message.initiator != null && message.hasOwnProperty("initiator"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.initiator);
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.type);
        if (message.state != null && message.hasOwnProperty("state"))
            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.state);
        if (message.head != null && message.hasOwnProperty("head"))
            writer.uint32(/* id 8, wireType 2 =*/66).string(message.head);
        return writer;
    };

    /**
     * Encodes the specified CafeThread message, length delimited. Does not implicitly {@link CafeThread.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeThread
     * @static
     * @param {ICafeThread} message CafeThread message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeThread.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeThread message from the specified reader or buffer.
     * @function decode
     * @memberof CafeThread
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeThread} CafeThread
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeThread.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeThread();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.key = reader.string();
                break;
            case 2:
                message.sk = reader.bytes();
                break;
            case 3:
                message.name = reader.string();
                break;
            case 4:
                message.schema = reader.string();
                break;
            case 5:
                message.initiator = reader.string();
                break;
            case 6:
                message.type = reader.int32();
                break;
            case 7:
                message.state = reader.int32();
                break;
            case 8:
                message.head = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeThread message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeThread
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeThread} CafeThread
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeThread.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeThread message.
     * @function verify
     * @memberof CafeThread
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeThread.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!$util.isString(message.key))
                return "key: string expected";
        if (message.sk != null && message.hasOwnProperty("sk"))
            if (!(message.sk && typeof message.sk.length === "number" || $util.isString(message.sk)))
                return "sk: buffer expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.schema != null && message.hasOwnProperty("schema"))
            if (!$util.isString(message.schema))
                return "schema: string expected";
        if (message.initiator != null && message.hasOwnProperty("initiator"))
            if (!$util.isString(message.initiator))
                return "initiator: string expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isInteger(message.type))
                return "type: integer expected";
        if (message.state != null && message.hasOwnProperty("state"))
            if (!$util.isInteger(message.state))
                return "state: integer expected";
        if (message.head != null && message.hasOwnProperty("head"))
            if (!$util.isString(message.head))
                return "head: string expected";
        return null;
    };

    /**
     * Creates a CafeThread message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeThread
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeThread} CafeThread
     */
    CafeThread.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeThread)
            return object;
        let message = new $root.CafeThread();
        if (object.key != null)
            message.key = String(object.key);
        if (object.sk != null)
            if (typeof object.sk === "string")
                $util.base64.decode(object.sk, message.sk = $util.newBuffer($util.base64.length(object.sk)), 0);
            else if (object.sk.length)
                message.sk = object.sk;
        if (object.name != null)
            message.name = String(object.name);
        if (object.schema != null)
            message.schema = String(object.schema);
        if (object.initiator != null)
            message.initiator = String(object.initiator);
        if (object.type != null)
            message.type = object.type | 0;
        if (object.state != null)
            message.state = object.state | 0;
        if (object.head != null)
            message.head = String(object.head);
        return message;
    };

    /**
     * Creates a plain object from a CafeThread message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeThread
     * @static
     * @param {CafeThread} message CafeThread
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeThread.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.key = "";
            if (options.bytes === String)
                object.sk = "";
            else {
                object.sk = [];
                if (options.bytes !== Array)
                    object.sk = $util.newBuffer(object.sk);
            }
            object.name = "";
            object.schema = "";
            object.initiator = "";
            object.type = 0;
            object.state = 0;
            object.head = "";
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = message.key;
        if (message.sk != null && message.hasOwnProperty("sk"))
            object.sk = options.bytes === String ? $util.base64.encode(message.sk, 0, message.sk.length) : options.bytes === Array ? Array.prototype.slice.call(message.sk) : message.sk;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.schema != null && message.hasOwnProperty("schema"))
            object.schema = message.schema;
        if (message.initiator != null && message.hasOwnProperty("initiator"))
            object.initiator = message.initiator;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.state != null && message.hasOwnProperty("state"))
            object.state = message.state;
        if (message.head != null && message.hasOwnProperty("head"))
            object.head = message.head;
        return object;
    };

    /**
     * Converts this CafeThread to JSON.
     * @function toJSON
     * @memberof CafeThread
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeThread.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeThread;
})();

export const CafeStored = $root.CafeStored = (() => {

    /**
     * Properties of a CafeStored.
     * @exports ICafeStored
     * @interface ICafeStored
     * @property {string|null} [id] CafeStored id
     */

    /**
     * Constructs a new CafeStored.
     * @exports CafeStored
     * @classdesc Represents a CafeStored.
     * @implements ICafeStored
     * @constructor
     * @param {ICafeStored=} [properties] Properties to set
     */
    function CafeStored(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeStored id.
     * @member {string} id
     * @memberof CafeStored
     * @instance
     */
    CafeStored.prototype.id = "";

    /**
     * Creates a new CafeStored instance using the specified properties.
     * @function create
     * @memberof CafeStored
     * @static
     * @param {ICafeStored=} [properties] Properties to set
     * @returns {CafeStored} CafeStored instance
     */
    CafeStored.create = function create(properties) {
        return new CafeStored(properties);
    };

    /**
     * Encodes the specified CafeStored message. Does not implicitly {@link CafeStored.verify|verify} messages.
     * @function encode
     * @memberof CafeStored
     * @static
     * @param {ICafeStored} message CafeStored message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeStored.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && message.hasOwnProperty("id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        return writer;
    };

    /**
     * Encodes the specified CafeStored message, length delimited. Does not implicitly {@link CafeStored.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeStored
     * @static
     * @param {ICafeStored} message CafeStored message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeStored.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeStored message from the specified reader or buffer.
     * @function decode
     * @memberof CafeStored
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeStored} CafeStored
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeStored.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeStored();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeStored message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeStored
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeStored} CafeStored
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeStored.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeStored message.
     * @function verify
     * @memberof CafeStored
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeStored.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        return null;
    };

    /**
     * Creates a CafeStored message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeStored
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeStored} CafeStored
     */
    CafeStored.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeStored)
            return object;
        let message = new $root.CafeStored();
        if (object.id != null)
            message.id = String(object.id);
        return message;
    };

    /**
     * Creates a plain object from a CafeStored message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeStored
     * @static
     * @param {CafeStored} message CafeStored
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeStored.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.id = "";
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        return object;
    };

    /**
     * Converts this CafeStored to JSON.
     * @function toJSON
     * @memberof CafeStored
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeStored.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeStored;
})();

export const CafeDeliverMessage = $root.CafeDeliverMessage = (() => {

    /**
     * Properties of a CafeDeliverMessage.
     * @exports ICafeDeliverMessage
     * @interface ICafeDeliverMessage
     * @property {string|null} [id] CafeDeliverMessage id
     * @property {string|null} [clientId] CafeDeliverMessage clientId
     */

    /**
     * Constructs a new CafeDeliverMessage.
     * @exports CafeDeliverMessage
     * @classdesc Represents a CafeDeliverMessage.
     * @implements ICafeDeliverMessage
     * @constructor
     * @param {ICafeDeliverMessage=} [properties] Properties to set
     */
    function CafeDeliverMessage(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeDeliverMessage id.
     * @member {string} id
     * @memberof CafeDeliverMessage
     * @instance
     */
    CafeDeliverMessage.prototype.id = "";

    /**
     * CafeDeliverMessage clientId.
     * @member {string} clientId
     * @memberof CafeDeliverMessage
     * @instance
     */
    CafeDeliverMessage.prototype.clientId = "";

    /**
     * Creates a new CafeDeliverMessage instance using the specified properties.
     * @function create
     * @memberof CafeDeliverMessage
     * @static
     * @param {ICafeDeliverMessage=} [properties] Properties to set
     * @returns {CafeDeliverMessage} CafeDeliverMessage instance
     */
    CafeDeliverMessage.create = function create(properties) {
        return new CafeDeliverMessage(properties);
    };

    /**
     * Encodes the specified CafeDeliverMessage message. Does not implicitly {@link CafeDeliverMessage.verify|verify} messages.
     * @function encode
     * @memberof CafeDeliverMessage
     * @static
     * @param {ICafeDeliverMessage} message CafeDeliverMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeDeliverMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && message.hasOwnProperty("id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.clientId != null && message.hasOwnProperty("clientId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.clientId);
        return writer;
    };

    /**
     * Encodes the specified CafeDeliverMessage message, length delimited. Does not implicitly {@link CafeDeliverMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeDeliverMessage
     * @static
     * @param {ICafeDeliverMessage} message CafeDeliverMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeDeliverMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeDeliverMessage message from the specified reader or buffer.
     * @function decode
     * @memberof CafeDeliverMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeDeliverMessage} CafeDeliverMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeDeliverMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeDeliverMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.clientId = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeDeliverMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeDeliverMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeDeliverMessage} CafeDeliverMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeDeliverMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeDeliverMessage message.
     * @function verify
     * @memberof CafeDeliverMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeDeliverMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.clientId != null && message.hasOwnProperty("clientId"))
            if (!$util.isString(message.clientId))
                return "clientId: string expected";
        return null;
    };

    /**
     * Creates a CafeDeliverMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeDeliverMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeDeliverMessage} CafeDeliverMessage
     */
    CafeDeliverMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeDeliverMessage)
            return object;
        let message = new $root.CafeDeliverMessage();
        if (object.id != null)
            message.id = String(object.id);
        if (object.clientId != null)
            message.clientId = String(object.clientId);
        return message;
    };

    /**
     * Creates a plain object from a CafeDeliverMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeDeliverMessage
     * @static
     * @param {CafeDeliverMessage} message CafeDeliverMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeDeliverMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = "";
            object.clientId = "";
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.clientId != null && message.hasOwnProperty("clientId"))
            object.clientId = message.clientId;
        return object;
    };

    /**
     * Converts this CafeDeliverMessage to JSON.
     * @function toJSON
     * @memberof CafeDeliverMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeDeliverMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeDeliverMessage;
})();

export const CafeCheckMessages = $root.CafeCheckMessages = (() => {

    /**
     * Properties of a CafeCheckMessages.
     * @exports ICafeCheckMessages
     * @interface ICafeCheckMessages
     * @property {string|null} [token] CafeCheckMessages token
     */

    /**
     * Constructs a new CafeCheckMessages.
     * @exports CafeCheckMessages
     * @classdesc Represents a CafeCheckMessages.
     * @implements ICafeCheckMessages
     * @constructor
     * @param {ICafeCheckMessages=} [properties] Properties to set
     */
    function CafeCheckMessages(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeCheckMessages token.
     * @member {string} token
     * @memberof CafeCheckMessages
     * @instance
     */
    CafeCheckMessages.prototype.token = "";

    /**
     * Creates a new CafeCheckMessages instance using the specified properties.
     * @function create
     * @memberof CafeCheckMessages
     * @static
     * @param {ICafeCheckMessages=} [properties] Properties to set
     * @returns {CafeCheckMessages} CafeCheckMessages instance
     */
    CafeCheckMessages.create = function create(properties) {
        return new CafeCheckMessages(properties);
    };

    /**
     * Encodes the specified CafeCheckMessages message. Does not implicitly {@link CafeCheckMessages.verify|verify} messages.
     * @function encode
     * @memberof CafeCheckMessages
     * @static
     * @param {ICafeCheckMessages} message CafeCheckMessages message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeCheckMessages.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.token != null && message.hasOwnProperty("token"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.token);
        return writer;
    };

    /**
     * Encodes the specified CafeCheckMessages message, length delimited. Does not implicitly {@link CafeCheckMessages.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeCheckMessages
     * @static
     * @param {ICafeCheckMessages} message CafeCheckMessages message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeCheckMessages.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeCheckMessages message from the specified reader or buffer.
     * @function decode
     * @memberof CafeCheckMessages
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeCheckMessages} CafeCheckMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeCheckMessages.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeCheckMessages();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.token = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeCheckMessages message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeCheckMessages
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeCheckMessages} CafeCheckMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeCheckMessages.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeCheckMessages message.
     * @function verify
     * @memberof CafeCheckMessages
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeCheckMessages.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.token != null && message.hasOwnProperty("token"))
            if (!$util.isString(message.token))
                return "token: string expected";
        return null;
    };

    /**
     * Creates a CafeCheckMessages message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeCheckMessages
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeCheckMessages} CafeCheckMessages
     */
    CafeCheckMessages.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeCheckMessages)
            return object;
        let message = new $root.CafeCheckMessages();
        if (object.token != null)
            message.token = String(object.token);
        return message;
    };

    /**
     * Creates a plain object from a CafeCheckMessages message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeCheckMessages
     * @static
     * @param {CafeCheckMessages} message CafeCheckMessages
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeCheckMessages.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.token = "";
        if (message.token != null && message.hasOwnProperty("token"))
            object.token = message.token;
        return object;
    };

    /**
     * Converts this CafeCheckMessages to JSON.
     * @function toJSON
     * @memberof CafeCheckMessages
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeCheckMessages.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeCheckMessages;
})();

export const CafeMessage = $root.CafeMessage = (() => {

    /**
     * Properties of a CafeMessage.
     * @exports ICafeMessage
     * @interface ICafeMessage
     * @property {string|null} [id] CafeMessage id
     * @property {string|null} [peerId] CafeMessage peerId
     * @property {google.protobuf.ITimestamp|null} [date] CafeMessage date
     */

    /**
     * Constructs a new CafeMessage.
     * @exports CafeMessage
     * @classdesc Represents a CafeMessage.
     * @implements ICafeMessage
     * @constructor
     * @param {ICafeMessage=} [properties] Properties to set
     */
    function CafeMessage(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeMessage id.
     * @member {string} id
     * @memberof CafeMessage
     * @instance
     */
    CafeMessage.prototype.id = "";

    /**
     * CafeMessage peerId.
     * @member {string} peerId
     * @memberof CafeMessage
     * @instance
     */
    CafeMessage.prototype.peerId = "";

    /**
     * CafeMessage date.
     * @member {google.protobuf.ITimestamp|null|undefined} date
     * @memberof CafeMessage
     * @instance
     */
    CafeMessage.prototype.date = null;

    /**
     * Creates a new CafeMessage instance using the specified properties.
     * @function create
     * @memberof CafeMessage
     * @static
     * @param {ICafeMessage=} [properties] Properties to set
     * @returns {CafeMessage} CafeMessage instance
     */
    CafeMessage.create = function create(properties) {
        return new CafeMessage(properties);
    };

    /**
     * Encodes the specified CafeMessage message. Does not implicitly {@link CafeMessage.verify|verify} messages.
     * @function encode
     * @memberof CafeMessage
     * @static
     * @param {ICafeMessage} message CafeMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && message.hasOwnProperty("id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.peerId != null && message.hasOwnProperty("peerId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.peerId);
        if (message.date != null && message.hasOwnProperty("date"))
            $root.google.protobuf.Timestamp.encode(message.date, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified CafeMessage message, length delimited. Does not implicitly {@link CafeMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeMessage
     * @static
     * @param {ICafeMessage} message CafeMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeMessage message from the specified reader or buffer.
     * @function decode
     * @memberof CafeMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeMessage} CafeMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.peerId = reader.string();
                break;
            case 3:
                message.date = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeMessage} CafeMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeMessage message.
     * @function verify
     * @memberof CafeMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.peerId != null && message.hasOwnProperty("peerId"))
            if (!$util.isString(message.peerId))
                return "peerId: string expected";
        if (message.date != null && message.hasOwnProperty("date")) {
            let error = $root.google.protobuf.Timestamp.verify(message.date);
            if (error)
                return "date." + error;
        }
        return null;
    };

    /**
     * Creates a CafeMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeMessage} CafeMessage
     */
    CafeMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeMessage)
            return object;
        let message = new $root.CafeMessage();
        if (object.id != null)
            message.id = String(object.id);
        if (object.peerId != null)
            message.peerId = String(object.peerId);
        if (object.date != null) {
            if (typeof object.date !== "object")
                throw TypeError(".CafeMessage.date: object expected");
            message.date = $root.google.protobuf.Timestamp.fromObject(object.date);
        }
        return message;
    };

    /**
     * Creates a plain object from a CafeMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeMessage
     * @static
     * @param {CafeMessage} message CafeMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = "";
            object.peerId = "";
            object.date = null;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.peerId != null && message.hasOwnProperty("peerId"))
            object.peerId = message.peerId;
        if (message.date != null && message.hasOwnProperty("date"))
            object.date = $root.google.protobuf.Timestamp.toObject(message.date, options);
        return object;
    };

    /**
     * Converts this CafeMessage to JSON.
     * @function toJSON
     * @memberof CafeMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeMessage;
})();

export const CafeMessages = $root.CafeMessages = (() => {

    /**
     * Properties of a CafeMessages.
     * @exports ICafeMessages
     * @interface ICafeMessages
     * @property {Array.<ICafeMessage>|null} [messages] CafeMessages messages
     */

    /**
     * Constructs a new CafeMessages.
     * @exports CafeMessages
     * @classdesc Represents a CafeMessages.
     * @implements ICafeMessages
     * @constructor
     * @param {ICafeMessages=} [properties] Properties to set
     */
    function CafeMessages(properties) {
        this.messages = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeMessages messages.
     * @member {Array.<ICafeMessage>} messages
     * @memberof CafeMessages
     * @instance
     */
    CafeMessages.prototype.messages = $util.emptyArray;

    /**
     * Creates a new CafeMessages instance using the specified properties.
     * @function create
     * @memberof CafeMessages
     * @static
     * @param {ICafeMessages=} [properties] Properties to set
     * @returns {CafeMessages} CafeMessages instance
     */
    CafeMessages.create = function create(properties) {
        return new CafeMessages(properties);
    };

    /**
     * Encodes the specified CafeMessages message. Does not implicitly {@link CafeMessages.verify|verify} messages.
     * @function encode
     * @memberof CafeMessages
     * @static
     * @param {ICafeMessages} message CafeMessages message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeMessages.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.messages != null && message.messages.length)
            for (let i = 0; i < message.messages.length; ++i)
                $root.CafeMessage.encode(message.messages[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified CafeMessages message, length delimited. Does not implicitly {@link CafeMessages.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeMessages
     * @static
     * @param {ICafeMessages} message CafeMessages message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeMessages.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeMessages message from the specified reader or buffer.
     * @function decode
     * @memberof CafeMessages
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeMessages} CafeMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeMessages.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeMessages();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.messages && message.messages.length))
                    message.messages = [];
                message.messages.push($root.CafeMessage.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeMessages message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeMessages
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeMessages} CafeMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeMessages.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeMessages message.
     * @function verify
     * @memberof CafeMessages
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeMessages.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.messages != null && message.hasOwnProperty("messages")) {
            if (!Array.isArray(message.messages))
                return "messages: array expected";
            for (let i = 0; i < message.messages.length; ++i) {
                let error = $root.CafeMessage.verify(message.messages[i]);
                if (error)
                    return "messages." + error;
            }
        }
        return null;
    };

    /**
     * Creates a CafeMessages message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeMessages
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeMessages} CafeMessages
     */
    CafeMessages.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeMessages)
            return object;
        let message = new $root.CafeMessages();
        if (object.messages) {
            if (!Array.isArray(object.messages))
                throw TypeError(".CafeMessages.messages: array expected");
            message.messages = [];
            for (let i = 0; i < object.messages.length; ++i) {
                if (typeof object.messages[i] !== "object")
                    throw TypeError(".CafeMessages.messages: object expected");
                message.messages[i] = $root.CafeMessage.fromObject(object.messages[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a CafeMessages message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeMessages
     * @static
     * @param {CafeMessages} message CafeMessages
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeMessages.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.messages = [];
        if (message.messages && message.messages.length) {
            object.messages = [];
            for (let j = 0; j < message.messages.length; ++j)
                object.messages[j] = $root.CafeMessage.toObject(message.messages[j], options);
        }
        return object;
    };

    /**
     * Converts this CafeMessages to JSON.
     * @function toJSON
     * @memberof CafeMessages
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeMessages.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeMessages;
})();

export const CafeDeleteMessages = $root.CafeDeleteMessages = (() => {

    /**
     * Properties of a CafeDeleteMessages.
     * @exports ICafeDeleteMessages
     * @interface ICafeDeleteMessages
     * @property {string|null} [token] CafeDeleteMessages token
     */

    /**
     * Constructs a new CafeDeleteMessages.
     * @exports CafeDeleteMessages
     * @classdesc Represents a CafeDeleteMessages.
     * @implements ICafeDeleteMessages
     * @constructor
     * @param {ICafeDeleteMessages=} [properties] Properties to set
     */
    function CafeDeleteMessages(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeDeleteMessages token.
     * @member {string} token
     * @memberof CafeDeleteMessages
     * @instance
     */
    CafeDeleteMessages.prototype.token = "";

    /**
     * Creates a new CafeDeleteMessages instance using the specified properties.
     * @function create
     * @memberof CafeDeleteMessages
     * @static
     * @param {ICafeDeleteMessages=} [properties] Properties to set
     * @returns {CafeDeleteMessages} CafeDeleteMessages instance
     */
    CafeDeleteMessages.create = function create(properties) {
        return new CafeDeleteMessages(properties);
    };

    /**
     * Encodes the specified CafeDeleteMessages message. Does not implicitly {@link CafeDeleteMessages.verify|verify} messages.
     * @function encode
     * @memberof CafeDeleteMessages
     * @static
     * @param {ICafeDeleteMessages} message CafeDeleteMessages message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeDeleteMessages.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.token != null && message.hasOwnProperty("token"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.token);
        return writer;
    };

    /**
     * Encodes the specified CafeDeleteMessages message, length delimited. Does not implicitly {@link CafeDeleteMessages.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeDeleteMessages
     * @static
     * @param {ICafeDeleteMessages} message CafeDeleteMessages message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeDeleteMessages.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeDeleteMessages message from the specified reader or buffer.
     * @function decode
     * @memberof CafeDeleteMessages
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeDeleteMessages} CafeDeleteMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeDeleteMessages.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeDeleteMessages();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.token = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeDeleteMessages message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeDeleteMessages
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeDeleteMessages} CafeDeleteMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeDeleteMessages.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeDeleteMessages message.
     * @function verify
     * @memberof CafeDeleteMessages
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeDeleteMessages.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.token != null && message.hasOwnProperty("token"))
            if (!$util.isString(message.token))
                return "token: string expected";
        return null;
    };

    /**
     * Creates a CafeDeleteMessages message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeDeleteMessages
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeDeleteMessages} CafeDeleteMessages
     */
    CafeDeleteMessages.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeDeleteMessages)
            return object;
        let message = new $root.CafeDeleteMessages();
        if (object.token != null)
            message.token = String(object.token);
        return message;
    };

    /**
     * Creates a plain object from a CafeDeleteMessages message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeDeleteMessages
     * @static
     * @param {CafeDeleteMessages} message CafeDeleteMessages
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeDeleteMessages.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.token = "";
        if (message.token != null && message.hasOwnProperty("token"))
            object.token = message.token;
        return object;
    };

    /**
     * Converts this CafeDeleteMessages to JSON.
     * @function toJSON
     * @memberof CafeDeleteMessages
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeDeleteMessages.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeDeleteMessages;
})();

export const CafeDeleteMessagesAck = $root.CafeDeleteMessagesAck = (() => {

    /**
     * Properties of a CafeDeleteMessagesAck.
     * @exports ICafeDeleteMessagesAck
     * @interface ICafeDeleteMessagesAck
     * @property {boolean|null} [more] CafeDeleteMessagesAck more
     */

    /**
     * Constructs a new CafeDeleteMessagesAck.
     * @exports CafeDeleteMessagesAck
     * @classdesc Represents a CafeDeleteMessagesAck.
     * @implements ICafeDeleteMessagesAck
     * @constructor
     * @param {ICafeDeleteMessagesAck=} [properties] Properties to set
     */
    function CafeDeleteMessagesAck(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CafeDeleteMessagesAck more.
     * @member {boolean} more
     * @memberof CafeDeleteMessagesAck
     * @instance
     */
    CafeDeleteMessagesAck.prototype.more = false;

    /**
     * Creates a new CafeDeleteMessagesAck instance using the specified properties.
     * @function create
     * @memberof CafeDeleteMessagesAck
     * @static
     * @param {ICafeDeleteMessagesAck=} [properties] Properties to set
     * @returns {CafeDeleteMessagesAck} CafeDeleteMessagesAck instance
     */
    CafeDeleteMessagesAck.create = function create(properties) {
        return new CafeDeleteMessagesAck(properties);
    };

    /**
     * Encodes the specified CafeDeleteMessagesAck message. Does not implicitly {@link CafeDeleteMessagesAck.verify|verify} messages.
     * @function encode
     * @memberof CafeDeleteMessagesAck
     * @static
     * @param {ICafeDeleteMessagesAck} message CafeDeleteMessagesAck message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeDeleteMessagesAck.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.more != null && message.hasOwnProperty("more"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.more);
        return writer;
    };

    /**
     * Encodes the specified CafeDeleteMessagesAck message, length delimited. Does not implicitly {@link CafeDeleteMessagesAck.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CafeDeleteMessagesAck
     * @static
     * @param {ICafeDeleteMessagesAck} message CafeDeleteMessagesAck message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CafeDeleteMessagesAck.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CafeDeleteMessagesAck message from the specified reader or buffer.
     * @function decode
     * @memberof CafeDeleteMessagesAck
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CafeDeleteMessagesAck} CafeDeleteMessagesAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeDeleteMessagesAck.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CafeDeleteMessagesAck();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.more = reader.bool();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CafeDeleteMessagesAck message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CafeDeleteMessagesAck
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CafeDeleteMessagesAck} CafeDeleteMessagesAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CafeDeleteMessagesAck.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CafeDeleteMessagesAck message.
     * @function verify
     * @memberof CafeDeleteMessagesAck
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CafeDeleteMessagesAck.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.more != null && message.hasOwnProperty("more"))
            if (typeof message.more !== "boolean")
                return "more: boolean expected";
        return null;
    };

    /**
     * Creates a CafeDeleteMessagesAck message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CafeDeleteMessagesAck
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CafeDeleteMessagesAck} CafeDeleteMessagesAck
     */
    CafeDeleteMessagesAck.fromObject = function fromObject(object) {
        if (object instanceof $root.CafeDeleteMessagesAck)
            return object;
        let message = new $root.CafeDeleteMessagesAck();
        if (object.more != null)
            message.more = Boolean(object.more);
        return message;
    };

    /**
     * Creates a plain object from a CafeDeleteMessagesAck message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CafeDeleteMessagesAck
     * @static
     * @param {CafeDeleteMessagesAck} message CafeDeleteMessagesAck
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CafeDeleteMessagesAck.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.more = false;
        if (message.more != null && message.hasOwnProperty("more"))
            object.more = message.more;
        return object;
    };

    /**
     * Converts this CafeDeleteMessagesAck to JSON.
     * @function toJSON
     * @memberof CafeDeleteMessagesAck
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CafeDeleteMessagesAck.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CafeDeleteMessagesAck;
})();

export const Message = $root.Message = (() => {

    /**
     * Properties of a Message.
     * @exports IMessage
     * @interface IMessage
     * @property {Message.Type|null} [type] Message type
     * @property {google.protobuf.IAny|null} [payload] Message payload
     * @property {number|null} [requestId] Message requestId
     * @property {boolean|null} [isResponse] Message isResponse
     */

    /**
     * Constructs a new Message.
     * @exports Message
     * @classdesc Represents a Message.
     * @implements IMessage
     * @constructor
     * @param {IMessage=} [properties] Properties to set
     */
    function Message(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Message type.
     * @member {Message.Type} type
     * @memberof Message
     * @instance
     */
    Message.prototype.type = 0;

    /**
     * Message payload.
     * @member {google.protobuf.IAny|null|undefined} payload
     * @memberof Message
     * @instance
     */
    Message.prototype.payload = null;

    /**
     * Message requestId.
     * @member {number} requestId
     * @memberof Message
     * @instance
     */
    Message.prototype.requestId = 0;

    /**
     * Message isResponse.
     * @member {boolean} isResponse
     * @memberof Message
     * @instance
     */
    Message.prototype.isResponse = false;

    /**
     * Creates a new Message instance using the specified properties.
     * @function create
     * @memberof Message
     * @static
     * @param {IMessage=} [properties] Properties to set
     * @returns {Message} Message instance
     */
    Message.create = function create(properties) {
        return new Message(properties);
    };

    /**
     * Encodes the specified Message message. Does not implicitly {@link Message.verify|verify} messages.
     * @function encode
     * @memberof Message
     * @static
     * @param {IMessage} message Message message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Message.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
        if (message.payload != null && message.hasOwnProperty("payload"))
            $root.google.protobuf.Any.encode(message.payload, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.requestId != null && message.hasOwnProperty("requestId"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.requestId);
        if (message.isResponse != null && message.hasOwnProperty("isResponse"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isResponse);
        return writer;
    };

    /**
     * Encodes the specified Message message, length delimited. Does not implicitly {@link Message.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Message
     * @static
     * @param {IMessage} message Message message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Message.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Message message from the specified reader or buffer.
     * @function decode
     * @memberof Message
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Message} Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Message.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Message();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.type = reader.int32();
                break;
            case 2:
                message.payload = $root.google.protobuf.Any.decode(reader, reader.uint32());
                break;
            case 3:
                message.requestId = reader.int32();
                break;
            case 4:
                message.isResponse = reader.bool();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Message message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Message
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Message} Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Message.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Message message.
     * @function verify
     * @memberof Message
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Message.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 10:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 58:
            case 59:
            case 60:
            case 61:
            case 62:
            case 63:
            case 64:
            case 500:
                break;
            }
        if (message.payload != null && message.hasOwnProperty("payload")) {
            let error = $root.google.protobuf.Any.verify(message.payload);
            if (error)
                return "payload." + error;
        }
        if (message.requestId != null && message.hasOwnProperty("requestId"))
            if (!$util.isInteger(message.requestId))
                return "requestId: integer expected";
        if (message.isResponse != null && message.hasOwnProperty("isResponse"))
            if (typeof message.isResponse !== "boolean")
                return "isResponse: boolean expected";
        return null;
    };

    /**
     * Creates a Message message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Message
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Message} Message
     */
    Message.fromObject = function fromObject(object) {
        if (object instanceof $root.Message)
            return object;
        let message = new $root.Message();
        switch (object.type) {
        case "PING":
        case 0:
            message.type = 0;
            break;
        case "PONG":
        case 1:
            message.type = 1;
            break;
        case "THREAD_ENVELOPE":
        case 10:
            message.type = 10;
            break;
        case "CAFE_CHALLENGE":
        case 50:
            message.type = 50;
            break;
        case "CAFE_NONCE":
        case 51:
            message.type = 51;
            break;
        case "CAFE_REGISTRATION":
        case 52:
            message.type = 52;
            break;
        case "CAFE_SESSION":
        case 53:
            message.type = 53;
            break;
        case "CAFE_REFRESH_SESSION":
        case 54:
            message.type = 54;
            break;
        case "CAFE_STORE":
        case 55:
            message.type = 55;
            break;
        case "CAFE_BLOCK":
        case 56:
            message.type = 56;
            break;
        case "CAFE_BLOCKLIST":
        case 57:
            message.type = 57;
            break;
        case "CAFE_STORE_THREAD":
        case 58:
            message.type = 58;
            break;
        case "CAFE_STORED":
        case 59:
            message.type = 59;
            break;
        case "CAFE_DELIVER_MESSAGE":
        case 60:
            message.type = 60;
            break;
        case "CAFE_CHECK_MESSAGES":
        case 61:
            message.type = 61;
            break;
        case "CAFE_MESSAGES":
        case 62:
            message.type = 62;
            break;
        case "CAFE_DELETE_MESSAGES":
        case 63:
            message.type = 63;
            break;
        case "CAFE_DELETE_MESSAGES_ACK":
        case 64:
            message.type = 64;
            break;
        case "ERROR":
        case 500:
            message.type = 500;
            break;
        }
        if (object.payload != null) {
            if (typeof object.payload !== "object")
                throw TypeError(".Message.payload: object expected");
            message.payload = $root.google.protobuf.Any.fromObject(object.payload);
        }
        if (object.requestId != null)
            message.requestId = object.requestId | 0;
        if (object.isResponse != null)
            message.isResponse = Boolean(object.isResponse);
        return message;
    };

    /**
     * Creates a plain object from a Message message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Message
     * @static
     * @param {Message} message Message
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Message.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.type = options.enums === String ? "PING" : 0;
            object.payload = null;
            object.requestId = 0;
            object.isResponse = false;
        }
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.Message.Type[message.type] : message.type;
        if (message.payload != null && message.hasOwnProperty("payload"))
            object.payload = $root.google.protobuf.Any.toObject(message.payload, options);
        if (message.requestId != null && message.hasOwnProperty("requestId"))
            object.requestId = message.requestId;
        if (message.isResponse != null && message.hasOwnProperty("isResponse"))
            object.isResponse = message.isResponse;
        return object;
    };

    /**
     * Converts this Message to JSON.
     * @function toJSON
     * @memberof Message
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Message.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name Message.Type
     * @enum {string}
     * @property {number} PING=0 PING value
     * @property {number} PONG=1 PONG value
     * @property {number} THREAD_ENVELOPE=10 THREAD_ENVELOPE value
     * @property {number} CAFE_CHALLENGE=50 CAFE_CHALLENGE value
     * @property {number} CAFE_NONCE=51 CAFE_NONCE value
     * @property {number} CAFE_REGISTRATION=52 CAFE_REGISTRATION value
     * @property {number} CAFE_SESSION=53 CAFE_SESSION value
     * @property {number} CAFE_REFRESH_SESSION=54 CAFE_REFRESH_SESSION value
     * @property {number} CAFE_STORE=55 CAFE_STORE value
     * @property {number} CAFE_BLOCK=56 CAFE_BLOCK value
     * @property {number} CAFE_BLOCKLIST=57 CAFE_BLOCKLIST value
     * @property {number} CAFE_STORE_THREAD=58 CAFE_STORE_THREAD value
     * @property {number} CAFE_STORED=59 CAFE_STORED value
     * @property {number} CAFE_DELIVER_MESSAGE=60 CAFE_DELIVER_MESSAGE value
     * @property {number} CAFE_CHECK_MESSAGES=61 CAFE_CHECK_MESSAGES value
     * @property {number} CAFE_MESSAGES=62 CAFE_MESSAGES value
     * @property {number} CAFE_DELETE_MESSAGES=63 CAFE_DELETE_MESSAGES value
     * @property {number} CAFE_DELETE_MESSAGES_ACK=64 CAFE_DELETE_MESSAGES_ACK value
     * @property {number} ERROR=500 ERROR value
     */
    Message.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "PING"] = 0;
        values[valuesById[1] = "PONG"] = 1;
        values[valuesById[10] = "THREAD_ENVELOPE"] = 10;
        values[valuesById[50] = "CAFE_CHALLENGE"] = 50;
        values[valuesById[51] = "CAFE_NONCE"] = 51;
        values[valuesById[52] = "CAFE_REGISTRATION"] = 52;
        values[valuesById[53] = "CAFE_SESSION"] = 53;
        values[valuesById[54] = "CAFE_REFRESH_SESSION"] = 54;
        values[valuesById[55] = "CAFE_STORE"] = 55;
        values[valuesById[56] = "CAFE_BLOCK"] = 56;
        values[valuesById[57] = "CAFE_BLOCKLIST"] = 57;
        values[valuesById[58] = "CAFE_STORE_THREAD"] = 58;
        values[valuesById[59] = "CAFE_STORED"] = 59;
        values[valuesById[60] = "CAFE_DELIVER_MESSAGE"] = 60;
        values[valuesById[61] = "CAFE_CHECK_MESSAGES"] = 61;
        values[valuesById[62] = "CAFE_MESSAGES"] = 62;
        values[valuesById[63] = "CAFE_DELETE_MESSAGES"] = 63;
        values[valuesById[64] = "CAFE_DELETE_MESSAGES_ACK"] = 64;
        values[valuesById[500] = "ERROR"] = 500;
        return values;
    })();

    return Message;
})();

export const Envelope = $root.Envelope = (() => {

    /**
     * Properties of an Envelope.
     * @exports IEnvelope
     * @interface IEnvelope
     * @property {IMessage|null} [message] Envelope message
     * @property {Uint8Array|null} [sig] Envelope sig
     */

    /**
     * Constructs a new Envelope.
     * @exports Envelope
     * @classdesc Represents an Envelope.
     * @implements IEnvelope
     * @constructor
     * @param {IEnvelope=} [properties] Properties to set
     */
    function Envelope(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Envelope message.
     * @member {IMessage|null|undefined} message
     * @memberof Envelope
     * @instance
     */
    Envelope.prototype.message = null;

    /**
     * Envelope sig.
     * @member {Uint8Array} sig
     * @memberof Envelope
     * @instance
     */
    Envelope.prototype.sig = $util.newBuffer([]);

    /**
     * Creates a new Envelope instance using the specified properties.
     * @function create
     * @memberof Envelope
     * @static
     * @param {IEnvelope=} [properties] Properties to set
     * @returns {Envelope} Envelope instance
     */
    Envelope.create = function create(properties) {
        return new Envelope(properties);
    };

    /**
     * Encodes the specified Envelope message. Does not implicitly {@link Envelope.verify|verify} messages.
     * @function encode
     * @memberof Envelope
     * @static
     * @param {IEnvelope} message Envelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Envelope.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.message != null && message.hasOwnProperty("message"))
            $root.Message.encode(message.message, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.sig != null && message.hasOwnProperty("sig"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.sig);
        return writer;
    };

    /**
     * Encodes the specified Envelope message, length delimited. Does not implicitly {@link Envelope.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Envelope
     * @static
     * @param {IEnvelope} message Envelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Envelope.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Envelope message from the specified reader or buffer.
     * @function decode
     * @memberof Envelope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Envelope} Envelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Envelope.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Envelope();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.message = $root.Message.decode(reader, reader.uint32());
                break;
            case 2:
                message.sig = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Envelope message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Envelope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Envelope} Envelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Envelope.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Envelope message.
     * @function verify
     * @memberof Envelope
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Envelope.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.message != null && message.hasOwnProperty("message")) {
            let error = $root.Message.verify(message.message);
            if (error)
                return "message." + error;
        }
        if (message.sig != null && message.hasOwnProperty("sig"))
            if (!(message.sig && typeof message.sig.length === "number" || $util.isString(message.sig)))
                return "sig: buffer expected";
        return null;
    };

    /**
     * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Envelope
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Envelope} Envelope
     */
    Envelope.fromObject = function fromObject(object) {
        if (object instanceof $root.Envelope)
            return object;
        let message = new $root.Envelope();
        if (object.message != null) {
            if (typeof object.message !== "object")
                throw TypeError(".Envelope.message: object expected");
            message.message = $root.Message.fromObject(object.message);
        }
        if (object.sig != null)
            if (typeof object.sig === "string")
                $util.base64.decode(object.sig, message.sig = $util.newBuffer($util.base64.length(object.sig)), 0);
            else if (object.sig.length)
                message.sig = object.sig;
        return message;
    };

    /**
     * Creates a plain object from an Envelope message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Envelope
     * @static
     * @param {Envelope} message Envelope
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Envelope.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.message = null;
            if (options.bytes === String)
                object.sig = "";
            else {
                object.sig = [];
                if (options.bytes !== Array)
                    object.sig = $util.newBuffer(object.sig);
            }
        }
        if (message.message != null && message.hasOwnProperty("message"))
            object.message = $root.Message.toObject(message.message, options);
        if (message.sig != null && message.hasOwnProperty("sig"))
            object.sig = options.bytes === String ? $util.base64.encode(message.sig, 0, message.sig.length) : options.bytes === Array ? Array.prototype.slice.call(message.sig) : message.sig;
        return object;
    };

    /**
     * Converts this Envelope to JSON.
     * @function toJSON
     * @memberof Envelope
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Envelope.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Envelope;
})();

export const Error = $root.Error = (() => {

    /**
     * Properties of an Error.
     * @exports IError
     * @interface IError
     * @property {number|null} [code] Error code
     * @property {string|null} [message] Error message
     */

    /**
     * Constructs a new Error.
     * @exports Error
     * @classdesc Represents an Error.
     * @implements IError
     * @constructor
     * @param {IError=} [properties] Properties to set
     */
    function Error(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Error code.
     * @member {number} code
     * @memberof Error
     * @instance
     */
    Error.prototype.code = 0;

    /**
     * Error message.
     * @member {string} message
     * @memberof Error
     * @instance
     */
    Error.prototype.message = "";

    /**
     * Creates a new Error instance using the specified properties.
     * @function create
     * @memberof Error
     * @static
     * @param {IError=} [properties] Properties to set
     * @returns {Error} Error instance
     */
    Error.create = function create(properties) {
        return new Error(properties);
    };

    /**
     * Encodes the specified Error message. Does not implicitly {@link Error.verify|verify} messages.
     * @function encode
     * @memberof Error
     * @static
     * @param {IError} message Error message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Error.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.code != null && message.hasOwnProperty("code"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.code);
        if (message.message != null && message.hasOwnProperty("message"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
        return writer;
    };

    /**
     * Encodes the specified Error message, length delimited. Does not implicitly {@link Error.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Error
     * @static
     * @param {IError} message Error message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Error.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Error message from the specified reader or buffer.
     * @function decode
     * @memberof Error
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Error} Error
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Error.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Error();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.code = reader.uint32();
                break;
            case 2:
                message.message = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Error message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Error
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Error} Error
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Error.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Error message.
     * @function verify
     * @memberof Error
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Error.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.code != null && message.hasOwnProperty("code"))
            if (!$util.isInteger(message.code))
                return "code: integer expected";
        if (message.message != null && message.hasOwnProperty("message"))
            if (!$util.isString(message.message))
                return "message: string expected";
        return null;
    };

    /**
     * Creates an Error message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Error
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Error} Error
     */
    Error.fromObject = function fromObject(object) {
        if (object instanceof $root.Error)
            return object;
        let message = new $root.Error();
        if (object.code != null)
            message.code = object.code >>> 0;
        if (object.message != null)
            message.message = String(object.message);
        return message;
    };

    /**
     * Creates a plain object from an Error message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Error
     * @static
     * @param {Error} message Error
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Error.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.code = 0;
            object.message = "";
        }
        if (message.code != null && message.hasOwnProperty("code"))
            object.code = message.code;
        if (message.message != null && message.hasOwnProperty("message"))
            object.message = message.message;
        return object;
    };

    /**
     * Converts this Error to JSON.
     * @function toJSON
     * @memberof Error
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Error.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Error;
})();

export const File = $root.File = (() => {

    /**
     * Properties of a File.
     * @exports IFile
     * @interface IFile
     * @property {string|null} [mill] File mill
     * @property {string|null} [checksum] File checksum
     * @property {string|null} [source] File source
     * @property {string|null} [opts] File opts
     * @property {string|null} [hash] File hash
     * @property {string|null} [key] File key
     * @property {string|null} [media] File media
     * @property {string|null} [name] File name
     * @property {number|Long|null} [size] File size
     * @property {google.protobuf.ITimestamp|null} [added] File added
     * @property {google.protobuf.IStruct|null} [meta] File meta
     */

    /**
     * Constructs a new File.
     * @exports File
     * @classdesc Represents a File.
     * @implements IFile
     * @constructor
     * @param {IFile=} [properties] Properties to set
     */
    function File(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * File mill.
     * @member {string} mill
     * @memberof File
     * @instance
     */
    File.prototype.mill = "";

    /**
     * File checksum.
     * @member {string} checksum
     * @memberof File
     * @instance
     */
    File.prototype.checksum = "";

    /**
     * File source.
     * @member {string} source
     * @memberof File
     * @instance
     */
    File.prototype.source = "";

    /**
     * File opts.
     * @member {string} opts
     * @memberof File
     * @instance
     */
    File.prototype.opts = "";

    /**
     * File hash.
     * @member {string} hash
     * @memberof File
     * @instance
     */
    File.prototype.hash = "";

    /**
     * File key.
     * @member {string} key
     * @memberof File
     * @instance
     */
    File.prototype.key = "";

    /**
     * File media.
     * @member {string} media
     * @memberof File
     * @instance
     */
    File.prototype.media = "";

    /**
     * File name.
     * @member {string} name
     * @memberof File
     * @instance
     */
    File.prototype.name = "";

    /**
     * File size.
     * @member {number|Long} size
     * @memberof File
     * @instance
     */
    File.prototype.size = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * File added.
     * @member {google.protobuf.ITimestamp|null|undefined} added
     * @memberof File
     * @instance
     */
    File.prototype.added = null;

    /**
     * File meta.
     * @member {google.protobuf.IStruct|null|undefined} meta
     * @memberof File
     * @instance
     */
    File.prototype.meta = null;

    /**
     * Creates a new File instance using the specified properties.
     * @function create
     * @memberof File
     * @static
     * @param {IFile=} [properties] Properties to set
     * @returns {File} File instance
     */
    File.create = function create(properties) {
        return new File(properties);
    };

    /**
     * Encodes the specified File message. Does not implicitly {@link File.verify|verify} messages.
     * @function encode
     * @memberof File
     * @static
     * @param {IFile} message File message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    File.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.mill != null && message.hasOwnProperty("mill"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.mill);
        if (message.checksum != null && message.hasOwnProperty("checksum"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.checksum);
        if (message.source != null && message.hasOwnProperty("source"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.source);
        if (message.opts != null && message.hasOwnProperty("opts"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.opts);
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.hash);
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.key);
        if (message.media != null && message.hasOwnProperty("media"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.media);
        if (message.name != null && message.hasOwnProperty("name"))
            writer.uint32(/* id 8, wireType 2 =*/66).string(message.name);
        if (message.size != null && message.hasOwnProperty("size"))
            writer.uint32(/* id 9, wireType 0 =*/72).int64(message.size);
        if (message.added != null && message.hasOwnProperty("added"))
            $root.google.protobuf.Timestamp.encode(message.added, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
        if (message.meta != null && message.hasOwnProperty("meta"))
            $root.google.protobuf.Struct.encode(message.meta, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified File message, length delimited. Does not implicitly {@link File.verify|verify} messages.
     * @function encodeDelimited
     * @memberof File
     * @static
     * @param {IFile} message File message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    File.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a File message from the specified reader or buffer.
     * @function decode
     * @memberof File
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {File} File
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    File.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.File();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.mill = reader.string();
                break;
            case 2:
                message.checksum = reader.string();
                break;
            case 3:
                message.source = reader.string();
                break;
            case 4:
                message.opts = reader.string();
                break;
            case 5:
                message.hash = reader.string();
                break;
            case 6:
                message.key = reader.string();
                break;
            case 7:
                message.media = reader.string();
                break;
            case 8:
                message.name = reader.string();
                break;
            case 9:
                message.size = reader.int64();
                break;
            case 10:
                message.added = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                break;
            case 11:
                message.meta = $root.google.protobuf.Struct.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a File message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof File
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {File} File
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    File.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a File message.
     * @function verify
     * @memberof File
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    File.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.mill != null && message.hasOwnProperty("mill"))
            if (!$util.isString(message.mill))
                return "mill: string expected";
        if (message.checksum != null && message.hasOwnProperty("checksum"))
            if (!$util.isString(message.checksum))
                return "checksum: string expected";
        if (message.source != null && message.hasOwnProperty("source"))
            if (!$util.isString(message.source))
                return "source: string expected";
        if (message.opts != null && message.hasOwnProperty("opts"))
            if (!$util.isString(message.opts))
                return "opts: string expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            if (!$util.isString(message.hash))
                return "hash: string expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!$util.isString(message.key))
                return "key: string expected";
        if (message.media != null && message.hasOwnProperty("media"))
            if (!$util.isString(message.media))
                return "media: string expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.size != null && message.hasOwnProperty("size"))
            if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                return "size: integer|Long expected";
        if (message.added != null && message.hasOwnProperty("added")) {
            let error = $root.google.protobuf.Timestamp.verify(message.added);
            if (error)
                return "added." + error;
        }
        if (message.meta != null && message.hasOwnProperty("meta")) {
            let error = $root.google.protobuf.Struct.verify(message.meta);
            if (error)
                return "meta." + error;
        }
        return null;
    };

    /**
     * Creates a File message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof File
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {File} File
     */
    File.fromObject = function fromObject(object) {
        if (object instanceof $root.File)
            return object;
        let message = new $root.File();
        if (object.mill != null)
            message.mill = String(object.mill);
        if (object.checksum != null)
            message.checksum = String(object.checksum);
        if (object.source != null)
            message.source = String(object.source);
        if (object.opts != null)
            message.opts = String(object.opts);
        if (object.hash != null)
            message.hash = String(object.hash);
        if (object.key != null)
            message.key = String(object.key);
        if (object.media != null)
            message.media = String(object.media);
        if (object.name != null)
            message.name = String(object.name);
        if (object.size != null)
            if ($util.Long)
                (message.size = $util.Long.fromValue(object.size)).unsigned = false;
            else if (typeof object.size === "string")
                message.size = parseInt(object.size, 10);
            else if (typeof object.size === "number")
                message.size = object.size;
            else if (typeof object.size === "object")
                message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber();
        if (object.added != null) {
            if (typeof object.added !== "object")
                throw TypeError(".File.added: object expected");
            message.added = $root.google.protobuf.Timestamp.fromObject(object.added);
        }
        if (object.meta != null) {
            if (typeof object.meta !== "object")
                throw TypeError(".File.meta: object expected");
            message.meta = $root.google.protobuf.Struct.fromObject(object.meta);
        }
        return message;
    };

    /**
     * Creates a plain object from a File message. Also converts values to other types if specified.
     * @function toObject
     * @memberof File
     * @static
     * @param {File} message File
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    File.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.mill = "";
            object.checksum = "";
            object.source = "";
            object.opts = "";
            object.hash = "";
            object.key = "";
            object.media = "";
            object.name = "";
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.size = options.longs === String ? "0" : 0;
            object.added = null;
            object.meta = null;
        }
        if (message.mill != null && message.hasOwnProperty("mill"))
            object.mill = message.mill;
        if (message.checksum != null && message.hasOwnProperty("checksum"))
            object.checksum = message.checksum;
        if (message.source != null && message.hasOwnProperty("source"))
            object.source = message.source;
        if (message.opts != null && message.hasOwnProperty("opts"))
            object.opts = message.opts;
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = message.hash;
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = message.key;
        if (message.media != null && message.hasOwnProperty("media"))
            object.media = message.media;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.size != null && message.hasOwnProperty("size"))
            if (typeof message.size === "number")
                object.size = options.longs === String ? String(message.size) : message.size;
            else
                object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber() : message.size;
        if (message.added != null && message.hasOwnProperty("added"))
            object.added = $root.google.protobuf.Timestamp.toObject(message.added, options);
        if (message.meta != null && message.hasOwnProperty("meta"))
            object.meta = $root.google.protobuf.Struct.toObject(message.meta, options);
        return object;
    };

    /**
     * Converts this File to JSON.
     * @function toJSON
     * @memberof File
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    File.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return File;
})();

export const google = $root.google = (() => {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    const google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        const protobuf = {};

        protobuf.Timestamp = (function() {

            /**
             * Properties of a Timestamp.
             * @memberof google.protobuf
             * @interface ITimestamp
             * @property {number|Long|null} [seconds] Timestamp seconds
             * @property {number|null} [nanos] Timestamp nanos
             */

            /**
             * Constructs a new Timestamp.
             * @memberof google.protobuf
             * @classdesc Represents a Timestamp.
             * @implements ITimestamp
             * @constructor
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             */
            function Timestamp(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Timestamp seconds.
             * @member {number|Long} seconds
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Timestamp nanos.
             * @member {number} nanos
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.nanos = 0;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             * @returns {google.protobuf.Timestamp} Timestamp instance
             */
            Timestamp.create = function create(properties) {
                return new Timestamp(properties);
            };

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                return writer;
            };

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Timestamp();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.seconds = reader.int64();
                        break;
                    case 2:
                        message.nanos = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Timestamp message.
             * @function verify
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Timestamp.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                        return "seconds: integer|Long expected";
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    if (!$util.isInteger(message.nanos))
                        return "nanos: integer expected";
                return null;
            };

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Timestamp} Timestamp
             */
            Timestamp.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Timestamp)
                    return object;
                let message = new $root.google.protobuf.Timestamp();
                if (object.seconds != null)
                    if ($util.Long)
                        (message.seconds = $util.Long.fromValue(object.seconds)).unsigned = false;
                    else if (typeof object.seconds === "string")
                        message.seconds = parseInt(object.seconds, 10);
                    else if (typeof object.seconds === "number")
                        message.seconds = object.seconds;
                    else if (typeof object.seconds === "object")
                        message.seconds = new $util.LongBits(object.seconds.low >>> 0, object.seconds.high >>> 0).toNumber();
                if (object.nanos != null)
                    message.nanos = object.nanos | 0;
                return message;
            };

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.Timestamp} message Timestamp
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Timestamp.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.seconds = options.longs === String ? "0" : 0;
                    object.nanos = 0;
                }
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (typeof message.seconds === "number")
                        object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                    else
                        object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    object.nanos = message.nanos;
                return object;
            };

            /**
             * Converts this Timestamp to JSON.
             * @function toJSON
             * @memberof google.protobuf.Timestamp
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Timestamp.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Timestamp;
        })();

        protobuf.Any = (function() {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type_url = reader.string();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @function verify
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Any)
                    return object;
                let message = new $root.google.protobuf.Any();
                if (object.type_url != null)
                    message.type_url = String(object.type_url);
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.type_url = "";
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    object.type_url = message.type_url;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this Any to JSON.
             * @function toJSON
             * @memberof google.protobuf.Any
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Any.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Any;
        })();

        protobuf.Struct = (function() {

            /**
             * Properties of a Struct.
             * @memberof google.protobuf
             * @interface IStruct
             * @property {Object.<string,google.protobuf.IValue>|null} [fields] Struct fields
             */

            /**
             * Constructs a new Struct.
             * @memberof google.protobuf
             * @classdesc Represents a Struct.
             * @implements IStruct
             * @constructor
             * @param {google.protobuf.IStruct=} [properties] Properties to set
             */
            function Struct(properties) {
                this.fields = {};
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Struct fields.
             * @member {Object.<string,google.protobuf.IValue>} fields
             * @memberof google.protobuf.Struct
             * @instance
             */
            Struct.prototype.fields = $util.emptyObject;

            /**
             * Creates a new Struct instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.IStruct=} [properties] Properties to set
             * @returns {google.protobuf.Struct} Struct instance
             */
            Struct.create = function create(properties) {
                return new Struct(properties);
            };

            /**
             * Encodes the specified Struct message. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.IStruct} message Struct message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Struct.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.fields != null && message.hasOwnProperty("fields"))
                    for (let keys = Object.keys(message.fields), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.google.protobuf.Value.encode(message.fields[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                return writer;
            };

            /**
             * Encodes the specified Struct message, length delimited. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.IStruct} message Struct message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Struct.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Struct message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Struct
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Struct} Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Struct.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Struct(), key;
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        reader.skip().pos++;
                        if (message.fields === $util.emptyObject)
                            message.fields = {};
                        key = reader.string();
                        reader.pos++;
                        message.fields[key] = $root.google.protobuf.Value.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Struct message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Struct
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Struct} Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Struct.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Struct message.
             * @function verify
             * @memberof google.protobuf.Struct
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Struct.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.fields != null && message.hasOwnProperty("fields")) {
                    if (!$util.isObject(message.fields))
                        return "fields: object expected";
                    let key = Object.keys(message.fields);
                    for (let i = 0; i < key.length; ++i) {
                        let error = $root.google.protobuf.Value.verify(message.fields[key[i]]);
                        if (error)
                            return "fields." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Struct message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Struct
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Struct} Struct
             */
            Struct.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Struct)
                    return object;
                let message = new $root.google.protobuf.Struct();
                if (object.fields) {
                    if (typeof object.fields !== "object")
                        throw TypeError(".google.protobuf.Struct.fields: object expected");
                    message.fields = {};
                    for (let keys = Object.keys(object.fields), i = 0; i < keys.length; ++i) {
                        if (typeof object.fields[keys[i]] !== "object")
                            throw TypeError(".google.protobuf.Struct.fields: object expected");
                        message.fields[keys[i]] = $root.google.protobuf.Value.fromObject(object.fields[keys[i]]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a Struct message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Struct
             * @static
             * @param {google.protobuf.Struct} message Struct
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Struct.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.objects || options.defaults)
                    object.fields = {};
                let keys2;
                if (message.fields && (keys2 = Object.keys(message.fields)).length) {
                    object.fields = {};
                    for (let j = 0; j < keys2.length; ++j)
                        object.fields[keys2[j]] = $root.google.protobuf.Value.toObject(message.fields[keys2[j]], options);
                }
                return object;
            };

            /**
             * Converts this Struct to JSON.
             * @function toJSON
             * @memberof google.protobuf.Struct
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Struct.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Struct;
        })();

        protobuf.Value = (function() {

            /**
             * Properties of a Value.
             * @memberof google.protobuf
             * @interface IValue
             * @property {google.protobuf.NullValue|null} [nullValue] Value nullValue
             * @property {number|null} [numberValue] Value numberValue
             * @property {string|null} [stringValue] Value stringValue
             * @property {boolean|null} [boolValue] Value boolValue
             * @property {google.protobuf.IStruct|null} [structValue] Value structValue
             * @property {google.protobuf.IListValue|null} [listValue] Value listValue
             */

            /**
             * Constructs a new Value.
             * @memberof google.protobuf
             * @classdesc Represents a Value.
             * @implements IValue
             * @constructor
             * @param {google.protobuf.IValue=} [properties] Properties to set
             */
            function Value(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Value nullValue.
             * @member {google.protobuf.NullValue} nullValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.nullValue = 0;

            /**
             * Value numberValue.
             * @member {number} numberValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.numberValue = 0;

            /**
             * Value stringValue.
             * @member {string} stringValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.stringValue = "";

            /**
             * Value boolValue.
             * @member {boolean} boolValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.boolValue = false;

            /**
             * Value structValue.
             * @member {google.protobuf.IStruct|null|undefined} structValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.structValue = null;

            /**
             * Value listValue.
             * @member {google.protobuf.IListValue|null|undefined} listValue
             * @memberof google.protobuf.Value
             * @instance
             */
            Value.prototype.listValue = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * Value kind.
             * @member {"nullValue"|"numberValue"|"stringValue"|"boolValue"|"structValue"|"listValue"|undefined} kind
             * @memberof google.protobuf.Value
             * @instance
             */
            Object.defineProperty(Value.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["nullValue", "numberValue", "stringValue", "boolValue", "structValue", "listValue"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.IValue=} [properties] Properties to set
             * @returns {google.protobuf.Value} Value instance
             */
            Value.create = function create(properties) {
                return new Value(properties);
            };

            /**
             * Encodes the specified Value message. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.IValue} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.nullValue != null && message.hasOwnProperty("nullValue"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nullValue);
                if (message.numberValue != null && message.hasOwnProperty("numberValue"))
                    writer.uint32(/* id 2, wireType 1 =*/17).double(message.numberValue);
                if (message.stringValue != null && message.hasOwnProperty("stringValue"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.stringValue);
                if (message.boolValue != null && message.hasOwnProperty("boolValue"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.boolValue);
                if (message.structValue != null && message.hasOwnProperty("structValue"))
                    $root.google.protobuf.Struct.encode(message.structValue, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.listValue != null && message.hasOwnProperty("listValue"))
                    $root.google.protobuf.ListValue.encode(message.listValue, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Value message, length delimited. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.IValue} message Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Value} Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Value();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.nullValue = reader.int32();
                        break;
                    case 2:
                        message.numberValue = reader.double();
                        break;
                    case 3:
                        message.stringValue = reader.string();
                        break;
                    case 4:
                        message.boolValue = reader.bool();
                        break;
                    case 5:
                        message.structValue = $root.google.protobuf.Struct.decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.listValue = $root.google.protobuf.ListValue.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Value} Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Value message.
             * @function verify
             * @memberof google.protobuf.Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.nullValue != null && message.hasOwnProperty("nullValue")) {
                    properties.kind = 1;
                    switch (message.nullValue) {
                    default:
                        return "nullValue: enum value expected";
                    case 0:
                        break;
                    }
                }
                if (message.numberValue != null && message.hasOwnProperty("numberValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (typeof message.numberValue !== "number")
                        return "numberValue: number expected";
                }
                if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (!$util.isString(message.stringValue))
                        return "stringValue: string expected";
                }
                if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (typeof message.boolValue !== "boolean")
                        return "boolValue: boolean expected";
                }
                if (message.structValue != null && message.hasOwnProperty("structValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        let error = $root.google.protobuf.Struct.verify(message.structValue);
                        if (error)
                            return "structValue." + error;
                    }
                }
                if (message.listValue != null && message.hasOwnProperty("listValue")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        let error = $root.google.protobuf.ListValue.verify(message.listValue);
                        if (error)
                            return "listValue." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Value} Value
             */
            Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Value)
                    return object;
                let message = new $root.google.protobuf.Value();
                switch (object.nullValue) {
                case "NULL_VALUE":
                case 0:
                    message.nullValue = 0;
                    break;
                }
                if (object.numberValue != null)
                    message.numberValue = Number(object.numberValue);
                if (object.stringValue != null)
                    message.stringValue = String(object.stringValue);
                if (object.boolValue != null)
                    message.boolValue = Boolean(object.boolValue);
                if (object.structValue != null) {
                    if (typeof object.structValue !== "object")
                        throw TypeError(".google.protobuf.Value.structValue: object expected");
                    message.structValue = $root.google.protobuf.Struct.fromObject(object.structValue);
                }
                if (object.listValue != null) {
                    if (typeof object.listValue !== "object")
                        throw TypeError(".google.protobuf.Value.listValue: object expected");
                    message.listValue = $root.google.protobuf.ListValue.fromObject(object.listValue);
                }
                return message;
            };

            /**
             * Creates a plain object from a Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Value
             * @static
             * @param {google.protobuf.Value} message Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.nullValue != null && message.hasOwnProperty("nullValue")) {
                    object.nullValue = options.enums === String ? $root.google.protobuf.NullValue[message.nullValue] : message.nullValue;
                    if (options.oneofs)
                        object.kind = "nullValue";
                }
                if (message.numberValue != null && message.hasOwnProperty("numberValue")) {
                    object.numberValue = options.json && !isFinite(message.numberValue) ? String(message.numberValue) : message.numberValue;
                    if (options.oneofs)
                        object.kind = "numberValue";
                }
                if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    object.stringValue = message.stringValue;
                    if (options.oneofs)
                        object.kind = "stringValue";
                }
                if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                    object.boolValue = message.boolValue;
                    if (options.oneofs)
                        object.kind = "boolValue";
                }
                if (message.structValue != null && message.hasOwnProperty("structValue")) {
                    object.structValue = $root.google.protobuf.Struct.toObject(message.structValue, options);
                    if (options.oneofs)
                        object.kind = "structValue";
                }
                if (message.listValue != null && message.hasOwnProperty("listValue")) {
                    object.listValue = $root.google.protobuf.ListValue.toObject(message.listValue, options);
                    if (options.oneofs)
                        object.kind = "listValue";
                }
                return object;
            };

            /**
             * Converts this Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Value;
        })();

        /**
         * NullValue enum.
         * @name google.protobuf.NullValue
         * @enum {string}
         * @property {number} NULL_VALUE=0 NULL_VALUE value
         */
        protobuf.NullValue = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NULL_VALUE"] = 0;
            return values;
        })();

        protobuf.ListValue = (function() {

            /**
             * Properties of a ListValue.
             * @memberof google.protobuf
             * @interface IListValue
             * @property {Array.<google.protobuf.IValue>|null} [values] ListValue values
             */

            /**
             * Constructs a new ListValue.
             * @memberof google.protobuf
             * @classdesc Represents a ListValue.
             * @implements IListValue
             * @constructor
             * @param {google.protobuf.IListValue=} [properties] Properties to set
             */
            function ListValue(properties) {
                this.values = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ListValue values.
             * @member {Array.<google.protobuf.IValue>} values
             * @memberof google.protobuf.ListValue
             * @instance
             */
            ListValue.prototype.values = $util.emptyArray;

            /**
             * Creates a new ListValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.IListValue=} [properties] Properties to set
             * @returns {google.protobuf.ListValue} ListValue instance
             */
            ListValue.create = function create(properties) {
                return new ListValue(properties);
            };

            /**
             * Encodes the specified ListValue message. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.IListValue} message ListValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.values != null && message.values.length)
                    for (let i = 0; i < message.values.length; ++i)
                        $root.google.protobuf.Value.encode(message.values[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ListValue message, length delimited. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.IListValue} message ListValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ListValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.ListValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.ListValue} ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.ListValue();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.values && message.values.length))
                            message.values = [];
                        message.values.push($root.google.protobuf.Value.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ListValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.ListValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.ListValue} ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListValue message.
             * @function verify
             * @memberof google.protobuf.ListValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.values != null && message.hasOwnProperty("values")) {
                    if (!Array.isArray(message.values))
                        return "values: array expected";
                    for (let i = 0; i < message.values.length; ++i) {
                        let error = $root.google.protobuf.Value.verify(message.values[i]);
                        if (error)
                            return "values." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ListValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.ListValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.ListValue} ListValue
             */
            ListValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.ListValue)
                    return object;
                let message = new $root.google.protobuf.ListValue();
                if (object.values) {
                    if (!Array.isArray(object.values))
                        throw TypeError(".google.protobuf.ListValue.values: array expected");
                    message.values = [];
                    for (let i = 0; i < object.values.length; ++i) {
                        if (typeof object.values[i] !== "object")
                            throw TypeError(".google.protobuf.ListValue.values: object expected");
                        message.values[i] = $root.google.protobuf.Value.fromObject(object.values[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ListValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.ListValue
             * @static
             * @param {google.protobuf.ListValue} message ListValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.values = [];
                if (message.values && message.values.length) {
                    object.values = [];
                    for (let j = 0; j < message.values.length; ++j)
                        object.values[j] = $root.google.protobuf.Value.toObject(message.values[j], options);
                }
                return object;
            };

            /**
             * Converts this ListValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.ListValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ListValue;
        })();

        return protobuf;
    })();

    return google;
})();

export const ThreadEnvelope = $root.ThreadEnvelope = (() => {

    /**
     * Properties of a ThreadEnvelope.
     * @exports IThreadEnvelope
     * @interface IThreadEnvelope
     * @property {string|null} [thread] ThreadEnvelope thread
     * @property {string|null} [hash] ThreadEnvelope hash
     * @property {Uint8Array|null} [ciphertext] ThreadEnvelope ciphertext
     */

    /**
     * Constructs a new ThreadEnvelope.
     * @exports ThreadEnvelope
     * @classdesc Represents a ThreadEnvelope.
     * @implements IThreadEnvelope
     * @constructor
     * @param {IThreadEnvelope=} [properties] Properties to set
     */
    function ThreadEnvelope(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadEnvelope thread.
     * @member {string} thread
     * @memberof ThreadEnvelope
     * @instance
     */
    ThreadEnvelope.prototype.thread = "";

    /**
     * ThreadEnvelope hash.
     * @member {string} hash
     * @memberof ThreadEnvelope
     * @instance
     */
    ThreadEnvelope.prototype.hash = "";

    /**
     * ThreadEnvelope ciphertext.
     * @member {Uint8Array} ciphertext
     * @memberof ThreadEnvelope
     * @instance
     */
    ThreadEnvelope.prototype.ciphertext = $util.newBuffer([]);

    /**
     * Creates a new ThreadEnvelope instance using the specified properties.
     * @function create
     * @memberof ThreadEnvelope
     * @static
     * @param {IThreadEnvelope=} [properties] Properties to set
     * @returns {ThreadEnvelope} ThreadEnvelope instance
     */
    ThreadEnvelope.create = function create(properties) {
        return new ThreadEnvelope(properties);
    };

    /**
     * Encodes the specified ThreadEnvelope message. Does not implicitly {@link ThreadEnvelope.verify|verify} messages.
     * @function encode
     * @memberof ThreadEnvelope
     * @static
     * @param {IThreadEnvelope} message ThreadEnvelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadEnvelope.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.thread != null && message.hasOwnProperty("thread"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.thread);
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.hash);
        if (message.ciphertext != null && message.hasOwnProperty("ciphertext"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.ciphertext);
        return writer;
    };

    /**
     * Encodes the specified ThreadEnvelope message, length delimited. Does not implicitly {@link ThreadEnvelope.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadEnvelope
     * @static
     * @param {IThreadEnvelope} message ThreadEnvelope message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadEnvelope message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadEnvelope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadEnvelope} ThreadEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadEnvelope.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadEnvelope();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.thread = reader.string();
                break;
            case 2:
                message.hash = reader.string();
                break;
            case 3:
                message.ciphertext = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadEnvelope message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadEnvelope
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadEnvelope} ThreadEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadEnvelope.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadEnvelope message.
     * @function verify
     * @memberof ThreadEnvelope
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadEnvelope.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.thread != null && message.hasOwnProperty("thread"))
            if (!$util.isString(message.thread))
                return "thread: string expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            if (!$util.isString(message.hash))
                return "hash: string expected";
        if (message.ciphertext != null && message.hasOwnProperty("ciphertext"))
            if (!(message.ciphertext && typeof message.ciphertext.length === "number" || $util.isString(message.ciphertext)))
                return "ciphertext: buffer expected";
        return null;
    };

    /**
     * Creates a ThreadEnvelope message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadEnvelope
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadEnvelope} ThreadEnvelope
     */
    ThreadEnvelope.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadEnvelope)
            return object;
        let message = new $root.ThreadEnvelope();
        if (object.thread != null)
            message.thread = String(object.thread);
        if (object.hash != null)
            message.hash = String(object.hash);
        if (object.ciphertext != null)
            if (typeof object.ciphertext === "string")
                $util.base64.decode(object.ciphertext, message.ciphertext = $util.newBuffer($util.base64.length(object.ciphertext)), 0);
            else if (object.ciphertext.length)
                message.ciphertext = object.ciphertext;
        return message;
    };

    /**
     * Creates a plain object from a ThreadEnvelope message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadEnvelope
     * @static
     * @param {ThreadEnvelope} message ThreadEnvelope
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadEnvelope.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.thread = "";
            object.hash = "";
            if (options.bytes === String)
                object.ciphertext = "";
            else {
                object.ciphertext = [];
                if (options.bytes !== Array)
                    object.ciphertext = $util.newBuffer(object.ciphertext);
            }
        }
        if (message.thread != null && message.hasOwnProperty("thread"))
            object.thread = message.thread;
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = message.hash;
        if (message.ciphertext != null && message.hasOwnProperty("ciphertext"))
            object.ciphertext = options.bytes === String ? $util.base64.encode(message.ciphertext, 0, message.ciphertext.length) : options.bytes === Array ? Array.prototype.slice.call(message.ciphertext) : message.ciphertext;
        return object;
    };

    /**
     * Converts this ThreadEnvelope to JSON.
     * @function toJSON
     * @memberof ThreadEnvelope
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadEnvelope.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ThreadEnvelope;
})();

export const ThreadBlock = $root.ThreadBlock = (() => {

    /**
     * Properties of a ThreadBlock.
     * @exports IThreadBlock
     * @interface IThreadBlock
     * @property {IThreadBlockHeader|null} [header] ThreadBlock header
     * @property {ThreadBlock.Type|null} [type] ThreadBlock type
     * @property {google.protobuf.IAny|null} [payload] ThreadBlock payload
     */

    /**
     * Constructs a new ThreadBlock.
     * @exports ThreadBlock
     * @classdesc Represents a ThreadBlock.
     * @implements IThreadBlock
     * @constructor
     * @param {IThreadBlock=} [properties] Properties to set
     */
    function ThreadBlock(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadBlock header.
     * @member {IThreadBlockHeader|null|undefined} header
     * @memberof ThreadBlock
     * @instance
     */
    ThreadBlock.prototype.header = null;

    /**
     * ThreadBlock type.
     * @member {ThreadBlock.Type} type
     * @memberof ThreadBlock
     * @instance
     */
    ThreadBlock.prototype.type = 0;

    /**
     * ThreadBlock payload.
     * @member {google.protobuf.IAny|null|undefined} payload
     * @memberof ThreadBlock
     * @instance
     */
    ThreadBlock.prototype.payload = null;

    /**
     * Creates a new ThreadBlock instance using the specified properties.
     * @function create
     * @memberof ThreadBlock
     * @static
     * @param {IThreadBlock=} [properties] Properties to set
     * @returns {ThreadBlock} ThreadBlock instance
     */
    ThreadBlock.create = function create(properties) {
        return new ThreadBlock(properties);
    };

    /**
     * Encodes the specified ThreadBlock message. Does not implicitly {@link ThreadBlock.verify|verify} messages.
     * @function encode
     * @memberof ThreadBlock
     * @static
     * @param {IThreadBlock} message ThreadBlock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadBlock.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.header != null && message.hasOwnProperty("header"))
            $root.ThreadBlockHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
        if (message.payload != null && message.hasOwnProperty("payload"))
            $root.google.protobuf.Any.encode(message.payload, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified ThreadBlock message, length delimited. Does not implicitly {@link ThreadBlock.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadBlock
     * @static
     * @param {IThreadBlock} message ThreadBlock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadBlock.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadBlock message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadBlock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadBlock} ThreadBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadBlock.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadBlock();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.header = $root.ThreadBlockHeader.decode(reader, reader.uint32());
                break;
            case 2:
                message.type = reader.int32();
                break;
            case 3:
                message.payload = $root.google.protobuf.Any.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadBlock message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadBlock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadBlock} ThreadBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadBlock.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadBlock message.
     * @function verify
     * @memberof ThreadBlock
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadBlock.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.header != null && message.hasOwnProperty("header")) {
            let error = $root.ThreadBlockHeader.verify(message.header);
            if (error)
                return "header." + error;
        }
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 50:
                break;
            }
        if (message.payload != null && message.hasOwnProperty("payload")) {
            let error = $root.google.protobuf.Any.verify(message.payload);
            if (error)
                return "payload." + error;
        }
        return null;
    };

    /**
     * Creates a ThreadBlock message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadBlock
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadBlock} ThreadBlock
     */
    ThreadBlock.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadBlock)
            return object;
        let message = new $root.ThreadBlock();
        if (object.header != null) {
            if (typeof object.header !== "object")
                throw TypeError(".ThreadBlock.header: object expected");
            message.header = $root.ThreadBlockHeader.fromObject(object.header);
        }
        switch (object.type) {
        case "MERGE":
        case 0:
            message.type = 0;
            break;
        case "IGNORE":
        case 1:
            message.type = 1;
            break;
        case "FLAG":
        case 2:
            message.type = 2;
            break;
        case "JOIN":
        case 3:
            message.type = 3;
            break;
        case "ANNOUNCE":
        case 4:
            message.type = 4;
            break;
        case "LEAVE":
        case 5:
            message.type = 5;
            break;
        case "MESSAGE":
        case 6:
            message.type = 6;
            break;
        case "FILES":
        case 7:
            message.type = 7;
            break;
        case "COMMENT":
        case 8:
            message.type = 8;
            break;
        case "LIKE":
        case 9:
            message.type = 9;
            break;
        case "INVITE":
        case 50:
            message.type = 50;
            break;
        }
        if (object.payload != null) {
            if (typeof object.payload !== "object")
                throw TypeError(".ThreadBlock.payload: object expected");
            message.payload = $root.google.protobuf.Any.fromObject(object.payload);
        }
        return message;
    };

    /**
     * Creates a plain object from a ThreadBlock message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadBlock
     * @static
     * @param {ThreadBlock} message ThreadBlock
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadBlock.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.header = null;
            object.type = options.enums === String ? "MERGE" : 0;
            object.payload = null;
        }
        if (message.header != null && message.hasOwnProperty("header"))
            object.header = $root.ThreadBlockHeader.toObject(message.header, options);
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.ThreadBlock.Type[message.type] : message.type;
        if (message.payload != null && message.hasOwnProperty("payload"))
            object.payload = $root.google.protobuf.Any.toObject(message.payload, options);
        return object;
    };

    /**
     * Converts this ThreadBlock to JSON.
     * @function toJSON
     * @memberof ThreadBlock
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadBlock.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name ThreadBlock.Type
     * @enum {string}
     * @property {number} MERGE=0 MERGE value
     * @property {number} IGNORE=1 IGNORE value
     * @property {number} FLAG=2 FLAG value
     * @property {number} JOIN=3 JOIN value
     * @property {number} ANNOUNCE=4 ANNOUNCE value
     * @property {number} LEAVE=5 LEAVE value
     * @property {number} MESSAGE=6 MESSAGE value
     * @property {number} FILES=7 FILES value
     * @property {number} COMMENT=8 COMMENT value
     * @property {number} LIKE=9 LIKE value
     * @property {number} INVITE=50 INVITE value
     */
    ThreadBlock.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "MERGE"] = 0;
        values[valuesById[1] = "IGNORE"] = 1;
        values[valuesById[2] = "FLAG"] = 2;
        values[valuesById[3] = "JOIN"] = 3;
        values[valuesById[4] = "ANNOUNCE"] = 4;
        values[valuesById[5] = "LEAVE"] = 5;
        values[valuesById[6] = "MESSAGE"] = 6;
        values[valuesById[7] = "FILES"] = 7;
        values[valuesById[8] = "COMMENT"] = 8;
        values[valuesById[9] = "LIKE"] = 9;
        values[valuesById[50] = "INVITE"] = 50;
        return values;
    })();

    return ThreadBlock;
})();

export const ThreadBlockHeader = $root.ThreadBlockHeader = (() => {

    /**
     * Properties of a ThreadBlockHeader.
     * @exports IThreadBlockHeader
     * @interface IThreadBlockHeader
     * @property {google.protobuf.ITimestamp|null} [date] ThreadBlockHeader date
     * @property {Array.<string>|null} [parents] ThreadBlockHeader parents
     * @property {string|null} [author] ThreadBlockHeader author
     * @property {string|null} [address] ThreadBlockHeader address
     */

    /**
     * Constructs a new ThreadBlockHeader.
     * @exports ThreadBlockHeader
     * @classdesc Represents a ThreadBlockHeader.
     * @implements IThreadBlockHeader
     * @constructor
     * @param {IThreadBlockHeader=} [properties] Properties to set
     */
    function ThreadBlockHeader(properties) {
        this.parents = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadBlockHeader date.
     * @member {google.protobuf.ITimestamp|null|undefined} date
     * @memberof ThreadBlockHeader
     * @instance
     */
    ThreadBlockHeader.prototype.date = null;

    /**
     * ThreadBlockHeader parents.
     * @member {Array.<string>} parents
     * @memberof ThreadBlockHeader
     * @instance
     */
    ThreadBlockHeader.prototype.parents = $util.emptyArray;

    /**
     * ThreadBlockHeader author.
     * @member {string} author
     * @memberof ThreadBlockHeader
     * @instance
     */
    ThreadBlockHeader.prototype.author = "";

    /**
     * ThreadBlockHeader address.
     * @member {string} address
     * @memberof ThreadBlockHeader
     * @instance
     */
    ThreadBlockHeader.prototype.address = "";

    /**
     * Creates a new ThreadBlockHeader instance using the specified properties.
     * @function create
     * @memberof ThreadBlockHeader
     * @static
     * @param {IThreadBlockHeader=} [properties] Properties to set
     * @returns {ThreadBlockHeader} ThreadBlockHeader instance
     */
    ThreadBlockHeader.create = function create(properties) {
        return new ThreadBlockHeader(properties);
    };

    /**
     * Encodes the specified ThreadBlockHeader message. Does not implicitly {@link ThreadBlockHeader.verify|verify} messages.
     * @function encode
     * @memberof ThreadBlockHeader
     * @static
     * @param {IThreadBlockHeader} message ThreadBlockHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadBlockHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.date != null && message.hasOwnProperty("date"))
            $root.google.protobuf.Timestamp.encode(message.date, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.parents != null && message.parents.length)
            for (let i = 0; i < message.parents.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.parents[i]);
        if (message.author != null && message.hasOwnProperty("author"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.author);
        if (message.address != null && message.hasOwnProperty("address"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.address);
        return writer;
    };

    /**
     * Encodes the specified ThreadBlockHeader message, length delimited. Does not implicitly {@link ThreadBlockHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadBlockHeader
     * @static
     * @param {IThreadBlockHeader} message ThreadBlockHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadBlockHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadBlockHeader message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadBlockHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadBlockHeader} ThreadBlockHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadBlockHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadBlockHeader();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.date = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                break;
            case 2:
                if (!(message.parents && message.parents.length))
                    message.parents = [];
                message.parents.push(reader.string());
                break;
            case 3:
                message.author = reader.string();
                break;
            case 4:
                message.address = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadBlockHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadBlockHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadBlockHeader} ThreadBlockHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadBlockHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadBlockHeader message.
     * @function verify
     * @memberof ThreadBlockHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadBlockHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.date != null && message.hasOwnProperty("date")) {
            let error = $root.google.protobuf.Timestamp.verify(message.date);
            if (error)
                return "date." + error;
        }
        if (message.parents != null && message.hasOwnProperty("parents")) {
            if (!Array.isArray(message.parents))
                return "parents: array expected";
            for (let i = 0; i < message.parents.length; ++i)
                if (!$util.isString(message.parents[i]))
                    return "parents: string[] expected";
        }
        if (message.author != null && message.hasOwnProperty("author"))
            if (!$util.isString(message.author))
                return "author: string expected";
        if (message.address != null && message.hasOwnProperty("address"))
            if (!$util.isString(message.address))
                return "address: string expected";
        return null;
    };

    /**
     * Creates a ThreadBlockHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadBlockHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadBlockHeader} ThreadBlockHeader
     */
    ThreadBlockHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadBlockHeader)
            return object;
        let message = new $root.ThreadBlockHeader();
        if (object.date != null) {
            if (typeof object.date !== "object")
                throw TypeError(".ThreadBlockHeader.date: object expected");
            message.date = $root.google.protobuf.Timestamp.fromObject(object.date);
        }
        if (object.parents) {
            if (!Array.isArray(object.parents))
                throw TypeError(".ThreadBlockHeader.parents: array expected");
            message.parents = [];
            for (let i = 0; i < object.parents.length; ++i)
                message.parents[i] = String(object.parents[i]);
        }
        if (object.author != null)
            message.author = String(object.author);
        if (object.address != null)
            message.address = String(object.address);
        return message;
    };

    /**
     * Creates a plain object from a ThreadBlockHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadBlockHeader
     * @static
     * @param {ThreadBlockHeader} message ThreadBlockHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadBlockHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.parents = [];
        if (options.defaults) {
            object.date = null;
            object.author = "";
            object.address = "";
        }
        if (message.date != null && message.hasOwnProperty("date"))
            object.date = $root.google.protobuf.Timestamp.toObject(message.date, options);
        if (message.parents && message.parents.length) {
            object.parents = [];
            for (let j = 0; j < message.parents.length; ++j)
                object.parents[j] = message.parents[j];
        }
        if (message.author != null && message.hasOwnProperty("author"))
            object.author = message.author;
        if (message.address != null && message.hasOwnProperty("address"))
            object.address = message.address;
        return object;
    };

    /**
     * Converts this ThreadBlockHeader to JSON.
     * @function toJSON
     * @memberof ThreadBlockHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadBlockHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ThreadBlockHeader;
})();

export const ThreadInvite = $root.ThreadInvite = (() => {

    /**
     * Properties of a ThreadInvite.
     * @exports IThreadInvite
     * @interface IThreadInvite
     * @property {Uint8Array|null} [sk] ThreadInvite sk
     * @property {string|null} [name] ThreadInvite name
     * @property {string|null} [schema] ThreadInvite schema
     * @property {string|null} [initiator] ThreadInvite initiator
     */

    /**
     * Constructs a new ThreadInvite.
     * @exports ThreadInvite
     * @classdesc Represents a ThreadInvite.
     * @implements IThreadInvite
     * @constructor
     * @param {IThreadInvite=} [properties] Properties to set
     */
    function ThreadInvite(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadInvite sk.
     * @member {Uint8Array} sk
     * @memberof ThreadInvite
     * @instance
     */
    ThreadInvite.prototype.sk = $util.newBuffer([]);

    /**
     * ThreadInvite name.
     * @member {string} name
     * @memberof ThreadInvite
     * @instance
     */
    ThreadInvite.prototype.name = "";

    /**
     * ThreadInvite schema.
     * @member {string} schema
     * @memberof ThreadInvite
     * @instance
     */
    ThreadInvite.prototype.schema = "";

    /**
     * ThreadInvite initiator.
     * @member {string} initiator
     * @memberof ThreadInvite
     * @instance
     */
    ThreadInvite.prototype.initiator = "";

    /**
     * Creates a new ThreadInvite instance using the specified properties.
     * @function create
     * @memberof ThreadInvite
     * @static
     * @param {IThreadInvite=} [properties] Properties to set
     * @returns {ThreadInvite} ThreadInvite instance
     */
    ThreadInvite.create = function create(properties) {
        return new ThreadInvite(properties);
    };

    /**
     * Encodes the specified ThreadInvite message. Does not implicitly {@link ThreadInvite.verify|verify} messages.
     * @function encode
     * @memberof ThreadInvite
     * @static
     * @param {IThreadInvite} message ThreadInvite message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadInvite.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.sk != null && message.hasOwnProperty("sk"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.sk);
        if (message.name != null && message.hasOwnProperty("name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        if (message.schema != null && message.hasOwnProperty("schema"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.schema);
        if (message.initiator != null && message.hasOwnProperty("initiator"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.initiator);
        return writer;
    };

    /**
     * Encodes the specified ThreadInvite message, length delimited. Does not implicitly {@link ThreadInvite.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadInvite
     * @static
     * @param {IThreadInvite} message ThreadInvite message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadInvite.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadInvite message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadInvite
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadInvite} ThreadInvite
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadInvite.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadInvite();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.sk = reader.bytes();
                break;
            case 2:
                message.name = reader.string();
                break;
            case 3:
                message.schema = reader.string();
                break;
            case 4:
                message.initiator = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadInvite message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadInvite
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadInvite} ThreadInvite
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadInvite.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadInvite message.
     * @function verify
     * @memberof ThreadInvite
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadInvite.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.sk != null && message.hasOwnProperty("sk"))
            if (!(message.sk && typeof message.sk.length === "number" || $util.isString(message.sk)))
                return "sk: buffer expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.schema != null && message.hasOwnProperty("schema"))
            if (!$util.isString(message.schema))
                return "schema: string expected";
        if (message.initiator != null && message.hasOwnProperty("initiator"))
            if (!$util.isString(message.initiator))
                return "initiator: string expected";
        return null;
    };

    /**
     * Creates a ThreadInvite message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadInvite
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadInvite} ThreadInvite
     */
    ThreadInvite.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadInvite)
            return object;
        let message = new $root.ThreadInvite();
        if (object.sk != null)
            if (typeof object.sk === "string")
                $util.base64.decode(object.sk, message.sk = $util.newBuffer($util.base64.length(object.sk)), 0);
            else if (object.sk.length)
                message.sk = object.sk;
        if (object.name != null)
            message.name = String(object.name);
        if (object.schema != null)
            message.schema = String(object.schema);
        if (object.initiator != null)
            message.initiator = String(object.initiator);
        return message;
    };

    /**
     * Creates a plain object from a ThreadInvite message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadInvite
     * @static
     * @param {ThreadInvite} message ThreadInvite
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadInvite.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.sk = "";
            else {
                object.sk = [];
                if (options.bytes !== Array)
                    object.sk = $util.newBuffer(object.sk);
            }
            object.name = "";
            object.schema = "";
            object.initiator = "";
        }
        if (message.sk != null && message.hasOwnProperty("sk"))
            object.sk = options.bytes === String ? $util.base64.encode(message.sk, 0, message.sk.length) : options.bytes === Array ? Array.prototype.slice.call(message.sk) : message.sk;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.schema != null && message.hasOwnProperty("schema"))
            object.schema = message.schema;
        if (message.initiator != null && message.hasOwnProperty("initiator"))
            object.initiator = message.initiator;
        return object;
    };

    /**
     * Converts this ThreadInvite to JSON.
     * @function toJSON
     * @memberof ThreadInvite
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadInvite.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ThreadInvite;
})();

export const ThreadIgnore = $root.ThreadIgnore = (() => {

    /**
     * Properties of a ThreadIgnore.
     * @exports IThreadIgnore
     * @interface IThreadIgnore
     * @property {string|null} [target] ThreadIgnore target
     */

    /**
     * Constructs a new ThreadIgnore.
     * @exports ThreadIgnore
     * @classdesc Represents a ThreadIgnore.
     * @implements IThreadIgnore
     * @constructor
     * @param {IThreadIgnore=} [properties] Properties to set
     */
    function ThreadIgnore(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadIgnore target.
     * @member {string} target
     * @memberof ThreadIgnore
     * @instance
     */
    ThreadIgnore.prototype.target = "";

    /**
     * Creates a new ThreadIgnore instance using the specified properties.
     * @function create
     * @memberof ThreadIgnore
     * @static
     * @param {IThreadIgnore=} [properties] Properties to set
     * @returns {ThreadIgnore} ThreadIgnore instance
     */
    ThreadIgnore.create = function create(properties) {
        return new ThreadIgnore(properties);
    };

    /**
     * Encodes the specified ThreadIgnore message. Does not implicitly {@link ThreadIgnore.verify|verify} messages.
     * @function encode
     * @memberof ThreadIgnore
     * @static
     * @param {IThreadIgnore} message ThreadIgnore message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadIgnore.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.target != null && message.hasOwnProperty("target"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.target);
        return writer;
    };

    /**
     * Encodes the specified ThreadIgnore message, length delimited. Does not implicitly {@link ThreadIgnore.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadIgnore
     * @static
     * @param {IThreadIgnore} message ThreadIgnore message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadIgnore.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadIgnore message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadIgnore
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadIgnore} ThreadIgnore
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadIgnore.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadIgnore();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.target = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadIgnore message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadIgnore
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadIgnore} ThreadIgnore
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadIgnore.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadIgnore message.
     * @function verify
     * @memberof ThreadIgnore
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadIgnore.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.target != null && message.hasOwnProperty("target"))
            if (!$util.isString(message.target))
                return "target: string expected";
        return null;
    };

    /**
     * Creates a ThreadIgnore message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadIgnore
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadIgnore} ThreadIgnore
     */
    ThreadIgnore.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadIgnore)
            return object;
        let message = new $root.ThreadIgnore();
        if (object.target != null)
            message.target = String(object.target);
        return message;
    };

    /**
     * Creates a plain object from a ThreadIgnore message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadIgnore
     * @static
     * @param {ThreadIgnore} message ThreadIgnore
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadIgnore.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.target = "";
        if (message.target != null && message.hasOwnProperty("target"))
            object.target = message.target;
        return object;
    };

    /**
     * Converts this ThreadIgnore to JSON.
     * @function toJSON
     * @memberof ThreadIgnore
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadIgnore.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ThreadIgnore;
})();

export const ThreadFlag = $root.ThreadFlag = (() => {

    /**
     * Properties of a ThreadFlag.
     * @exports IThreadFlag
     * @interface IThreadFlag
     * @property {string|null} [target] ThreadFlag target
     */

    /**
     * Constructs a new ThreadFlag.
     * @exports ThreadFlag
     * @classdesc Represents a ThreadFlag.
     * @implements IThreadFlag
     * @constructor
     * @param {IThreadFlag=} [properties] Properties to set
     */
    function ThreadFlag(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadFlag target.
     * @member {string} target
     * @memberof ThreadFlag
     * @instance
     */
    ThreadFlag.prototype.target = "";

    /**
     * Creates a new ThreadFlag instance using the specified properties.
     * @function create
     * @memberof ThreadFlag
     * @static
     * @param {IThreadFlag=} [properties] Properties to set
     * @returns {ThreadFlag} ThreadFlag instance
     */
    ThreadFlag.create = function create(properties) {
        return new ThreadFlag(properties);
    };

    /**
     * Encodes the specified ThreadFlag message. Does not implicitly {@link ThreadFlag.verify|verify} messages.
     * @function encode
     * @memberof ThreadFlag
     * @static
     * @param {IThreadFlag} message ThreadFlag message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadFlag.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.target != null && message.hasOwnProperty("target"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.target);
        return writer;
    };

    /**
     * Encodes the specified ThreadFlag message, length delimited. Does not implicitly {@link ThreadFlag.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadFlag
     * @static
     * @param {IThreadFlag} message ThreadFlag message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadFlag.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadFlag message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadFlag
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadFlag} ThreadFlag
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadFlag.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadFlag();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.target = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadFlag message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadFlag
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadFlag} ThreadFlag
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadFlag.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadFlag message.
     * @function verify
     * @memberof ThreadFlag
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadFlag.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.target != null && message.hasOwnProperty("target"))
            if (!$util.isString(message.target))
                return "target: string expected";
        return null;
    };

    /**
     * Creates a ThreadFlag message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadFlag
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadFlag} ThreadFlag
     */
    ThreadFlag.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadFlag)
            return object;
        let message = new $root.ThreadFlag();
        if (object.target != null)
            message.target = String(object.target);
        return message;
    };

    /**
     * Creates a plain object from a ThreadFlag message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadFlag
     * @static
     * @param {ThreadFlag} message ThreadFlag
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadFlag.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.target = "";
        if (message.target != null && message.hasOwnProperty("target"))
            object.target = message.target;
        return object;
    };

    /**
     * Converts this ThreadFlag to JSON.
     * @function toJSON
     * @memberof ThreadFlag
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadFlag.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ThreadFlag;
})();

export const ThreadJoin = $root.ThreadJoin = (() => {

    /**
     * Properties of a ThreadJoin.
     * @exports IThreadJoin
     * @interface IThreadJoin
     * @property {string|null} [inviter] ThreadJoin inviter
     * @property {string|null} [username] ThreadJoin username
     * @property {Array.<string>|null} [inboxes] ThreadJoin inboxes
     */

    /**
     * Constructs a new ThreadJoin.
     * @exports ThreadJoin
     * @classdesc Represents a ThreadJoin.
     * @implements IThreadJoin
     * @constructor
     * @param {IThreadJoin=} [properties] Properties to set
     */
    function ThreadJoin(properties) {
        this.inboxes = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadJoin inviter.
     * @member {string} inviter
     * @memberof ThreadJoin
     * @instance
     */
    ThreadJoin.prototype.inviter = "";

    /**
     * ThreadJoin username.
     * @member {string} username
     * @memberof ThreadJoin
     * @instance
     */
    ThreadJoin.prototype.username = "";

    /**
     * ThreadJoin inboxes.
     * @member {Array.<string>} inboxes
     * @memberof ThreadJoin
     * @instance
     */
    ThreadJoin.prototype.inboxes = $util.emptyArray;

    /**
     * Creates a new ThreadJoin instance using the specified properties.
     * @function create
     * @memberof ThreadJoin
     * @static
     * @param {IThreadJoin=} [properties] Properties to set
     * @returns {ThreadJoin} ThreadJoin instance
     */
    ThreadJoin.create = function create(properties) {
        return new ThreadJoin(properties);
    };

    /**
     * Encodes the specified ThreadJoin message. Does not implicitly {@link ThreadJoin.verify|verify} messages.
     * @function encode
     * @memberof ThreadJoin
     * @static
     * @param {IThreadJoin} message ThreadJoin message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadJoin.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.inviter != null && message.hasOwnProperty("inviter"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.inviter);
        if (message.username != null && message.hasOwnProperty("username"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.username);
        if (message.inboxes != null && message.inboxes.length)
            for (let i = 0; i < message.inboxes.length; ++i)
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.inboxes[i]);
        return writer;
    };

    /**
     * Encodes the specified ThreadJoin message, length delimited. Does not implicitly {@link ThreadJoin.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadJoin
     * @static
     * @param {IThreadJoin} message ThreadJoin message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadJoin.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadJoin message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadJoin
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadJoin} ThreadJoin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadJoin.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadJoin();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.inviter = reader.string();
                break;
            case 2:
                message.username = reader.string();
                break;
            case 3:
                if (!(message.inboxes && message.inboxes.length))
                    message.inboxes = [];
                message.inboxes.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadJoin message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadJoin
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadJoin} ThreadJoin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadJoin.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadJoin message.
     * @function verify
     * @memberof ThreadJoin
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadJoin.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.inviter != null && message.hasOwnProperty("inviter"))
            if (!$util.isString(message.inviter))
                return "inviter: string expected";
        if (message.username != null && message.hasOwnProperty("username"))
            if (!$util.isString(message.username))
                return "username: string expected";
        if (message.inboxes != null && message.hasOwnProperty("inboxes")) {
            if (!Array.isArray(message.inboxes))
                return "inboxes: array expected";
            for (let i = 0; i < message.inboxes.length; ++i)
                if (!$util.isString(message.inboxes[i]))
                    return "inboxes: string[] expected";
        }
        return null;
    };

    /**
     * Creates a ThreadJoin message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadJoin
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadJoin} ThreadJoin
     */
    ThreadJoin.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadJoin)
            return object;
        let message = new $root.ThreadJoin();
        if (object.inviter != null)
            message.inviter = String(object.inviter);
        if (object.username != null)
            message.username = String(object.username);
        if (object.inboxes) {
            if (!Array.isArray(object.inboxes))
                throw TypeError(".ThreadJoin.inboxes: array expected");
            message.inboxes = [];
            for (let i = 0; i < object.inboxes.length; ++i)
                message.inboxes[i] = String(object.inboxes[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a ThreadJoin message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadJoin
     * @static
     * @param {ThreadJoin} message ThreadJoin
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadJoin.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.inboxes = [];
        if (options.defaults) {
            object.inviter = "";
            object.username = "";
        }
        if (message.inviter != null && message.hasOwnProperty("inviter"))
            object.inviter = message.inviter;
        if (message.username != null && message.hasOwnProperty("username"))
            object.username = message.username;
        if (message.inboxes && message.inboxes.length) {
            object.inboxes = [];
            for (let j = 0; j < message.inboxes.length; ++j)
                object.inboxes[j] = message.inboxes[j];
        }
        return object;
    };

    /**
     * Converts this ThreadJoin to JSON.
     * @function toJSON
     * @memberof ThreadJoin
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadJoin.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ThreadJoin;
})();

export const ThreadAnnounce = $root.ThreadAnnounce = (() => {

    /**
     * Properties of a ThreadAnnounce.
     * @exports IThreadAnnounce
     * @interface IThreadAnnounce
     * @property {string|null} [username] ThreadAnnounce username
     * @property {Array.<string>|null} [inboxes] ThreadAnnounce inboxes
     */

    /**
     * Constructs a new ThreadAnnounce.
     * @exports ThreadAnnounce
     * @classdesc Represents a ThreadAnnounce.
     * @implements IThreadAnnounce
     * @constructor
     * @param {IThreadAnnounce=} [properties] Properties to set
     */
    function ThreadAnnounce(properties) {
        this.inboxes = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadAnnounce username.
     * @member {string} username
     * @memberof ThreadAnnounce
     * @instance
     */
    ThreadAnnounce.prototype.username = "";

    /**
     * ThreadAnnounce inboxes.
     * @member {Array.<string>} inboxes
     * @memberof ThreadAnnounce
     * @instance
     */
    ThreadAnnounce.prototype.inboxes = $util.emptyArray;

    /**
     * Creates a new ThreadAnnounce instance using the specified properties.
     * @function create
     * @memberof ThreadAnnounce
     * @static
     * @param {IThreadAnnounce=} [properties] Properties to set
     * @returns {ThreadAnnounce} ThreadAnnounce instance
     */
    ThreadAnnounce.create = function create(properties) {
        return new ThreadAnnounce(properties);
    };

    /**
     * Encodes the specified ThreadAnnounce message. Does not implicitly {@link ThreadAnnounce.verify|verify} messages.
     * @function encode
     * @memberof ThreadAnnounce
     * @static
     * @param {IThreadAnnounce} message ThreadAnnounce message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadAnnounce.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.username != null && message.hasOwnProperty("username"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
        if (message.inboxes != null && message.inboxes.length)
            for (let i = 0; i < message.inboxes.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.inboxes[i]);
        return writer;
    };

    /**
     * Encodes the specified ThreadAnnounce message, length delimited. Does not implicitly {@link ThreadAnnounce.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadAnnounce
     * @static
     * @param {IThreadAnnounce} message ThreadAnnounce message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadAnnounce.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadAnnounce message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadAnnounce
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadAnnounce} ThreadAnnounce
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadAnnounce.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadAnnounce();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.username = reader.string();
                break;
            case 2:
                if (!(message.inboxes && message.inboxes.length))
                    message.inboxes = [];
                message.inboxes.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadAnnounce message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadAnnounce
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadAnnounce} ThreadAnnounce
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadAnnounce.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadAnnounce message.
     * @function verify
     * @memberof ThreadAnnounce
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadAnnounce.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.username != null && message.hasOwnProperty("username"))
            if (!$util.isString(message.username))
                return "username: string expected";
        if (message.inboxes != null && message.hasOwnProperty("inboxes")) {
            if (!Array.isArray(message.inboxes))
                return "inboxes: array expected";
            for (let i = 0; i < message.inboxes.length; ++i)
                if (!$util.isString(message.inboxes[i]))
                    return "inboxes: string[] expected";
        }
        return null;
    };

    /**
     * Creates a ThreadAnnounce message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadAnnounce
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadAnnounce} ThreadAnnounce
     */
    ThreadAnnounce.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadAnnounce)
            return object;
        let message = new $root.ThreadAnnounce();
        if (object.username != null)
            message.username = String(object.username);
        if (object.inboxes) {
            if (!Array.isArray(object.inboxes))
                throw TypeError(".ThreadAnnounce.inboxes: array expected");
            message.inboxes = [];
            for (let i = 0; i < object.inboxes.length; ++i)
                message.inboxes[i] = String(object.inboxes[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a ThreadAnnounce message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadAnnounce
     * @static
     * @param {ThreadAnnounce} message ThreadAnnounce
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadAnnounce.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.inboxes = [];
        if (options.defaults)
            object.username = "";
        if (message.username != null && message.hasOwnProperty("username"))
            object.username = message.username;
        if (message.inboxes && message.inboxes.length) {
            object.inboxes = [];
            for (let j = 0; j < message.inboxes.length; ++j)
                object.inboxes[j] = message.inboxes[j];
        }
        return object;
    };

    /**
     * Converts this ThreadAnnounce to JSON.
     * @function toJSON
     * @memberof ThreadAnnounce
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadAnnounce.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ThreadAnnounce;
})();

export const ThreadMessage = $root.ThreadMessage = (() => {

    /**
     * Properties of a ThreadMessage.
     * @exports IThreadMessage
     * @interface IThreadMessage
     * @property {string|null} [body] ThreadMessage body
     */

    /**
     * Constructs a new ThreadMessage.
     * @exports ThreadMessage
     * @classdesc Represents a ThreadMessage.
     * @implements IThreadMessage
     * @constructor
     * @param {IThreadMessage=} [properties] Properties to set
     */
    function ThreadMessage(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadMessage body.
     * @member {string} body
     * @memberof ThreadMessage
     * @instance
     */
    ThreadMessage.prototype.body = "";

    /**
     * Creates a new ThreadMessage instance using the specified properties.
     * @function create
     * @memberof ThreadMessage
     * @static
     * @param {IThreadMessage=} [properties] Properties to set
     * @returns {ThreadMessage} ThreadMessage instance
     */
    ThreadMessage.create = function create(properties) {
        return new ThreadMessage(properties);
    };

    /**
     * Encodes the specified ThreadMessage message. Does not implicitly {@link ThreadMessage.verify|verify} messages.
     * @function encode
     * @memberof ThreadMessage
     * @static
     * @param {IThreadMessage} message ThreadMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.body != null && message.hasOwnProperty("body"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.body);
        return writer;
    };

    /**
     * Encodes the specified ThreadMessage message, length delimited. Does not implicitly {@link ThreadMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadMessage
     * @static
     * @param {IThreadMessage} message ThreadMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadMessage message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadMessage} ThreadMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.body = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadMessage} ThreadMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadMessage message.
     * @function verify
     * @memberof ThreadMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.body != null && message.hasOwnProperty("body"))
            if (!$util.isString(message.body))
                return "body: string expected";
        return null;
    };

    /**
     * Creates a ThreadMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadMessage} ThreadMessage
     */
    ThreadMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadMessage)
            return object;
        let message = new $root.ThreadMessage();
        if (object.body != null)
            message.body = String(object.body);
        return message;
    };

    /**
     * Creates a plain object from a ThreadMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadMessage
     * @static
     * @param {ThreadMessage} message ThreadMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.body = "";
        if (message.body != null && message.hasOwnProperty("body"))
            object.body = message.body;
        return object;
    };

    /**
     * Converts this ThreadMessage to JSON.
     * @function toJSON
     * @memberof ThreadMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ThreadMessage;
})();

export const ThreadFiles = $root.ThreadFiles = (() => {

    /**
     * Properties of a ThreadFiles.
     * @exports IThreadFiles
     * @interface IThreadFiles
     * @property {string|null} [target] ThreadFiles target
     * @property {string|null} [body] ThreadFiles body
     * @property {Object.<string,string>|null} [keys] ThreadFiles keys
     */

    /**
     * Constructs a new ThreadFiles.
     * @exports ThreadFiles
     * @classdesc Represents a ThreadFiles.
     * @implements IThreadFiles
     * @constructor
     * @param {IThreadFiles=} [properties] Properties to set
     */
    function ThreadFiles(properties) {
        this.keys = {};
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadFiles target.
     * @member {string} target
     * @memberof ThreadFiles
     * @instance
     */
    ThreadFiles.prototype.target = "";

    /**
     * ThreadFiles body.
     * @member {string} body
     * @memberof ThreadFiles
     * @instance
     */
    ThreadFiles.prototype.body = "";

    /**
     * ThreadFiles keys.
     * @member {Object.<string,string>} keys
     * @memberof ThreadFiles
     * @instance
     */
    ThreadFiles.prototype.keys = $util.emptyObject;

    /**
     * Creates a new ThreadFiles instance using the specified properties.
     * @function create
     * @memberof ThreadFiles
     * @static
     * @param {IThreadFiles=} [properties] Properties to set
     * @returns {ThreadFiles} ThreadFiles instance
     */
    ThreadFiles.create = function create(properties) {
        return new ThreadFiles(properties);
    };

    /**
     * Encodes the specified ThreadFiles message. Does not implicitly {@link ThreadFiles.verify|verify} messages.
     * @function encode
     * @memberof ThreadFiles
     * @static
     * @param {IThreadFiles} message ThreadFiles message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadFiles.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.target != null && message.hasOwnProperty("target"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.target);
        if (message.body != null && message.hasOwnProperty("body"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.body);
        if (message.keys != null && message.hasOwnProperty("keys"))
            for (let keys = Object.keys(message.keys), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.keys[keys[i]]).ldelim();
        return writer;
    };

    /**
     * Encodes the specified ThreadFiles message, length delimited. Does not implicitly {@link ThreadFiles.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadFiles
     * @static
     * @param {IThreadFiles} message ThreadFiles message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadFiles.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadFiles message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadFiles
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadFiles} ThreadFiles
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadFiles.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadFiles(), key;
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.target = reader.string();
                break;
            case 2:
                message.body = reader.string();
                break;
            case 3:
                reader.skip().pos++;
                if (message.keys === $util.emptyObject)
                    message.keys = {};
                key = reader.string();
                reader.pos++;
                message.keys[key] = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadFiles message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadFiles
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadFiles} ThreadFiles
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadFiles.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadFiles message.
     * @function verify
     * @memberof ThreadFiles
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadFiles.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.target != null && message.hasOwnProperty("target"))
            if (!$util.isString(message.target))
                return "target: string expected";
        if (message.body != null && message.hasOwnProperty("body"))
            if (!$util.isString(message.body))
                return "body: string expected";
        if (message.keys != null && message.hasOwnProperty("keys")) {
            if (!$util.isObject(message.keys))
                return "keys: object expected";
            let key = Object.keys(message.keys);
            for (let i = 0; i < key.length; ++i)
                if (!$util.isString(message.keys[key[i]]))
                    return "keys: string{k:string} expected";
        }
        return null;
    };

    /**
     * Creates a ThreadFiles message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadFiles
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadFiles} ThreadFiles
     */
    ThreadFiles.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadFiles)
            return object;
        let message = new $root.ThreadFiles();
        if (object.target != null)
            message.target = String(object.target);
        if (object.body != null)
            message.body = String(object.body);
        if (object.keys) {
            if (typeof object.keys !== "object")
                throw TypeError(".ThreadFiles.keys: object expected");
            message.keys = {};
            for (let keys = Object.keys(object.keys), i = 0; i < keys.length; ++i)
                message.keys[keys[i]] = String(object.keys[keys[i]]);
        }
        return message;
    };

    /**
     * Creates a plain object from a ThreadFiles message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadFiles
     * @static
     * @param {ThreadFiles} message ThreadFiles
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadFiles.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.objects || options.defaults)
            object.keys = {};
        if (options.defaults) {
            object.target = "";
            object.body = "";
        }
        if (message.target != null && message.hasOwnProperty("target"))
            object.target = message.target;
        if (message.body != null && message.hasOwnProperty("body"))
            object.body = message.body;
        let keys2;
        if (message.keys && (keys2 = Object.keys(message.keys)).length) {
            object.keys = {};
            for (let j = 0; j < keys2.length; ++j)
                object.keys[keys2[j]] = message.keys[keys2[j]];
        }
        return object;
    };

    /**
     * Converts this ThreadFiles to JSON.
     * @function toJSON
     * @memberof ThreadFiles
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadFiles.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ThreadFiles;
})();

export const ThreadComment = $root.ThreadComment = (() => {

    /**
     * Properties of a ThreadComment.
     * @exports IThreadComment
     * @interface IThreadComment
     * @property {string|null} [target] ThreadComment target
     * @property {string|null} [body] ThreadComment body
     */

    /**
     * Constructs a new ThreadComment.
     * @exports ThreadComment
     * @classdesc Represents a ThreadComment.
     * @implements IThreadComment
     * @constructor
     * @param {IThreadComment=} [properties] Properties to set
     */
    function ThreadComment(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadComment target.
     * @member {string} target
     * @memberof ThreadComment
     * @instance
     */
    ThreadComment.prototype.target = "";

    /**
     * ThreadComment body.
     * @member {string} body
     * @memberof ThreadComment
     * @instance
     */
    ThreadComment.prototype.body = "";

    /**
     * Creates a new ThreadComment instance using the specified properties.
     * @function create
     * @memberof ThreadComment
     * @static
     * @param {IThreadComment=} [properties] Properties to set
     * @returns {ThreadComment} ThreadComment instance
     */
    ThreadComment.create = function create(properties) {
        return new ThreadComment(properties);
    };

    /**
     * Encodes the specified ThreadComment message. Does not implicitly {@link ThreadComment.verify|verify} messages.
     * @function encode
     * @memberof ThreadComment
     * @static
     * @param {IThreadComment} message ThreadComment message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadComment.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.target != null && message.hasOwnProperty("target"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.target);
        if (message.body != null && message.hasOwnProperty("body"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.body);
        return writer;
    };

    /**
     * Encodes the specified ThreadComment message, length delimited. Does not implicitly {@link ThreadComment.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadComment
     * @static
     * @param {IThreadComment} message ThreadComment message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadComment.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadComment message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadComment
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadComment} ThreadComment
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadComment.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadComment();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.target = reader.string();
                break;
            case 2:
                message.body = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadComment message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadComment
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadComment} ThreadComment
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadComment.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadComment message.
     * @function verify
     * @memberof ThreadComment
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadComment.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.target != null && message.hasOwnProperty("target"))
            if (!$util.isString(message.target))
                return "target: string expected";
        if (message.body != null && message.hasOwnProperty("body"))
            if (!$util.isString(message.body))
                return "body: string expected";
        return null;
    };

    /**
     * Creates a ThreadComment message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadComment
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadComment} ThreadComment
     */
    ThreadComment.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadComment)
            return object;
        let message = new $root.ThreadComment();
        if (object.target != null)
            message.target = String(object.target);
        if (object.body != null)
            message.body = String(object.body);
        return message;
    };

    /**
     * Creates a plain object from a ThreadComment message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadComment
     * @static
     * @param {ThreadComment} message ThreadComment
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadComment.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.target = "";
            object.body = "";
        }
        if (message.target != null && message.hasOwnProperty("target"))
            object.target = message.target;
        if (message.body != null && message.hasOwnProperty("body"))
            object.body = message.body;
        return object;
    };

    /**
     * Converts this ThreadComment to JSON.
     * @function toJSON
     * @memberof ThreadComment
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadComment.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ThreadComment;
})();

export const ThreadLike = $root.ThreadLike = (() => {

    /**
     * Properties of a ThreadLike.
     * @exports IThreadLike
     * @interface IThreadLike
     * @property {string|null} [target] ThreadLike target
     */

    /**
     * Constructs a new ThreadLike.
     * @exports ThreadLike
     * @classdesc Represents a ThreadLike.
     * @implements IThreadLike
     * @constructor
     * @param {IThreadLike=} [properties] Properties to set
     */
    function ThreadLike(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ThreadLike target.
     * @member {string} target
     * @memberof ThreadLike
     * @instance
     */
    ThreadLike.prototype.target = "";

    /**
     * Creates a new ThreadLike instance using the specified properties.
     * @function create
     * @memberof ThreadLike
     * @static
     * @param {IThreadLike=} [properties] Properties to set
     * @returns {ThreadLike} ThreadLike instance
     */
    ThreadLike.create = function create(properties) {
        return new ThreadLike(properties);
    };

    /**
     * Encodes the specified ThreadLike message. Does not implicitly {@link ThreadLike.verify|verify} messages.
     * @function encode
     * @memberof ThreadLike
     * @static
     * @param {IThreadLike} message ThreadLike message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadLike.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.target != null && message.hasOwnProperty("target"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.target);
        return writer;
    };

    /**
     * Encodes the specified ThreadLike message, length delimited. Does not implicitly {@link ThreadLike.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ThreadLike
     * @static
     * @param {IThreadLike} message ThreadLike message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ThreadLike.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ThreadLike message from the specified reader or buffer.
     * @function decode
     * @memberof ThreadLike
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ThreadLike} ThreadLike
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadLike.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ThreadLike();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.target = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ThreadLike message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ThreadLike
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ThreadLike} ThreadLike
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ThreadLike.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ThreadLike message.
     * @function verify
     * @memberof ThreadLike
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ThreadLike.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.target != null && message.hasOwnProperty("target"))
            if (!$util.isString(message.target))
                return "target: string expected";
        return null;
    };

    /**
     * Creates a ThreadLike message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ThreadLike
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ThreadLike} ThreadLike
     */
    ThreadLike.fromObject = function fromObject(object) {
        if (object instanceof $root.ThreadLike)
            return object;
        let message = new $root.ThreadLike();
        if (object.target != null)
            message.target = String(object.target);
        return message;
    };

    /**
     * Creates a plain object from a ThreadLike message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ThreadLike
     * @static
     * @param {ThreadLike} message ThreadLike
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ThreadLike.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.target = "";
        if (message.target != null && message.hasOwnProperty("target"))
            object.target = message.target;
        return object;
    };

    /**
     * Converts this ThreadLike to JSON.
     * @function toJSON
     * @memberof ThreadLike
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ThreadLike.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ThreadLike;
})();

export const Directory = $root.Directory = (() => {

    /**
     * Properties of a Directory.
     * @exports IDirectory
     * @interface IDirectory
     * @property {Object.<string,IFile>|null} [files] Directory files
     */

    /**
     * Constructs a new Directory.
     * @exports Directory
     * @classdesc Represents a Directory.
     * @implements IDirectory
     * @constructor
     * @param {IDirectory=} [properties] Properties to set
     */
    function Directory(properties) {
        this.files = {};
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Directory files.
     * @member {Object.<string,IFile>} files
     * @memberof Directory
     * @instance
     */
    Directory.prototype.files = $util.emptyObject;

    /**
     * Creates a new Directory instance using the specified properties.
     * @function create
     * @memberof Directory
     * @static
     * @param {IDirectory=} [properties] Properties to set
     * @returns {Directory} Directory instance
     */
    Directory.create = function create(properties) {
        return new Directory(properties);
    };

    /**
     * Encodes the specified Directory message. Does not implicitly {@link Directory.verify|verify} messages.
     * @function encode
     * @memberof Directory
     * @static
     * @param {IDirectory} message Directory message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Directory.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.files != null && message.hasOwnProperty("files"))
            for (let keys = Object.keys(message.files), i = 0; i < keys.length; ++i) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                $root.File.encode(message.files[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
            }
        return writer;
    };

    /**
     * Encodes the specified Directory message, length delimited. Does not implicitly {@link Directory.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Directory
     * @static
     * @param {IDirectory} message Directory message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Directory.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Directory message from the specified reader or buffer.
     * @function decode
     * @memberof Directory
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Directory} Directory
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Directory.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Directory(), key;
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                reader.skip().pos++;
                if (message.files === $util.emptyObject)
                    message.files = {};
                key = reader.string();
                reader.pos++;
                message.files[key] = $root.File.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Directory message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Directory
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Directory} Directory
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Directory.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Directory message.
     * @function verify
     * @memberof Directory
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Directory.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.files != null && message.hasOwnProperty("files")) {
            if (!$util.isObject(message.files))
                return "files: object expected";
            let key = Object.keys(message.files);
            for (let i = 0; i < key.length; ++i) {
                let error = $root.File.verify(message.files[key[i]]);
                if (error)
                    return "files." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Directory message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Directory
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Directory} Directory
     */
    Directory.fromObject = function fromObject(object) {
        if (object instanceof $root.Directory)
            return object;
        let message = new $root.Directory();
        if (object.files) {
            if (typeof object.files !== "object")
                throw TypeError(".Directory.files: object expected");
            message.files = {};
            for (let keys = Object.keys(object.files), i = 0; i < keys.length; ++i) {
                if (typeof object.files[keys[i]] !== "object")
                    throw TypeError(".Directory.files: object expected");
                message.files[keys[i]] = $root.File.fromObject(object.files[keys[i]]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Directory message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Directory
     * @static
     * @param {Directory} message Directory
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Directory.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.objects || options.defaults)
            object.files = {};
        let keys2;
        if (message.files && (keys2 = Object.keys(message.files)).length) {
            object.files = {};
            for (let j = 0; j < keys2.length; ++j)
                object.files[keys2[j]] = $root.File.toObject(message.files[keys2[j]], options);
        }
        return object;
    };

    /**
     * Converts this Directory to JSON.
     * @function toJSON
     * @memberof Directory
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Directory.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Directory;
})();

export const MobilePreparedFiles = $root.MobilePreparedFiles = (() => {

    /**
     * Properties of a MobilePreparedFiles.
     * @exports IMobilePreparedFiles
     * @interface IMobilePreparedFiles
     * @property {IDirectory|null} [dir] MobilePreparedFiles dir
     * @property {Object.<string,string>|null} [pin] MobilePreparedFiles pin
     */

    /**
     * Constructs a new MobilePreparedFiles.
     * @exports MobilePreparedFiles
     * @classdesc Represents a MobilePreparedFiles.
     * @implements IMobilePreparedFiles
     * @constructor
     * @param {IMobilePreparedFiles=} [properties] Properties to set
     */
    function MobilePreparedFiles(properties) {
        this.pin = {};
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MobilePreparedFiles dir.
     * @member {IDirectory|null|undefined} dir
     * @memberof MobilePreparedFiles
     * @instance
     */
    MobilePreparedFiles.prototype.dir = null;

    /**
     * MobilePreparedFiles pin.
     * @member {Object.<string,string>} pin
     * @memberof MobilePreparedFiles
     * @instance
     */
    MobilePreparedFiles.prototype.pin = $util.emptyObject;

    /**
     * Creates a new MobilePreparedFiles instance using the specified properties.
     * @function create
     * @memberof MobilePreparedFiles
     * @static
     * @param {IMobilePreparedFiles=} [properties] Properties to set
     * @returns {MobilePreparedFiles} MobilePreparedFiles instance
     */
    MobilePreparedFiles.create = function create(properties) {
        return new MobilePreparedFiles(properties);
    };

    /**
     * Encodes the specified MobilePreparedFiles message. Does not implicitly {@link MobilePreparedFiles.verify|verify} messages.
     * @function encode
     * @memberof MobilePreparedFiles
     * @static
     * @param {IMobilePreparedFiles} message MobilePreparedFiles message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MobilePreparedFiles.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.dir != null && message.hasOwnProperty("dir"))
            $root.Directory.encode(message.dir, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.pin != null && message.hasOwnProperty("pin"))
            for (let keys = Object.keys(message.pin), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.pin[keys[i]]).ldelim();
        return writer;
    };

    /**
     * Encodes the specified MobilePreparedFiles message, length delimited. Does not implicitly {@link MobilePreparedFiles.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MobilePreparedFiles
     * @static
     * @param {IMobilePreparedFiles} message MobilePreparedFiles message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MobilePreparedFiles.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MobilePreparedFiles message from the specified reader or buffer.
     * @function decode
     * @memberof MobilePreparedFiles
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MobilePreparedFiles} MobilePreparedFiles
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MobilePreparedFiles.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.MobilePreparedFiles(), key;
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.dir = $root.Directory.decode(reader, reader.uint32());
                break;
            case 2:
                reader.skip().pos++;
                if (message.pin === $util.emptyObject)
                    message.pin = {};
                key = reader.string();
                reader.pos++;
                message.pin[key] = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MobilePreparedFiles message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MobilePreparedFiles
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MobilePreparedFiles} MobilePreparedFiles
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MobilePreparedFiles.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MobilePreparedFiles message.
     * @function verify
     * @memberof MobilePreparedFiles
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MobilePreparedFiles.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.dir != null && message.hasOwnProperty("dir")) {
            let error = $root.Directory.verify(message.dir);
            if (error)
                return "dir." + error;
        }
        if (message.pin != null && message.hasOwnProperty("pin")) {
            if (!$util.isObject(message.pin))
                return "pin: object expected";
            let key = Object.keys(message.pin);
            for (let i = 0; i < key.length; ++i)
                if (!$util.isString(message.pin[key[i]]))
                    return "pin: string{k:string} expected";
        }
        return null;
    };

    /**
     * Creates a MobilePreparedFiles message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MobilePreparedFiles
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MobilePreparedFiles} MobilePreparedFiles
     */
    MobilePreparedFiles.fromObject = function fromObject(object) {
        if (object instanceof $root.MobilePreparedFiles)
            return object;
        let message = new $root.MobilePreparedFiles();
        if (object.dir != null) {
            if (typeof object.dir !== "object")
                throw TypeError(".MobilePreparedFiles.dir: object expected");
            message.dir = $root.Directory.fromObject(object.dir);
        }
        if (object.pin) {
            if (typeof object.pin !== "object")
                throw TypeError(".MobilePreparedFiles.pin: object expected");
            message.pin = {};
            for (let keys = Object.keys(object.pin), i = 0; i < keys.length; ++i)
                message.pin[keys[i]] = String(object.pin[keys[i]]);
        }
        return message;
    };

    /**
     * Creates a plain object from a MobilePreparedFiles message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MobilePreparedFiles
     * @static
     * @param {MobilePreparedFiles} message MobilePreparedFiles
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MobilePreparedFiles.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.objects || options.defaults)
            object.pin = {};
        if (options.defaults)
            object.dir = null;
        if (message.dir != null && message.hasOwnProperty("dir"))
            object.dir = $root.Directory.toObject(message.dir, options);
        let keys2;
        if (message.pin && (keys2 = Object.keys(message.pin)).length) {
            object.pin = {};
            for (let j = 0; j < keys2.length; ++j)
                object.pin[keys2[j]] = message.pin[keys2[j]];
        }
        return object;
    };

    /**
     * Converts this MobilePreparedFiles to JSON.
     * @function toJSON
     * @memberof MobilePreparedFiles
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MobilePreparedFiles.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MobilePreparedFiles;
})();

export { $root as default };
