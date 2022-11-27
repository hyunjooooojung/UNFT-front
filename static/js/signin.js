document.getElementById("button_login").addEventListener("click",function(){
    handleSignin();
});

async function handleSignin() {

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    

    if (username === "" || password === "") {
        alert("빈칸을 채워주세요.")
    }
    else {
        const response = await fetch("http://43.201.57.228/users/signin/", {
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
        const response_json = await response.json();

        if (response.ok) {
            localStorage.setItem("access", response_json.access);
            localStorage.setItem("refresh", response_json.refresh);
            localStorage.setItem("username", username);

            const base64Url = response_json.access.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(atob(base64).split("").map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(""))
            localStorage.setItem("payload", jsonPayload);
            const payload = localStorage.getItem("payload")
            const payload_parse = JSON.parse(payload)
            
            handleProfile(username)
            alert("로그인 되었습니다.")
            location.href = "/";
        } 
        // 회원가입 할 때 입력한 아이디,비밀번호와 일치 하지 않을 경우
        else if (response.status == 401) {
            alert("아이디와 비밀번호가 일치하지 않습니다! 다시 입력해주세요.");
        }
        else {
            alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요!");
            console.warn(`${response.status} 에러가 발생했습니다.`);
        }
    }

}

async function handleProfile(url_param){    
    const response = await fetch('http://43.201.57.228/users/'+url_param+'/',{
        headers: {
            "content-type": "application/json",
        },
        method:'GET',
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        const response_json = result;
        localStorage.setItem("usd", response_json['usd']);
    }).catch(error => {
        console.warn(error.message)
    });
}