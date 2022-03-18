const ConfigService = {
  QR_CODE_CONFIG: {
    width: 220,
    height: 220,
    colorDark: "#000000",
    colorLight: "#ffffff",
  },
  ZIP_CONFIG: {
    type: "base64",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9
    }
  },
};

export default ConfigService;
