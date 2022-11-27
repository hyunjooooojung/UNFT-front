document.addEventListener("DOMContentLoaded", function(){
    handleProfile()
    // handleOfferDetail()
    // handleDealDetail()
});
// url을 불러오는 함수
function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}
async function handleProfile(){
    url_param = getParams("username");
    if (url_param == undefined){
        url_param = localStorage.getItem("username");
    }
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
        
        document.getElementById("profile_user_id").value = response_json['id']
        document.getElementById("profile_username").innerText = response_json['username']
        document.getElementById("profile_email").innerText = response_json['email']
        // 내새끼 리스트
        let owner_unft_card_list = document.getElementById("owner_unft_card_list").querySelector(".row")
        append_unft_card_list(response_json['own_unft'],owner_unft_card_list)
        
        // 내가만든 작품 리스트
        let creator_unft_card_list = document.getElementById("creator_unft_card_list").querySelector(".row")
        append_unft_card_list1(response_json['create_unft'],creator_unft_card_list)
    }).catch(error => {
        console.warn(error.message)
    });
}

function append_unft_card_list(dataset, element) {
    element.innerHTML = '';
    dataset.forEach(data => {
        let new_item = document.createElement('div');
        new_item.className = 'col-lg-3 col-md-4 col-6';
        new_item.innerHTML = `
            
                <div class='unft_card item_card' id='owner_unft_${data['id']}'>
                    <div class="card_header list_profile">
                        <a href="/unft.html?unft=${data['id']}">
                            <div class="unft_images item_image scale_up">
                                <img aria-hidden="false" draggable="false" loading="lazy" src="http://43.201.57.228${data['result_image']}">
                            </div>
                            ${data['status'] ? `<span class="unft_card_status">판매중</span>` : ``}
                        </a>
                    </div>
                    <div class="card_body">
                        <div class="card_content">
                            <p class="unft_card_title item_card_title"><a href="/unft.html?unft=${data['id']}"><span class="title">${data['title']}</span></a></p>
                            <p class="unft_card_creator item_card_editor"><a href="/unft.html?unft=${data['id']}"><span class="creator">${data['creator']}</span></a></p>
                            <div class="card_button">
                                <button type="button" class="unft_card_edit" onclick="javascript:location.href='/edit_unft.html?unft=${data['id']}'">수정</button>
                            </div>
                        </div>
                    </div>
                    <div class="card_footer">
                        ${data['status'] ? `<p>판매가</p>` : `<p>마지막 거래가</p>`}
                        <p class="unft_card_price"><span class="price">${insertCommas(data['status'] ? data['price'] : data['last_price'])}</span> USD ~ </p>
                    </div>
                </div>
            </a>
        `;
        element.append(new_item);
    });
}

 // 내가만든 작품 리스트
 // -  owner가 username(creator)이랑 같은 경우 [수정],[삭제] 버튼 있음.
function append_unft_card_list1(dataset,element){
    element.innerHTML='';
    dataset.forEach(data => {
        let new_item = document.createElement('div');
        new_item.className = 'col-lg-3 col-md-4 col-6';
        new_item.innerHTML = `
                <div class='unft_card item_card' id='creator_unft_${data['id']}'>
                    <div class="card_header list_profile">
                        <a href="/unft.html?unft=${data['id']}">
                            <div class="unft_images item_image scale_up">
                                <img aria-hidden="false" draggable="false" loading="lazy" src="http://43.201.57.228${data['result_image']}">
                            </div>
                            ${data['status'] ? `<span class="unft_card_status">판매중</span>` : ``}
                        <a href="/unft.html?unft=${data['id']}">
                    </div>
                    <div class="card_body">
                        <div class="card_content">
                            <p class="unft_card_title item_card_title"><a href="/unft.html?unft=${data['id']}"><span class="title">${data['title']}</span></a></p>
                            <p class="unft_card_creator item_card_editor"><a href="/unft.html?unft=${data['id']}"><span class="creator">${data['creator']}</span></a></p>
                            ${data['creator']==data['owner'] ?`
                            <div class="card_button">
                                <button type="button" class="unft_card_edit" onclick="javascript:location.href='/edit_unft.html?unft=${data['id']}'">수정</button>
                                <button type="button" class="unft_card_delete" data-bs-toggle="modal" data-bs-target="#deleteModal">삭제</button>
                            </div>`: ``}
                        </div>
                    </div>
                    <div class="card_footer">
                        ${data['status'] ? `<p>판매가</p>` : `<p>마지막 거래가</p>`}
                        <p class="unft_card_price"><span class="price">${insertCommas(data['status'] ? data['price'] : data['last_price'])}</span> USD ~ </p>
                    </div>
                </div>
            </a>
        `;

        element.append(new_item);
    });
}
$('#deleteModal').on('show.bs.modal', function(event) {
    target_id = $(event.relatedTarget).closest(".item_card").attr('id').split("_")[2]
    $(this).find(".btn_delete").attr("onclick","handleDeleteUnft("+target_id+")");
});

