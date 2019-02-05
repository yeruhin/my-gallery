console.log('Starting up');

function init() {
    createPortfolios()
    renderPortfolios()
}

function renderPortfolios() {
    var projs = getProjs()
    strHtml = projs.map(function (proj){
        return `
        <div class="col-md-4 col-sm-6 portfolio-item">
        <a class="portfolio-link" data-toggle="modal" href="#portfolioModal1" onclick="openModal('${proj.id}')">
          <div class="portfolio-hover">
            <div class="portfolio-hover-content">
              <i class="fa fa-plus fa-3x"></i>
            </div>
          </div>
          <img class="img-fluid" src="${proj.smlImg}" alt="">
        </a>
        <div class="portfolio-caption">
          <h4>${proj.title}</h4>
          <p class="text-muted">${proj.desc}</p>
        </div>
      </div>
        `
    })
    $('.projects-container').html(strHtml.join(''));
}

function openModal(projId) {
    var proj = getProjById(projId)
    $('.model-name').html(proj.name)
    $('.model-title').html(proj.title)
    $('.model-img').attr('src',proj.bigImg)
    $('.model-desc').html(proj.desc)
    var date = new Date(proj.time).toLocaleDateString("en-US")
    $('.model-timestemp').html(date)
    $('.model-link').attr('href',proj.url)
}

function onSubmitMailClick() {
    var subject = $('.subject-section-input').val();
    var email = $('.email-section-input').val();
    var msg = $('.textarea-section-input').val();
    window.location = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${msg}`;
}