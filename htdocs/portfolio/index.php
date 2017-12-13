<?php

include('../../lib/base.php');
include('../../lib/portfolio.php');

print_header(array('page_classname' => 'portfolio-page'));

$slideshow_photos = get_photos(array('new-homes', 'remodels', 'interiors', 'details'));
$slideshow_has_photo_picker = true;
include('../../templates/slideshow.php');

print_footer();

?>