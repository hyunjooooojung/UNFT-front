document.addEventListener("DOMContentLoaded", function(){
    handleUnftDetail()
});
// url을 불러오는 함수
function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}
async function handleUnftDetail(){
     // url이 ?q="unft=1" 형태로 입력되지 않았을 때 에러메세지 출력
    url_param = getParams("unft");
    if (url_param == undefined){
        url_param = localStorage.getItem("unft");
    }
    const response = await fetch('http://127.0.0.1:8000/unft/'+url_param+'/',{
        headers: {
            "content-type": "application/json",
            // "Authorization":"Bearer " + localStorage.getItem("access")
        },
        credentials: "include",
        method:'GET',
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        const response_json = result;
        append_unft_card_detail(response_json)
        // let unft_card_list = document.getElementById("unft_card_list").querySelector(".row")
        // append_unft_card_list(response_json,unft_card_list)
        
    }).catch(error => {
        console.warn(error.message)
    });
}
function append_unft_card_detail(data){
    console.log(data)
    const element = document.querySelector(".item_detail_card");
    element.querySelector(".title").innerText = data['title']
    element.querySelector(".id").innerText = "#"+data['id']
    element.querySelector(".hits").innerText = data['hits']
    element.querySelector(".owner").innerText = data['owner']
    element.querySelector(".creator").innerText = data['creator']
    element.querySelector(".item_image img").setAttribute('src', 'http://127.0.0.1:8000/'+data['result_image']+'/')

    if(data['status']){
        element.querySelector(".unft_card_price_field").innerText = "판매가"
        element.querySelector(".unft_card_price .price").innerText = insertCommas(data['price'])
    }else{
        element.querySelector('.unft_card_status').remove();
    }
    document.querySelector(".unft_card_desc").innerHTML = data['desc']
}

function insertCommas(num){
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}