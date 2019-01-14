import * as $protobuf from "protobufjs";
/** Properties of a Cafe. */
export interface ICafe {

    /** Cafe peer */
    peer?: (string|null);

    /** Cafe address */
    address?: (string|null);

    /** Cafe api */
    api?: (string|null);

    /** Cafe protocol */
    protocol?: (string|null);

    /** Cafe node */
    node?: (string|null);

    /** Cafe url */
    url?: (string|null);

    /** Cafe swarm */
    swarm?: (string[]|null);
}

/** Represents a Cafe. */
export class Cafe implements ICafe {

    /**
     * Constructs a new Cafe.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafe);

    /** Cafe peer. */
    public peer: string;

    /** Cafe address. */
    public address: string;

    /** Cafe api. */
    public api: string;

    /** Cafe protocol. */
    public protocol: string;

    /** Cafe node. */
    public node: string;

    /** Cafe url. */
    public url: string;

    /** Cafe swarm. */
    public swarm: string[];

    /**
     * Creates a new Cafe instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Cafe instance
     */
    public static create(properties?: ICafe): Cafe;

    /**
     * Encodes the specified Cafe message. Does not implicitly {@link Cafe.verify|verify} messages.
     * @param message Cafe message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafe, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Cafe message, length delimited. Does not implicitly {@link Cafe.verify|verify} messages.
     * @param message Cafe message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafe, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Cafe message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Cafe
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Cafe;

    /**
     * Decodes a Cafe message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Cafe
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Cafe;

    /**
     * Verifies a Cafe message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Cafe message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Cafe
     */
    public static fromObject(object: { [k: string]: any }): Cafe;

    /**
     * Creates a plain object from a Cafe message. Also converts values to other types if specified.
     * @param message Cafe
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Cafe, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Cafe to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeChallenge. */
export interface ICafeChallenge {

    /** CafeChallenge address */
    address?: (string|null);
}

/** Represents a CafeChallenge. */
export class CafeChallenge implements ICafeChallenge {

    /**
     * Constructs a new CafeChallenge.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeChallenge);

    /** CafeChallenge address. */
    public address: string;

    /**
     * Creates a new CafeChallenge instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeChallenge instance
     */
    public static create(properties?: ICafeChallenge): CafeChallenge;

    /**
     * Encodes the specified CafeChallenge message. Does not implicitly {@link CafeChallenge.verify|verify} messages.
     * @param message CafeChallenge message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeChallenge, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeChallenge message, length delimited. Does not implicitly {@link CafeChallenge.verify|verify} messages.
     * @param message CafeChallenge message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeChallenge, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeChallenge message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeChallenge
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeChallenge;

    /**
     * Decodes a CafeChallenge message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeChallenge
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeChallenge;

    /**
     * Verifies a CafeChallenge message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeChallenge message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeChallenge
     */
    public static fromObject(object: { [k: string]: any }): CafeChallenge;

    /**
     * Creates a plain object from a CafeChallenge message. Also converts values to other types if specified.
     * @param message CafeChallenge
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeChallenge, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeChallenge to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeNonce. */
export interface ICafeNonce {

    /** CafeNonce value */
    value?: (string|null);
}

/** Represents a CafeNonce. */
export class CafeNonce implements ICafeNonce {

    /**
     * Constructs a new CafeNonce.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeNonce);

    /** CafeNonce value. */
    public value: string;

    /**
     * Creates a new CafeNonce instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeNonce instance
     */
    public static create(properties?: ICafeNonce): CafeNonce;

    /**
     * Encodes the specified CafeNonce message. Does not implicitly {@link CafeNonce.verify|verify} messages.
     * @param message CafeNonce message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeNonce, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeNonce message, length delimited. Does not implicitly {@link CafeNonce.verify|verify} messages.
     * @param message CafeNonce message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeNonce, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeNonce message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeNonce
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeNonce;

    /**
     * Decodes a CafeNonce message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeNonce
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeNonce;

    /**
     * Verifies a CafeNonce message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeNonce message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeNonce
     */
    public static fromObject(object: { [k: string]: any }): CafeNonce;

    /**
     * Creates a plain object from a CafeNonce message. Also converts values to other types if specified.
     * @param message CafeNonce
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeNonce, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeNonce to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeRegistration. */
export interface ICafeRegistration {

    /** CafeRegistration address */
    address?: (string|null);

    /** CafeRegistration value */
    value?: (string|null);

    /** CafeRegistration nonce */
    nonce?: (string|null);

    /** CafeRegistration sig */
    sig?: (Uint8Array|null);
}

/** Represents a CafeRegistration. */
export class CafeRegistration implements ICafeRegistration {

    /**
     * Constructs a new CafeRegistration.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeRegistration);

    /** CafeRegistration address. */
    public address: string;

    /** CafeRegistration value. */
    public value: string;

    /** CafeRegistration nonce. */
    public nonce: string;

    /** CafeRegistration sig. */
    public sig: Uint8Array;

    /**
     * Creates a new CafeRegistration instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeRegistration instance
     */
    public static create(properties?: ICafeRegistration): CafeRegistration;

    /**
     * Encodes the specified CafeRegistration message. Does not implicitly {@link CafeRegistration.verify|verify} messages.
     * @param message CafeRegistration message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeRegistration, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeRegistration message, length delimited. Does not implicitly {@link CafeRegistration.verify|verify} messages.
     * @param message CafeRegistration message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeRegistration, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeRegistration message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeRegistration
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeRegistration;

    /**
     * Decodes a CafeRegistration message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeRegistration
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeRegistration;

    /**
     * Verifies a CafeRegistration message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeRegistration message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeRegistration
     */
    public static fromObject(object: { [k: string]: any }): CafeRegistration;

    /**
     * Creates a plain object from a CafeRegistration message. Also converts values to other types if specified.
     * @param message CafeRegistration
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeRegistration, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeRegistration to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeSession. */
export interface ICafeSession {

    /** CafeSession id */
    id?: (string|null);

    /** CafeSession access */
    access?: (string|null);

    /** CafeSession exp */
    exp?: (google.protobuf.ITimestamp|null);

    /** CafeSession refresh */
    refresh?: (string|null);

    /** CafeSession rexp */
    rexp?: (google.protobuf.ITimestamp|null);

    /** CafeSession subject */
    subject?: (string|null);

    /** CafeSession type */
    type?: (string|null);

    /** CafeSession cafe */
    cafe?: (ICafe|null);
}

/** Represents a CafeSession. */
export class CafeSession implements ICafeSession {

    /**
     * Constructs a new CafeSession.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeSession);

    /** CafeSession id. */
    public id: string;

    /** CafeSession access. */
    public access: string;

    /** CafeSession exp. */
    public exp?: (google.protobuf.ITimestamp|null);

    /** CafeSession refresh. */
    public refresh: string;

    /** CafeSession rexp. */
    public rexp?: (google.protobuf.ITimestamp|null);

    /** CafeSession subject. */
    public subject: string;

    /** CafeSession type. */
    public type: string;

    /** CafeSession cafe. */
    public cafe?: (ICafe|null);

    /**
     * Creates a new CafeSession instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeSession instance
     */
    public static create(properties?: ICafeSession): CafeSession;

