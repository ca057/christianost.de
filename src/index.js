import createFontsLoader, { addFontLoadedClass } from './modules/fonts';

const fontsLoader = createFontsLoader();

const handleDocumentReady = () => {
  fontsLoader.then(addFontLoadedClass);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDocumentReady);
} else {
  handleDocumentReady();
}
