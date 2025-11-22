const ConfigService = {
  QR_CODE_CONFIG: {
    width: 220,
    height: 220,
    colorDark: "#000000",
    colorLight: "#ffffff",
  },
  ZIP_CONFIG: {
    // compression: "DEFLATE",
    type: "base64",
    compressionOptions: {
      level: 6
    }
  },
};

export enum ActivityStates {
  VISIBLE = "visible",
  HIDDEN = "hidden",
}

export default ConfigService;