    /**
     * Encodes the specified CafeSession message. Does not implicitly {@link CafeSession.verify|verify} messages.
     * @param message CafeSession message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeSession, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeSession message, length delimited. Does not implicitly {@link CafeSession.verify|verify} messages.
     * @param message CafeSession message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeSession, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeSession message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeSession
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeSession;

    /**
     * Decodes a CafeSession message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeSession
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeSession;

    /**
     * Verifies a CafeSession message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeSession message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeSession
     */
    public static fromObject(object: { [k: string]: any }): CafeSession;

    /**
     * Creates a plain object from a CafeSession message. Also converts values to other types if specified.
     * @param message CafeSession
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeSession, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeSession to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeRefreshSession. */
export interface ICafeRefreshSession {

    /** CafeRefreshSession access */
    access?: (string|null);

    /** CafeRefreshSession refresh */
    refresh?: (string|null);
}

/** Represents a CafeRefreshSession. */
export class CafeRefreshSession implements ICafeRefreshSession {

    /**
     * Constructs a new CafeRefreshSession.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeRefreshSession);

    /** CafeRefreshSession access. */
    public access: string;

    /** CafeRefreshSession refresh. */
    public refresh: string;

    /**
     * Creates a new CafeRefreshSession instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeRefreshSession instance
     */
    public static create(properties?: ICafeRefreshSession): CafeRefreshSession;

    /**
     * Encodes the specified CafeRefreshSession message. Does not implicitly {@link CafeRefreshSession.verify|verify} messages.
     * @param message CafeRefreshSession message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeRefreshSession, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeRefreshSession message, length delimited. Does not implicitly {@link CafeRefreshSession.verify|verify} messages.
     * @param message CafeRefreshSession message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeRefreshSession, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeRefreshSession message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeRefreshSession
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeRefreshSession;

    /**
     * Decodes a CafeRefreshSession message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeRefreshSession
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeRefreshSession;

    /**
     * Verifies a CafeRefreshSession message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeRefreshSession message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeRefreshSession
     */
    public static fromObject(object: { [k: string]: any }): CafeRefreshSession;

    /**
     * Creates a plain object from a CafeRefreshSession message. Also converts values to other types if specified.
     * @param message CafeRefreshSession
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeRefreshSession, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeRefreshSession to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeStore. */
export interface ICafeStore {

    /** CafeStore token */
    token?: (string|null);

    /** CafeStore cids */
    cids?: (string[]|null);
}

/** Represents a CafeStore. */
export class CafeStore implements ICafeStore {

    /**
     * Constructs a new CafeStore.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeStore);

    /** CafeStore token. */
    public token: string;

    /** CafeStore cids. */
    public cids: string[];

    /**
     * Creates a new CafeStore instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeStore instance
     */
    public static create(properties?: ICafeStore): CafeStore;

    /**
     * Encodes the specified CafeStore message. Does not implicitly {@link CafeStore.verify|verify} messages.
     * @param message CafeStore message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeStore, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeStore message, length delimited. Does not implicitly {@link CafeStore.verify|verify} messages.
     * @param message CafeStore message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeStore, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeStore message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeStore
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeStore;

    /**
     * Decodes a CafeStore message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeStore
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeStore;

    /**
     * Verifies a CafeStore message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeStore message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeStore
     */
    public static fromObject(object: { [k: string]: any }): CafeStore;

    /**
     * Creates a plain object from a CafeStore message. Also converts values to other types if specified.
     * @param message CafeStore
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeStore, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeStore to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeObjectList. */
export interface ICafeObjectList {

    /** CafeObjectList cids */
    cids?: (string[]|null);
}

/** Represents a CafeObjectList. */
export class CafeObjectList implements ICafeObjectList {

    /**
     * Constructs a new CafeObjectList.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeObjectList);

    /** CafeObjectList cids. */
    public cids: string[];

    /**
     * Creates a new CafeObjectList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeObjectList instance
     */
    public static create(properties?: ICafeObjectList): CafeObjectList;

    /**
     * Encodes the specified CafeObjectList message. Does not implicitly {@link CafeObjectList.verify|verify} messages.
     * @param message CafeObjectList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeObjectList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeObjectList message, length delimited. Does not implicitly {@link CafeObjectList.verify|verify} messages.
     * @param message CafeObjectList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeObjectList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeObjectList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeObjectList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeObjectList;

    /**
     * Decodes a CafeObjectList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeObjectList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeObjectList;

    /**
     * Verifies a CafeObjectList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeObjectList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeObjectList
     */
    public static fromObject(object: { [k: string]: any }): CafeObjectList;

    /**
     * Creates a plain object from a CafeObjectList message. Also converts values to other types if specified.
     * @param message CafeObjectList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeObjectList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeObjectList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeObject. */
export interface ICafeObject {

    /** CafeObject token */
    token?: (string|null);

    /** CafeObject cid */
    cid?: (string|null);

    /** CafeObject data */
    data?: (Uint8Array|null);

    /** CafeObject node */
    node?: (Uint8Array|null);
}

/** Represents a CafeObject. */
export class CafeObject implements ICafeObject {

    /**
     * Constructs a new CafeObject.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeObject);

    /** CafeObject token. */
    public token: string;

    /** CafeObject cid. */
    public cid: string;

    /** CafeObject data. */
    public data: Uint8Array;

    /** CafeObject node. */
    public node: Uint8Array;

    /**
     * Creates a new CafeObject instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeObject instance
     */
    public static create(properties?: ICafeObject): CafeObject;

    /**
     * Encodes the specified CafeObject message. Does not implicitly {@link CafeObject.verify|verify} messages.
     * @param message CafeObject message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeObject, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeObject message, length delimited. Does not implicitly {@link CafeObject.verify|verify} messages.
     * @param message CafeObject message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeObject, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeObject message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeObject
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeObject;

    /**
     * Decodes a CafeObject message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeObject
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeObject;

    /**
     * Verifies a CafeObject message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeObject message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeObject
     */
    public static fromObject(object: { [k: string]: any }): CafeObject;

    /**
     * Creates a plain object from a CafeObject message. Also converts values to other types if specified.
     * @param message CafeObject
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeObject, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeObject to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeStoreThread. */
export interface ICafeStoreThread {

    /** CafeStoreThread token */
    token?: (string|null);

    /** CafeStoreThread id */
    id?: (string|null);

    /** CafeStoreThread ciphertext */
    ciphertext?: (Uint8Array|null);
}

/** Represents a CafeStoreThread. */
export class CafeStoreThread implements ICafeStoreThread {

    /**
     * Constructs a new CafeStoreThread.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeStoreThread);

    /** CafeStoreThread token. */
    public token: string;

    /** CafeStoreThread id. */
    public id: string;

    /** CafeStoreThread ciphertext. */
    public ciphertext: Uint8Array;

    /**
     * Creates a new CafeStoreThread instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeStoreThread instance
     */
    public static create(properties?: ICafeStoreThread): CafeStoreThread;

    /**
     * Encodes the specified CafeStoreThread message. Does not implicitly {@link CafeStoreThread.verify|verify} messages.
     * @param message CafeStoreThread message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeStoreThread, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeStoreThread message, length delimited. Does not implicitly {@link CafeStoreThread.verify|verify} messages.
     * @param message CafeStoreThread message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeStoreThread, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeStoreThread message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeStoreThread
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeStoreThread;

    /**
     * Decodes a CafeStoreThread message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeStoreThread
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeStoreThread;

    /**
     * Verifies a CafeStoreThread message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeStoreThread message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeStoreThread
     */
    public static fromObject(object: { [k: string]: any }): CafeStoreThread;

