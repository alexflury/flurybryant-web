<?php

function print_about_header() {
  print_header();
  require('about/header.php');
}

function print_about_footer() {
  require('about/footer.php');
  print_footer();
}

?>