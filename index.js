var fs = require('fs');

var docData;
var pages = [];
var reset = [];
var active = null;
var closing = false;
var numnum = 0;

function page(name, path, contents, size) {
    this.name = name;
    this.path = path;
    this.contents = contents;
    this.size = size;
    this.num = numnum;
    numnum++;
    this.closed = false;
    active = this;

    pages.push(this);

    var fullpage = document.getElementById('fullpage');

    var doc = document.createElement('DIV');
    doc.id = "page" + this.num.toString();
    doc.className = "page";
    

    var top = document.createElement('DIV');
    top.className = "pagetop";
    top.id = "top" + this.num.toString();
    top.appendChild(document.createTextNode(this.name));
    top.onclick = function() {
        var str = "";
        var idStr = this.id;
        for (var i = 0; i < idStr.length; i++) {
            if (i >= 3) {
                str = str + idStr.charAt(i);
            }
        }
        var num = parseInt(str);
        
        var that;
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].num == num) {
                that = pages[i];
            }
        }
        active = that;
        activeCheck();
    }

    var text = document.createElement('TEXTAREA');
    text.className = "pagetext";
    text.id = "text" + this.num.toString();
    text.value = this.contents;
    
    doc.appendChild(top);
    fullpage.appendChild(doc);
    fullpage.appendChild(text);

    document.getElementById("text" + this.num.toString()).style.height = window.innerHeight - 40 + "px";
    document.getElementById("text" + this.num.toString()).style.width = (window.innerWidth * .9999) - 10 + "px";
    document.getElementById("page" + this.num.toString()).style.left = (((pages.length - 1) * 150) + 5) + "px";
    document.getElementById("top" + this.num.toString()).style.background = "rgb(40,40,40)";
    activeCheck();
}

function activeCheck() {
    var num = active.num;
    for (var i = 0; i < pages.length; i++) {
        var p = pages[i];
        if (num != p.num) {
            document.getElementById("text" + p.num.toString()).style.visibility = "hidden";
            document.getElementById("top" + p.num.toString()).style.background = "rgb(60,60,60)";
        } else {
            document.getElementById("text" + p.num.toString()).style.visibility = "visible";
            document.getElementById("top" + p.num.toString()).style.background = "rgb(40,40,40)";
        }
    }
}

function clickFile() {
    document.getElementById('file').click();
}

function changeFile(e) {
    var input = e.srcElement.files[0];
    
    var reader = new FileReader();
    reader.onload = function() {
        var result = reader.result;
        docData = result;
        new page(input.name, input.path, result, input.size);
    }
    var text = reader.readAsText(input);
}

function createName() {
    document.getElementById("fullpage").style.display = "none";
    document.getElementById("fileask").style.display = "block";
}

function clickFolder() {
    document.getElementById("folder").click();
}

function selectFolder(e) {
    var input = e.srcElement.files[0];
    createFile(input, document.getElementById("filename").value);
}

function sizing(size) {
    if (size < 1024) {
        return size + " bytes";
    } else if (size / 1024 < 1024) {
        return (size / 1024).toFixed(2) + " kilobytes";
    } else if (size / (1024 * 1024) < 1024) {
        return (size / (1024 * 1024)).toFixed(2) + " megabytes";
    } else if (size / (1024 * 1024 * 1024) < 1024) {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + " gigabytes";
    }
}

function closeFile() {
    closing = true;
    var fullpage = document.getElementById('fullpage');

    fullpage.removeChild(document.getElementById("page" + active.num.toString()));
    fullpage.removeChild(document.getElementById("text" + active.num.toString()));
    var pageList = document.getElementsByClassName("page");

    active.closed = true;

    for (var i = 0; i < pageList.length; i++) {
        pageList[i].style.left = ((i * 150) + 5) + "px";
    }
    for (var i = 0; i < pages.length; i++) {
        if (!pages[i].closed) {
            reset.push(pages[i]);
        }
    }
    pages = [];
    for (var i = 0; i < reset.length; i++) {
        pages.push(reset[i]);
    }
    reset = [];
    if (pages.length > 0) {
        active = pages[0];
        activeCheck();
    } else {
        active = null;
    }
    closing = false;
}

function saveFile() {
    var text = document.getElementById("text" + active.num.toString()).value;
    var top = document.getElementById("top" + active.num.toString());
    fs.writeFile(active.path, text, function(err) {
        if (err) throw err;
        top.style.borderLeftColor = "white";
        active.contents = text;
    });
}

function createFile(file, name) {
    console.log(file.path);
    fs.writeFile(file.path + "\\" + name, "", function(err){
        if (err) throw err;
        console.log("New File");
    });
    new page(name, file.path + "\\" + name, "", 0);
    document.getElementById("fullpage").style.display = "block";
    document.getElementById("fileask").style.display = "none";
}

function deleteFile() {
    fs.unlink(active.path, function(err) {
        if (err) throw err;
    });
    closeFile();
}