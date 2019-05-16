const attachDropdown = () => {
  $('.article-menu > .trigger').click((e) => {
      var isShown = e.target.parentElement.classList.contains('shown');
      $('.article-menu.shown').toggleClass('shown');
      if (!isShown) {
          e.target.parentElement.classList.toggle('shown');
      }
      e.stopPropagation();
  })

  $(document).click((e) => { $('.article-menu.shown').toggleClass('shown') })
}

const main = async () => {
  attachDropdown()
}

$(attachDropdown)