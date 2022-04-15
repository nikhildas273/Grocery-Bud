// ****** SELECT ITEMS **********

const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option

let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********

form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItems);
// ****** FUNCTIONS **********

function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = Math.floor(Math.random() * 1000) + 1;
  if (value && !editFlag) {
    createListItem(id, value);
    container.classList.add('show-container');
    displayAlert('Item Added to list');
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.textContent = value;
    displayAlert('Item is Changed', 'success');
    editToLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert('Please Enter an Item', 'danger');
  }
}

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(() => {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

function clearItems() {
  const items = document.querySelectorAll('.grocery-item');

  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  container.classList.remove('show-container');
  displayAlert('Empty List', 'danger');
  setBackToDefault();
  localStorage.removeItem('list');
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove('show-container');
  }
  displayAlert('Item Removed', 'danger');
  setBackToDefault();
  removeFromLocalStorage(id);
}
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;

  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.textContent;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = 'edit';
}

function setBackToDefault() {
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'submit';
}
// ****** LOCAL STORAGE **********

function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== Number(id)) {
      return item;
    }
  });
  console.log(items);
  localStorage.setItem('list', JSON.stringify(items));
}
function editToLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === Number(id)) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem('list', JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}
// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    container.classList.add('show-container');
  }
}

function createListItem(id, value) {
  const element = document.createElement('article');
  element.classList.add('grocery-item');
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
          <div class="btn-container">
            <button class="edit-btn" type="button">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" type="button">
              <i class="fas fa-trash"></i>
            </button>
          </div>`;
  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');
  console.log(deleteBtn, editBtn);
  deleteBtn.addEventListener('click', deleteItem);
  editBtn.addEventListener('click', editItem);
  list.appendChild(element);
}
