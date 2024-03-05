
LootJS.modifiers((event) => {
    event.addBlockLootModifier("embers:lead_ore")
         .removeLoot("embers:raw_lead")
         .addLoot("oreganized:raw_lead");
});