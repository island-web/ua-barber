// Autor: Denys Lupandin

const fa_vector = '<i class="fa-solid fa-arrow-right fa-beat-fade" style="color: #37ff00;"></i>';
const text = { "btn_clients": "друзі", "btn_serv": "послуги", "btn_serv_edit": "редагувати послуги", "btn_orders": "Замовлення", "btn_edit_orders": "Редагувати замовлення" };
const block_progress = document.querySelector('.progress-bar');
const progressBar = document.querySelector('.progress');
let progressPercent = 0;




for (let key in text) {
  document.getElementById(key).innerHTML = text[key];
}





async function rout(id) {
  document.getElementById('fa-back').style.display = 'block';

  switch (id) {

    case 'btn_serv':
      getData('services', id);
      break;
    case 'btn_serv_edit':
      document.getElementById('fa-search').style.display = 'block';
      document.getElementById('fa-add-service').style.display = 'block';
      getData('services', id);
      break;
    case 'btn_clients':
      getData('clients', id);
      break;
    case 'btn_orders':
      getData('orders', id);
      break;
  }
}

function getData(table, id) {
  console.log(table);
  fetch('/' + table)
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      switch (id) {
        case 'btn_serv':
          showAllServices(data);
          break;
        case 'btn_serv_edit':
          showAllServicesEdit(data);
          break;
        case 'btn_clients':
          showAllClients(data);
          break;
        case 'btn_orders':
          showAllOrders(data);
          break;
      }
    })
    .catch(error => console.error('Ошибка:', error));
}

function showAllServices(services) {

  document.getElementById('li_start').style.display = 'none';
  const div = document.createElement('div');
  let count = 0;
  for (item in services) {
    count++;
    const class_div = (count === 1) ? 'info-service active' : 'info-service';

    div.innerHTML += `
   <p class="output services" onclick="show_hide(this, 'services');"> ${fa_vector} ${services[item].name_service}</p>
    <div class="${class_div}">
      <ul class="list-service">
        <li class="list-service-opt">Ціна: ${services[item].price}</li>
        <li class="list-service-opt">тривалість: ${services[item].length_}</li>
        <li class="list-service-opt">опис: ${services[item].discription}</li>
      </ul>
    </div>
    `;
  }

  document.getElementById("body-info").append(div);
  document.getElementById("body-info").style.textAlign = 'left';
  document.getElementById("body-info").style.display = 'block';

}

function showAllServicesEdit(services) {

  document.getElementById('li_start').style.display = 'none';
  const div = document.createElement('div');

  for (item in services) {
    div.innerHTML += `
    <div class="row row-edit-service" id="${services[item].id}">
      <div class="col-sm-4">
        <input class="input name_input" name="name_service" value="${services[item].name_service}" onclick="shake('edit_services')"/>
      </div>
      <div class="col-sm-4">
        <input class="input price-input" name="price" value="${services[item].price}" onclick="shake('edit_services')"/>
      </div>
      <div class="col-sm-4">
        <input class="input lenght-input" name="length_" value="${services[item].length_}" onclick="shake('edit_services')"/>
      </div>
    </div>  
    `;
  }
  document.getElementById("body-info").append(div);
  document.getElementById("body-info").style.textAlign = 'center';
  document.getElementById("body-info").style.display = 'block';
}

function showAllOrders(orders) {

  const clients = JSON.parse(sessionStorage.getItem('clients'));
  const div = document.createElement('div');
  div.id = 'info-order-block';
  document.getElementById('li_start').style.display = 'none';
  document.getElementById('fa-add-order').style.display = 'block';

  for (item in orders) {
    orders[item]['client_data'] = clients.filter((cl) => { if (cl.id === orders[item].id_client) { return cl } });
    div.innerHTML += `
          <div class="row row-edit-service" id="${orders[item].id_order}">
              <p class="output order" onclick="show_hide(this, 'orders');"> 
                ${fa_vector} [ ${orders[item].time_order.slice(0, -3)} ] - ${orders[item].client_data[0].name_client}
              </p>
              <div class="order-data">
                <ul class="list-order">
                  <hr>
                  <li class="list-order-opt">Послуга: ${orders[item].service_order.replace(/["]/g, "")}</li>
                  <li class="list-order-opt">Ціна: ${orders[item].price_order}</li>
                  <li class="list-order-opt">тривалість: ${orders[item].length_order}</li>
                  <li class="list-order-opt">мастер: ${orders[item].name_master}</li>
                  <li class="errorcode order-btn-edit fa-beat-fade" onclick="editOrder(${orders[item].id_order})"> редагувати </li>
                  <hr>
                </ul>
              </div>
          </div>`;
  }

  sessionStorage.setItem('show_orders', JSON.stringify(orders));

  document.getElementById("body-info").append(div);
  document.getElementById("body-info").style.textAlign = 'center';
  document.getElementById("body-info").style.display = 'block';

}


