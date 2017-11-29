<?php

include('../../../lib/base.php');
include('../../../lib/documents.php');

$album_name = 'new-homes-docs';

print_documents_header();

require('../../../templates/doc-album.php');

print_documents_footer();

?>