    /**
     * Creates a plain object from a CafeStoreThread message. Also converts values to other types if specified.
     * @param message CafeStoreThread
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeStoreThread, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeStoreThread to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeThread. */
export interface ICafeThread {

    /** CafeThread key */
    key?: (string|null);

    /** CafeThread sk */
    sk?: (Uint8Array|null);

    /** CafeThread name */
    name?: (string|null);

    /** CafeThread schema */
    schema?: (string|null);

    /** CafeThread initiator */
    initiator?: (string|null);

    /** CafeThread type */
    type?: (number|null);

    /** CafeThread state */
    state?: (number|null);

    /** CafeThread head */
    head?: (string|null);
}

/** Represents a CafeThread. */
export class CafeThread implements ICafeThread {

    /**
     * Constructs a new CafeThread.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeThread);

    /** CafeThread key. */
    public key: string;

    /** CafeThread sk. */
    public sk: Uint8Array;

    /** CafeThread name. */
    public name: string;

    /** CafeThread schema. */
    public schema: string;

    /** CafeThread initiator. */
    public initiator: string;

    /** CafeThread type. */
    public type: number;

    /** CafeThread state. */
    public state: number;

    /** CafeThread head. */
    public head: string;

    /**
     * Creates a new CafeThread instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeThread instance
     */
    public static create(properties?: ICafeThread): CafeThread;

    /**
     * Encodes the specified CafeThread message. Does not implicitly {@link CafeThread.verify|verify} messages.
     * @param message CafeThread message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeThread, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeThread message, length delimited. Does not implicitly {@link CafeThread.verify|verify} messages.
     * @param message CafeThread message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeThread, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeThread message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeThread
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeThread;

    /**
     * Decodes a CafeThread message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeThread
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeThread;

    /**
     * Verifies a CafeThread message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeThread message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeThread
     */
    public static fromObject(object: { [k: string]: any }): CafeThread;

    /**
     * Creates a plain object from a CafeThread message. Also converts values to other types if specified.
     * @param message CafeThread
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeThread, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeThread to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeStored. */
export interface ICafeStored {

    /** CafeStored id */
    id?: (string|null);
}

/** Represents a CafeStored. */
export class CafeStored implements ICafeStored {

    /**
     * Constructs a new CafeStored.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeStored);

    /** CafeStored id. */
    public id: string;

    /**
     * Creates a new CafeStored instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeStored instance
     */
    public static create(properties?: ICafeStored): CafeStored;

    /**
     * Encodes the specified CafeStored message. Does not implicitly {@link CafeStored.verify|verify} messages.
     * @param message CafeStored message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeStored, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeStored message, length delimited. Does not implicitly {@link CafeStored.verify|verify} messages.
     * @param message CafeStored message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeStored, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeStored message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeStored
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeStored;

    /**
     * Decodes a CafeStored message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeStored
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeStored;

    /**
     * Verifies a CafeStored message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeStored message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeStored
     */
    public static fromObject(object: { [k: string]: any }): CafeStored;

    /**
     * Creates a plain object from a CafeStored message. Also converts values to other types if specified.
     * @param message CafeStored
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeStored, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeStored to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeDeliverMessage. */
export interface ICafeDeliverMessage {

    /** CafeDeliverMessage id */
    id?: (string|null);

    /** CafeDeliverMessage clientId */
    clientId?: (string|null);
}

/** Represents a CafeDeliverMessage. */
export class CafeDeliverMessage implements ICafeDeliverMessage {

    /**
     * Constructs a new CafeDeliverMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeDeliverMessage);

    /** CafeDeliverMessage id. */
    public id: string;

    /** CafeDeliverMessage clientId. */
    public clientId: string;

    /**
     * Creates a new CafeDeliverMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeDeliverMessage instance
     */
    public static create(properties?: ICafeDeliverMessage): CafeDeliverMessage;

    /**
     * Encodes the specified CafeDeliverMessage message. Does not implicitly {@link CafeDeliverMessage.verify|verify} messages.
     * @param message CafeDeliverMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeDeliverMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeDeliverMessage message, length delimited. Does not implicitly {@link CafeDeliverMessage.verify|verify} messages.
     * @param message CafeDeliverMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeDeliverMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeDeliverMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeDeliverMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeDeliverMessage;

    /**
     * Decodes a CafeDeliverMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeDeliverMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeDeliverMessage;

    /**
     * Verifies a CafeDeliverMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeDeliverMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeDeliverMessage
     */
    public static fromObject(object: { [k: string]: any }): CafeDeliverMessage;

    /**
     * Creates a plain object from a CafeDeliverMessage message. Also converts values to other types if specified.
     * @param message CafeDeliverMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeDeliverMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeDeliverMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeCheckMessages. */
export interface ICafeCheckMessages {

    /** CafeCheckMessages token */
    token?: (string|null);
}

/** Represents a CafeCheckMessages. */
export class CafeCheckMessages implements ICafeCheckMessages {

    /**
     * Constructs a new CafeCheckMessages.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeCheckMessages);

    /** CafeCheckMessages token. */
    public token: string;

    /**
     * Creates a new CafeCheckMessages instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeCheckMessages instance
     */
    public static create(properties?: ICafeCheckMessages): CafeCheckMessages;

    /**
     * Encodes the specified CafeCheckMessages message. Does not implicitly {@link CafeCheckMessages.verify|verify} messages.
     * @param message CafeCheckMessages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeCheckMessages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeCheckMessages message, length delimited. Does not implicitly {@link CafeCheckMessages.verify|verify} messages.
     * @param message CafeCheckMessages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeCheckMessages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeCheckMessages message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeCheckMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeCheckMessages;

    /**
     * Decodes a CafeCheckMessages message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeCheckMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeCheckMessages;

    /**
     * Verifies a CafeCheckMessages message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeCheckMessages message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeCheckMessages
     */
    public static fromObject(object: { [k: string]: any }): CafeCheckMessages;

    /**
     * Creates a plain object from a CafeCheckMessages message. Also converts values to other types if specified.
     * @param message CafeCheckMessages
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeCheckMessages, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeCheckMessages to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeMessage. */
export interface ICafeMessage {

    /** CafeMessage id */
    id?: (string|null);

    /** CafeMessage peerId */
    peerId?: (string|null);

    /** CafeMessage date */
    date?: (google.protobuf.ITimestamp|null);
}

/** Represents a CafeMessage. */
export class CafeMessage implements ICafeMessage {

    /**
     * Constructs a new CafeMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeMessage);

    /** CafeMessage id. */
    public id: string;

    /** CafeMessage peerId. */
    public peerId: string;

    /** CafeMessage date. */
    public date?: (google.protobuf.ITimestamp|null);

    /**
     * Creates a new CafeMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeMessage instance
     */
    public static create(properties?: ICafeMessage): CafeMessage;

