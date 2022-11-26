// create_unft.html에서 생성하기 버튼을 누르면 handleCreateUnft() 호출
document.getElementById("create_button").addEventListener("click",function(){
  handleCreateUnft();
});


// unft 생성하기
async function handleCreateUnft() {
  const loader = document.getElementById("page-loader")
  loader.className += 'show';

  const unft_formData = new FormData();

  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const status = document.getElementById("status").value;
  const price = document.getElementById("price").value;
  const basefileField = document.getElementById("base_image").files[0];
  const stylefileField = document.getElementById("style_image").files[0];



  unft_formData.append("title",title);
  unft_formData.append("desc",desc);
  unft_formData.append("status",status);
  unft_formData.append("price",price);
  unft_formData.append("base_image", basefileField);
  unft_formData.append("style_image", stylefileField);


  const response = await fetch('http://127.0.0.1:8000/unft/',{
      method:'POST',
      headers: {
          "Authorization":"Bearer " + localStorage.getItem("access"),
      },
      body: unft_formData,
  })
  .then(response => {
      if(!response.ok){
          throw new Error(`${response.status} 에러가 발생했습니다.`);    
      }
      console.log(response)
      return response.json()
  })
  .then(result => {
      alert("U-NFT 생성에 성공했습니다!")
      location.href="/unft.html?unft=" + result["id"];
  })
  .catch(error => {
      alert("U-NFT 생성에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
      console.warn(error.message);
      loader.classList.remove('show');
 
  });
}

document.getElementById("status").addEventListener("change",function(){
  const status = document.getElementById("status").value;
  toggleStatusUI(status=="true"? true : false);
});
function toggleStatusUI(status){
  if(status == true){
      document.getElementById("price").removeAttribute("Disabled")
      document.getElementById("price").parentElement.style.display = "block";
  }else{
      document.getElementById("price").setAttribute("Disabled","Disabled")
      document.getElementById("price").parentElement.style.display = "none";
  }
}

// base image 화면에 보여주기
function readImage(input) {
  if(input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = e => {
          const previewImage = document.getElementById("default_image")
          previewImage.src = e.target.result
      }
      reader.readAsDataURL(input.files[0])
  }
}
const inputImage = document.getElementById("base_image")
inputImage.addEventListener("change", e => {
  readImage(e.target)
})

// style image 화면에 보여주기
function readImage2(input) {
  if(input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = e => {
          const previewImage = document.getElementById("default_style_image")
          previewImage.src = e.target.result
      }
      reader.readAsDataURL(input.files[0])
  }
}
const inputImage2 = document.getElementById("style_image")
inputImage2.addEventListener("change", e => {
  readImage2(e.target)
})



// 드래그앤 드롭으로 업로드
const base_image = document.querySelector('.section_base_box');
const style_image = document.querySelector('.section_style_box');

// 1. 박스 안에 drag 하고 있을 때
base_image.addEventListener('dragover', function (e) {
  e.preventDefault();
  this.style.backgroundColor = 'rgb(13 110 253 / 25%)';
});
style_image.addEventListener('dragover', function (e) {
    e.preventDefault();
    this.style.backgroundColor = 'rgb(13 110 253 / 25%)';
});

// 2. 박스 밖으로 drag가 나갈 때
base_image.addEventListener('dragleave', function (e) {
  this.style.backgroundColor = 'white';
});
style_image.addEventListener('dragleave', function (e) {
    this.style.backgroundColor = 'white';
});

// 3. 박스 안에 drop 했을 때
base_image.addEventListener('drop', function (e) {
    e.preventDefault();
    this.style.backgroundColor = 'white';

});
style_image.addEventListener('drop', function (e) {
    e.preventDefault();
    this.style.backgroundColor = 'white';
});




