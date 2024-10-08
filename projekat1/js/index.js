function bodyLoaded() {
    loadDepartments();
}

function loadDepartments() {
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments')
        .then(response => response.json())
        .then(json_resp => {
            json_resp.departments.forEach(department => {
                let id = department.departmentId;
                let name = department.displayName;

                let dept_nav_html = `
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="search.html/deptId=${id}" tag="dept${id}">${name}</a>
                    </li>`;

                document.getElementById('depts_nav').innerHTML += dept_nav_html;
            });
        });
}