// profile tab jquery
$('.tab_item').on("click",function(e){
    e.preventDefault(); 
    console.log(this);
    console.log($(this).find("a").attr("href"));
    const target_content_id = $(this).find("a").attr("href");
    $(".tab_item").removeClass('active');
    $(this).addClass("active");
    $(".tab_content").removeClass("active");
    $(target_content_id).addClass("active");
})