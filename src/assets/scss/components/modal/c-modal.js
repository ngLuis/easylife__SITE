
function setListenersModal() {
    $('.c-modal__background').on('click', function(){
        $(this).parent().removeClass('c-modal--show');
    });
}

export { setListenersModal };