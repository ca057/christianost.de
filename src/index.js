import createFontsLoader, { addFontLoadedClass } from './modules/fonts';
import drawLines from './modules/lines';

const fontsLoader = createFontsLoader();

const handleDocumentReady = () => {
  fontsLoader.then(addFontLoadedClass);
  drawLines(document.getElementById('lines-space'));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDocumentReady);
} else {
  handleDocumentReady();
}
