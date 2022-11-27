document.addEventListener("DOMContentLoaded", function(){
    username = localStorage.getItem("username")
    usd = localStorage.getItem("usd")
    

    if(username){
        document.querySelector("header .navbar_menu.nav-right").innerHTML = `
        <li class="navbar_item">
            <a href="/profile.html">
                <div class="my_money">
                    <i class="bi bi-wallet2"></i>
                    <p>
                        <span class="money"> ${insertCommas(usd)} </span> USD
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
        const disallow_path = ['/signin.html','/signup.html']
        const link_pathname =  document.location.pathname;
        if(disallow_path.includes(link_pathname)){
            alert("이미 로그인되어 있습니다");
            location.href = "/";
        }
    }else{
        const disallow_path = ['/create_unft.html','/edit_unft.html']
        const link_pathname =  document.location.pathname;
        
        if(disallow_path.includes(link_pathname)){
            alert("로그인 후 이용이 가능합니다.");
            location.href = "/signin.html";
        }
    }
});
function handleLogout(){
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    localStorage.removeItem("username")
    localStorage.removeItem("usd")
    alert("로그아웃 되었습니다! ")
    location.href = "/";
}
function insertCommas(num){
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}