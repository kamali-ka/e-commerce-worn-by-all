function redirectTo(category) {
    const baseUrl = "pages"; // Directory where your HTML files are stored
    const url = `${baseUrl}/${category}Page.html`; // Example: pages/menPage.html
    window.location.href = url;
  }
  