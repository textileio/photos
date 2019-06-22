//
//  TextileApi.m
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "TextileApi.h"
#import "Messenger.h"
#import "LifecycleManager.h"
#import "RequestsHandler.h"

NSString *const TEXTILE_BACKGROUND_SESSION_ID = @"textile";

@interface Textile()

@property (nonatomic, strong) Messenger *messenger;

@property (nonatomic, strong) MobileMobile *node;

@property (nonatomic, strong) AccountApi *account;
@property (nonatomic, strong) CafesApi *cafes;
@property (nonatomic, strong) CommentsApi *comments;
@property (nonatomic, strong) ContactsApi *contacts;
@property (nonatomic, strong) FeedApi *feed;
@property (nonatomic, strong) FilesApi *files;
@property (nonatomic, strong) FlagsApi *flags;
@property (nonatomic, strong) IgnoresApi *ignores;
@property (nonatomic, strong) InvitesApi *invites;
@property (nonatomic, strong) IpfsApi *ipfs;
@property (nonatomic, strong) LikesApi *likes;
@property (nonatomic, strong) LogsApi *logs;
@property (nonatomic, strong) MessagesApi *messages;
@property (nonatomic, strong) NotificationsApi *notifications;
@property (nonatomic, strong) ProfileApi *profile;
@property (nonatomic, strong) SchemasApi *schemas;
@property (nonatomic, strong) ThreadsApi *threads;

@property (nonatomic, strong) NSString *repoPath;

@property (nonatomic, strong) LifecycleManager *lifecycleManager;
@property (nonatomic, strong) RequestsHandler *requestsHandler;

- (NSString *)newWallet:(NSInteger)wordCount error:(NSError **)error;
- (MobileWalletAccount *)walletAccountAt:(NSString *)phrase index:(NSInteger)index password:(NSString *)password error:(NSError **)error;
- (void)initRepo:(NSString *)seed repoPath:(NSString *)repoPath logToDisk:(BOOL)logToDisk debug:(BOOL)debug error:(NSError **)error;
- (void)migrateRepo:(NSString *)repoPath error:(NSError **)error;
- (void)newTextile:(NSString *)repoPath debug:(BOOL)debug error:(NSError **)error;
- (void)start:(NSError **)error;
- (void)stop:(NSError **)error;

@end

@implementation Textile

+ (NSString *)initializeWithDebug:(BOOL)debug logToDisk:(BOOL)logToDisk error:(NSError * _Nullable __autoreleasing *)error {
  if (Textile.instance.node) {
    return nil;
  }
  NSString *documents = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
  NSString *repoPath = [documents stringByAppendingPathComponent:@"textile-go"];
  Textile.instance.repoPath = repoPath;
  Textile.instance.requestsHandler = [[RequestsHandler alloc] init];
  Textile.instance.messenger = [[Messenger alloc] init];
  [Textile.instance newTextile:repoPath debug:debug error:error];
  if (*error && (*error).code == 1) {
    *error = nil;
    NSString *recoveryPhrase = [Textile.instance newWallet:12 error:error];
    if (*error) {
      return nil;
    }
    MobileWalletAccount *account = [Textile.instance walletAccountAt:recoveryPhrase index:0 password:@"" error:error];
    if (*error) {
      return nil;
    }
    [Textile.instance initRepo:account.seed repoPath:repoPath logToDisk:logToDisk debug:debug error:error];
    if (*error) {
      return nil;
    }
    [Textile.instance newTextile:repoPath debug:debug error:error];
    if (*error) {
      return nil;
    }
    [Textile.instance createNodeDependants];
    return recoveryPhrase;
  } else if (*error) {
    return nil;
  }
  [Textile.instance createNodeDependants];
  return nil;
}

+ (Textile *)instance {
  static Textile *instnace = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    instnace = [[self alloc] init];
  });
  return instnace;
}

- (void)setDelegate:(id<TextileDelegate>)delegate {
  _delegate = delegate;
  self.lifecycleManager.delegate = delegate;
  self.messenger.delegate = delegate;
}

- (NSString *)newWallet:(NSInteger)wordCount error:(NSError *__autoreleasing *)error {
  NSString *recoveryPhrase = MobileNewWallet(wordCount, error);
  return recoveryPhrase;
}

