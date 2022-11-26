const current_username = localStorage.getItem("username")
const current_username_usd = localStorage.getItem("usd")
document.addEventListener("DOMContentLoaded", function(){
    handleUnftDetail()
    handleOfferDetail()
    handleDealDetail()
});


// U-NFT의 owner_id값을 전역변수로
let owner_id;

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
        owner_id = result['owner_id']

        // 현재 로그인한 유저가 소유자일 때, 제안하기 버튼 안보이기
        if(current_username == result['owner']){
            document.getElementById("btn_deal_modal").remove();
        }
    }).catch(error => {
        console.warn(error.message)
    });
}
function append_unft_card_detail(data){
    const element = document.querySelector(".item_detail_card");
    element.querySelector(".title").innerText = data['title']
    element.querySelector(".id").innerText = "#"+data['id']
    element.querySelector(".hits").innerText = data['hits']
    element.querySelector(".owner").innerText = data['owner']
    element.querySelector(".owner").parentElement.setAttribute("href","/profile.html?username="+data['owner'])
    element.querySelector(".creator").innerText = data['creator']
    element.querySelector(".creator").parentElement.setAttribute("href","/profile.html?username="+data['creator'])
    element.querySelector(".item_image img").setAttribute('src', 'http://127.0.0.1:8000'+data['result_image']+'/')

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

async function handleOfferDetail(){
    let url_param = window.location.search;
    const response = await fetch('http://127.0.0.1:8000/deal/'+url_param,{
        headers: {
            "content-type": "application/json",
        },
        method:'GET',
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`)
        }
        return response.json()
    }).then(result => {
        let offer_body = document.getElementById("offer_body")
        offer_body.innerHTML="";
        if ("message" in result){
            null_item = document.createElement("div");
            null_item.className = "tr"
            null_item.innerHTML = `
                                <div class="td">
                                    <span>${result["message"]}</span>
                                </div>
                                `
            offer_body.append(null_item)
        }else{
            const response_json = result;
            response_json.forEach(deal => {
                if (deal.status !== 0){
                    let dealStatus
                    // 거래승인 상태시
                    if (deal.status === 1){
                        dealStatus = "거래승인"
                    }else if (deal.status === 2){
                        dealStatus = "거래거절"
                    }else{
                        dealStatus = "제안중"
                    }
                
                    let new_item = document.createElement("div");
                    new_item.className = "tr"
                    new_item.innerHTML = `
                                        <div class="td">
                                            <span>${deal["updated_at"]}</span>
                                        </div>
                                        <div class="td">
                                            <span>${deal["to_user_username"]}</span>
                                        </div>
                                        <div class="td">
                                            <span>${dealStatus}</span>
                                        </div>
                                        <div class="td">
                                            <span>${deal["price"]}</span>
                                        </div>
                                        `
                    offer_body.append(new_item);
                };
            });
        };
    }).catch(error => {
        console.error(error.message)
    })
};


async function handleDealDetail(){
    let url_param = window.location.search;
    const response = await fetch('http://127.0.0.1:8000/deal/'+url_param,{
        headers: {
            "content-type": "application/json",
        },
        method:'GET',
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러 발생`)
        }
        return response.json()
    }).then(result => {
        let deal_body = document.getElementById("deal_body")
        deal_body.innerHTML="";
        if ("message" in result){
            null_item = document.createElement("div");
            null_item.className = "tr"
            null_item.innerHTML = `
                                <div class="td">
                                    <span>${result["message"]}</span>
                                </div>
                                `
            deal_body.append(null_item)
        }else{
            result.forEach(element => {
                if (element.status === 1){
                    let new_item = document.createElement("div");
                    new_item.className = "tr"
                    new_item.innerHTML = `
                                        <div class="td">
                                            <span>${element["updated_at"]}</span>
                                        </div>
                                        <div class="td">
                                            <span>${element["from_user_username"]}</span>
                                        </div>
                                        <div class="td">
                                            <span>${element["to_user_username"]}</span>
                                        </div>
                                        <div class="td">
                                            <span>${element["price"]}</span>
                                        </div>
                                        `
                        deal_body.append(new_item);
                        // UNFT 마지막 거래가 삽입
                        let last_price_div = document.querySelector(".unft_card_price")
                        last_price_div.querySelector(".price").innerText = `${result[0]["price"]}`

                }else{
                    null_item = document.createElement("div");
                    null_item.className = "tr"
                    null_item.innerHTML = `
                                        <div class="td">
                                            <span>거래 내역이 없습니다.</span>
                                        </div>
                                        `
                    deal_body.append(null_item)
                }
            });
        };
    }).catch(error => {
        console.error(error.message)
    });
};



// 모달 버튼 클릭시 모달 출력
document.getElementById("btn_deal_modal").addEventListener("click",function(){
    if(current_username){
        $('#dealModal').modal('show');
    }else{
        alert("로그인 후 이용이 가능합니다.");
    }
});
// 가격 제안 API
async function handleDeal(){
    const price = document.getElementById("price_input").value
    const unft_id = getParams("unft")
    if(current_username_usd < price){
        alert("보유 금액을 초과해서 제안할 수 없습니다.")
        return
    }

    const response = await fetch(`http://127.0.0.1:8000/deal/`, {
        headers: {
            "content-type": "application/json",
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method: "POST",
        body: JSON.stringify({
            "unft":unft_id,
            "price":price,
            "from_user":owner_id,
        })
    }).catch(error => {
        console.error(error.message)
    });
    const response_json = await response.json()
    if("message" in response_json){
        alert(response_json.message)
    }else{
        alert("제안되었습니다!")
    };
};