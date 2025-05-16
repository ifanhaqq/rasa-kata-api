const generateRandomUsername = () => {
  const adjectives = [
    "Mysterious",
    "Radiant",
    "Ancient",
    "Silent",
    "Frozen",
    "Enchanted",
    "Hollow",
    "Crimson",
    "Wandering",
    "Forgotten",
    "Celestial",
    "Hidden",
    "Sapphire",
    "Eternal",
    "Whispering",
    "Jagged",
    "Phantom",
    "Golden",
    "Lost",
    "Burning",
    "Midnight",
    "Hollow",
    "Stormy",
    "Timeless",
    "Shimmering",
    "Cursed",
    "Infinite",
    "Forgotten",
    "Obsidian",
    "Luminous",
  ];

  const nouns = [
    "Mountain",
    "Ocean",
    "Book",
    "Castle",
    "Thunder",
    "Diamond",
    "Shadow",
    "Phoenix",
    "Whisper",
    "Galaxy",
    "Lantern",
    "Storm",
    "Compass",
    "Echo",
    "Serpent",
    "Crown",
    "Blizzard",
    "Mirage",
    "Labyrinth",
    "Raven",
    "Tundra",
    "Obsidian",
    "Vortex",
    "Oracle",
    "Falcon",
    "Monolith",
    "Ember",
    "Tide",
    "Nebula",
    "Sphinx",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 100);

  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

module.exports = generateRandomUsername;
