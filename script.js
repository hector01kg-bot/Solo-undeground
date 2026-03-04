document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll("[data-nav-link]").forEach(function(link){

    link.addEventListener("click", function(e){

      e.preventDefault();

      const target = link.getAttribute("data-nav-link");

      if(!target) return;

      const base = "/Solo-undeground/";

      window.location.href = base + target;

    });

  });

});