async function handleDeleteUnft(unft_id) {
    const response = await fetch('http://43.201.57.228/unft/'+unft_id+'/',{
        method:'DELETE',
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response;
    }).then(async result => {
        alert("U-NFT 삭제에 성공했습니다!");
        document.getElementById("creator_unft_"+unft_id).remove();
        document.getElementById("owner_unft_"+unft_id).remove();  
    }).catch(async error => {
        alert("U-NFT 삭제에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
        console.warn(error.message);
    });
}

function insertCommas(num){
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
function changeDateTimeFormat(datetime){ // YYYY-MM-DD HH:MM:SS
    const TIME_ZONE = 3240 * 10000;
    const date = new Date(datetime)
    return new Date(+date + TIME_ZONE).toISOString().replace('T', ' ').replace(/\..*/, '');
}


// tab_menu_03탭 누르면 handleDealDetail() 호출
document.getElementById("tab_menu_03").addEventListener("click",function(){
    handleDealDetail();
});
async function handleDealDetail(){
    let user_id = document.getElementById("profile_user_id").value;
    let url_param = `from_user=${user_id}&to_user=${user_id}`;
    const response = await fetch('http://43.201.57.228/deal/?'+url_param,{
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
                                            <span>${changeDateTimeFormat(element["updated_at"])}</span>
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


// tab_menu_04탭 누르면 handleOfferDetail(),handleFromOfferDetail() 호출
document.getElementById("tab_menu_04").addEventListener("click",function(){
    handleToOfferDetail();
    handleFromOfferDetail();
});
// 내가 제안한 것 섹션
async function handleToOfferDetail(){ 
    let user_id = document.getElementById("profile_user_id").value;
    let url_param = `to_user=${user_id}`;
    const response = await fetch('http://43.201.57.228/deal/?'+url_param,{
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
        let offer_body = document.getElementById("to_offer_body")
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
                                            <span>${changeDateTimeFormat(deal["updated_at"])}</span>
                                        </div>
                                        <div class="td">
                                            <span>${deal["from_user_username"]}</span>
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
// 내가 제안 받은 것 섹션
async function handleFromOfferDetail(){
    let user_id = document.getElementById("profile_user_id").value;
    let url_param = `from_user=${user_id}`;
    const response = await fetch('http://43.201.57.228/deal/?'+url_param,{
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
        let offer_body = document.getElementById("from_offer_body")
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
                    new_item.className = "tr unft"+deal["unft"]
                    new_item.id = "deal_"+deal["id"]
                    if(deal["from_user_username"] === localStorage.getItem("username")){
                    new_item.innerHTML = `
                                        <div class="td">
                                            <span>${changeDateTimeFormat(deal["updated_at"])}</span>
                                        </div>
                                        <div class="td">
                                            <span>${deal["from_user_username"]}</span>
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
                                        <div class="td">
                                            <button type="button" class='btn_deal_approve' onclick='handleDeal(${deal['id']},1,${deal['unft']})'>승인</button>
                                            <button type="button" class='btn_deal_reject' onclick='handleDeal(${deal['id']},2,${deal['unft']})'>거절</button>
                                        </div>
                                        `
                    }else{
                        new_item.innerHTML = `
                        <div class="td">
                            <span>${changeDateTimeFormat(deal["updated_at"])}</span>
                        </div>
                        <div class="td">
                            <span>${deal["from_user_username"]}</span>
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
                        <div class="td">
                            <span>권한없음</span>
                        </div>
                        `
                    }
                    offer_body.append(new_item);
                };
            });
        };
    }).catch(error => {
        console.error(error.message)
    })
};

async function handleDeal(deal_id, status, unft_id){
    if(status === 1){
        const response = await fetch(`http://43.201.57.228/deal/complete/${deal_id}/`, {
            headers: {
                "content-type": "application/json",
                "Authorization":"Bearer " + localStorage.getItem("access"),
            },
            method: "PUT",
            body: JSON.stringify({
                "status":status,
            })
        })
        let response_json = await response.json()
        if(response.ok){
            // 거래 성공시 유저 usd 반영 코드
            localStorage.setItem("usd", response_json['from_user_usd']);
            let user_usd = localStorage.getItem('usd')
            document.querySelector(".my_money .money").innerText = `${insertCommas(user_usd)} `

            alert(response_json.message)
            document.getElementById(`deal_${deal_id}`).remove()
            document.querySelectorAll(`.unft${unft_id}`).forEach(element => {
                element.remove()
            })
        }else{
            alert(response_json.message)
        }
    }else if (status === 2){
        const response = await fetch(`http://43.201.57.228/deal/${deal_id}/`, {
            headers: {
                "content-type": "application/json",
                "Authorization":"Bearer " + localStorage.getItem("access"),
            },
            method: "PUT",
            body: JSON.stringify({
                "status":status,
            })
        });
        alert("제안이 거절되었습니다.")
        document.getElementById(`deal_${deal_id}`).remove()
    }
}