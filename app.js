if (window.XMLHttpRequest) { // Mozilla, Safari, ...
    httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) { // IE
    try {
        httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } 
    catch (e) {
        try {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        } 
        catch (e) {}
    }
}


var url = 'https://api.github.com';

//atrelado ao button GitSearch
function request(){
    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }

    var username = document.getElementById('input').value;

    var userContainer = document.getElementById("userGit");
    userContainer.style.display="none";
    
    clearChildren(document.getElementById("repos"));
    clearChildren(document.getElementById("followers"));
    document.getElementById("followers").style.display="none";

    httpRequest.onreadystatechange = preencheSobre;
    httpRequest.open('GET', url+'/users/'+username);
    httpRequest.send();

    

}

function clearChildren(node){
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}


function preencheSobre(){
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {

            var userContainer = document.getElementById("userGit");
            var userImg = document.getElementById("avatar");
            
            var response = JSON.parse(httpRequest.responseText);
            userImg.src = response.avatar_url;

            var h3 = document.getElementById("name");
            h3.textContent = response.name;

            var h4 = document.getElementById("login");
            h4.textContent = response.login;

            userContainer.style.display = "block";

            document.getElementById("escondido").value=response.followers_url;

            document.getElementById("countFollower").textContent=response.followers;
            document.getElementById("countFollower").style.display="inline";
            
            //Get repositories of the user
            httpRequest.onreadystatechange = preencheRepositorio;
            httpRequest.open('GET', response.repos_url);
            httpRequest.send();
            

        } else {
            alert('There was a problem with the request.');
        }
    }
}


function preencheRepositorio(){
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
            

            var response = JSON.parse(httpRequest.responseText);
            var containerRepos = document.getElementById("repos");

            for(var i=0; i<response.length; i++){
                var repos = document.createElement("a");
                repos.className="container-repository";
                repos.href=response[i].html_url;


                var h3 = document.createElement("h3");
                h3.className="h3-name-repository";
                h3.textContent=response[i].name;

                repos.appendChild(h3);

                var divLanguage = document.createElement("div");
                divLanguage.className="container-language";


                var span = document.createElement("span");
                span.textContent=response[i].language;
                
                var img = document.createElement("img");
                img.className="img-circulo";
                img.src="images/circulo.png";


                var divimg = document.createElement("div");
                divimg.className="container-img";

                divimg.appendChild(img);

                divLanguage.appendChild(span);
                if(response[i].language!=null){
                    divLanguage.appendChild(divimg);
                    repos.appendChild(divLanguage);
                }else
                    h3.style.margin="auto";
                
                containerRepos.appendChild(repos);
            }

        }else 
            alert('There was a problem with the request.');
    }
}


function requestFollowers(){
    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }

    clearChildren(document.getElementById("followers"));

    httpRequest.onreadystatechange = preencheFollowers;
    httpRequest.open('GET', document.getElementById("escondido").value);
    httpRequest.send();
    
}


function preencheFollowers(){
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
            var followers = document.getElementById("followers");


            var response = JSON.parse(httpRequest.responseText);
            for(var i=0; i<response.length; i++){
                var perfil = document.createElement("img");
                perfil.className="img-follower";
                perfil.src = response[i].avatar_url;

                var login = document.createElement("span");
                login.textContent = response[i].login;

                var people = document.createElement("div");
                people.className="container-follower";
                people.appendChild(perfil);
                people.appendChild(login);

                followers.appendChild(people);
            }

            followers.style.display="flex";

            

        } else
           alert('There was a problem with the request.');
    }

}