- (MobileWalletAccount *)walletAccountAt:(NSString *)phrase index:(NSInteger)index password:(NSString *)password error:(NSError *__autoreleasing *)error {
  NSData *data = MobileWalletAccountAt(phrase, index, password, error);
  if (*error) {
    return nil;
  }
  MobileWalletAccount *account = [[MobileWalletAccount alloc] initWithData:data error:error];
  return account;
}

- (void)initRepo:(NSString *)seed repoPath:(NSString *)repoPath logToDisk:(BOOL)logToDisk debug:(BOOL)debug error:(NSError *__autoreleasing *)error {
  MobileInitConfig *config = [[MobileInitConfig alloc] init];
  config.seed = seed;
  config.repoPath = repoPath;
  config.logToDisk = logToDisk;
  config.debug = debug;
  MobileInitRepo(config, error);
}

- (void)migrateRepo:(NSString *)repoPath error:(NSError *__autoreleasing *)error {
  MobileMigrateConfig *config = [[MobileMigrateConfig alloc] init];
  config.repoPath = repoPath;
  MobileMigrateRepo(config, error);
}

- (void)newTextile:(NSString *)repoPath debug:(BOOL)debug error:(NSError *__autoreleasing *)error {
  MobileRunConfig *config = [[MobileRunConfig alloc] init];
  config.repoPath = repoPath;
  config.debug = debug;
  config.cafeOutboxHandler = self.requestsHandler;
  self.node = MobileNewTextile(config, self.messenger, error);
}

- (void)start:(NSError *__autoreleasing *)error {
  [self.node start:error];
}

- (void)stop:(NSError *__autoreleasing *)error {
  [self.node stop:error];
}

- (NSString *)version {
  return [self.node version];
}

- (NSString *)gitSummary {
  return [self.node gitSummary];
}

- (Summary *)summary:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node summary:error];
  if (*error) {
    return nil;
  }
  return [[Summary alloc] initWithData:data error:error];
}

- (void)destroy:(NSError * _Nullable __autoreleasing *)error {
  [self.node stop:error];
  if (!*error) {
    self.delegate = nil;
    self.node = nil;
    self.messenger = nil;

    self.account = nil;
    self.cafes = nil;
    self.comments = nil;
    self.contacts = nil;
    self.feed = nil;
    self.files = nil;
    self.flags = nil;
    self.ignores = nil;
    self.invites = nil;
    self.ipfs = nil;
    self.likes = nil;
    self.logs = nil;
    self.messages = nil;
    self.notifications = nil;
    self.profile = nil;
    self.schemas = nil;
    self.threads = nil;

    self.repoPath = nil;

    self.lifecycleManager = nil;
  }
}

- (void)createNodeDependants {
  self.account = [[AccountApi alloc] initWithNode:self.node];
  self.cafes = [[CafesApi alloc] initWithNode:self.node];
  self.comments = [[CommentsApi alloc] initWithNode:self.node];
  self.contacts = [[ContactsApi alloc] initWithNode:self.node];
  self.feed = [[FeedApi alloc] initWithNode:self.node];
  self.files = [[FilesApi alloc] initWithNode:self.node];
  self.flags = [[FlagsApi alloc] initWithNode:self.node];
  self.ignores = [[IgnoresApi alloc] initWithNode:self.node];
  self.invites = [[InvitesApi alloc] initWithNode:self.node];
  self.ipfs = [[IpfsApi alloc] initWithNode:self.node];
  self.likes = [[LikesApi alloc] initWithNode:self.node];
  self.logs = [[LogsApi alloc] initWithNode:self.node];
  self.messages = [[MessagesApi alloc] initWithNode:self.node];
  self.notifications = [[NotificationsApi alloc] initWithNode:self.node];
  self.profile = [[ProfileApi alloc] initWithNode:self.node];
  self.schemas = [[SchemasApi alloc] initWithNode:self.node];
  self.threads = [[ThreadsApi alloc] initWithNode:self.node];

  self.lifecycleManager = [[LifecycleManager alloc] initWithNode:self.node];
  self.lifecycleManager.delegate = self.delegate;

  self.requestsHandler.node = self.node;
}

@end

