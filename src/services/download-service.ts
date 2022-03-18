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
    // document.removeChild(link);
  },
  fileToBase64: (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || "");
      reader.onerror = (error) => reject(error);
    });
  },
  base64ImageToBlob: (str: string) => {
    // extract content type and base64 payload from original string
    const pos = str.indexOf(";base64,");
    const type = str.substring(5, pos);
    const b64 = str.substr(pos + 8); // decode base64
    const imageContent = atob(b64); // create an ArrayBuffer and a view (as unsigned 8-bit)
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer); // fill the view, using the decoded base64
    for (let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    } // convert ArrayBuffer to Blob
    const blob = new Blob([buffer], { type: type });
    return blob;
  },
};

export default DownloadService;
