<?php

include('../../../lib/base.php');
include('../../../lib/portfolio.php');

print_header(array('page_classname' => 'documents-page'));

$slideshow_photos = get_photos(array('new-home-docs'));
$slideshow_has_photo_picker = true;
$slideshow_auto = false;
$slideshow_has_full_screen = true;
include('../../../templates/slideshow.php');

print_footer();

?>