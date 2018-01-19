<?php

include('../../../lib/base.php');
include('../../../lib/portfolio.php');

print_header(array('page_classname' => 'portfolio-page'));

$slideshow_photos = get_photos(array('interiors'));
$slideshow_has_photo_picker = true;
$slideshow_auto = false;
$slideshow_has_full_screen = true;
$slideshow_photo = 7;
include('../../../templates/slideshow.php');

print_footer();

?>