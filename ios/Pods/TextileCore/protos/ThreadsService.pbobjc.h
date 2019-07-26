// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: threads_service.proto

// This CPP symbol can be defined to use imports that match up to the framework
// imports needed when using CocoaPods.
#if !defined(GPB_USE_PROTOBUF_FRAMEWORK_IMPORTS)
 #define GPB_USE_PROTOBUF_FRAMEWORK_IMPORTS 0
#endif

#if GPB_USE_PROTOBUF_FRAMEWORK_IMPORTS
 #import <Protobuf/GPBProtocolBuffers.h>
#else
 #import "GPBProtocolBuffers.h"
#endif

#if GOOGLE_PROTOBUF_OBJC_VERSION < 30002
#error This file was generated by a newer version of protoc which is incompatible with your Protocol Buffer library sources.
#endif
#if 30002 < GOOGLE_PROTOBUF_OBJC_MIN_SUPPORTED_VERSION
#error This file was generated by an older version of protoc which is incompatible with your Protocol Buffer library sources.
#endif

// @@protoc_insertion_point(imports)

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

CF_EXTERN_C_BEGIN

@class GPBAny;
@class GPBTimestamp;
@class Peer;
@class Thread;
@class ThreadBlockHeader;
GPB_ENUM_FWD_DECLARE(Block_BlockType);

NS_ASSUME_NONNULL_BEGIN

#pragma mark - ThreadsServiceRoot

/**
 * Exposes the extension registry for this file.
 *
 * The base class provides:
 * @code
 *   + (GPBExtensionRegistry *)extensionRegistry;
 * @endcode
 * which is a @c GPBExtensionRegistry that includes all the extensions defined by
 * this file and all files that it depends on.
 **/
@interface ThreadsServiceRoot : GPBRootObject
@end

#pragma mark - ThreadEnvelope

typedef GPB_ENUM(ThreadEnvelope_FieldNumber) {
  ThreadEnvelope_FieldNumber_Thread = 1,
  ThreadEnvelope_FieldNumber_Hash_p = 2,
  ThreadEnvelope_FieldNumber_Ciphertext = 3,
  ThreadEnvelope_FieldNumber_Sig = 4,
  ThreadEnvelope_FieldNumber_Node = 5,
  ThreadEnvelope_FieldNumber_Block = 6,
};

/**
 * for wire transport
 **/
@interface ThreadEnvelope : GPBMessage

@property(nonatomic, readwrite, copy, null_resettable) NSString *thread;

/** hash of encrypted block */
@property(nonatomic, readwrite, copy, null_resettable) NSString *hash_p GPB_DEPRECATED_MSG("ThreadEnvelope.hash is deprecated (see threads_service.proto).");

/** encrypted ThreadBlock, also stored on ipfs for recovery */
@property(nonatomic, readwrite, copy, null_resettable) NSData *ciphertext GPB_DEPRECATED_MSG("ThreadEnvelope.ciphertext is deprecated (see threads_service.proto).");

/** account signature */
@property(nonatomic, readwrite, copy, null_resettable) NSData *sig;

/** block node (v2) */
@property(nonatomic, readwrite, copy, null_resettable) NSData *node;

/** block (v2) */
@property(nonatomic, readwrite, copy, null_resettable) NSData *block;

@end

#pragma mark - ThreadEnvelopeAck

typedef GPB_ENUM(ThreadEnvelopeAck_FieldNumber) {
  ThreadEnvelopeAck_FieldNumber_Id_p = 1,
};

@interface ThreadEnvelopeAck : GPBMessage

@property(nonatomic, readwrite, copy, null_resettable) NSString *id_p;

@end

#pragma mark - ThreadBlock

typedef GPB_ENUM(ThreadBlock_FieldNumber) {
  ThreadBlock_FieldNumber_Header = 1,
  ThreadBlock_FieldNumber_Type = 2,
  ThreadBlock_FieldNumber_Payload = 3,
};

@interface ThreadBlock : GPBMessage

@property(nonatomic, readwrite, strong, null_resettable) ThreadBlockHeader *header;
/** Test to see if @c header has been set. */
@property(nonatomic, readwrite) BOOL hasHeader;

@property(nonatomic, readwrite) enum Block_BlockType type;

/** nil for some types */
@property(nonatomic, readwrite, strong, null_resettable) GPBAny *payload;
/** Test to see if @c payload has been set. */
@property(nonatomic, readwrite) BOOL hasPayload;

@end

/**
 * Fetches the raw value of a @c ThreadBlock's @c type property, even
 * if the value was not defined by the enum at the time the code was generated.
 **/
int32_t ThreadBlock_Type_RawValue(ThreadBlock *message);
/**
 * Sets the raw value of an @c ThreadBlock's @c type property, allowing
 * it to be set to a value that was not defined by the enum at the time the code
 * was generated.
 **/
void SetThreadBlock_Type_RawValue(ThreadBlock *message, int32_t value);

#pragma mark - ThreadBlockHeader

typedef GPB_ENUM(ThreadBlockHeader_FieldNumber) {
  ThreadBlockHeader_FieldNumber_Date = 1,
  ThreadBlockHeader_FieldNumber_ParentsArray = 2,
  ThreadBlockHeader_FieldNumber_Author = 3,
  ThreadBlockHeader_FieldNumber_Address = 4,
};

@interface ThreadBlockHeader : GPBMessage

@property(nonatomic, readwrite, strong, null_resettable) GPBTimestamp *date;
/** Test to see if @c date has been set. */
@property(nonatomic, readwrite) BOOL hasDate;

