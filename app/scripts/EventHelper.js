export const EventHelper = {
  events: {
    START_GAME: 'startGame',
    ASK_TO_PICK: 'askToPick',
    ASK_TO_BURY: 'askToBury',
    USER_BURY: 'userBury',
    PICKED: 'userPicked',
    UPDATE_HAND: 'updateHand'
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