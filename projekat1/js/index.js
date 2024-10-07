
function bodyLoaded() {
    loadDepartments();
}

function loadDepartments() {
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments')
        .then(response => response.json())
        .then(json_resp => {
            let first = true;

            json_resp.departments.forEach(department => {
                let id = 'dept' + department.departmentId;
                let name = department.dispayName;

                let cat_html = `<div class="carousel-item ${first ? 'active' : ''}">
                                <img src="https://cataas.com/cat/${cat._id}" class="d-block w-100">
                                <div class="carousel-caption d-none d-md-block">
                                  <h5>Tags</h5>
                                  <p>${tags}</p>
                                </div>
                              </div>`;

                first = false;

                document.getElementById('cats').innerHTML += cat_html;
            });
        });
}