@property(nonatomic, readwrite, strong, null_resettable) NSMutableArray<NSString*> *parentsArray GPB_DEPRECATED_MSG("ThreadBlockHeader.parents is deprecated (see threads_service.proto).");
/** The number of items in @c parentsArray without causing the array to be created. */
@property(nonatomic, readonly) NSUInteger parentsArray_Count GPB_DEPRECATED_MSG("ThreadBlockHeader.parents is deprecated (see threads_service.proto).");

@property(nonatomic, readwrite, copy, null_resettable) NSString *author;

@property(nonatomic, readwrite, copy, null_resettable) NSString *address;

@end

#pragma mark - ThreadAdd

typedef GPB_ENUM(ThreadAdd_FieldNumber) {
  ThreadAdd_FieldNumber_Inviter = 1,
  ThreadAdd_FieldNumber_Thread = 2,
  ThreadAdd_FieldNumber_Invitee = 3,
};

/**
 * not kept on-chain
 **/
@interface ThreadAdd : GPBMessage

@property(nonatomic, readwrite, strong, null_resettable) Peer *inviter;
/** Test to see if @c inviter has been set. */
@property(nonatomic, readwrite) BOOL hasInviter;

@property(nonatomic, readwrite, strong, null_resettable) Thread *thread;
/** Test to see if @c thread has been set. */
@property(nonatomic, readwrite) BOOL hasThread;

@property(nonatomic, readwrite, copy, null_resettable) NSString *invitee;

@end

#pragma mark - ThreadIgnore

typedef GPB_ENUM(ThreadIgnore_FieldNumber) {
  ThreadIgnore_FieldNumber_Target = 1,
};

GPB_DEPRECATED_MSG("ThreadIgnore is deprecated (see threads_service.proto).")
@interface ThreadIgnore : GPBMessage

@property(nonatomic, readwrite, copy, null_resettable) NSString *target;

@end

#pragma mark - ThreadFlag

typedef GPB_ENUM(ThreadFlag_FieldNumber) {
  ThreadFlag_FieldNumber_Target = 1,
};

GPB_DEPRECATED_MSG("ThreadFlag is deprecated (see threads_service.proto).")
@interface ThreadFlag : GPBMessage

@property(nonatomic, readwrite, copy, null_resettable) NSString *target;

@end

#pragma mark - ThreadJoin

typedef GPB_ENUM(ThreadJoin_FieldNumber) {
  ThreadJoin_FieldNumber_Inviter = 1,
  ThreadJoin_FieldNumber_Peer = 2,
};

@interface ThreadJoin : GPBMessage

@property(nonatomic, readwrite, copy, null_resettable) NSString *inviter;

@property(nonatomic, readwrite, strong, null_resettable) Peer *peer;
/** Test to see if @c peer has been set. */
@property(nonatomic, readwrite) BOOL hasPeer;

@end

#pragma mark - ThreadAnnounce

typedef GPB_ENUM(ThreadAnnounce_FieldNumber) {
  ThreadAnnounce_FieldNumber_Peer = 1,
  ThreadAnnounce_FieldNumber_Name = 2,
};

@interface ThreadAnnounce : GPBMessage

@property(nonatomic, readwrite, strong, null_resettable) Peer *peer;
/** Test to see if @c peer has been set. */
@property(nonatomic, readwrite) BOOL hasPeer;

/** new thread name */
@property(nonatomic, readwrite, copy, null_resettable) NSString *name;

@end

#pragma mark - ThreadMessage

typedef GPB_ENUM(ThreadMessage_FieldNumber) {
  ThreadMessage_FieldNumber_Body = 1,
};

@interface ThreadMessage : GPBMessage

@property(nonatomic, readwrite, copy, null_resettable) NSString *body;

@end

#pragma mark - ThreadFiles

typedef GPB_ENUM(ThreadFiles_FieldNumber) {
  ThreadFiles_FieldNumber_Target = 1,
  ThreadFiles_FieldNumber_Body = 2,
  ThreadFiles_FieldNumber_Keys = 3,
};

@interface ThreadFiles : GPBMessage

/** top-level file hash */
@property(nonatomic, readwrite, copy, null_resettable) NSString *target GPB_DEPRECATED_MSG("ThreadFiles.target is deprecated (see threads_service.proto).");

@property(nonatomic, readwrite, copy, null_resettable) NSString *body;

/** hash: key */
@property(nonatomic, readwrite, strong, null_resettable) NSMutableDictionary<NSString*, NSString*> *keys;
/** The number of items in @c keys without causing the array to be created. */
@property(nonatomic, readonly) NSUInteger keys_Count;

@end

#pragma mark - ThreadComment

typedef GPB_ENUM(ThreadComment_FieldNumber) {
  ThreadComment_FieldNumber_Target = 1,
  ThreadComment_FieldNumber_Body = 2,
};

GPB_DEPRECATED_MSG("ThreadComment is deprecated (see threads_service.proto).")
@interface ThreadComment : GPBMessage

@property(nonatomic, readwrite, copy, null_resettable) NSString *target;

@property(nonatomic, readwrite, copy, null_resettable) NSString *body;

@end

#pragma mark - ThreadLike

typedef GPB_ENUM(ThreadLike_FieldNumber) {
  ThreadLike_FieldNumber_Target = 1,
};

GPB_DEPRECATED_MSG("ThreadLike is deprecated (see threads_service.proto).")
@interface ThreadLike : GPBMessage

@property(nonatomic, readwrite, copy, null_resettable) NSString *target;

@end

NS_ASSUME_NONNULL_END

CF_EXTERN_C_END

#pragma clang diagnostic pop

// @@protoc_insertion_point(global_scope)
