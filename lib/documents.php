<?php

function print_documents_header() {
  print_header();
  require('documents/header.php');
}

function print_documents_footer() {
  require('documents/footer.php');
  print_footer();
}

?>