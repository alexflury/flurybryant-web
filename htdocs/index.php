<?php

require('../lib/base.php');

print_header();

?>

<div id="home">
	<?php 
	$slideshow_auto_resize_delta = $SIZE['HD_HEIGHT'] + $SIZE['FT_HEIGHT'];
	$slideshow_auto_resize_min = $SIZE['MIN_PAGE_HEIGHT'] - $SIZE['HD_HEIGHT'] - $SIZE['FT_HEIGHT'];
	include('../templates/slideshow.php');
	?>
	<div class="clearb"></div>

</div>

<?php

print_footer();

?>
