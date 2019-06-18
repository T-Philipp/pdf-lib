const fs = require('fs');
const {
  PDFDocumentFactory,
  PDFDocumentWriter,
  StandardFonts,
  drawText,
} = require('pdf-lib');

const params = {
  filename: '123456789',
  address: {
    line1: 'Philipp Tavra',
    line2: 'Herrenbachstraße 31a',
    line3: '86161 Augsburg',
  },
  date: '22.05.2017',
  billNumber: '12',
  issuer: 'Tobias Baumhauer',
  contact: 'Susanne Maier',
  price: '23,45',
};

const assets = {
  rechnungPdfBytes: fs.readFileSync('./assets/Rechnung_ArbeitskreisSchuleWirtschaft-2019.pdf'),
};


const pdfDoc = PDFDocumentFactory.load(assets.rechnungPdfBytes);

const COURIER_FONT = 'Courier';
const [courierRef, courierFont] = pdfDoc.embedStandardFont(
  StandardFonts.Courier,
);

const pages = pdfDoc.getPages();

const existingPage = pages[0].addFontDictionary(COURIER_FONT, courierRef);


const addressLine1 = pdfDoc.createContentStream(
  drawText(courierFont.encodeText(params.address.line1), {
    x: 50,
    y: 670,
    font: COURIER_FONT,
    size: 12,
    colorRgb: [0, 0, 0],
  }),
);
existingPage.addContentStreams(pdfDoc.register(addressLine1));


const addressLine2 = pdfDoc.createContentStream(
  drawText(courierFont.encodeText(params.address.line2), {
    x: 50,
    y: 650,
    font: COURIER_FONT,
    size: 12,
    colorRgb: [0, 0, 0],
  }),
);
existingPage.addContentStreams(pdfDoc.register(addressLine2));


const addressLine3 = pdfDoc.createContentStream(
  drawText(courierFont.encodeText(params.address.line3), {
    x: 50,
    y: 630,
    font: COURIER_FONT,
    size: 12,
    colorRgb: [0, 0, 0],
  }),
);
existingPage.addContentStreams(pdfDoc.register(addressLine3));


const dateLine = pdfDoc.createContentStream(
  drawText(courierFont.encodeText(params.date), {
    x: 445,
    y: 616,
    font: COURIER_FONT,
    size: 8,
    colorRgb: [0, 0, 0],
  }),
);
existingPage.addContentStreams(pdfDoc.register(dateLine));


const billNumberLine = pdfDoc.createContentStream(
  drawText(courierFont.encodeText(params.billNumber), {
    x: 240,
    y: 560,
    font: COURIER_FONT,
    size: 8,
    colorRgb: [0, 0, 0],
  }),
);
existingPage.addContentStreams(pdfDoc.register(billNumberLine));


const issuerLine = pdfDoc.createContentStream(
  drawText(courierFont.encodeText(params.issuer), {
    x: 240,
    y: 547,
    font: COURIER_FONT,
    size: 8,
    colorRgb: [0, 0, 0],
  }),
);
existingPage.addContentStreams(pdfDoc.register(issuerLine));


const contactLine = pdfDoc.createContentStream(
  drawText(courierFont.encodeText(params.contact), {
    x: 240,
    y: 534,
    font: COURIER_FONT,
    size: 8,
    colorRgb: [0, 0, 0],
  }),
);
existingPage.addContentStreams(pdfDoc.register(contactLine));


const priceLine = pdfDoc.createContentStream(
  drawText(courierFont.encodeText(params.price), {
    x: 50,
    y: 386,
    font: COURIER_FONT,
    size: 10,
    colorRgb: [0, 0, 0],
  }),
);
existingPage.addContentStreams(pdfDoc.register(priceLine));


const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);

const filePath = `${__dirname}/${params.filename}.pdf`;
fs.writeFileSync(filePath, pdfBytes);

// eslint-disable-next-line
console.log(`PDF wurde erstellt: ${filePath}`);