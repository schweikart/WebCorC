// TODO: get the current file out of working Object (like workingDirectory)
var currentlyOpenedFile = "";
var workingDirectory = "";

function setListenerToTreeview() {
    let treeToggler = document.getElementsByClassName("folder");
    let i;

    for (i = 0; i < treeToggler.length; i++) {
        treeToggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("folder-down");
            toggleFolder(this.id, this.innerText);
        });
    }
}

function toggleFolder (fullFolderPath, folderName){
    // console.log(fullFolderPath +"  - "+ folderName);
    // let treePath = fullFolderPath.split("/");
    // let jsonElement = workingDirectory;
    // for (let i = 1; i<treePath.length; i++){
    //     //TODO! json is not build like this x)
    //     if (jsonElement[i-1].FolderName === treePath[i]){
    //         jsonElement = jsonElement[i-1].FolderContent;
    //     }
    // }
    // if (jsonElement.isOpened ){
    //     jsonElement.isOpened = false;
    // }
    // else{
    //     jsonElement.isOpened = true;
    // }
}

function createFolder(name = "defaultFolder", parentFolderId = "treeView", path) {
    //TODO: other ids than names -> also a problem with spaces
    // use path plus name as id, also eliminate
    if(name === "defaultFolder"){
        name = path + window.prompt("Folder name pleeaaase");
    }

    let folder = document.createElement("li");
    folder.classList.add("corc-ellipsis");
    folder.id = path + name + "Folder";

    let folderSpan = document.createElement("span");
    folderSpan.classList.add("folder");
    folderSpan.id = path + name;
    folderSpan.innerHTML = name;

    let folderInside = document.createElement("ul");
    folderInside.classList.add("nested");
    folderInside.id = path + name + "FolderInside"

    folder.appendChild(folderSpan);
    folder.appendChild(folderInside);

    if (parentFolderId === "treeView"){
        document.getElementById(parentFolderId).appendChild(folder);
    }else{
        document.getElementById(parentFolderId + "FolderInside").appendChild(folder);
    }
}


function addFileToTreeviewer(fileName, type, parentFolderId = "treeView") {
    let fileLi = document.createElement("li");
    fileLi.classList.add("corc-ellipsis");
    fileLi.classList.add("corc-file-clickable");
    fileName.replace(/ /g, "_");
    fileLi.id = parentFolderId + "/" + fileName + "." + type;

    fileLi.addEventListener("click", ()=>{fileClicked(fileLi, type, fileName)});

    let icon = document.createElement("i");
    if (type === "java"){
        icon.classList.add("fas","fa-file-code");
    }
    else {
        icon.classList.add("fas","fa-file-image");
    }


    fileLi.appendChild(icon);
    fileLi.innerHTML += " "+ fileName + "." + type;

    // let folderInPath = path.split("/");
    // parentFolder = folderInPath[folderInPath.length-1];
    if(parentFolderId !== "treeView"){
        parentFolderId = parentFolderId + "FolderInside";
    }
    document.getElementById(parentFolderId).appendChild(fileLi);
}

function createDirectory(directoryObject, parentId = "treeView", path = "/") {
    if (parentId !== "treeView"){
        parentId = path + parentId ;
        parentId.replace(/ /g, "_");
    }
    path = parentId + "/";
    // TODO: deliver the path here
    for(let ele in directoryObject){
        if(directoryObject[ele].Type === "Folder"){
            createFolder(directoryObject[ele].FolderName.replace(/ /g, "_"), parentId, path);
            createDirectory(directoryObject[ele].FolderContent, directoryObject[ele].FolderName.replace(/ /g, "_"), path);
        }
        else if(directoryObject[ele].Type === "File"){
            addFileToTreeviewer(directoryObject[ele].FileName.replace(/ /g, "_"), directoryObject[ele].FileType, parentId, path);
        }

    }
}

function initializeTree(treeObject) {
    let directory = JSON.parse(treeObject).directory;
    // let webDirectory;
    let helperFileFolder;
    let proofFolder;
    for (let folder in directory){
        let obj = directory[folder];
        switch (obj.FolderName) {
            case "HelperFiles":
                helperFileFolder = obj.FolderContent;
                break;
            case "ProofData":
                proofFolder = obj.FolderContent;
                break;
            case "WebDirectory":
                workingDirectory = obj.FolderContent;
                break;
        }
    }
    console.log("working directory: " + JSON.stringify(workingDirectory));
    console.log("helper: " + JSON.stringify(helperFileFolder));
    console.log("proofs: " + JSON.stringify(proofFolder));

    createDirectory(workingDirectory);
    setListenerToTreeview();
}

function fileClicked(domElement, type, fileName) {
    let elements = document.getElementsByClassName("corc-file-clicked");
    Array.prototype.forEach.call(elements, function(el) {
        el.classList.remove("corc-file-clicked");
    });
    domElement.classList.add("corc-file-clicked");

    let fullPath = domElement.id;
    console.log(fullPath);

    // if(currentlyOpenedFile !== fullPath) {
        let fileContent = getFile(fullPath.replace("treeView", "WebDirectory"));
        openFile(fileContent, type, fullPath, fileName);
    // }
}

function getCurrentFilePath() {
    return currentlyOpenedFile;
}

