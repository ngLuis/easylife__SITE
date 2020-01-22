
function setListenersModal() {
    $('.c-modal__background').on('click', function(){
        $(this).parent().removeClass('c-modal--show');
    });

    $('.c-modal__close-icon').on('click', function(){
        $(this).parent().parent().parent().removeClass('c-modal--show');
    });
}

export { setListenersModal };