function editOrder(id) {

  document.getElementById('info-order-block').style.display = 'none';
  const div_edit = document.createElement('div');
  div_edit.id = 'edit-order-menu';

  div_edit.innerHTML = `
    <ul class="list-order-menu">
      <li class="errorcode order-btn-edit" onclick="editMaster()"> змінити майстра </li>
      <li class="errorcode order-btn-edit" onclick="editFullOrder(${id})"> редагувати дані</li>
      <li class="errorcode order-btn-edit-dell" onclick="dellOrder(${id})"> видалити </li>
    </ul>
  `;

  document.getElementById("body-info").append(div_edit);

}

function dellOrder(id) {

  const orders = JSON.parse(sessionStorage.getItem("show_orders"));
  const order = orders.filter(obj => { if (obj.id_order === id) { return obj } });
  sessionStorage.setItem('order_for_dell', JSON.stringify(order[0]));

  document.getElementById('edit-order-menu').style.display = 'none';
  document.getElementById('warning').style.display = 'block';
  document.getElementById('header-warning-2').innerHTML = `видалити запис ?`;
  document.getElementById('option-warning-1').innerHTML = `<i class="fa-regular fa-clock fa-beat-fade" style="color: #73ff00;"></i> ${order[0].time_order.slice(0, -3)}`;
  document.getElementById('option-warning-2').innerHTML = `<i class="fa-regular fa-user fa-beat-fade" style="color: #73ff00;"></i> ${order[0].client_data[0].name_client}`;
  document.getElementById('option-warning-3').innerHTML = `<i class="fa-solid fa-list fa-beat-fade" style="color: #11ff00;"></i> ${order[0].service_order.replace(/["]/g, "")}`;
}

function ordersWarningExit() {

  document.getElementById('warning').style.display = 'none';
  document.getElementById('edit-order-menu').style.display = 'block';

}

function ordersWarningCheck() {

  const order = JSON.parse(sessionStorage.getItem('order_for_dell'));
  console.log(order);
  fetch('/dell_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  })
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      document.getElementById('warning').style.display = 'none';
      document.getElementById('body-info').innerHTML = '';
      showAllOrders(data);
    });
}

//shake element for say user about change
function shake(type = 'null') {
  if (type === 'edit_services') {
    document.getElementById('fa-check').style.display = 'block';
  } else if (type === 'edit_clients') {
    document.getElementById('fa-check-clients_edit').style.display = 'block';
  }
}

function show_hide(elem, id) {
  const div = elem.nextElementSibling;
  let divs;
  if (id === 'services') {
    divs = document.getElementsByClassName('info-service');
  } else if (id === 'clients') {
    divs = document.getElementsByClassName('client_input');
  } else if (id === 'orders') {
    divs = document.getElementsByClassName('order-data');
  }

  for (let i = 0; i < divs.length; i++) { divs[i].classList.remove('active') }
  div.classList.add('active');
}


function back() {
  document.getElementById('fa-back').style.display = 'none';
  document.getElementById('fa-check').style.display = 'none';
  document.getElementById('fa-search').style.display = 'none';
  document.getElementById('fa-add-service').style.display = 'none';
  document.getElementById('fa-add-order').style.display = 'none';
  document.getElementById('fa-add-client').style.display = 'none';
  document.getElementById('body-info').innerHTML = '';
  document.getElementById('li_start').style.display = 'block';
}

function check(type) {

  if (type === 'edit_services') { editService() }
  else if (type === 'edit_clients') { editClient() }


}

