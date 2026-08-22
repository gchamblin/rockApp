// Built-in reference data: general rock guide + Florida-specific facts.
// This data ships with the app so the Rock Guide and Florida Facts tabs work fully offline.

const ROCK_GUIDE = [
  {
    name: "Granite",
    type: "Igneous",
    emoji: "🪨",
    description: "Granite forms deep underground when melted rock (magma) cools very slowly. It's speckled with black, white, and pink crystals.",
    funFact: "Granite is so hard that people use it for kitchen countertops and statues!"
  },
  {
    name: "Basalt",
    type: "Igneous",
    emoji: "⬛",
    description: "Basalt forms when lava cools quickly at the Earth's surface, like from a volcano. It's usually dark gray or black.",
    funFact: "The Moon's dark 'seas' are actually huge fields of basalt!"
  },
  {
    name: "Obsidian",
    type: "Igneous",
    emoji: "🖤",
    description: "Obsidian is volcanic glass — it cools so fast that crystals never get the chance to form.",
    funFact: "Obsidian can be sharper than a surgeon's steel scalpel when broken!"
  },
  {
    name: "Sandstone",
    type: "Sedimentary",
    emoji: "🟨",
    description: "Sandstone is made of tiny grains of sand pressed and glued together over a very long time.",
    funFact: "You can often see the individual sand grains sparkle in sandstone!"
  },
  {
    name: "Limestone",
    type: "Sedimentary",
    emoji: "⚪",
    description: "Limestone forms from the shells and skeletons of ancient sea creatures compacted together.",
    funFact: "Limestone can fizz when you put a drop of vinegar on it!"
  },
  {
    name: "Shale",
    type: "Sedimentary",
    emoji: "🩶",
    description: "Shale forms from layers of mud and clay squeezed together, so it splits easily into flat, thin layers.",
    funFact: "Shale sometimes hides amazing fossils between its thin layers!"
  },
  {
    name: "Marble",
    type: "Metamorphic",
    emoji: "🤍",
    description: "Marble starts as limestone, then gets squeezed and heated deep underground until it changes into a harder, sparkly rock.",
    funFact: "Famous statues like Michelangelo's David are carved from marble!"
  },
  {
    name: "Slate",
    type: "Metamorphic",
    emoji: "🪶",
    description: "Slate starts as shale and gets pressed and heated until it becomes a smooth rock that splits into flat sheets.",
    funFact: "Old chalkboards used to be made from real slate rock!"
  },
  {
    name: "Quartz",
    type: "Mineral",
    emoji: "💎",
    description: "Quartz is one of the most common minerals on Earth. It can be clear, white, purple (amethyst), or pink (rose quartz).",
    funFact: "Quartz crystals can create a tiny electric charge when squeezed — that's how many watches keep time!"
  },
  {
    name: "Pyrite",
    type: "Mineral",
    emoji: "🟡",
    description: "Pyrite is a shiny, golden mineral often mistaken for real gold.",
    funFact: "Pyrite's nickname is 'Fool's Gold' because prospectors used to mistake it for treasure!"
  }
];

const FLORIDA_FACTS = [
  {
    name: "Coquina",
    tag: "Florida's Own Rock",
    emoji: "🐚",
    description: "Coquina is made almost entirely of tiny broken shells cemented together by nature over thousands of years. You can find it along Florida's coast, especially near St. Augustine.",
    funFact: "Fort Matanzas and the Castillo de San Marcos in St. Augustine were built from coquina — cannonballs would sink into it instead of shattering it!"
  },
  {
    name: "Florida Limestone",
    tag: "Under Your Feet",
    emoji: "🌊",
    description: "Almost all of Florida sits on a giant slab of limestone formed millions of years ago when Florida was covered by a shallow sea full of shelled creatures.",
    funFact: "This limestone is why Florida has so many sinkholes and freshwater springs — rainwater slowly dissolves it, carving out caves and holes underground!"
  },
  {
    name: "Agatized Coral",
    tag: "Florida's State Stone",
    emoji: "🪸",
    description: "Agatized coral forms when ancient coral gets replaced bit by bit with colorful quartz, turning it into a sparkly gemstone.",
    funFact: "Agatized coral is the official Florida State Stone, and you can find pieces along the Econfina and Suwannee Rivers!"
  },
  {
    name: "Florida Chert (Flint)",
    tag: "Toolmaker's Rock",
    emoji: "🔪",
    description: "Chert is a hard, glassy rock found in many Florida riverbeds. Native Americans in Florida used it to make sharp tools and arrowheads.",
    funFact: "You can still find chert flakes and tools left behind by people who lived in Florida thousands of years ago!"
  },
  {
    name: "Megalodon Teeth",
    tag: "Fossil Hunter's Prize",
    emoji: "🦈",
    description: "Florida's rivers, like the Peace River, are famous for fossilized shark teeth, including giant Megalodon teeth from a shark bigger than a school bus!",
    funFact: "Florida is one of the best places in the world to find megalodon teeth — some found here are over 6 inches long!"
  },
  {
    name: "Florida Phosphate",
    tag: "Hidden Mineral",
    emoji: "⛏️",
    description: "Central Florida has huge deposits of phosphate rock, formed from ancient sea life and used to make fertilizer that helps plants grow.",
    funFact: "Florida produces about 75% of the phosphate used in the United States!"
  },
  {
    name: "Florida Sand",
    tag: "Beach Bonus",
    emoji: "🏖️",
    description: "Florida's famous white sand beaches are made mostly of quartz crystals, washed down from rocks in the Appalachian Mountains over millions of years.",
    funFact: "Some Florida sand squeaks when you walk on it because the quartz grains are so round and clean!"
  }
];