    /**
     * Encodes the specified CafeMessage message. Does not implicitly {@link CafeMessage.verify|verify} messages.
     * @param message CafeMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeMessage message, length delimited. Does not implicitly {@link CafeMessage.verify|verify} messages.
     * @param message CafeMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeMessage;

    /**
     * Decodes a CafeMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeMessage;

    /**
     * Verifies a CafeMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeMessage
     */
    public static fromObject(object: { [k: string]: any }): CafeMessage;

    /**
     * Creates a plain object from a CafeMessage message. Also converts values to other types if specified.
     * @param message CafeMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeMessages. */
export interface ICafeMessages {

    /** CafeMessages messages */
    messages?: (ICafeMessage[]|null);
}

/** Represents a CafeMessages. */
export class CafeMessages implements ICafeMessages {

    /**
     * Constructs a new CafeMessages.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeMessages);

    /** CafeMessages messages. */
    public messages: ICafeMessage[];

    /**
     * Creates a new CafeMessages instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeMessages instance
     */
    public static create(properties?: ICafeMessages): CafeMessages;

    /**
     * Encodes the specified CafeMessages message. Does not implicitly {@link CafeMessages.verify|verify} messages.
     * @param message CafeMessages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeMessages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeMessages message, length delimited. Does not implicitly {@link CafeMessages.verify|verify} messages.
     * @param message CafeMessages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeMessages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeMessages message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeMessages;

    /**
     * Decodes a CafeMessages message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeMessages;

    /**
     * Verifies a CafeMessages message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeMessages message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeMessages
     */
    public static fromObject(object: { [k: string]: any }): CafeMessages;

    /**
     * Creates a plain object from a CafeMessages message. Also converts values to other types if specified.
     * @param message CafeMessages
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeMessages, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeMessages to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeDeleteMessages. */
export interface ICafeDeleteMessages {

    /** CafeDeleteMessages token */
    token?: (string|null);
}

/** Represents a CafeDeleteMessages. */
export class CafeDeleteMessages implements ICafeDeleteMessages {

    /**
     * Constructs a new CafeDeleteMessages.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeDeleteMessages);

    /** CafeDeleteMessages token. */
    public token: string;

    /**
     * Creates a new CafeDeleteMessages instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeDeleteMessages instance
     */
    public static create(properties?: ICafeDeleteMessages): CafeDeleteMessages;

    /**
     * Encodes the specified CafeDeleteMessages message. Does not implicitly {@link CafeDeleteMessages.verify|verify} messages.
     * @param message CafeDeleteMessages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeDeleteMessages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeDeleteMessages message, length delimited. Does not implicitly {@link CafeDeleteMessages.verify|verify} messages.
     * @param message CafeDeleteMessages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeDeleteMessages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeDeleteMessages message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeDeleteMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeDeleteMessages;

    /**
     * Decodes a CafeDeleteMessages message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeDeleteMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeDeleteMessages;

    /**
     * Verifies a CafeDeleteMessages message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeDeleteMessages message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeDeleteMessages
     */
    public static fromObject(object: { [k: string]: any }): CafeDeleteMessages;

    /**
     * Creates a plain object from a CafeDeleteMessages message. Also converts values to other types if specified.
     * @param message CafeDeleteMessages
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeDeleteMessages, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeDeleteMessages to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CafeDeleteMessagesAck. */
export interface ICafeDeleteMessagesAck {

    /** CafeDeleteMessagesAck more */
    more?: (boolean|null);
}

/** Represents a CafeDeleteMessagesAck. */
export class CafeDeleteMessagesAck implements ICafeDeleteMessagesAck {

    /**
     * Constructs a new CafeDeleteMessagesAck.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICafeDeleteMessagesAck);

    /** CafeDeleteMessagesAck more. */
    public more: boolean;

    /**
     * Creates a new CafeDeleteMessagesAck instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CafeDeleteMessagesAck instance
     */
    public static create(properties?: ICafeDeleteMessagesAck): CafeDeleteMessagesAck;

    /**
     * Encodes the specified CafeDeleteMessagesAck message. Does not implicitly {@link CafeDeleteMessagesAck.verify|verify} messages.
     * @param message CafeDeleteMessagesAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICafeDeleteMessagesAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CafeDeleteMessagesAck message, length delimited. Does not implicitly {@link CafeDeleteMessagesAck.verify|verify} messages.
     * @param message CafeDeleteMessagesAck message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICafeDeleteMessagesAck, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CafeDeleteMessagesAck message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CafeDeleteMessagesAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CafeDeleteMessagesAck;

    /**
     * Decodes a CafeDeleteMessagesAck message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CafeDeleteMessagesAck
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CafeDeleteMessagesAck;

    /**
     * Verifies a CafeDeleteMessagesAck message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CafeDeleteMessagesAck message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CafeDeleteMessagesAck
     */
    public static fromObject(object: { [k: string]: any }): CafeDeleteMessagesAck;

    /**
     * Creates a plain object from a CafeDeleteMessagesAck message. Also converts values to other types if specified.
     * @param message CafeDeleteMessagesAck
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CafeDeleteMessagesAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CafeDeleteMessagesAck to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Message. */
export interface IMessage {

    /** Message type */
    type?: (Message.Type|null);

    /** Message payload */
    payload?: (google.protobuf.IAny|null);

    /** Message requestId */
    requestId?: (number|null);

    /** Message isResponse */
    isResponse?: (boolean|null);
}

/** Represents a Message. */
export class Message implements IMessage {

    /**
     * Constructs a new Message.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMessage);

    /** Message type. */
    public type: Message.Type;

    /** Message payload. */
    public payload?: (google.protobuf.IAny|null);

    /** Message requestId. */
    public requestId: number;

    /** Message isResponse. */
    public isResponse: boolean;

    /**
     * Creates a new Message instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Message instance
     */
    public static create(properties?: IMessage): Message;

    /**
     * Encodes the specified Message message. Does not implicitly {@link Message.verify|verify} messages.
     * @param message Message message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Message message, length delimited. Does not implicitly {@link Message.verify|verify} messages.
     * @param message Message message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Message message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Message;

    /**
     * Decodes a Message message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Message;

    /**
     * Verifies a Message message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Message message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Message
     */
    public static fromObject(object: { [k: string]: any }): Message;

    /**
     * Creates a plain object from a Message message. Also converts values to other types if specified.
     * @param message Message
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Message, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Message to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Message {

    /** Type enum. */
    enum Type {
        PING = 0,
        PONG = 1,
        THREAD_ENVELOPE = 10,
        CAFE_CHALLENGE = 50,
        CAFE_NONCE = 51,
        CAFE_REGISTRATION = 52,
        CAFE_SESSION = 53,
        CAFE_REFRESH_SESSION = 54,
        CAFE_STORE = 55,
        CAFE_OBJECT = 56,
        CAFE_OBJECT_LIST = 57,
        CAFE_STORE_THREAD = 58,
        CAFE_STORED = 59,
        CAFE_DELIVER_MESSAGE = 60,
        CAFE_CHECK_MESSAGES = 61,
        CAFE_MESSAGES = 62,
        CAFE_DELETE_MESSAGES = 63,
        CAFE_DELETE_MESSAGES_ACK = 64,
        CAFE_YOU_HAVE_MAIL = 65,
        ERROR = 500
    }
}

/** Properties of an Envelope. */
export interface IEnvelope {

