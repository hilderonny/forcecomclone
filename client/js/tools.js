function $createRequest(url, method, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    if (App.token) xhr.setRequestHeader("x-access-token", App.token);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText));
        } else {
            if (xhr.status === 401) App.isloggedin = false;
            callback(xhr.status);
        }
        App.iswaiting = false;
    };
    App.iswaiting = true;
    return xhr;
}

function $get(url, callback) {
    $createRequest(url, "GET", callback).send();
}

function $post(url, data, callback) {
    $createRequest(url, "POST", callback).send(JSON.stringify(data));
}
