export const EventHelper = {
  events: {
    UPDATE_STATE: 'stateUpdate',
    START_GAME: 'startGame',
    NEW_TRICK: 'newTrick',
    ASK_TO_PICK: 'askToPick',
    ASK_TO_BURY: 'askToBury',
    USER_BURY: 'userBury',
    PICKED: 'userPicked',
    UPDATE_HAND: 'updateHand',
    ASK_TO_PLAY: 'askToPlay',
    PLAYED_CARD: 'playedCard',
    COMP_PLAYER_PLAYED:'compPlayerPlayed',
    COMP_PLAYER_UPDATED: 'compPlayerUpdated'
  },
  subscribe: function(event, callback) {
    console.log(`Subscribed to event ${event}`);
    return PubSub.subscribe(event, callback);
  },
  publish: function(event, object) {
    console.log(`Sent event ${event} with info ${object}`);
    return PubSub.publish(event, object);
  }
}