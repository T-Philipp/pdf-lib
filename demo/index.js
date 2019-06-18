const fs = require('fs');
const {
  PDFDocumentFactory,
  PDFDocumentWriter,
  StandardFonts,
  drawLinesOfText,
} = require('pdf-lib');

/* ========================= 1. Read in Assets ============================== */
// This step is platform dependent. Since this is a Node script, we can just
// read the assets in from the file system. But this approach wouldn't work
// in a browser. Instead, you might need to make HTTP requests for the assets.
const assets = {
  rechnungPdfBytes: fs.readFileSync('./assets/Rechnung_ArbeitskreisSchuleWirtschaft-2019.pdf'),
};

/* ================== 2. Load and Setup the PDF Document ==================== */
// This step is platform independent. The same code can be used in any
// JavaScript runtime (e.g. Node, the browser, or React Native).

// Here we load the tax voucher PDF file into a PDFDocument object.
const pdfDoc = PDFDocumentFactory.load(assets.rechnungPdfBytes);

// Let's define some constants that we can use to reference the fonts and
// images later in the script.
const COURIER_FONT = 'Courier';

// Now we embed a standard font (Courier), and the custom TrueType font we
// read in (Ubuntu-R).
const [courierRef, courierFont] = pdfDoc.embedStandardFont(
  StandardFonts.Courier,
);


/* ====================== 3. Modify Existing Page =========================== */
// This step is platform independent. The same code can be used in any
// JavaScript runtime (e.g. Node, the browser, or React Native).

// Here we get an array of PDFPage objects contained in the `pdfDoc`. In this
// case, the tax voucher we loaded has a single page. So this will be an array
// of length one.
const pages = pdfDoc.getPages();

// Now we'll add the Courier font dictionary and Mario PNG image object that we
// embedded into the document earlier.
const existingPage = pages[0]
  .addFontDictionary(COURIER_FONT, courierRef);


// Here, we define a new "content stream" for the page. A content stream is
// simply a sequence of PDF operators that define what we want to draw on the
// page.
const newContentStream = pdfDoc.createContentStream(
  // `drawImage` is a "composite" PDF operator that lets us easily draw an image
  // on a page's content stream. "composite" just means that it is composed of
  // several lower-level PDF operators. Usually, you'll want to work with
  // composite operators - they make things a lot easier! The naming convention
  // for composite operators is "draw<thing_being_drawn>".
  //
  // Now let's draw 2 lines of red Courier text near the bottom of the page.
  drawLinesOfText(
    ['This text was added', 'with JavaScript!'].map(courierFont.encodeText),
    {
      x: 30,
      y: 150,
      font: COURIER_FONT,
      size: 48,
      colorRgb: [1, 0, 0],
    },
  ),
);

// Here we (1) register the content stream to the PDF document, and (2) add the
// reference to the registered stream to the page's content streams.
existingPage.addContentStreams(pdfDoc.register(newContentStream));

// Now we'll convert the `pdfDoc` to a `Uint8Array` containing the bytes of a
// PDF document. This step serializes the document. You can still make changes
// to the document after this step, but you'll have to call `saveToBytes` again
// after doing so.
//
// The `Uint8Array` returned here can be used in a number of ways. What you do
// with it largely depends on the JavaScript environment you're running in.
const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);

/* ========================== 7. Write PDF to File ========================== */
// This step is platform dependent. Since this is a Node script, we can just
// save the `pdfBytes` to the file system, where it can be opened with a PDF
// reader.
const filePath = `${__dirname}/demo.pdf`;
fs.writeFileSync(filePath, pdfBytes);
console.log(`PDF file written to: ${filePath}`);
