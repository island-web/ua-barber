const mysql = require('mysql2/promise');
const moment = require('moment');
pool = mysql.createPool({ connectionLimit: 10, host: '89.184.68.183', user: 'u_uabarber', password: 'ejux90tr', database: 'uabarber' });

async function getServices(res) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`SELECT * FROM services`);
      return rows;
    } finally {
      connection.release();
    }
}

async function getAllClients() {

  const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`SELECT * FROM clients`);
      return rows;
    } finally {
      connection.release();
    }
}

async function setDataConnect(user_agent, ip) {
  const connection = await pool.getConnection();
    try {
      await connection.query(`INSERT INTO connections (user_agent, client_ip, time, date) VALUES ('${user_agent}', '${ip}', '${moment().format('HH:mm:ss')}', '${moment().format('YYYY-MM-DD')}')`);
      console.log('Данные о подключении записаны в БД');
    } finally {
      connection.release();
    }
}

async function setEditServices(data) {
  const connection = await pool.getConnection();
    try {
      for (key of Object.keys(data)){
        await connection.query(`UPDATE services SET name_service = '${data[key].name_service}', price = '${data[key].price}', length_ = '${data[key].length_}' WHERE id = '${key}'`);
        console.log('Данные сервиса обновлены в БД');
      }      
    } finally {
      connection.release();
    }
}

async function addServices(data) {

  const connection = await pool.getConnection();
    try {
      await connection.query(`INSERT INTO services (name_service, price, length_, discription) VALUES ('${data.name_service}', '${data.price}', '${data.length_}', '${data.discription}')`);
      console.log('Данные сервиса добавлены в БД');
    } finally {
      connection.release();
    }
}

async function editClients(data) {

  const connection = await pool.getConnection();
    try {
      for (key of Object.keys(data)){
        await connection.query(`UPDATE clients SET name_client = '${data[key].name_client}', phone_client = '${data[key].phone_client}', about_client = '${data[key].about_client}', history = '${data[key].history}' WHERE id = '${key}'`);
        console.log('Данные клиента обновлены в БД');
      }
    } finally { connection.release() }
}

async function addClient(data) {

  const connection = await pool.getConnection();
    try {
      await connection.query(`INSERT INTO clients (name_client, phone_client, about_client) VALUES ('${data.name_client}', '${data.phone_client}', '${data.about_client}')`);
      console.log('Данные клиента добавлены в БД');
    } finally {
      connection.release();
    }
}

async function getOrders() {

  const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`SELECT * FROM orders`);
      return rows
    } finally {
      connection.release();
    }
}

async function getClient(data) {

  const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`SELECT * FROM clients WHERE id = '${data.id}'`);
      return rows;
    } finally {
      connection.release();
    }
}

async function dellOrder(data) {

  const connection = await pool.getConnection();
    try {
      await connection.query(`DELETE FROM orders WHERE id_order = '${data.id_order}'`);
      console.log('Заказ удален из БД');
    } finally {
      connection.release();
    }
}

async function getMasters() {

  const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`SELECT * FROM masters`);
      return rows;
    } finally {
      connection.release();
    }
}

module.exports = { getServices, setDataConnect, setEditServices, addServices, getAllClients, editClients, addClient,
  getOrders, getClient, dellOrder, getMasters }