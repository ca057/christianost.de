import FontFaceObserver from 'fontfaceobserver';

export const addFontLoadedClass = () => {
  document.body.classList.add('fonts-loaded');
};

const interFontObserver = new FontFaceObserver('Inter Regular');

export default () => interFontObserver.load();