    /** Envelope message */
    message?: (IMessage|null);

    /** Envelope sig */
    sig?: (Uint8Array|null);
}

/** Represents an Envelope. */
export class Envelope implements IEnvelope {

    /**
     * Constructs a new Envelope.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEnvelope);

    /** Envelope message. */
    public message?: (IMessage|null);

    /** Envelope sig. */
    public sig: Uint8Array;

    /**
     * Creates a new Envelope instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Envelope instance
     */
    public static create(properties?: IEnvelope): Envelope;

    /**
     * Encodes the specified Envelope message. Does not implicitly {@link Envelope.verify|verify} messages.
     * @param message Envelope message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Envelope message, length delimited. Does not implicitly {@link Envelope.verify|verify} messages.
     * @param message Envelope message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Envelope message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Envelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Envelope;

    /**
     * Decodes an Envelope message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Envelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Envelope;

    /**
     * Verifies an Envelope message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Envelope
     */
    public static fromObject(object: { [k: string]: any }): Envelope;

    /**
     * Creates a plain object from an Envelope message. Also converts values to other types if specified.
     * @param message Envelope
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Envelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Envelope to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an Error. */
export interface IError {

    /** Error code */
    code?: (number|null);

    /** Error message */
    message?: (string|null);
}

/** Represents an Error. */
export class Error implements IError {

    /**
     * Constructs a new Error.
     * @param [properties] Properties to set
     */
    constructor(properties?: IError);

    /** Error code. */
    public code: number;

    /** Error message. */
    public message: string;

    /**
     * Creates a new Error instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Error instance
     */
    public static create(properties?: IError): Error;

    /**
     * Encodes the specified Error message. Does not implicitly {@link Error.verify|verify} messages.
     * @param message Error message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IError, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Error message, length delimited. Does not implicitly {@link Error.verify|verify} messages.
     * @param message Error message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IError, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Error message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Error
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Error;

    /**
     * Decodes an Error message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Error
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Error;

    /**
     * Verifies an Error message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Error message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Error
     */
    public static fromObject(object: { [k: string]: any }): Error;

    /**
     * Creates a plain object from an Error message. Also converts values to other types if specified.
     * @param message Error
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Error, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Error to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a File. */
export interface IFile {

    /** File mill */
    mill?: (string|null);

    /** File checksum */
    checksum?: (string|null);

    /** File source */
    source?: (string|null);

    /** File opts */
    opts?: (string|null);

    /** File hash */
    hash?: (string|null);

    /** File key */
    key?: (string|null);

    /** File media */
    media?: (string|null);

    /** File name */
    name?: (string|null);

    /** File size */
    size?: (number|Long|null);

    /** File added */
    added?: (google.protobuf.ITimestamp|null);

    /** File meta */
    meta?: (google.protobuf.IStruct|null);
}

/** Represents a File. */
export class File implements IFile {

    /**
     * Constructs a new File.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFile);

    /** File mill. */
    public mill: string;

    /** File checksum. */
    public checksum: string;

    /** File source. */
    public source: string;

    /** File opts. */
    public opts: string;

    /** File hash. */
    public hash: string;

    /** File key. */
    public key: string;

    /** File media. */
    public media: string;

    /** File name. */
    public name: string;

    /** File size. */
    public size: (number|Long);

    /** File added. */
    public added?: (google.protobuf.ITimestamp|null);

    /** File meta. */
    public meta?: (google.protobuf.IStruct|null);

    /**
     * Creates a new File instance using the specified properties.
     * @param [properties] Properties to set
     * @returns File instance
     */
    public static create(properties?: IFile): File;

    /**
     * Encodes the specified File message. Does not implicitly {@link File.verify|verify} messages.
     * @param message File message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFile, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified File message, length delimited. Does not implicitly {@link File.verify|verify} messages.
     * @param message File message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFile, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a File message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns File
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): File;

    /**
     * Decodes a File message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns File
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): File;

    /**
     * Verifies a File message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a File message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns File
     */
    public static fromObject(object: { [k: string]: any }): File;

    /**
     * Creates a plain object from a File message. Also converts values to other types if specified.
     * @param message File
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: File, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this File to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|Long|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: (number|Long);

            /** Timestamp nanos. */
            public nanos: number;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Timestamp instance
             */
            public static create(properties?: google.protobuf.ITimestamp): google.protobuf.Timestamp;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Timestamp;

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Timestamp;

            /**
             * Verifies a Timestamp message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Timestamp
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Timestamp;

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @param message Timestamp
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Timestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Timestamp to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Struct. */
        interface IStruct {

            /** Struct fields */
            fields?: ({ [k: string]: google.protobuf.IValue }|null);
        }

        /** Represents a Struct. */
        class Struct implements IStruct {

            /**
             * Constructs a new Struct.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IStruct);

            /** Struct fields. */
            public fields: { [k: string]: google.protobuf.IValue };

            /**
             * Creates a new Struct instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Struct instance
             */
            public static create(properties?: google.protobuf.IStruct): google.protobuf.Struct;

            /**
             * Encodes the specified Struct message. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @param message Struct message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IStruct, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Struct message, length delimited. Does not implicitly {@link google.protobuf.Struct.verify|verify} messages.
             * @param message Struct message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IStruct, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Struct message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Struct;

            /**
             * Decodes a Struct message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Struct
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Struct;

            /**
             * Verifies a Struct message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Struct message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Struct
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Struct;

            /**
             * Creates a plain object from a Struct message. Also converts values to other types if specified.
             * @param message Struct
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Struct, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Struct to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Value. */
        interface IValue {

            /** Value nullValue */
            nullValue?: (google.protobuf.NullValue|null);

            /** Value numberValue */
            numberValue?: (number|null);

            /** Value stringValue */
            stringValue?: (string|null);

            /** Value boolValue */
            boolValue?: (boolean|null);

            /** Value structValue */
            structValue?: (google.protobuf.IStruct|null);

            /** Value listValue */
            listValue?: (google.protobuf.IListValue|null);
        }

        /** Represents a Value. */
        class Value implements IValue {

            /**
             * Constructs a new Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IValue);

            /** Value nullValue. */
            public nullValue: google.protobuf.NullValue;

            /** Value numberValue. */
            public numberValue: number;

            /** Value stringValue. */
            public stringValue: string;

            /** Value boolValue. */
            public boolValue: boolean;

            /** Value structValue. */
            public structValue?: (google.protobuf.IStruct|null);

            /** Value listValue. */
            public listValue?: (google.protobuf.IListValue|null);

            /** Value kind. */
            public kind?: ("nullValue"|"numberValue"|"stringValue"|"boolValue"|"structValue"|"listValue");

            /**
             * Creates a new Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Value instance
             */
            public static create(properties?: google.protobuf.IValue): google.protobuf.Value;

            /**
             * Encodes the specified Value message. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @param message Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Value message, length delimited. Does not implicitly {@link google.protobuf.Value.verify|verify} messages.
             * @param message Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Value;

            /**
             * Decodes a Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Value;

            /**
             * Verifies a Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Value;

            /**
             * Creates a plain object from a Value message. Also converts values to other types if specified.
             * @param message Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** NullValue enum. */
        enum NullValue {
            NULL_VALUE = 0
        }