function editClient() {

  document.getElementById('fa-check-clients_edit').style.display = 'none';
  //get all rows with class row-edit-service
  const rows = document.getElementsByClassName('client_input');
  const id_clients = document.getElementsByClassName('id_client_for_edit');

  const data = {};
  for (let i = 0; i < rows.length; i++) {
    data[id_clients[i].value] = {};
    const inputs = rows[i].getElementsByClassName('data-clients');
    for (let j = 0; j < inputs.length; j++) {
      data[id_clients[i].value][inputs[j].name] = inputs[j].value;
    }
  }
  console.log(data);
  //send data to server
  fetch('/edit_clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      showProgressBar();
      document.getElementById('body-info').innerHTML = '';
      showAllClients(data);
    });
}

function editService() {
  document.getElementById('fa-check').style.display = 'none';
  //get all rows with class row-edit-service
  const rows = document.getElementsByClassName('row-edit-service');

  const data = {};
  for (let i = 0; i < rows.length; i++) {
    data[rows[i].id] = {};
    const inputs = rows[i].getElementsByClassName('input');
    for (let j = 0; j < inputs.length; j++) {
      data[rows[i].id][inputs[j].name] = inputs[j].value;
    }
  }

  //send data to server
  fetch('/edit_services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      showProgressBar();
      document.getElementById('body-info').innerHTML = '';
      showAllServicesEdit(data);
    });
}

function showProgressBar() {

  block_progress.style.display = 'block';
  progressPercent = 0;

  setInterval(() => {
    if (progressPercent < 100) {
      progressPercent++;
      progressBar.style.width = progressPercent + '%';
    } else {
      block_progress.style.display = 'none';
      clearInterval();
    }
  }, 30);
}

function getAllClients() {
  fetch('/clients')
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      sessionStorage.setItem('clients', JSON.stringify(data));
      return data;
    })
    .catch(error => console.error('Ошибка:', error));
}

function showAllClients(clients) {

  document.getElementById('li_start').style.display = 'none';
  const body_info = document.getElementById('body-info');
  const div = document.createElement('div');
  div.className = 'info-client';


  for (item in clients) {
    div.innerHTML += `
    <p class="output client" onclick="show_hide(this, 'clients');"> ${fa_vector} ${clients[item].name_client}</p>
    <div class="client_input">
      <ul class="list-info-client">
      <input class="input id_client_for_edit" type="hidden" name="id" value="${clients[item].id}"/>
        <input class="input data-clients" type="hidden" name="id" value="${clients[item].id}"/>
        <input class="input data-clients" name="name_client" value="${clients[item].name_client}" onclick="shake('edit_clients')"/>
        <input class="input data-clients" name="phone_client" value="${clients[item].phone_client}" onclick="shake('edit_clients')"/>
        <input class="input data-clients" name="about_client" value="${clients[item].about_client}" onclick="shake('edit_clients')"/>
        <input class="input data-clients history-client" name="history" value="${clients[item].history}" onclick="shake('edit_clients')"/>
      </ul>
    </div>
    `;

    body_info.append(div);
    document.getElementById("body-info").style.textAlign = 'left';
    body_info.style.display = 'block';
    document.getElementById('fa-search').style.display = 'block';
    document.getElementById('fa-add-service').style.display = 'none';
    document.getElementById('fa-add-client').style.display = 'block';

  }


}


function search() {
  console.log('search');
}

function addService() {

  const row_edit_service = document.getElementsByClassName('row-create-service');
  const inputsInsideRow = row_edit_service[0].querySelectorAll('input');
  for (let i = 0; i < inputsInsideRow.length; i++) { inputsInsideRow[i].value = '' }

  document.getElementById('body-info').style.display = 'none';
  document.getElementById('custom-alert').style.display = 'block';
  document.getElementById('fa-add-service').style.display = 'none';
}


function addClient() {

  const row_add_client = document.getElementsByClassName('row-create-client');
  const inputsInsideRow = row_add_client[0].querySelectorAll('input');
  for (let i = 0; i < inputsInsideRow.length; i++) { inputsInsideRow[i].value = '' }

  document.getElementById('body-info').style.display = 'none';
  document.getElementById('custom-alert-add-client').style.display = 'block';
  document.getElementById('fa-add-client').style.display = 'none';
}

function closeCustomAlert(type = 'fa-add-service', custom_alert = 'custom-alert') {
  document.getElementById(custom_alert).style.display = 'none';
  document.getElementById('body-info').style.display = 'block';
  document.getElementById(type).style.display = 'block';
  document.getElementById('fa-back').style.display = 'block';
}

