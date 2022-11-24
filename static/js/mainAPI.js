document.addEventListener("DOMContentLoaded", function(){
    handleUnftList()
});
async function handleUnftList(){
    const response = await fetch('http://127.0.0.1:8000/unft/',{
        headers: {
            "content-type": "application/json",
            // "Authorization":"Bearer " + localStorage.getItem("access")
        },
        method:'GET',
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        const response_json = result;
        let unft_card_list = document.getElementById("unft_card_list").querySelector(".row")
        append_unft_card_list(response_json,unft_card_list)
        
    }).catch(error => {
        console.warn(error.message)
    });
}

function append_unft_card_list(dataset,element){
    element.innerHTML='';
    dataset.forEach(data => {
        let new_item = document.createElement('div');
        new_item.className = 'col-lg-3 col-md-4 col-6';
        new_item.innerHTML = `
            <a href="/unft.html?unft=${data['id']}">
                <div class='unft_card item_card' id='unft_${data['id']}'>
                    <div class="card_header list_profile">
                        <div class="unft_images item_image">
                            <img aria-hidden="false" draggable="false" loading="lazy" src="http://127.0.0.1:8000/${data['result_image']}">
                        </div>
                       ${data['status'] ? `<span class="unft_card_status">판매중</span>` : ``}
                    </div>
                    <div class="card_body">
                        <div class="card_content">
                            <p class="unft_card_title item_card_title"><span class="title">${data['title']}</span></p>
                            <p class="unft_card_creator item_card_editor"><span class="creator">${data['creator']}</span></p>
                        </div>
                    </div>
                    <div class="card_footer">
                        ${data['status'] ? `<p>판매가</p>` : `<p>마지막 거래가</p>`}
                        <p class="unft_card_price"><span class="price">${insertCommas(data['status'] ? data['price'] : 0)}</span> USD ~ </p>
                    </div>
                </div>
            </a>
        `;
        element.append(new_item);
    });
}

function insertCommas(num){
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}