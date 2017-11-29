<?php

function get_album_name() {
  $album_name = preg_replace('/\/(\?.*)?$/', '', $_SERVER['REQUEST_URI']);
  $album_name = preg_replace('/^.*\//', '', $album_name);
  return $album_name;
}

function print_portfolio_header() {
  print_header();
  require('portfolio/header.php');
}

function print_portfolio_footer() {
  require('portfolio/footer.php');
  print_footer();
}

?>