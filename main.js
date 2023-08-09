const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { getServices, setDataConnect, setEditServices, addServices, getAllClients, editClients, addClient,
  getOrders, getClient, dellOrder, getMasters } = require('./database');

// Настройка статического файлового сервера для директории 'src'
app.use(express.static(path.join(__dirname, 'src')));
// Разрешаем парсить данные в формате JSON

app.use(bodyParser.json());



// Маршрут для обработки запроса на корень сайта
app.get('/drag_20', (req, res) => {
  // Получаем данные из заголовка запроса и ip клиента
  setDataConnect(req.get('User-Agent'), req.ip);
  // Отправляем файл index.html в ответ на запрос
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('moment-timezone', (req, res) => { res.sendFile( require('moment-timezone')) });



app.get('/services', (req, res) => { try { getServices().then((rows) => { res.json(rows) }) } catch (e) { console.log(e) } });
app.post('/edit_services', (req, res) => {
  try{
    const data = req.body;
    setEditServices(data).then(() => { getServices().then((rows) => { res.json(rows) }) })
  } catch (e) { console.log(e) }
});
app.post('/add_service', (req, res) => {
  try{
    const data = req.body;
    addServices(data).then(() => { getServices().then((rows) => { res.json(rows) }) })
  }
  catch (e) { console.log(e) }
});

app.post('/add_client', (req, res) => { 
  try{
    const data = req.body;
    addClient(data).then(() => { getAllClients().then((rows) => { res.json(rows) }) })
  }
  catch (e) { console.log(e) }
});
app.get('/clients', (req, res) => { try { getAllClients().then((rows) => { res.json(rows) }) } catch (e) { console.log(e) } });

//get one client by id
app.post('/client', (req, res) => {
  try{
    const data = req.body;
    getClient(data).then((rows) => { res.json(rows) })
  }
  catch (e) { console.log(e) }
});

app.post('/edit_clients', (req, res) => {
  try{
    const data = req.body;
    editClients(data).then(() => { getAllClients().then((rows) => { res.json(rows) }) })
  }
  catch (e) { console.log(e) }
});

app.get('/orders', (req, res) => { try { getOrders().then((rows) => { res.json(rows) }) } catch (e) { console.log(e) } });


app.post('/dell_order', (req, res) => {
  try{
    const data = req.body;
    dellOrder(data).then(() => { getOrders().then((rows) => { res.json(rows) }) })
  }
  catch (e) { console.log(e) }
});

app.get('/masters', (req, res) => { try { getMasters().then((rows) => { res.json(rows) }) } catch (e) { console.log(e) } });

// Запуск сервера
const port = 3377;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});


