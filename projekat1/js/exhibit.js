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

                document.getElementById(`depts_nav`).innerHTML += `
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="search.html?deptId=${id}&deptName=${name}" tag="dept${id}">${name}</a>
                    </li>`;
            });
        });
}

function loadExhibit() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
        .then(response => response.json())
        .then(json_resp => {
            document.getElementById("image").src = json_resp.primaryImageSmall || `img/placeholder.png`;

            const listAttrInnerHTML = document.getElementById("attr_list").innerHTML;
            listAttrInnerHTML = "";

            listAttrInnerHTML += `<li class="list - group - item text-light">title: ${json_resp.title}</li>`;
            listAttrInnerHTML += `<li class="list - group - item text-light">Name: ${json_resp.objectName}</li>`;
            listAttrInnerHTML += `<li class="list - group - item text-light">ID: ${json_resp.objectID}</li>`;
            listAttrInnerHTML += `<li class="list - group - item text-light">department: ${json_resp.department}</li>`;
            listAttrInnerHTML += `<li class="list - group - item text-light">Highlighted: ${json_resp.isHighlight}</li>`;
            listAttrInnerHTML += `<li class="list - group - item text-light">public domain: ${json_resp.isPublicDomain}</li>`;
        });
}