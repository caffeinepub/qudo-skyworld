import List "mo:core/List";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Set "mo:core/Set";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Type definitions
  public type SkyWorldState = {
    theme : Text;
    decorations : [Text];
    totalFlowersCollected : Nat;
    totalSparklesCollected : Nat;
    lastQudoBoostTime : Time.Time;
    activeSessions : Nat;
    persistentStars : [PersistentStar];
    lastVisitedTime : ?Time.Time;
    friends : [Principal];
    highScore : Nat;
  };

  public type PersistentStar = {
    x : Float;
    y : Float;
    brightness : Float;
  };

  public type QudoReward = {
    amount : Nat;
    description : Text;
    timestamp : Time.Time;
  };

  public type FriendVisit = {
    visitor : Principal;
    message : Text;
    timestamp : Time.Time;
  };

  public type PastelSkyProfile = {
    world : SkyWorldState;
    rewards : [QudoReward];
    visits : [FriendVisit];
    lastActiveTime : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    pastelSkyProfile : ?PastelSkyProfile;
  };

  // Helper type for sorting PersistentStars
  module PersistentStar {
    public func compare(star1 : PersistentStar, star2 : PersistentStar) : Order.Order {
      switch (Float.compare(star1.brightness, star2.brightness)) {
        case (#equal) { Float.compare(star1.x, star2.x) };
        case (order) { order };
      };
    };
  };

  // Persistent state
  let userProfiles = Map.empty<Principal, UserProfile>();
  let pastelSkyProfiles = Map.empty<Principal, PastelSkyProfile>();
  let friendsDatabase = Map.empty<Principal, Set.Set<Principal>>();

  // Setup default starter world
  let starterWorld : SkyWorldState = {
    theme = "pastel_sky";
    decorations = [];
    totalFlowersCollected = 0;
    totalSparklesCollected = 0;
    lastQudoBoostTime = 0;
    activeSessions = 0;
    persistentStars = [];
    lastVisitedTime = null;
    friends = [];
    highScore = 0;
  };

  // Required user profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func isRegistered() : async Bool {
    // Accessible to all users including guests
    pastelSkyProfiles.containsKey(caller);
  };

  // Game interface
  public shared ({ caller }) func initializeSkyWorld() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can initialize Sky World");
    };
    if (pastelSkyProfiles.containsKey(caller)) {
      Runtime.trap("SkyWorld already exists for caller");
    };
    let newProfile : PastelSkyProfile = {
      world = starterWorld;
      rewards = [];
      visits = [];
      lastActiveTime = Time.now();
    };
    pastelSkyProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func addFriend(friend : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add friends");
    };
    if (caller == friend) {
      Runtime.trap("Cannot add yourself as a friend");
    };
    let friends = switch (friendsDatabase.get(caller)) {
      case (null) { Set.empty<Principal>() };
      case (?existing) { existing };
    };
    friends.add(friend);
    friendsDatabase.add(caller, friends);
  };

  public shared ({ caller }) func visitFriend(friend : Principal, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can visit friends");
    };
    if (caller == friend) {
      Runtime.trap("Cannot visit your own world");
    };
    if (not pastelSkyProfiles.containsKey(friend)) {
      Runtime.trap("Friend not found");
    };

    let friendProfile = switch (pastelSkyProfiles.get(friend)) {
      case (null) { Runtime.trap("Friend not found") };
      case (?profile) { profile };
    };

    // Check visit cooldown
    switch (friendProfile.world.lastVisitedTime) {
      case (?lastTime) {
        if (Time.now() - lastTime < 86400_000_000_000) {
          Runtime.trap("You can only visit this friend once per day");
        };
      };
      case (_) {};
    };

    // Create visit record
    let newVisit : FriendVisit = {
      visitor = caller;
      message = message;
      timestamp = Time.now();
    };

    let updatedVisits = friendProfile.visits.concat([newVisit]);

    let updatedWorld = {
      friendProfile.world with
      lastVisitedTime = ?Time.now();
    };

    let newProfile = {
      friendProfile with
      world = updatedWorld;
      visits = updatedVisits;
      lastActiveTime = Time.now();
    };

    pastelSkyProfiles.add(friend, newProfile);
  };

  public query ({ caller }) func getHighScores() : async [PastelSkyProfile] {
    // Public leaderboard - accessible to all including guests
    pastelSkyProfiles.values().toArray().sort(compareHighScores);
  };

  func compareHighScores(profile1 : PastelSkyProfile, profile2 : PastelSkyProfile) : Order.Order {
    Int.compare(profile2.world.highScore, profile1.world.highScore);
  };

  public query ({ caller }) func getStarsByBrightness() : async [PersistentStar] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their stars");
    };
    let profile = switch (pastelSkyProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?p) { p };
    };
    profile.world.persistentStars.sort();
  };

  public query ({ caller }) func getSkyWorld() : async ?PastelSkyProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their Sky World");
    };
    pastelSkyProfiles.get(caller);
  };

  public query ({ caller }) func getFriendSkyWorld(friend : Principal) : async ?SkyWorldState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view friend worlds");
    };
    switch (pastelSkyProfiles.get(friend)) {
      case (null) { null };
      case (?profile) { ?profile.world };
    };
  };

  public query ({ caller }) func getMyVisits() : async [FriendVisit] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their visits");
    };
    switch (pastelSkyProfiles.get(caller)) {
      case (null) { [] };
      case (?profile) { profile.visits };
    };
  };

  public shared ({ caller }) func updateSkyWorld(world : SkyWorldState) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their Sky World");
    };
    let profile = switch (pastelSkyProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found. Initialize Sky World first.") };
      case (?p) { p };
    };
    let updatedProfile = {
      profile with
      world = world;
      lastActiveTime = Time.now();
    };
    pastelSkyProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func recordReward(reward : QudoReward) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record rewards");
    };
    let profile = switch (pastelSkyProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found. Initialize Sky World first.") };
      case (?p) { p };
    };
    let updatedRewards = profile.rewards.concat([reward]);
    let updatedProfile = {
      profile with
      rewards = updatedRewards;
      lastActiveTime = Time.now();
    };
    pastelSkyProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getRewards() : async [QudoReward] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their rewards");
    };
    switch (pastelSkyProfiles.get(caller)) {
      case (null) { [] };
      case (?profile) { profile.rewards };
    };
  };

  // Admin functions for moderation and anti-cheat
  public shared ({ caller }) func adminResetUserWorld(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reset user worlds");
    };
    let profile = switch (pastelSkyProfiles.get(user)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?p) { p };
    };
    let resetProfile = {
      profile with
      world = starterWorld;
      rewards = [];
    };
    pastelSkyProfiles.add(user, resetProfile);
  };

  public query ({ caller }) func adminGetUserProfile(user : Principal) : async ?PastelSkyProfile {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view user profiles");
    };
    pastelSkyProfiles.get(user);
  };

  public shared ({ caller }) func adminRemoveReward(user : Principal, rewardIndex : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove rewards");
    };
    let profile = switch (pastelSkyProfiles.get(user)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?p) { p };
    };
    if (rewardIndex >= profile.rewards.size()) {
      Runtime.trap("Invalid reward index");
    };
    let updatedRewards = Array.tabulate(
      profile.rewards.size() - 1,
      func(i) {
        if (i < rewardIndex) {
          profile.rewards[i];
        } else {
          profile.rewards[i + 1];
        };
      },
    );
    let updatedProfile = {
      profile with
      rewards = updatedRewards;
    };
    pastelSkyProfiles.add(user, updatedProfile);
  };
};
