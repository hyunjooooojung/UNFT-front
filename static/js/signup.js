// 이메일 형식 확인을 위한 정규식 체크
function email_check(email) {
	var reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
	return reg.test(email);

}

// 패스워드 형식 확인을 위한 정규식 체크
function password_check(password) {
    var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return reg.test(password);
}

async function handleSignup() {

    const email = document.getElementById("email").value
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const password2 = document.getElementById("password2").value
    const usd = document.getElementById("usd").value

    
    if (email === "" || username === "" || password === "" || password2 === "" || usd === "") {
        alert("빈칸을 채워주세요!")
    }
    else if (username.length > 8) {
        alert("아이디는 8자 이하로 작성해주세요!")
    }
    else if (password !== password2) {
        alert("비밀번호를 확인해주세요!")        
    }
    else if (password.length < 8 || password.length > 20){
        alert("비밀번호는 8-20자로 설정해주세요!")
    }
    else if (!email_check(email)){
		alert("이메일 형식에 맞게 입력해주세요!");
	}
    else if (!password_check(password)){
		alert("비밀번호는 8-20자이며 최소 하나 이상의 영문자, 숫자, 특수문자가 필요합니다!");
	}
    else {
        const response = await fetch("http://127.0.0.1:8000/users/signup/", {
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                "email": email,
                "username": username,
                "password": password,
                "password2": password2,
                "usd" : usd
            })
        })
        if(response.ok){
            alert("회원가입이 완료 되었습니다!")
            location.href = "http://127.0.0.1:5500/signin.html";
        }else{
            alert("회원가입에 실패했습니다. 다시 시도해주세요!");
            console.warn(`${response.status} 에러가 발생했습니다.`)
        }
    }
}