        /** Properties of a ListValue. */
        interface IListValue {

            /** ListValue values */
            values?: (google.protobuf.IValue[]|null);
        }

        /** Represents a ListValue. */
        class ListValue implements IListValue {

            /**
             * Constructs a new ListValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IListValue);

            /** ListValue values. */
            public values: google.protobuf.IValue[];

            /**
             * Creates a new ListValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListValue instance
             */
            public static create(properties?: google.protobuf.IListValue): google.protobuf.ListValue;

            /**
             * Encodes the specified ListValue message. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @param message ListValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IListValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListValue message, length delimited. Does not implicitly {@link google.protobuf.ListValue.verify|verify} messages.
             * @param message ListValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IListValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ListValue;

            /**
             * Decodes a ListValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ListValue;

            /**
             * Verifies a ListValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ListValue;

            /**
             * Creates a plain object from a ListValue message. Also converts values to other types if specified.
             * @param message ListValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ListValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}

/** Properties of a ThreadEnvelope. */
export interface IThreadEnvelope {

    /** ThreadEnvelope thread */
    thread?: (string|null);

    /** ThreadEnvelope hash */
    hash?: (string|null);

    /** ThreadEnvelope ciphertext */
    ciphertext?: (Uint8Array|null);
}

/** Represents a ThreadEnvelope. */
export class ThreadEnvelope implements IThreadEnvelope {

    /**
     * Constructs a new ThreadEnvelope.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadEnvelope);

    /** ThreadEnvelope thread. */
    public thread: string;

    /** ThreadEnvelope hash. */
    public hash: string;

    /** ThreadEnvelope ciphertext. */
    public ciphertext: Uint8Array;

    /**
     * Creates a new ThreadEnvelope instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadEnvelope instance
     */
    public static create(properties?: IThreadEnvelope): ThreadEnvelope;

    /**
     * Encodes the specified ThreadEnvelope message. Does not implicitly {@link ThreadEnvelope.verify|verify} messages.
     * @param message ThreadEnvelope message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadEnvelope message, length delimited. Does not implicitly {@link ThreadEnvelope.verify|verify} messages.
     * @param message ThreadEnvelope message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadEnvelope message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadEnvelope;

    /**
     * Decodes a ThreadEnvelope message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadEnvelope
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadEnvelope;

    /**
     * Verifies a ThreadEnvelope message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadEnvelope message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadEnvelope
     */
    public static fromObject(object: { [k: string]: any }): ThreadEnvelope;

    /**
     * Creates a plain object from a ThreadEnvelope message. Also converts values to other types if specified.
     * @param message ThreadEnvelope
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadEnvelope to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ThreadBlock. */
export interface IThreadBlock {

    /** ThreadBlock header */
    header?: (IThreadBlockHeader|null);

    /** ThreadBlock type */
    type?: (ThreadBlock.Type|null);

    /** ThreadBlock payload */
    payload?: (google.protobuf.IAny|null);
}

/** Represents a ThreadBlock. */
export class ThreadBlock implements IThreadBlock {

    /**
     * Constructs a new ThreadBlock.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadBlock);

    /** ThreadBlock header. */
    public header?: (IThreadBlockHeader|null);

    /** ThreadBlock type. */
    public type: ThreadBlock.Type;

    /** ThreadBlock payload. */
    public payload?: (google.protobuf.IAny|null);

    /**
     * Creates a new ThreadBlock instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadBlock instance
     */
    public static create(properties?: IThreadBlock): ThreadBlock;

    /**
     * Encodes the specified ThreadBlock message. Does not implicitly {@link ThreadBlock.verify|verify} messages.
     * @param message ThreadBlock message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadBlock, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadBlock message, length delimited. Does not implicitly {@link ThreadBlock.verify|verify} messages.
     * @param message ThreadBlock message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadBlock, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadBlock message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadBlock;

    /**
     * Decodes a ThreadBlock message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadBlock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadBlock;

    /**
     * Verifies a ThreadBlock message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadBlock message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadBlock
     */
    public static fromObject(object: { [k: string]: any }): ThreadBlock;

    /**
     * Creates a plain object from a ThreadBlock message. Also converts values to other types if specified.
     * @param message ThreadBlock
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadBlock, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadBlock to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace ThreadBlock {

    /** Type enum. */
    enum Type {
        MERGE = 0,
        IGNORE = 1,
        FLAG = 2,
        JOIN = 3,
        ANNOUNCE = 4,
        LEAVE = 5,
        MESSAGE = 6,
        FILES = 7,
        COMMENT = 8,
        LIKE = 9,
        INVITE = 50
    }
}

/** Properties of a ThreadBlockHeader. */
export interface IThreadBlockHeader {

    /** ThreadBlockHeader date */
    date?: (google.protobuf.ITimestamp|null);

    /** ThreadBlockHeader parents */
    parents?: (string[]|null);

    /** ThreadBlockHeader author */
    author?: (string|null);

    /** ThreadBlockHeader address */
    address?: (string|null);
}

/** Represents a ThreadBlockHeader. */
export class ThreadBlockHeader implements IThreadBlockHeader {

    /**
     * Constructs a new ThreadBlockHeader.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadBlockHeader);

    /** ThreadBlockHeader date. */
    public date?: (google.protobuf.ITimestamp|null);

    /** ThreadBlockHeader parents. */
    public parents: string[];

    /** ThreadBlockHeader author. */
    public author: string;

    /** ThreadBlockHeader address. */
    public address: string;

    /**
     * Creates a new ThreadBlockHeader instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadBlockHeader instance
     */
    public static create(properties?: IThreadBlockHeader): ThreadBlockHeader;

    /**
     * Encodes the specified ThreadBlockHeader message. Does not implicitly {@link ThreadBlockHeader.verify|verify} messages.
     * @param message ThreadBlockHeader message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadBlockHeader, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadBlockHeader message, length delimited. Does not implicitly {@link ThreadBlockHeader.verify|verify} messages.
     * @param message ThreadBlockHeader message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadBlockHeader, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadBlockHeader message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadBlockHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadBlockHeader;

    /**
     * Decodes a ThreadBlockHeader message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadBlockHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadBlockHeader;

    /**
     * Verifies a ThreadBlockHeader message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadBlockHeader message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadBlockHeader
     */
    public static fromObject(object: { [k: string]: any }): ThreadBlockHeader;

    /**
     * Creates a plain object from a ThreadBlockHeader message. Also converts values to other types if specified.
     * @param message ThreadBlockHeader
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadBlockHeader, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadBlockHeader to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ThreadInvite. */
export interface IThreadInvite {

    /** ThreadInvite sk */
    sk?: (Uint8Array|null);

    /** ThreadInvite name */
    name?: (string|null);

    /** ThreadInvite schema */
    schema?: (string|null);

    /** ThreadInvite initiator */
    initiator?: (string|null);
}

/** Represents a ThreadInvite. */
export class ThreadInvite implements IThreadInvite {

    /**
     * Constructs a new ThreadInvite.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadInvite);

    /** ThreadInvite sk. */
    public sk: Uint8Array;

    /** ThreadInvite name. */
    public name: string;

    /** ThreadInvite schema. */
    public schema: string;

    /** ThreadInvite initiator. */
    public initiator: string;

