console.log('Loading starting items script...');
// Listen to player login event
PlayerEvents.loggedIn(event => {
  // Check if player doesn't have "starting_items" stage yet
  if (!event.player.stages.has('starting_items')) {
    // Add the stage
    event.player.stages.add('starting_items')
    // Give some items to player
    event.player.give(Item.of('eccentrictome:tome', '{"eccentrictome:mods":{advancedperipherals:{0:{Count:1b,id:"patchouli:guide_book",tag:{"patchouli:book":"advancedperipherals:manual"}}},alexsmobs:{0:{Count:1b,id:"alexsmobs:animal_dictionary"}},ars_nouveau:{0:{Count:1b,id:"ars_nouveau:worn_notebook"}},caupona:{0:{Count:1b,id:"patchouli:guide_book",tag:{"patchouli:book":"caupona:book"}}}}}'));
  }
});
console.log('Starting items script loaded!');