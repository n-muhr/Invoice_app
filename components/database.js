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

//asynchronni funkce pro nacteni klientu z tabulky clients z databaze
export async function getProfile(id) {
  let selectQuery = await ExecuteQuery(
    'select id, name, email, address, descriptive_number, city, pays_dph, ico, dic, description from profile where id = ?',
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
  };
  return Profile;
}

export async function getClient(id) {
  try {
    let selectQuery = await ExecuteQuery(
      'select id, name, email, phone, address, description from clients where id = ?',
      [id],
    );

    var rows = selectQuery.rows;
    let item = rows.item(0);
    let Client = {
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      description: item.description,
    };
    return Client;
  } catch (err) {
    console.error(err);
  }
}

export async function getLastInvoice() {
  try {
    let selectQuery = await ExecuteQuery(
      'select id, date_of_issue, due_date, taxable_supply, total_cost, payment_method, paid, client_id, profile_id from invoice order by id desc limit 1',
      [],
    );
    var rows = selectQuery.rows;
    let item = rows.item(0);
    let invoice = {
      id: item.id,
      date_of_issue: item.date_of_issue,
      due_date: item.due_date,
      taxable_supply: item.taxable_supply,
      total_cost: item.total_cost,
      payment_method: item.payment_method,
      client_id: item.client_id,
      profile_id: item.profile_id,
    };
    //console.log(invoice);
    return invoice;
  } catch (err) {
    console.error(err);
  }
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

//vytvoreni table product pokud neexistuje
export const createTableProduct = () => {
  db.transaction(txn => {
    txn.executeSql(
      'Create table if not exists product(id INTEGER PRIMARY KEY AUTOINCREMENT, invoice_id integer, description TEXT, price decimal(10,5), quantity integer, dph integer)',
    );
  });
};