    /**
     * Creates a new ThreadInvite instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadInvite instance
     */
    public static create(properties?: IThreadInvite): ThreadInvite;

    /**
     * Encodes the specified ThreadInvite message. Does not implicitly {@link ThreadInvite.verify|verify} messages.
     * @param message ThreadInvite message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadInvite, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadInvite message, length delimited. Does not implicitly {@link ThreadInvite.verify|verify} messages.
     * @param message ThreadInvite message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadInvite, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadInvite message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadInvite
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadInvite;

    /**
     * Decodes a ThreadInvite message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadInvite
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadInvite;

    /**
     * Verifies a ThreadInvite message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadInvite message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadInvite
     */
    public static fromObject(object: { [k: string]: any }): ThreadInvite;

    /**
     * Creates a plain object from a ThreadInvite message. Also converts values to other types if specified.
     * @param message ThreadInvite
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadInvite, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadInvite to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ThreadIgnore. */
export interface IThreadIgnore {

    /** ThreadIgnore target */
    target?: (string|null);
}

/** Represents a ThreadIgnore. */
export class ThreadIgnore implements IThreadIgnore {

    /**
     * Constructs a new ThreadIgnore.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadIgnore);

    /** ThreadIgnore target. */
    public target: string;

    /**
     * Creates a new ThreadIgnore instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadIgnore instance
     */
    public static create(properties?: IThreadIgnore): ThreadIgnore;

    /**
     * Encodes the specified ThreadIgnore message. Does not implicitly {@link ThreadIgnore.verify|verify} messages.
     * @param message ThreadIgnore message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadIgnore, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadIgnore message, length delimited. Does not implicitly {@link ThreadIgnore.verify|verify} messages.
     * @param message ThreadIgnore message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadIgnore, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadIgnore message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadIgnore
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadIgnore;

    /**
     * Decodes a ThreadIgnore message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadIgnore
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadIgnore;

    /**
     * Verifies a ThreadIgnore message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadIgnore message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadIgnore
     */
    public static fromObject(object: { [k: string]: any }): ThreadIgnore;

    /**
     * Creates a plain object from a ThreadIgnore message. Also converts values to other types if specified.
     * @param message ThreadIgnore
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadIgnore, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadIgnore to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ThreadFlag. */
export interface IThreadFlag {

    /** ThreadFlag target */
    target?: (string|null);
}

/** Represents a ThreadFlag. */
export class ThreadFlag implements IThreadFlag {

    /**
     * Constructs a new ThreadFlag.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadFlag);

    /** ThreadFlag target. */
    public target: string;

    /**
     * Creates a new ThreadFlag instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadFlag instance
     */
    public static create(properties?: IThreadFlag): ThreadFlag;

    /**
     * Encodes the specified ThreadFlag message. Does not implicitly {@link ThreadFlag.verify|verify} messages.
     * @param message ThreadFlag message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadFlag, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadFlag message, length delimited. Does not implicitly {@link ThreadFlag.verify|verify} messages.
     * @param message ThreadFlag message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadFlag, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadFlag message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadFlag
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadFlag;

    /**
     * Decodes a ThreadFlag message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadFlag
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadFlag;

    /**
     * Verifies a ThreadFlag message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadFlag message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadFlag
     */
    public static fromObject(object: { [k: string]: any }): ThreadFlag;

    /**
     * Creates a plain object from a ThreadFlag message. Also converts values to other types if specified.
     * @param message ThreadFlag
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadFlag, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadFlag to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ThreadJoin. */
export interface IThreadJoin {

    /** ThreadJoin inviter */
    inviter?: (string|null);

    /** ThreadJoin username */
    username?: (string|null);

    /** ThreadJoin inboxes */
    inboxes?: (ICafe[]|null);
}

/** Represents a ThreadJoin. */
export class ThreadJoin implements IThreadJoin {

    /**
     * Constructs a new ThreadJoin.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadJoin);

    /** ThreadJoin inviter. */
    public inviter: string;

    /** ThreadJoin username. */
    public username: string;

    /** ThreadJoin inboxes. */
    public inboxes: ICafe[];

    /**
     * Creates a new ThreadJoin instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadJoin instance
     */
    public static create(properties?: IThreadJoin): ThreadJoin;

    /**
     * Encodes the specified ThreadJoin message. Does not implicitly {@link ThreadJoin.verify|verify} messages.
     * @param message ThreadJoin message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadJoin, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadJoin message, length delimited. Does not implicitly {@link ThreadJoin.verify|verify} messages.
     * @param message ThreadJoin message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadJoin, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadJoin message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadJoin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadJoin;

    /**
     * Decodes a ThreadJoin message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadJoin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadJoin;

    /**
     * Verifies a ThreadJoin message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadJoin message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadJoin
     */
    public static fromObject(object: { [k: string]: any }): ThreadJoin;

    /**
     * Creates a plain object from a ThreadJoin message. Also converts values to other types if specified.
     * @param message ThreadJoin
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadJoin, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadJoin to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ThreadAnnounce. */
export interface IThreadAnnounce {

    /** ThreadAnnounce username */
    username?: (string|null);

    /** ThreadAnnounce inboxes */
    inboxes?: (ICafe[]|null);
}

/** Represents a ThreadAnnounce. */
export class ThreadAnnounce implements IThreadAnnounce {

    /**
     * Constructs a new ThreadAnnounce.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadAnnounce);

    /** ThreadAnnounce username. */
    public username: string;

    /** ThreadAnnounce inboxes. */
    public inboxes: ICafe[];

    /**
     * Creates a new ThreadAnnounce instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadAnnounce instance
     */
    public static create(properties?: IThreadAnnounce): ThreadAnnounce;

    /**
     * Encodes the specified ThreadAnnounce message. Does not implicitly {@link ThreadAnnounce.verify|verify} messages.
     * @param message ThreadAnnounce message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadAnnounce, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadAnnounce message, length delimited. Does not implicitly {@link ThreadAnnounce.verify|verify} messages.
     * @param message ThreadAnnounce message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadAnnounce, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadAnnounce message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadAnnounce
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadAnnounce;

    /**
     * Decodes a ThreadAnnounce message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadAnnounce
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadAnnounce;

    /**
     * Verifies a ThreadAnnounce message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadAnnounce message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadAnnounce
     */
    public static fromObject(object: { [k: string]: any }): ThreadAnnounce;

    /**
     * Creates a plain object from a ThreadAnnounce message. Also converts values to other types if specified.
     * @param message ThreadAnnounce
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadAnnounce, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadAnnounce to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ThreadMessage. */
export interface IThreadMessage {

    /** ThreadMessage body */
    body?: (string|null);
}

/** Represents a ThreadMessage. */
export class ThreadMessage implements IThreadMessage {

    /**
     * Constructs a new ThreadMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadMessage);

    /** ThreadMessage body. */
    public body: string;

    /**
     * Creates a new ThreadMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadMessage instance
     */
    public static create(properties?: IThreadMessage): ThreadMessage;

    /**
     * Encodes the specified ThreadMessage message. Does not implicitly {@link ThreadMessage.verify|verify} messages.
     * @param message ThreadMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadMessage message, length delimited. Does not implicitly {@link ThreadMessage.verify|verify} messages.
     * @param message ThreadMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadMessage;

    /**
     * Decodes a ThreadMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadMessage;

    /**
     * Verifies a ThreadMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadMessage
     */
    public static fromObject(object: { [k: string]: any }): ThreadMessage;

