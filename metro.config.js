const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// This tells Expo to process your Tailwind classes from global.css
module.exports = withNativeWind(config, { input: "./global.css" });