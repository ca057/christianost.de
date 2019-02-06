import FontFaceObserver from 'fontfaceobserver';

const interFontObserver = new FontFaceObserver('Inter Regular');

const addFontLoadedClass = () => {
  document.body.classList.add('fonts-loaded');
};

interFontObserver.load().then(() => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFontLoadedClass);
  } else {
    addFontLoadedClass();
  }
});
