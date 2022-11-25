// 이메일 형식 확인을 위한 정규식 체크
function email_check(email) {
	var reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
	return reg.test(email);
}

async function handleSignin() {

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    

    if (email === "" || password === "") {
        alert("빈칸을 채워주세요.")
    }
    else if (!email_check(email)){
		alert("이메일 형식에 맞게 입력해주세요!");
	}
    else {
        const response = await fetch("http://127.0.0.1:8000/users/signin/", {
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        })
        console.log(response);
        const response_json = await response.json();

        if (response.ok) {
            localStorage.setItem("access", response_json.access);
            localStorage.setItem("refresh", response_json.refresh);
            localStorage.setItem("email", email);
            localStorage.setItem("username", username);

            const base64Url = response_json.access.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(atob(base64).split("").map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(""))
            localStorage.setItem("payload", jsonPayload);
            const payload = localStorage.getItem("payload")
            const payload_parse = JSON.parse(payload)
            
            alert("로그인 되었습니다.")
            location.href = "http://127.0.0.1:5500/index.html";
        } 
        // 회원가입 할 때 입력한 비밀번호와 일치 하지 않을 경우
        else if (response.status == 401) {
            alert("비밀번호가 일치하지 않습니다!");
        }
        else {
            alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요!");
            console.warn(`${response.status} 에러가 발생했습니다.`);
        }
    }

}