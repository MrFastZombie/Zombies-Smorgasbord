// priority: 0
// This script adds an addition processing step after Create's crushing wheel that uses Embers, allowing for further processing.

ServerEvents.recipes(event => {
    
    //-------------------------------- Vanilla Materials --------------------------------
    
    const defaultMats = [
        {
            name: "iron",
            bonus: "nickel",
            fluid: "embers:molten_iron"
        },
        {
            name: "gold",
            bonus: "silver",
            fluid: "embers:molten_gold"
        },
        {
            name: "copper",
            bonus: "gold",
            fluid: "embers:molten_copper"
        }
    ];

    defaultMats.forEach((r) => {
        event.custom({
            "type": "embers:melting",
            "bonus": {
                "amount": 10,
                "fluid": `embers:molten_${r.bonus}`
            },
            "input": {
                "item": `create:crushed_raw_${r.name}`
            },
            "output": {
                "amount": 120,
                "fluid": r.fluid
            }
        });
    });

    // ---------------------------- Non-Vanilla Materials ----------------------------
    // I have not added bonus resources to these materials. Doing so would require modifying the recipes for the raw materials and storage blocks as well. 
    let otherMats = [
        {
            name: "zinc",
            crushed_mat: "create:crushed_raw_zinc",
            fluid: "jaopca:molten.zinc",
        }
    ]

    otherMats.forEach((r) => {
        event.custom({ //Raw material
            "type": "embers:melting",
            "input": {
                "item": r.crushed_mat
            },
            "output": {
                "amount": 120,
                "fluid": r.fluid
            }
        });
    });

    // ------------------------------------------------------------------------------
}); //End of ServerEvents