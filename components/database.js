import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'InvoiceDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

//funkce pro provedeni sql query
export const ExecuteQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.transaction(trans => {
      trans.executeSql(
        sql,
        params,
        (trans, results) => {
          resolve(results);
        },
        error => {
          reject(error);
        },
      );
    });
  });

//vytvoreni table profile pokud neexistuje
export function createTableProfile() {
  db.transaction(txn => {
    txn.executeSql(
      'Create table if not exists profile(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30), email VARCHAR(30), address VARCHAR(30), descriptive_number VARCHAR(8), city VARCHAR(30), pays_dph BOOLEAN, ico VARCHAR(15), dic VARCHAR(15), description TEXT, account VARCHAR(15), court VARCHAR(40), section VARCHAR(2), part VARCHAR(6))',
    );
  });
}

//asynchronni funkce pro nacteni klientu z tabulky clients z databaze
export async function getProfile(id) {
  let selectQuery = await ExecuteQuery(
    'select id, name, email, address, descriptive_number, city, pays_dph, ico, dic, description, account, court, section, part from profile where id = ?',
    [id],
  );

  var rows = selectQuery.rows;
  let item = rows.item(0);
  let Profile = {
    id: item.id,
    name: item.name,
    email: item.email,
    address: item.address,
    descriptive_number: item.descriptive_number,
    city: item.city,
    pays_dph: item.pays_dph,
    ico: item.ico,
    dic: item.dic,
    description: item.description,
    account: item.account,
    court: item.court,
    section: item.section,
    part: item.part,
  };
  return Profile;
}

export async function getClient(id) {
  try {
    let selectQuery = await ExecuteQuery(
      'select id, name, email, address, descriptive_number, city, ico, dic, description from client where id = ?',
      [id],
    );

    var rows = selectQuery.rows;
    let item = rows.item(0);
    let Client = {
      id: item.id,
      name: item.name,
      email: item.email,
      descriptive_number: item.descriptive_number,
      city: item.city,
      address: item.address,
      ico: item.ico,
      dic: item.dic,
      description: item.description,
    };
    return Client;
  } catch (err) {
    console.error(err);
  }
}
export function deleteClient(id) {
  db.transaction(tx => {
    tx.executeSql('delete from client where id = ?', [id]);
  });

  db.transaction(tx => {
    tx.executeSql('update invoice set client_id =? where client_id = ?', [
      '',
      id,
    ]);
  });
}

export function deleteProfile(id) {
  db.transaction(tx => {
    tx.executeSql('delete from profile where id = ?', [id]);
  });

  db.transaction(tx => {
    tx.executeSql('update invoice set profile_id =? where profile_id = ?', [
      '',
      id,
    ]);
  });
}

export async function getLastInvoice() {
  try {
    let selectQuery = await ExecuteQuery(
      'select id, date_of_issue, due_date, taxable_supply, payed, payment_method, paid, client_id, profile_id, note, is_storno, invoice_number from invoice order by id desc limit 1',
      [],
    );
    var rows = selectQuery.rows;
    let item = rows.item(0);
    let invoice = {
      id: item.id,
      date_of_issue: item.date_of_issue,
      due_date: item.due_date,
      taxable_supply: item.taxable_supply,
      payed: item.payed,
      payment_method: item.payment_method,
      paid: item.paid,
      client_id: item.client_id,
      profile_id: item.profile_id,
      note: item.note,
      is_storno: item.is_storno,
      invoice_number: item.invoice_number,
    };
    return invoice;
  } catch (err) {
    console.error(err);
  }
}

export function updateProfileAccount(id, new_account) {
  db.transaction(tx => {
    tx.executeSql('update profile set account =? where id = ?', [
      new_account,
      id,
    ]);
  });
}

export function addProductDatabase(product) {
  db.transaction(tx => {
    tx.executeSql(
      'insert into product(invoice_id,description, price, quantity, dph) values (?,?,?,?,?)',
      [
        product.invoice_id,
        product.description,
        product.price,
        product.quantity,
        product.dph,
      ],
    );
  });
}

export function deleteProduct(id) {
  db.transaction(tx => {
    tx.executeSql('delete from product where id = ?', [id]);
  });
}

export function deleteInvoice(id) {
  db.transaction(tx => {
    tx.executeSql('update invoice set is_storno =? where id = ?', [true, id]);
  });
}

//vytvoreni table product pokud neexistuje
export function createTableProduct() {
  db.transaction(txn => {
    txn.executeSql(
      'Create table if not exists product(id INTEGER PRIMARY KEY AUTOINCREMENT, invoice_id integer, description TEXT, price decimal(10,5), quantity integer, dph integer)',
    );
  });
}

export function createTableClient() {
  db.transaction(txn => {
    txn.executeSql(
      'Create table if not exists client(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30), email VARCHAR(30), address VARCHAR(30), descriptive_number VARCHAR(10), city VARCHAR(30), ico VARCHAR(15), dic VARCHAR(15), description TEXT)',
    );
  });
}

