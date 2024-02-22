// priority: 0
// This script changes the Create ore-crushing recipes to make them more competitive with other mods.

/* Some thoughts:
Forge appears to now have #forge:ores_in_ground/stone tag that could be used to make this more dynamic.
Although, it may not be necessary to do this as it takes away some of the manual control over the recipes.

*/

ServerEvents.recipes(event => {
    //------------------------Default Ores------------------------
    const defaultMats = [
        {
            name: "iron",
            mod: "minecraft"
        },
        {
            name: "gold",
            mod: "minecraft"
        },
        {
            name: "copper",
            mod: "minecraft"
        },
        {
            name: "zinc",
            mod: "create"
        },
    ] 

    defaultMats.forEach((r) => {
        event.remove({id: `create:crushing/raw_${r.name}`})
        event.remove({id: `create:crushing/raw_${r.name}_block`})
        event.remove({id: `create:crushing/deepslate_${r.name}_ore`})
        event.remove({id: `create:crushing/${r.name}_ore`})

        event.recipes.create.crushing([ //Processing raw chunks
            `create:crushed_raw_${r.name}`,
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.33),
            Item.of(`create:experience_nugget`).withChance(0.75)
        ], `${r.mod}:raw_${r.name}`)

        event.recipes.create.crushing([ //Deepslate ores
            `2x create:crushed_raw_${r.name}`,
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.33),
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.25),
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.25),
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.25),
            Item.of(`create:experience_nugget`).withChance(0.75),
            Item.of(`create:experience_nugget`).withChance(0.75),
            Item.of(`minecraft:cobbled_deepslate`).withChance(0.12)
        ], `${r.mod}:deepslate_${r.name}_ore`)

        event.recipes.create.crushing([ //Normal ores
            `create:crushed_raw_${r.name}`,
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.33),
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.25),
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.25),
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.25),
            Item.of(`create:experience_nugget`).withChance(0.75),
            Item.of(`create:experience_nugget`).withChance(0.50),
            Item.of('minecraft:cobblestone').withChance(0.12)
        ], `${r.mod}:${r.name}_ore`)

        event.recipes.create.crushing([ //Raw blocks
            `9x create:crushed_raw_${r.name}`,
            Item.of(`3x create:crushed_raw_${r.name}`).withChance(0.50),
            Item.of(`3x create:crushed_raw_${r.name}`).withChance(0.33),
            Item.of(`3x create:crushed_raw_${r.name}`).withChance(0.33),
            Item.of(`3x create:experience_nugget`).withChance(0.75),
            Item.of(`3x create:experience_nugget`).withChance(0.75),
            Item.of(`3x create:experience_nugget`).withChance(0.75)
        ], `${r.mod}:raw_${r.name}_block`)
        
    }) //end of defaultMats

    event.remove({id: 'create:crushing/nether_gold_ore'}) //Handle gold ore specifically.
    event.recipes.create.crushing([
        '3x create:crushed_raw_gold',
        Item.of('create:crushed_raw_gold').withChance(0.50),
        Item.of('create:crushed_raw_gold').withChance(0.33),
        Item.of(`create:experience_nugget`).withChance(0.75),
        Item.of(`create:experience_nugget`).withChance(0.75)
    ], 'minecraft:nether_gold_ore')

    //---------------------Other General Mats---------------------
    const otherModMats = [
        {
            name: "silver"
        },
        {
            name: "tin"
        },
        {
            name: "lead"
        },
        {
            name: "aluminum"
        },
        {
            name: "nickel"
        },
        {
            name: "uranium"
        },
        {
            name: "platinum"
        },
        {
            name: "osmium"
        },
        {
            name: "quicksilver"
        }
    ]

    otherModMats.forEach((r) => { //I didn't include deepslate boosts for these, but this lets them use forge tags. 
        event.remove({id: `create:crushing/raw_${r.name}_ore`})
        event.remove({id: `create:crushing/raw_${r.name}_block`})
        event.remove({id: `create:crushing/${r.name}_ore`})

        event.recipes.create.crushing([ //Raw ores
            `create:crushed_raw_${r.name}`,
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.33),
            Item.of(`create:experience_nugget`).withChance(0.75)
        ], `#forge:raw_materials/${r.name}`)

        event.recipes.create.crushing([ //Normal ores
            `2x create:crushed_raw_${r.name}`,
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.33),
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.25),
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.25),
            Item.of(`create:crushed_raw_${r.name}`).withChance(0.25),
            Item.of(`create:experience_nugget`).withChance(0.75),
            Item.of(`create:experience_nugget`).withChance(0.50)
        ], `#forge:ores/${r.name}`)

        event.recipes.create.crushing([ //Raw blocks
            `9x create:crushed_raw_${r.name}`,
            Item.of(`3x create:crushed_raw_${r.name}`).withChance(0.50),
            Item.of(`3x create:crushed_raw_${r.name}`).withChance(0.33),
            Item.of(`3x create:crushed_raw_${r.name}`).withChance(0.33),
            Item.of(`9x create:experience_nugget`).withChance(0.75)
        ], `#forge:storage_blocks/raw_${r.name}`)
    }) //End of otherModMats

    //---------------------Better End + Nether Mats---------------------
    let betterendLoaded = Platform.isLoaded("betterend");
    let betternetherLoaded = Platform.isLoaded("betternether");

    const betterMats = []; 

    if(betterendLoaded) {
        betterMats.push(
            {
                name: "betterend:ender_ore",
                output: "betterend:ender_shard"
            },
            {
                name: "betterend:thallasium_ore",
                output: "betterend:thallasium_raw"
            }
        )
    }

    if(betternetherLoaded) {
        betterMats.push(
            {
                name: "betternether:cincinnasite_ore",
                output: "betternether:cincinnasite"
            },
            {
                name: "betternether:nether_redstone_ore",
                output: "minecraft:redstone"
            }
        )
    }

    if(betterendLoaded || betternetherLoaded) {
        betterMats.forEach((r) => {
            event.recipes.create.crushing([
                `2x ${r.output}`,
                Item.of(`${r.output}`).withChance(0.33),
                Item.of(`${r.output}`).withChance(0.25),
                Item.of(`${r.output}`).withChance(0.25),
                Item.of(`${r.output}`).withChance(0.25),
                Item.of(`create:experience_nugget`).withChance(0.75),
                Item.of(`create:experience_nugget`).withChance(0.75)
            ], r.name)
        })
        
        event.recipes.create.crushing([ //Raw amber has a different drop count so I chose to just manually set it.
            `2x betterend:raw_amber`,
            Item.of(`betterend:raw_amber`).withChance(0.33),
            Item.of(`betterend:raw_amber`).withChance(0.25),
            Item.of(`create:experience_nugget`).withChance(0.75),
            Item.of(`create:experience_nugget`).withChance(0.75)
        ], 'betterend:amber_ore')

        event.recipes.create.crushing([
            `2x betternether:nether_ruby`,
            Item.of(`betternether:nether_ruby`).withChance(0.33),
            Item.of(`betternether:nether_ruby`).withChance(0.25),
            Item.of(`create:experience_nugget`).withChance(0.75),
            Item.of(`create:experience_nugget`).withChance(0.75)
        ], 'betternether:nether_ruby_ore')
    
        event.recipes.create.crushing([ //I chose to make it drop Lapis instead of piles to reward the player for silk-touching the ore.
            `6x minecraft:lapis_lazuli`,
            Item.of(`minecraft:lapis_lazuli`).withChance(0.33).withCount(3),
            Item.of(`minecraft:lapis_lazuli`).withChance(0.33).withCount(3),
            Item.of(`create:experience_nugget`).withChance(0.75),
            Item.of(`create:experience_nugget`).withChance(0.75)
        ], 'betternether:nether_lapis_ore')
    } //endif 

    //---------------------Majrusz's Progressive Difficulty---------------------
    if(Platform.isLoaded("majruszsdifficulty")) {
        event.recipes.create.crushing([
            Item.of('majruszsdifficulty:enderium_shard'),
            Item.of('majruszsdifficulty:enderium_shard').withChance(0.1),
            Item.of(`create:experience_nugget`)
        ], "majruszsdifficulty:enderium_shard_ore")
    } //endif

    /* ---------------THE UNDERGARDEN---------------  */
    if(Platform.isLoaded("undergarden") && Platform.isLoaded("jaopca")) {
        let undergardenMetals = [
            {
                name: "cloggrum"
            },
            {
                name: "froststeel"
            }
        ]

        undergardenMetals.forEach((r) => {
            event.remove({id: `jaopca:create.raw_material_to_crushed.${r.name}`});
            event.recipes.create.crushing([ //Raw chunks
                Item.of(`jaopca:create_crushed.${r.name}`),
                Item.of(`jaopca:create_crushed.${r.name}`).withChance(0.33),
                Item.of(`create:experience_nugget`).withChance(0.75)
            ], `undergarden:raw_${r.name}`)
        })
    } //endif 
}); //end of ServerEvents