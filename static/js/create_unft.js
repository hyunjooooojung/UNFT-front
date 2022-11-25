document.addEventListener("DOMContentLoaded", function () {
    console.log("로딩되었음")
    handleMock()
});


// 이미지 업로드하는 자바스크립트
const basic_image = document.querySelector('.basic_image');
const style_image = document.querySelector('.style_image');
const input_basicname = document.querySelector('.basic_text');
const input_stylename = document.querySelector('.style_text');

// 박스 안에 drag 하고 있을 때
basic_image.addEventListener('dragover', function (e) {
  e.preventDefault();
  this.style.backgroundColor = 'rgb(13 110 253 / 25%)';
});
style_image.addEventListener('dragover', function (e) {
    e.preventDefault();
    this.style.backgroundColor = 'rgb(13 110 253 / 25%)';
  });

// 박스 밖으로 drag가 나갈 때
basic_image.addEventListener('dragleave', function (e) {
  this.style.backgroundColor = 'white';
});
style_image.addEventListener('dragleave', function (e) {
    this.style.backgroundColor = 'white';
  });

// 박스 안에 drop 했을 때
basic_image.addEventListener('drop', function (e) {
  e.preventDefault();
  this.style.backgroundColor = 'white';

  // 파일 이름을 text로 표시
  let filename = e.dataTransfer.files[0].name;
  input_basicname.innerHTML = filename;
});
style_image.addEventListener('drop', function (e) {
    e.preventDefault();
    this.style.backgroundColor = 'white';
  
    // 파일 이름을 text로 표시
    let filename2 = e.dataTransfer.files[0].name;
    input_stylename.innerHTML = filename2;
  });


// url을 불러오는 함수
function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}


document.getElementById("savebutton").addEventListener("click",function(){
    handleUpdate();

});
// unft 생성하기
async function handleCreateUnft() {

    const unft_formData = new FormData();

    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    const creator = document.getElementById("creator").value;
    const status = document.getElementById("status").value;
    const price = document.getElementById("price").value;
    const fileField = document.querySelector('input[type="file"]').files[0];

    unft_formData.append("title",title);
    unft_formData.append("desc",desc);
    unft_formData.append("creator",creator);
    unft_formData.append("status",status);
    unft_formData.append("price",price);
    unft_formData.append("basic_image", fileField);
    unft_formData.append("style_image", fileField);
    
    const response = await fetch('http://127.0.0.1:8000/unft/',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        body: unft_formData,
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
            alert("U-NFT 생성에 성공했습니다!")
    }).catch(error => {
        alert("U-NFT 생성에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
        console.warn(error.message);
    });
}