    /**
     * Creates a plain object from a ThreadMessage message. Also converts values to other types if specified.
     * @param message ThreadMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ThreadFiles. */
export interface IThreadFiles {

    /** ThreadFiles target */
    target?: (string|null);

    /** ThreadFiles body */
    body?: (string|null);

    /** ThreadFiles keys */
    keys?: ({ [k: string]: string }|null);
}

/** Represents a ThreadFiles. */
export class ThreadFiles implements IThreadFiles {

    /**
     * Constructs a new ThreadFiles.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadFiles);

    /** ThreadFiles target. */
    public target: string;

    /** ThreadFiles body. */
    public body: string;

    /** ThreadFiles keys. */
    public keys: { [k: string]: string };

    /**
     * Creates a new ThreadFiles instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadFiles instance
     */
    public static create(properties?: IThreadFiles): ThreadFiles;

    /**
     * Encodes the specified ThreadFiles message. Does not implicitly {@link ThreadFiles.verify|verify} messages.
     * @param message ThreadFiles message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadFiles, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadFiles message, length delimited. Does not implicitly {@link ThreadFiles.verify|verify} messages.
     * @param message ThreadFiles message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadFiles, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadFiles message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadFiles
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadFiles;

    /**
     * Decodes a ThreadFiles message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadFiles
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadFiles;

    /**
     * Verifies a ThreadFiles message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadFiles message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadFiles
     */
    public static fromObject(object: { [k: string]: any }): ThreadFiles;

    /**
     * Creates a plain object from a ThreadFiles message. Also converts values to other types if specified.
     * @param message ThreadFiles
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadFiles, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadFiles to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ThreadComment. */
export interface IThreadComment {

    /** ThreadComment target */
    target?: (string|null);

    /** ThreadComment body */
    body?: (string|null);
}

/** Represents a ThreadComment. */
export class ThreadComment implements IThreadComment {

    /**
     * Constructs a new ThreadComment.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadComment);

    /** ThreadComment target. */
    public target: string;

    /** ThreadComment body. */
    public body: string;

    /**
     * Creates a new ThreadComment instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadComment instance
     */
    public static create(properties?: IThreadComment): ThreadComment;

    /**
     * Encodes the specified ThreadComment message. Does not implicitly {@link ThreadComment.verify|verify} messages.
     * @param message ThreadComment message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadComment, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadComment message, length delimited. Does not implicitly {@link ThreadComment.verify|verify} messages.
     * @param message ThreadComment message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadComment, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadComment message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadComment
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadComment;

    /**
     * Decodes a ThreadComment message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadComment
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadComment;

    /**
     * Verifies a ThreadComment message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadComment message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadComment
     */
    public static fromObject(object: { [k: string]: any }): ThreadComment;

    /**
     * Creates a plain object from a ThreadComment message. Also converts values to other types if specified.
     * @param message ThreadComment
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadComment, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadComment to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ThreadLike. */
export interface IThreadLike {

    /** ThreadLike target */
    target?: (string|null);
}

/** Represents a ThreadLike. */
export class ThreadLike implements IThreadLike {

    /**
     * Constructs a new ThreadLike.
     * @param [properties] Properties to set
     */
    constructor(properties?: IThreadLike);

    /** ThreadLike target. */
    public target: string;

    /**
     * Creates a new ThreadLike instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ThreadLike instance
     */
    public static create(properties?: IThreadLike): ThreadLike;

    /**
     * Encodes the specified ThreadLike message. Does not implicitly {@link ThreadLike.verify|verify} messages.
     * @param message ThreadLike message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IThreadLike, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ThreadLike message, length delimited. Does not implicitly {@link ThreadLike.verify|verify} messages.
     * @param message ThreadLike message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IThreadLike, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ThreadLike message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ThreadLike
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ThreadLike;

    /**
     * Decodes a ThreadLike message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ThreadLike
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ThreadLike;

    /**
     * Verifies a ThreadLike message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ThreadLike message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ThreadLike
     */
    public static fromObject(object: { [k: string]: any }): ThreadLike;

    /**
     * Creates a plain object from a ThreadLike message. Also converts values to other types if specified.
     * @param message ThreadLike
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ThreadLike, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ThreadLike to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Directory. */
export interface IDirectory {

    /** Directory files */
    files?: ({ [k: string]: IFile }|null);
}

/** Represents a Directory. */
export class Directory implements IDirectory {

    /**
     * Constructs a new Directory.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDirectory);

    /** Directory files. */
    public files: { [k: string]: IFile };

    /**
     * Creates a new Directory instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Directory instance
     */
    public static create(properties?: IDirectory): Directory;

    /**
     * Encodes the specified Directory message. Does not implicitly {@link Directory.verify|verify} messages.
     * @param message Directory message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDirectory, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Directory message, length delimited. Does not implicitly {@link Directory.verify|verify} messages.
     * @param message Directory message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDirectory, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Directory message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Directory
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Directory;

    /**
     * Decodes a Directory message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Directory
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Directory;

    /**
     * Verifies a Directory message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Directory message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Directory
     */
    public static fromObject(object: { [k: string]: any }): Directory;

    /**
     * Creates a plain object from a Directory message. Also converts values to other types if specified.
     * @param message Directory
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Directory, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Directory to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a MobilePreparedFiles. */
export interface IMobilePreparedFiles {

    /** MobilePreparedFiles dir */
    dir?: (IDirectory|null);

    /** MobilePreparedFiles pin */
    pin?: ({ [k: string]: string }|null);
}

/** Represents a MobilePreparedFiles. */
export class MobilePreparedFiles implements IMobilePreparedFiles {

    /**
     * Constructs a new MobilePreparedFiles.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMobilePreparedFiles);

    /** MobilePreparedFiles dir. */
    public dir?: (IDirectory|null);

    /** MobilePreparedFiles pin. */
    public pin: { [k: string]: string };

    /**
     * Creates a new MobilePreparedFiles instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MobilePreparedFiles instance
     */
    public static create(properties?: IMobilePreparedFiles): MobilePreparedFiles;

    /**
     * Encodes the specified MobilePreparedFiles message. Does not implicitly {@link MobilePreparedFiles.verify|verify} messages.
     * @param message MobilePreparedFiles message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMobilePreparedFiles, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified MobilePreparedFiles message, length delimited. Does not implicitly {@link MobilePreparedFiles.verify|verify} messages.
     * @param message MobilePreparedFiles message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMobilePreparedFiles, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a MobilePreparedFiles message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MobilePreparedFiles
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MobilePreparedFiles;

    /**
     * Decodes a MobilePreparedFiles message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MobilePreparedFiles
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MobilePreparedFiles;

    /**
     * Verifies a MobilePreparedFiles message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a MobilePreparedFiles message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MobilePreparedFiles
     */
    public static fromObject(object: { [k: string]: any }): MobilePreparedFiles;

    /**
     * Creates a plain object from a MobilePreparedFiles message. Also converts values to other types if specified.
     * @param message MobilePreparedFiles
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MobilePreparedFiles, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MobilePreparedFiles to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
