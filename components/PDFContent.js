import {getProfile, getClient, getProducts} from './database';
import RNQRGenerator from 'rn-qr-generator';

const createQRC = async (iban, cost) => {
  let str =
    'SPD*1.0*ACC:' + iban + '*AM:' + cost + '*CC:CZK*MSG:PLATBA ZA ZBOZI';
  RNQRGenerator.generate({
    value: str,
    height: 150,
    width: 150,
    fileName: 'invoice_qrcode',
  })
    .then(response => {
      const {uri, width, height, base64} = response;
      console.log(uri);
    })
    .catch(error => console.log('Cannot create QR code', error));
};

export const pdfContent = async item => {
  const htmlStyles = `
*{
  border: 0;
  box-sizing: content-box;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: top;
}
h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }
/* table */
table { font-size: 75%; table-layout: fixed; width: 100%; }
table { border-collapse: separate; border-spacing: 2px; }
th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
th, td { border-radius: 0.25em; border-style: solid; }
th { background: #EEE; border-color: #BBB; }
td { border-color: #DDD; }
/* page */
html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; }
html { background: #999; cursor: default; }
body { box-sizing: border-box;margin: 0 auto; overflow: hidden; padding: 0.25in; }
body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }
/* header */
header { margin: 0 0 3em; }
header:after { clear: both; content: ""; display: table; }
header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
header address p { margin: 0 0 0.25em; }
header span, header img { display: block; float: right; }
header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
header img { max-height: 100%; max-width: 100%; }
/* article */
article, article address, table.meta, table.inventory { margin: 0 0 3em; }
article:after { clear: both; content: ""; display: table; }
article h1 { clip: rect(0 0 0 0); position: absolute; }
article address { float: left; font-size: 125%; font-weight: bold; }
/* table meta & balance */
table.meta, table.balance { float: right; width: 48%; }
table.meta:after, table.balance:after { clear: both; content: ""; display: table; }
/* table meta */
table.meta th { width: 40%; }
table.meta td { width: 60%; }
/* table items */
table.inventory { clear: both; width: 100%; }
table.inventory th { font-weight: bold; text-align: center; }
table.inventory td:nth-child(1) { width: 26%; }
table.inventory td:nth-child(2) { width: 38%; }
table.inventory td:nth-child(3) { text-align: right; width: 12%; }
table.inventory td:nth-child(4) { text-align: right; width: 12%; }
table.inventory td:nth-child(5) { text-align: right; width: 12%; }
/* table balance */
table.balance th, table.balance td { width: 50%; }
table.balance td { text-align: right; }
/* aside */
aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
aside h1 { border-color: #999; border-bottom-style: solid; }
`;
  let profile = {
    id: -1,
    name: '',
    email: '',
    address: '',
    descriptive_number: '',
    description: '',
    ICO: '',
    DIC: '',
    pays_dph: false,
    city: '',
    account: '',
    court: '',
    section: '',
    part: '',
  };
  let client = {
    id: -1,
    name: '',
    email: '',
    address: '',
    descriptive_number: '',
    city: '',
    ico: '',
    dic: '',
    description: '',
  };
  if (item.profile_id !== '') profile = await getProfile(item.profile_id);
  if (item.client_id !== '') client = await getClient(item.client_id);
  let products = await getProducts(item.id);
  let productTable = '';
  let total_cost = 0;
  for (let i = 0; i < products.length; i++) {
    let total_price = products[i].price * products[i].quantity;
    let dph_price = (total_price * products[i].dph) / 100;
    productTable = productTable + '<tr>';
    productTable =
      productTable + '<td><span>' + products[i].description + '</span></td>';
    productTable =
      productTable +
      '<td><span>' +
      products[i].quantity +
      ' ks' +
      '</span></td>';
    productTable =
      productTable + '<td><span>' + products[i].price + '</span></td>';
    if (profile.pays_dph) {
      productTable =
        productTable + '<td><span>' + products[i].dph + ' %' + '</span></td>';
      productTable = productTable + '<td><span>' + total_price + '</span></td>';
      productTable = productTable + '<td><span>' + dph_price + '</span></td>';
    } else {
      productTable = productTable + '<td><span></span></td>';
      productTable = productTable + '<td><span></span></td>';
      productTable = productTable + '<td><span></span></td>';
    }
    productTable =
      productTable +
      '<td><span>' +
      (total_price + dph_price) +
      '</span><span data-prefix> Kč</span></td>';
    productTable = productTable + '</tr>';
    total_cost += total_price + dph_price;
  }
  let payed = 0;
  if (item.paid) payed = total_cost;
  else if (item.payed.length > 0) payed = item.payed;
  let account =
    item.payment_method === 'Bankovní převod'
      ? '<th><span>Číslo účtu</span></th> <td><span>' +
        profile.account +
        '</span></td>'
      : '';
  let nodeCourt = '';
  if (profile.court.length > 0) {
    nodeCourt = 'Zapsáno v obchodním rejstříku u ' + profile.court;
    nodeCourt += profile.section !== '' ? ', iddíl ' + profile.section : '';
    nodeCourt += profile.part.length > 0 ? ', složka ' + profile.part : '';
    nodeCourt += '.';
  }
  let storno = item.is_storno
    ? '<div style="margin: 10px"><p>Faktura je stornovaná.</p></div>'
    : '';
  let taxable_date = profile.pays_dph
    ? '<tr>' +
      '<th><span>Zdanitelné plnění</span></th><td><span>' +
      new Date(item.taxable_supply).toLocaleDateString() +
      '</span></td></tr>'
    : '';
  let name = profile.pays_dph ? 'Faktura/Daňový doklad' : 'Faktura';
  let qrcode = '';
  if (item.payment_method !== 'Hotovost') {
    await createQRC(profile.account, total_cost - payed);
    qrcode +=
      '<img src="file:///data/user/0/com.invoiceapp/cache/invoice_qrcode.png" style="height:150px;float:left" />';
  }

  const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>Faktura</title>
            <link rel="license" href="https://www.opensource.org/licenses/mit-license/">
            <style>
              ${htmlStyles}
            </style>
          </head>
          <body>
            <header>
              <h1>Faktura</h1>
              <address>
                <p style="font-size:20px">Dodavatel</p>
                <p>${profile.name}</p>
                <p>${profile.address}</p>
                <p>${profile.descriptive_number}, ${profile.city}</p>
                <p>IČO: ${profile.ico}</p>
                <p>DIČ: ${profile.dic}</p>
              </address>

              <address style="padding-left: 100px;">
                <p style="font-size:20px">Odběratel</p>
                <p>${client.name}</p>
                <p>${client.address}</p>
                <p>${client.descriptive_number}, ${client.city}</p>
                <p>IČO: ${client.ico}</p>
              </address>
            </header>
            <article>
              <h1>Recipient</h1>
              
                <table class="meta">
                <tr>
                  <th><span>${name} #</span></th>
                  <td><span>${item.id}</span></td>
                </tr>
                <tr>
                  <th><span>Datum vystavení</span></th>
                  <td><span>${new Date(
                    item.date_of_issue,
                  ).toLocaleDateString()}</span></td>
                </tr>
                <tr>
                  <th><span>Datum splatnosti</span></th>
                  <td><span>${new Date(
                    item.due_date,
                  ).toLocaleDateString()}</span></td>
                </tr>
                ${taxable_date}
              </table>

              <table class="meta" style="float: left;">
                <tr>
                  <th><span>Způsob platby</span></th>
                  <td><span>${item.payment_method}</span></td>
                </tr>
                <tr>
                  ${account}
                </tr>
              </table>
              ${qrcode}


              <table class="inventory">
                <thead>
                  <tr>
                    <th><span>Popis</span></th>
                    <th><span>Množství</span></th>
                    <th><span>Cena za kus</span></th>
                    <th><span>%DPH</span></th>
                    <th><span>Bez DPH</span></th>
                    <th><span>DPH</span></th>
                    <th><span>Celkem</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    ${productTable}
                  </tr>
                </tbody>
              </table>
              <table class="balance">
                <tr>
                  <th><span>Celková cena</span></th>
                  <td><span>${total_cost}</span><span data-prefix> Kč</span></td>
                </tr>
                <tr>
                  <th><span>Zaplaceno</span></th>
                  <td><span>${payed}</span><span data-prefix> Kč</span></td>
                </tr>
                <tr>
                  <th><span>Zbývá zaplatit</span></th>
                  <td><span>${
                    total_cost - payed
                  }</span><span data-prefix> Kč</span></td>
                </tr>
              </table>
            </article>
            <aside>
              <h1><span>Poznámky</span></h1>
              <div style="margin: 10px">
                <p>${nodeCourt}</p>
              </div>
              <div style="margin: 10px">
                <p>${item.note}</p>
              </div>
              ${storno}
            </aside>
          </body>
        </html>
      `;

  return htmlContent;
};