//vytvoreni table invoice pokud neexistuje
export function createTableInvoice() {
  db.transaction(txn => {
    txn.executeSql(
      'Create table if not exists invoice(id INTEGER PRIMARY KEY AUTOINCREMENT, date_of_issue VARCHAR(10), due_date VARCHAR(10), taxable_supply VARCHAR(10), payed decimal(10,5), payment_method VARCHAR(20), paid BOOLEAN, client_id integer, profile_id integer, note TEXT, is_storno BOOLEAN, invoice_number VARCHAR(15))',
    );
  });
}

export async function getProducts(id) {
  try {
    let selectQuery = await ExecuteQuery(
      'select id,invoice_id,description, price, quantity, dph from product where invoice_id = ?',
      [id],
    );
    let products = [];
    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      let item = rows.item(i);
      console.log(item);
      let product = {
        id: item.id,
        invoice_id: item.invoice_id,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        dph: item.dph,
      };
      products = [...products, product];
    }

    return products;
  } catch (err) {
    console.error(err);
  }
}

export async function copyProducts(id_old, id_new) {
  try {
    let selectQuery = await ExecuteQuery(
      'select id,invoice_id,description, price, quantity, dph from product where invoice_id = ?',
      [id_old],
    );
    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      let item = rows.item(i);
      await ExecuteQuery(
        'insert into product(invoice_id,description, price, quantity, dph) values (?,?,?,?,?)',
        [id_new, item.description, item.price, item.quantity, item.dph],
      );
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getLastYearInvoice() {
  try {
    let firstDay = new Date(new Date().getFullYear(), 0, 1);

    let selectQuery = await ExecuteQuery(
      'select id, date_of_issue, due_date, taxable_supply, payed, payment_method, paid, client_id, profile_id, note, is_storno, invoice_number from invoice',
      [],
    );
    let invoices = [];
    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      let item = rows.item(i);
      if (new Date(item.date_of_issue).getTime() < firstDay.getTime()) continue;
      //console.log('Stats: ', item);

      let invoice = {
        id: item.id,
        date_of_issue: item.date_of_issue,
        due_date: item.due_date,
        taxable_supply: item.taxable_supply,
        payed: item.payed,
        payment_method: item.payment_method,
        paid: item.paid,
        client_id: item.client_id,
        profile_id: item.profile_id,
        note: item.note,
        is_storno: item.is_storno,
        invoice_number: item.invoice_number,
      };
      invoices = [...invoices, invoice];
    }

    return invoices;
  } catch (err) {
    console.error(err);
  }
}

export async function getLastThreeYearInvoice() {
  try {
    let fromYear = new Date(
      new Date().setFullYear(new Date().getFullYear() - 3),
    );
    console.log(fromYear);
    let selectQuery = await ExecuteQuery(
      'select id, date_of_issue, due_date, taxable_supply, payed, payment_method, paid, client_id, profile_id, note, is_storno, invoice_number from invoice',
      [],
    );
    let invoices = [];
    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      let item = rows.item(i);
      if (new Date(item.date_of_issue).getTime() < fromYear.getTime()) continue;
      console.log('Stats: ', item);

      let invoice = {
        id: item.id,
        date_of_issue: item.date_of_issue,
        due_date: item.due_date,
        taxable_supply: item.taxable_supply,
        payed: item.payed,
        payment_method: item.payment_method,
        paid: item.paid,
        client_id: item.client_id,
        profile_id: item.profile_id,
        note: item.note,
        is_storno: item.is_storno,
        invoice_number: item.invoice_number,
      };
      invoices = [...invoices, invoice];
    }

    return invoices;
  } catch (err) {
    console.error(err);
  }
}

export async function countInvoice() {
  try {
    let count = 0;
    let selectQuery = await ExecuteQuery('select count(*) from invoice', []);

    var rows = selectQuery.rows;
    let item = rows.item(0);
    count = item['count(*)'];
    return count;
  } catch (err) {
    console.error(err);
  }
}

//vytvoreni table invoice pokud neexistuje
export function createTableUser() {
  db.transaction(txn => {
    txn.executeSql(
      'Create table if not exists account(id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(30), password VARCHAR(30))',
    );
  });
}

export async function addUser(user) {
  db.transaction(tx => {
    tx.executeSql('insert into account(email,password) values (?,?)', [
      user.email,
      user.password,
    ]);
  });
}

export async function verifyUser(user) {
  try {
    let selectQuery = await ExecuteQuery(
      'select id, email, password from account',
      [],
    );
    let result = {id: -1, email: ''};
    var rows = selectQuery.rows;
    if (rows.length === 0) {
      console.log('prazdno');
      return result;
    }

    for (let i = 0; i < rows.length; i++) {
      let item = rows.item(i);
      //console.log(item);
      if (item.email === user.email && item.password === user.password) {
        result.id = item.id;
        result.email = item.email;
        return result;
      }
    }

    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function chechUserCount(email) {
  try {
    let count = 0;
    let selectQuery = await ExecuteQuery(
      'select count(*) from account where email = ?',
      [email],
    );

    var rows = selectQuery.rows;

    var rows = selectQuery.rows;
    let item = rows.item(0);
    count = item['count(*)'];
    console.log(count);

    return count;
  } catch (err) {
    console.error(err);
  }
}
