const fileInputButton = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const fileNameInput = document.getElementById('fileNameInput');
const encryptionKeyInput = document.getElementById('encryptionInput');
const encryptionErrorElement = document.getElementById('encryptionError');
let fileToUpload;
let userEnteredEncryptionKey = '';
let encryptionKey;

const getKey = async () => {
  await fetch('http://localhost:8000/encryptionKey', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async res => {
      const { data } = await res.json();
      encryptionKey = data;
    })
    .catch(err => ('Error', err));
};

const saveFile = async file => {
  let formData = new FormData();
  formData.append('file', file, file.name);
  var cipherText = CryptoJS.AES.encrypt(JSON.stringify(formData), userEnteredEncryptionKey).toString();

  await fetch('http://localhost:8000/myServer', {
    method: 'POST',
    body: cipherText,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then(res => {
      const isSuccess = res.ok;
      insertFileToTable({ isSuccess, data: file });
      console.log(res);
    })
    .catch(err => ('Error', err));
};

const insertFileToTable = ({ isSuccess = false, data = null }) => {
  if (!fileToUpload) {
    return;
  }
  const date = new Date();
  var tbody = document.getElementById('tbody');
  let row = document.createElement('tr');

  let c1 = document.createElement('td');
  let c2 = document.createElement('td');
  let c3 = document.createElement('td');

  c1.innerText = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
  c2.innerText = data.name;
  c3.innerHTML = isSuccess ? '<img src="/images/tick.png" />' : '<img src="/images/reupload.png" />';

  row.appendChild(c1);
  row.appendChild(c2);
  row.appendChild(c3);

  tbody.appendChild(row);

  fileInputButton.value = '';
  fileNameInput.value = '';
  fileToUpload = null;
};

fileInputButton.addEventListener('change', function(event) {
  const fileSizeErrorElement = document.getElementById('fileSizeError');

  fileToUpload = event.target.files[0];
  fileNameInput.value = fileToUpload.name;
  const fileSize = fileToUpload.size;
  const fileSizeInKb = Math.round(fileSize / 1024);

  if (fileSizeInKb < 100 || fileSizeInKb > 20000) {
    fileSizeErrorElement.innerHTML = 'File size must be 0.1 MB to 20 MB';
    fileSizeErrorElement.style.display = 'block';
    uploadButton.setAttribute('disabled', '');
  } else {
    encryptionErrorElement.style.display = 'none';
    fileSizeErrorElement.style.display = 'none';
    uploadButton.removeAttribute('disabled');
  }
});

encryptionKeyInput.addEventListener('keyup', function(event) {
  userEnteredEncryptionKey = event.target.value;
});

uploadButton.addEventListener('click', function() {
  if (userEnteredEncryptionKey !== encryptionKey) {
    encryptionErrorElement.innerHTML = userEnteredEncryptionKey === '' ? 'Enter encryption key' : 'Encryption key is incorrect';
    encryptionErrorElement.style.display = 'block';
    return;
  }
  encryptionErrorElement.style.display = 'none';
  const filesTable = document.getElementsByClassName('filesTable');
  const gdMessage = document.getElementsByClassName('gdMessage');
  filesTable[0].style.display = 'block';
  gdMessage[0].style.display = 'none';
  saveFile(fileToUpload);
});
