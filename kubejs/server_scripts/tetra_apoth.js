// priority: 0
// This script Apotheosis loot tools into Tetra tools.

//Currently needs to be in a format of mod:material_tool. Might need extra code added for some mods. I'm assuming that most world-gen found tools are based on Vanilla tools.
var itemfilter = ["minecraft:wooden_pickaxe", "minecraft:stone_pickaxe", "minecraft:gold_pickaxe", "minecraft:iron_pickaxe", "minecraft:diamond_pickaxe", "minecraft:netherite_pickaxe",
                  "minecraft:wooden_axe", "minecraft:stone_axe", "minecraft:gold_axe", "minecraft:iron_axe", "minecraft:diamond_axe", "minecraft:netherite_axe",
                  "minecraft:wooden_hoe", "minecraft:stone_hoe", "minecraft:gold_hoe", "minecraft:iron_hoe", "minecraft:diamond_hoe", "minecraft:netherite_hoe",
                  "minecraft:wooden_shovel", "minecraft:stone_shovel", "minecraft:gold_shovel", "minecraft:iron_shovel", "minecraft:diamond_shovel", "minecraft:netherite_shovel",
                  "minecraft:wooden_sword", "minecraft:stone_sword", "minecraft:gold_sword", "minecraft:iron_sword", "minecraft:diamond_sword", "minecraft:netherite_sword"];

/**
 * Converts the input item into a Tetra version.
 * @param {Internal.ItemStack} item The original item that is being replaced.
 * @param {number} damage The current NBT damage value of the item being replaced.
 * @returns A Tetra version of the original item.
 */
function buildItem(item, damage) {
    let material = getMaterial(item.getId());
    let tool = getTool(item.getId());
    let data = extractNBT(item.getNbt());
    let hasEnchants = false;
    var output;

    if(item.getNbt().get("Enchantments") != null) hasEnchants = true;
    
    switch (tool) {
        case "pickaxe":
            output = Item.of('tetra:modular_double', '{Damage:' + damage + ',HideFlags:1,"double/basic_handle_material":"basic_handle/stick","double/basic_pickaxe_left_material":"basic_pickaxe/' + material + '","double/basic_pickaxe_right_material":"basic_pickaxe/' + material + '","double/handle":"double/basic_handle","double/head_left":"double/basic_pickaxe_left","double/head_right":"double/basic_pickaxe_right",' + data + '}');
            break;
        case "axe":
            output = Item.of('tetra:modular_double', '{Damage:' + damage + ',HideFlags:1,"double/basic_axe_left_material":"basic_axe/' + material +'","double/basic_handle_material":"basic_handle/stick","double/butt_right_material":"butt/' + material + '","double/handle":"double/basic_handle","double/head_left":"double/basic_axe_left","double/head_right":"double/butt_right",' + data + '}');
            break;
        case "shovel":
            output = Item.of('tetra:modular_single', '{Damage:' + damage + ',HideFlags:1,"single/basic_handle_material":"basic_handle/stick","single/basic_shovel_material":"basic_shovel/' + material +'","single/handle":"single/basic_handle","single/head":"single/basic_shovel",' + data + '}');
            break;
        case "hoe":
            output = Item.of('tetra:modular_double', '{Damage:' + damage + ',HideFlags:1,"double/basic_handle_material":"basic_handle/stick","double/butt_right_material":"butt/' + material + '","double/handle":"double/basic_handle","double/head_left":"double/hoe_left","double/head_right":"double/butt_right","double/hoe_left_material":"hoe/' + material + '",' + data + '}');
            break;
        case "sword":
            output = Item.of('tetra:modular_sword', '{Damage:' + damage + ',HideFlags:1,"sword/basic_blade_material":"basic_blade/' + material + '","sword/basic_hilt_material":"basic_hilt/stick","sword/blade":"sword/basic_blade","sword/decorative_pommel_material":"decorative_pommel/' + material + '","sword/guard":"sword/makeshift_guard","sword/hilt":"sword/basic_hilt","sword/makeshift_guard_material":"makeshift_guard/' + material + '","sword/pommel":"sword/decorative_pommel",' + data + '}');
            break;
        default:
            output = false;
    }
    if(output != false && hasEnchants) output = addEnchants(output, item.getNbt().get("Enchantments")); //Copies the Enchants. I do it this way because it automatically maps the Enchants to the Tetra tool, so that they actually take up enchantment capacity on the tool. I don't know what happens if the tool doesn't have enough capacity.

    return output;
}

/**
 * Extracts the material from the item tag.
 * @param {String} string The item tag.
 * @returns String of the material.
 */
function getMaterial(string) {
    let output = string.split('_')[0].split(':')[1];
    if(output === 'wooden') output = 'oak';
    return output;
}

/**
 * Extracts the tool from the item tag.
 * @param {String} string The item tag.
 * @returns String of the tool.
 */
function getTool(string) {
    return string.split('_')[1];
}

/**
 * Extracts affix_data from the NBT data of the item.
 * @param {Internal.CompoundTag} nbt The NBT data of the item.
 * @returns Apothesosis affix_data NBT as an NBT string.
 */
function extractNBT(nbt) {
    let affix = nbt.get("affix_data");
    return "affix_data: " + affix;
}

/**
 * Adds Enchantments to the item with the given NBT data.
 * @param {Internal.ItemStack} item The item to add enchants to.
 * @param {Internal.Tag} nbt The Enchantments NBT data to add. Example: [{id:"minecraft:fortune",lvl:1s},{id:"minecraft:efficiency",lvl:1s}]
 * @returns An enchanted item.
 */
function addEnchants(item, nbt) {
    var outputItem = item;
    let enchants = eval(nbt);

    enchants.forEach(enchantment => {
        outputItem = outputItem.enchant(enchantment.id, parseInt(enchantment.lvl));
    });
    
    return outputItem;
}

//Main event
BlockEvents.rightClicked(e => {
    if(e.getBlock().id === 'tetra:basic_workbench') { //Check if the block is a Tetra basic workbench
        let item = e.getItem();
        let itemName = item.getDisplayName().getString();
        let damage = item.getDamageValue();
        let itemNBT = item.getNbtString();
        let player = e.getPlayer();

        //KubeJS has a playsound command, but it doesn't work so I have to do this... >:(
        let x = e.block.pos.getX();
        let y = e.block.pos.getY();
        let z = e.block.pos.getZ();
        
        
        if(itemfilter.includes(item.getId())) {
            if(itemNBT.includes('affix_data:')) { //Check if the item has Apoth affix data
                let newItem = buildItem(item, damage); //Attempt to build the item
                if(newItem != false) { //Check if the item was sucessfully built.
                    console.log("Tetrafying item " + item + " on " + player.getName() +  " with NBT:\n" + itemNBT);
                    item.setCount(0); //Remove the item
                    player.giveInHand(newItem);
                    player.displayClientMessage(Component.of(itemName + " has been tetrafied!").bold().aqua(), true);
                    e.server.runCommandSilent('playsound minecraft:block.anvil.use player @a ' + x + ' ' + y + ' ' + z + ' 0.5 1');
                } else console.log("Failed to tetrafy item " + item + " on " + player.getName() +  " with NBT:\n" + itemNBT);
            }
        }
    }
});
