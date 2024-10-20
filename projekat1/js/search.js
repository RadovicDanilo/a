function bodyLoaded() {
    loadDepartments();
    search();
}

function loadDepartments() {
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments')
        .then(response => response.json())
        .then(json_resp => {
            json_resp.departments.forEach(department => {
                const id = department.departmentId;
                const name = department.displayName;

                document.getElementById(`depts_nav`).innerHTML += `
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="search.html?deptId=${id}&deptName=${name}" tag="dept${id}">${name}</a>
                    </li>`;
            });
        });
}

function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has('query')) {
        const query = urlParams.get('query');
        console.log("query = " + query);
        document.getElementById('search_heading').innerHTML = 'search: ' + query;
        searchQuery(query);
    } else if (urlParams.has('deptId')) {
        const deptId = urlParams.get('deptId');
        const deptName = urlParams.get('deptName');
        console.log("deptId = " + deptId);
        console.log("deptName = " + deptName);
        document.getElementById('search_heading').innerHTML = 'department: ' + deptName;
        searchDepartment(deptId);
    }
}

const itemsPerPage = 10;
let currentPage = 1;
let pageCount = 0;
let itemCount = 0;
let objectIds = [];

function searchQuery(query) {
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`)
        .then(response => response.json())
        .then(json_resp => {
            loadResults(json_resp);
        });
}

function searchDepartment(deptId) {
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${deptId}`)
        .then(response => response.json())
        .then(json_resp => {
            loadResults(json_resp);
        });
}

function loadResults(json_resp) {
    console.log(json_resp);
    itemCount = json_resp.total;
    pageCount = Math.ceil(itemCount / itemsPerPage);
    currentPage = 1;
    objectIds = json_resp.objectIDs;
    loadObjects();
}

function loadObjects() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, objectIds.length);
    document.getElementById(`exhibits`).innerHTML = ``;

    for (let i = startIndex; i < endIndex; i++) {
        let id = objectIds[i];
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
            .then(response => response.json())
            .then(json_resp => {
            document.getElementById(`exhibits`).innerHTML += `
                <div class="col-6 col-md-2">
                    <a href="exhibit.html?id=${id}" class="card m-2" style="text-decoration: none;">
                         <div class="imgbox">
                            <img src="${json_resp.primaryImageSmall || 'img/placeholder.png'}" class="center-fit">
                        </div>
                        <div class="card-body">
                             <h5 class="card-title">${json_resp.title || 'No Title'}</h5>
                        </div>
                    </a>
                 </div>`;
            });
    }
    loadPagination();
}

function loadPagination() {
    document.getElementById('exhibit_pegination').innerHTML = ``;

    for (let i = 1; i <= pageCount; i++) {
        document.getElementById('exhibit_pegination').innerHTML += `
        <li class="page-item  ${currentPage === i ? 'active' : ''}">
            <a class="page-link " href="#" onclick="changePage(${i})">${i}</a>
        </li>`
    }
}

function changePage(page) {
    currentPage = page;
    loadObjects();
}