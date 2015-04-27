var originalGistList = [];
var favoriteGistList = [];
var settings = null;

function findById(gistId) {
    var i, gist;
    for (i = 0; i < originalGistList.length; i += 1) {
        if (originalGistList[i].id === gistId) {
            gist = originalGistList[i];
            return gist;
        }
    }
    return null;
}

function setLocalSettings () {
	var str = localStorage.getItem('userSettings');
	if (str === null) {
		settings = {favoriteGistList};
		localStorage.setItem('userSettings', JSON.stringify(settings));
	}
	else {
		settings = {favoriteGistList};
		localStorage.setItem('userSettings', JSON.parse(settings));
	}
}

function removeGist(ul, index) {
	var parent = document.getElementById('original');
	parent.removeChild(parent.childNodes[index]);
}

function addFavList(ul) {
	var li = document.createElement('li');
	li.appendChild(dlGist(favoriteGistList[favoriteGistList.length-1]));
	ul.appendChild(li);
}

function dlEntry(term, definition, gist) {
    var dt = document.createElement('dt');
    var dd = document.createElement('dd');
    dt.innerText = term;
    dd.innerText = definition;
    
	// add button next to each gist
	var fbutton = document.createElement("button");
	fbutton.innerHTML = "Add to Favorites";
	fbutton.setAttribute("id", gist.id);

	fbutton.onclick = function () {
		var	toBeFavoredGist = findById(gist.id);
		for (var i = 0; i < originalGistList.length; i += 1) {
			if (originalGistList[i] != null && toBeFavoredGist != null && originalGistList[i].id != null && toBeFavoredGist.id != null) {	
				if (originalGistList[i].id == toBeFavoredGist.id) {
				
					favoriteGistList.push(JSON.stringify(toBeFavoredGist));
					addFavList(document.getElementById('favored'));
					removeGist(document.getElementById('original'), i);
					setLocalSettings();
				}
			}
		}
	};
    return {'dt': dt, 'dd': dd, 'button': fbutton};
}

function linkEntry(term, definition) {
	var a = document.createElement('a');
	var dt = document.createElement('dt');
	
	a.innerText = definition;
	a.setAttribute("href", definition);
	dt.innerText = term;

	return {'a': a, 'dt': dt};
}

function dlGist(gist) {
    var lentry = linkEntry('URL: ', gist.url);
	var dl = document.createElement('dl');
	dl.appendChild(lentry.dt);
    dl.appendChild(lentry.a);
	
    var dlentry = dlEntry('Description: ', gist.description, gist);
	dl.appendChild(dlentry.dt);
    dl.appendChild(dlentry.dd);
	dl.appendChild(dlentry.button);
	
    return dl;
}

function createGistList(ul) {
    originalGistList.forEach(function (g) {
        var li = document.createElement('li');
        li.appendChild(dlGist(g));
        ul.appendChild(li);
    });
}

var generateGistHtml = function (gist) {
    if (gist.description) {    
		originalGistList.push(gist);
    }
};

var fetchData = function () {
    // XMLHttpRequest here
    var httpReq, url = "https://api.github.com/gists/public";

    // acceptable request?
    if (window.XMLHttpRequest) {
        httpReq = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        httpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (!httpReq) {
        throw 'Unable to create HttpRequest.';
    }
	
    // on requestStateChange, generate gist HTML
    httpReq.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var gist = JSON.parse(this.responseText);
                for (var i = 0; i < gist.length; i += 1) {
				    generateGistHtml(gist[i]);   
				}
            }
        }
	createGistList(document.getElementById('original'));
    };
	
    httpReq.open('GET', url);
    httpReq.send();
};

window.onload = function () {
	setLocalSettings();
}
