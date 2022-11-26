document.addEventListener("DOMContentLoaded", function () {
    handleUnftDetail()
});
// url을 불러오는 함수
function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}
// edit 페이지 unft 모델 정보 불러오기
async function handleUnftDetail(){
    // url이 ?q="unft=1" 형태로 입력되지 않았을 때 에러메세지 출력
   url_param = getParams("unft");
   if (url_param == undefined){
       alert("잘못된 경로입니다.");
       location.href='/';
   }
   const response = await fetch('http://127.0.0.1:8000/unft/'+url_param+'/',{
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
       if(result['owner'] != localStorage.getItem("username")){
            alert("수정 권한이 없습니다.")
            location.href=history.back()
        }
       append_unft_card_detail(response_json)
   }).catch(error => {
       console.warn(error.message)
   });
}
function append_unft_card_detail(data){
    // 수정 조건    
   const login_user = localStorage.getItem("username");
   if (login_user==data['owner'] && login_user==data['creator']){
        document.getElementById("title").removeAttribute("Disabled");
        document.getElementById("desc").removeAttribute("Disabled");
   }
   document.getElementById("title").value = data['title'];
   document.getElementById("desc").value = data['desc'];
   document.getElementById("creator").value = data['creator'];
   document.getElementById("status").querySelector('option[value=' + data['status'] + ']').setAttribute("selected",'selected');
   document.getElementById("price").value = data['price'];
   document.querySelector(".item_image img").setAttribute('src', 'http://127.0.0.1:8000/'+data['result_image']+'/');
   toggleStatusUI(data['status'])
}
function insertCommas(num){
   return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// 판매여부 select 관련 JS
document.getElementById("status").addEventListener("change",function(){
    const status = document.getElementById("status").value;
    toggleStatusUI(status=="true"? true : false);
});
function toggleStatusUI(status){
    if(status){
        document.getElementById("price").removeAttribute("Disabled")
        document.getElementById("price").parentElement.style.display = "block";
    }else{
        document.getElementById("price").setAttribute("Disabled","Disabled")
        document.getElementById("price").parentElement.style.display = "none";
    }
}



document.getElementById("btn_update_unft").addEventListener("click",function(){
    handleUpdateUnft();
});
// unft 생성하기
async function handleUpdateUnft() {
    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    const status = document.getElementById("status").value;
    const price = document.getElementById("price").value;
    
    const unft_formData = new FormData();
    unft_formData.append("title",title);
    unft_formData.append("desc",desc);
    unft_formData.append("status",status);
    unft_formData.append("price",price);
    
    const response = await fetch('http://127.0.0.1:8000/unft/'+url_param+'/',{
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method:'PUT',
        body: unft_formData,
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
            alert("U-NFT 수정에 성공했습니다!")
            location.href='/unft.html?unft='+url_param;
    }).catch(error => {
        alert("U-NFT 수정에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
        console.warn(error.message);
    });
}