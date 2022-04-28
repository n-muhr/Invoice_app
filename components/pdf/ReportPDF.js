import {
  getProfile,
  getClient,
  getProducts,
  getInvoiceDay,
  getInvoiceMonth,
} from '../database';

export const ReportPDF = async (currUser, choice) => {
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
table.meta{ float: right; width: 48%; }
table.meta:after{ clear: both; content: ""; display: table; }
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
  let invoice = [];
  if (choice === 1) {
    invoice = await getInvoiceDay(currUser.id);
  } else {
    invoice = await getInvoiceMonth(currUser.id);
  }

  let reportTable = '';
  for (let i = 0; i < invoice.length; i++) {
    reportTable = reportTable + '<tr>';
    reportTable =
      reportTable + '<td><span>' + invoice[i].invoice_number + '</span></td>';
    if (invoice[i].profile_id !== '') {
      profile = await getProfile(invoice[i].profile_id);
      reportTable = reportTable + '<td><span>' + profile.name + '</span></td>';
    } else {
      reportTable = reportTable + '<td><span></span></td>';
      profile.pays_dph = false;
    }
    reportTable =
      reportTable + '<td><span>' + invoice[i].date_of_issue + '</span></td>';

    let total_cost = 0;
    let products = await getProducts(invoice[i].id);
    for (let p = 0; p < products.length; p++) {
      let total_prod = products[p].price * products[p].quantity;
      if (profile.pays_dph === 1)
        total_prod += (total_prod * products[p].dph) / 100;
      total_cost += total_prod;
    }

    reportTable =
      reportTable +
      '<td><span>' +
      total_cost +
      '</span><span data-prefix> Kč</span></td>';
    reportTable = reportTable + '</tr>';
  }
  let date = new Date();
  let title =
    choice === 1
      ? 'Report za den ' + date.toLocaleDateString()
      : 'Report za tento měsíc';

  const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>Report</title>
            <style>
              ${htmlStyles}
            </style>
          </head>
          <body>
            <header>
              <h1>${title}</h1>
            </header>
            <article>
              <h1>Report</h1>


              <table class="inventory">
                <thead>
                  <tr>
                    <th><span>Číslo faktury</span></th>
                    <th><span>Odběratel</span></th>
                    <th><span>Datum vydání</span></th>
                    <th><span>Celková cena</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    ${reportTable}
                  </tr>
                </tbody>
              </table>
            </article>
          </body>
        </html>
      `;

  return htmlContent;
};
