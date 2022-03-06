const DownloadService = {
  downloadBlob: (blob: Blob, name: string) => {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);
    // Create a link element
    const link = document.createElement("a");
    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = name;
    // Append link to the body
    document.body.appendChild(link);
    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
    // Remove link from body
    document.body.removeChild(link);
  },
  downloadURI: (uri: string, filename = "qrcode") => {
    const link = document.createElement("a");
    link.href = uri;
    link.download = filename;
    link.click();
    // document.body.removeChild(link);
  },
};

export default DownloadService;
