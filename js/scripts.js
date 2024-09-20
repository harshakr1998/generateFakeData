// Add a new dropdown field for data selection
function addField() {
    const fieldContainer = document.getElementById('fieldContainer');
    const newField = `
      <div class="row mb-3">
        <div class="col-md-8">
          <select class="form-select dataType">
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="phone">Phone Number</option>
            <option value="company">Company Name</option>
            <option value="date">Date</option>
            <option value="internet">Username</option>
          </select>
        </div>
        <div class="col-md-2 align-self-end">
          <button type="button" class="btn btn-danger" onclick="removeField(this)">Remove</button>
        </div>
      </div>`;
    fieldContainer.insertAdjacentHTML('beforeend', newField);
  }

  // Remove a data field row
  function removeField(button) {
    const fieldRow = button.closest('.row');
    fieldRow.remove();
  }

  // Generate fake data based on selected types
  function generateData() {
    const selectedTypes = Array.from(document.querySelectorAll('.dataType')).map(select => select.value);
    const quantity = document.getElementById('quantity').value;
    let data = [];

    for (let i = 0; i < quantity; i++) {
      let item = {};
      if (selectedTypes.includes('name')) item.name = faker.name.findName();
      if (selectedTypes.includes('email')) item.email = faker.internet.email();
      if (selectedTypes.includes('address')) item.address = faker.address.streetAddress();
      if (selectedTypes.includes('phone')) item.phone = faker.phone.phoneNumber();
      if (selectedTypes.includes('company')) item.company = faker.company.companyName();
      if (selectedTypes.includes('date')) item.date = faker.date.past().toLocaleDateString();
      if (selectedTypes.includes('internet')) item.username = faker.internet.userName();
      data.push(item);
    }

    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
  }

  function copyToClipboard() {
    const output = document.getElementById('output').textContent;
    navigator.clipboard.writeText(output).then(() => alert('Copied to clipboard'));
  }

  function downloadData(format) {
    const data = JSON.parse(document.getElementById('output').textContent);
    let fileContent, fileName;

    if (format === 'json') {
      fileContent = JSON.stringify(data, null, 2);
      fileName = 'fake_data.json';
      downloadFile(fileContent, fileName, 'application/json');
    } else if (format === 'csv') {
      fileContent = convertToCSV(data);
      fileName = 'fake_data.csv';
      downloadFile(fileContent, fileName, 'text/csv');
    } else if (format === 'excel') {
      convertToExcel(data);
    }
  }

  function convertToCSV(data) {
    const keys = Object.keys(data[0]);
    const csvRows = [keys.join(',')];
    data.forEach(item => {
      csvRows.push(keys.map(key => item[key]).join(','));
    });
    return csvRows.join('\n');
  }

  function convertToExcel(data) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'fake_data.xlsx');
  }

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }