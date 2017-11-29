<?php

include('../../../lib/base.php');
include('../../../lib/portfolio.php');

$album_name = 'remodels';

print_portfolio_header();

require('../../../templates/photo-album.php');

print_portfolio_footer();

?>