function saveCustomAlert() {

  const row_edit_service = document.getElementsByClassName('row-create-service');
  const inputsInsideRow = row_edit_service[0].querySelectorAll('input');
  const data = {};
  for (let i = 0; i < inputsInsideRow.length; i++) { data[inputsInsideRow[i].name] = inputsInsideRow[i].value }

  fetch('/add_service', {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      document.getElementById('custom-alert').style.display = 'none';
      document.getElementById('body-info').innerHTML = '';
      showAllServicesEdit(data);
    })

    .catch(error => console.error('Ошибка:', error));

}

function saveCustomAlertAddCl() {

  const row_add_client = document.getElementsByClassName('row-create-client');
  const inputsInsideRow = row_add_client[0].querySelectorAll('input');
  const data = {};
  for (let i = 0; i < inputsInsideRow.length; i++) { data[inputsInsideRow[i].name] = inputsInsideRow[i].value }

  console.log(data);
  fetch('/add_client', {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      document.getElementById('custom-alert-add-client').style.display = 'none';
      document.getElementById('body-info').innerHTML = '';
      showAllClients(data);
    })

    .catch(error => console.error('Ошибка:', error));

}


function getAllMasters() {

  fetch('/masters')
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      sessionStorage.setItem('masters', JSON.stringify(data));
      return data;
    })
    .catch(error => console.error('Ошибка:', error));

}

function getAllServices() {

  fetch('/services')
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных
      sessionStorage.setItem('services', JSON.stringify(data));
      return data;
    })
    .catch(error => console.error('Ошибка:', error));

}

function addOrder() {


  checkMasterWorkDay(new Date().toISOString().slice(0, 10));

  document.getElementById('body-info').style.display = 'none';
  document.getElementById('fa-add-order').style.display = 'none';
  document.getElementById('fa-back').style.display = 'none';

  const dateInput = document.getElementById('date-input');
  const masterInput = document.getElementById('master-order-input');


  dateInput.value = new Date().toISOString().slice(0, 10);
  checkMasterService();
  document.getElementById('add-order').style.display = 'block';


  dateInput.addEventListener('input', function () { checkMasterWorkDay(dateInput.value); checkMasterService(); });
  masterInput.addEventListener('input', function () { checkMasterService() });

}

function checkMasterWorkDay(selectedDate) {


  const select_master = document.getElementById('master-order-input');
  const masters = JSON.parse(sessionStorage.getItem('masters'));

  const masters_work_in_date = [];

  for (mas of masters) {
    const work_day = JSON.parse(mas.work_day);
    if (Object.keys(work_day).includes(selectedDate)) {
      masters_work_in_date.push(mas);
    }
  }

  select_master.innerHTML = '';
  if (masters_work_in_date.length === 0) {
    const option = document.createElement('option');
    option.value = 'майстрів на цей день немає';
    option.innerHTML = 'майстрів на цей день немає';
    select_master.append(option);
  } else {
    for (let i = 0; i < masters_work_in_date.length; i++) {
      const option = document.createElement('option');
      option.value = masters_work_in_date[i].id_master;
      option.innerHTML = masters_work_in_date[i].name_master;
      select_master.append(option);
    }
  }

}

function checkMasterService() {



  const services = JSON.parse(sessionStorage.getItem('services'));
  const select_service = document.getElementById('service-order-input');
  const master_select = document.getElementById('master-order-input').value;
  const masters = JSON.parse(sessionStorage.getItem('masters'));



  select_service.innerHTML = '';

  if (master_select === 'майстрів на цей день немає') {
    for (let i = 0; i < services.length; i++) {
      const option = document.createElement('option');
      option.value = services[i].id;
      option.innerHTML = services[i].name_service;
      select_service.append(option);
    }
  } else {

    let services_from_selected_master = [];

    for (mas of masters) {
      console.log("mas.id_master" + mas.id_master);
      console.log("master_select" + master_select);
      if (mas.id_master == master_select) {
        const serv = JSON.parse(mas.service);
        services_from_selected_master = Object.keys(serv);
        break;
      }
    }
    console.log("services_from_selected_master" + services_from_selected_master);

    for (let i = 0; i < services.length; i++) {
      if (services_from_selected_master.includes(services[i].name_service)) {
        const option = document.createElement('option');
        option.value = services[i].id;
        option.innerHTML = services[i].name_service;
        select_service.append(option);
      }
    }


  }

}
