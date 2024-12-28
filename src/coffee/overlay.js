function addImgListeners() {
  console.log(document.readyState);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addImgListeners);
} else {
  addImgListeners();
}
