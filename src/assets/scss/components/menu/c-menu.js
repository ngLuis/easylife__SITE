let menu = function(){
    $('.c-menu').on('click', '.c-menu__option', function(){
        $('.c-menu__option--selected').removeClass('c-menu__option--selected');
        $(this).addClass('c-menu__option--selected');
    })
};

export { menu };