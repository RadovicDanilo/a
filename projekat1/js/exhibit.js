function bodyLoaded() {
    loadDepartments();
    loadExhibit();
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
                        <a class="nav-link active" aria-current="page" href="search.html?deptId=${id}&deptName=${name}" tag="dept${id}">${name}</a>
                    </li>`;

                document.getElementById('depts_nav').innerHTML += dept_nav_html;
            });
        });
}

function loadExhibit() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
        .then(response => response.json())
        .then(artwork => {
            document.getElementById("image").src = artwork.primaryImageSmall || `img/placeholder.png`;
            const listAttr = document.getElementById("attr_list");
            listAttr.innerHTML = "";
            listAttr.innerHTML += `<li class="list - group - item text-light">title: ${artwork.title}</li>`;
            listAttr.innerHTML += `<li class="list - group - item text-light">Name: ${artwork.objectName}</li>`;
            listAttr.innerHTML += `<li class="list - group - item text-light">ID: ${artwork.objectID}</li>`;
            listAttr.innerHTML += `<li class="list - group - item text-light">department: ${artwork.department}</li>`;
            listAttr.innerHTML += `<li class="list - group - item text-light">Highlighted: ${artwork.isHighlight}</li>`;
            listAttr.innerHTML += `<li class="list - group - item text-light">public domain: ${artwork.isPublicDomain}</li>`;
        });
}