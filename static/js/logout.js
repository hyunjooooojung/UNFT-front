document.addEventListener("DOMContentLoaded", function(){
    username = localStorage.getItem("username")
    console.log("username:",username)
    
    if(username){
        document.querySelector("header .navbar_menu.nav-right").innerHTML = `
        <li class="navbar_item">
            <a href="/profile.html">
                <div class="my_money">
                    <i class="bi bi-wallet2"></i>
                    <p>
                        <span class="money"> 1,000,000 </span> USD
                    </p>
                </div>
            </a>
        </li>
        <li class="navbar_item">
            <a href="/profile.html">
                ${username}
            </a>
        </li>
        <li class="navbar_item">
            <a href="#" onclick="handleLogout()">
                SIGNOUT
            </a>
        </li>
    `
    }   
    
});
function handleLogout(){
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    localStorage.removeItem("username")
    alert("로그아웃 되었습니다! ")
    location.href = "http://127.0.0.1:5500/index.html";
}