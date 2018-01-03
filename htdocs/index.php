<?php

require('../lib/base.php');

print_header(array('page_classname' => 'home-page'));

?>

<div id="home">
	<?php 
	$slideshow_photos = array(
		'new-homes/0001.jpg',
		'new-homes/0002.jpg',
		'new-homes/0004.jpg',
		'new-homes/0015.jpg',
		'new-homes/0017.jpg',
		'new-homes/0018.jpg',
		'new-homes/0021.jpg',
		'interiors/0001.jpg',
		'interiors/0002.jpg',
		'interiors/0006.jpg',
		'interiors/0007.jpg',
		'interiors/0009.jpg',
		'interiors/0010.jpg',
		'interiors/0011.jpg',
		'interiors/0012.jpg',
		'interiors/0013.jpg',
		'interiors/0014.jpg',
		'interiors/0018.jpg',
		'interiors/0021.jpg',
		'interiors/0022.jpg',
		'interiors/0023.jpg',
		'interiors/0025.jpg',
		'interiors/0027.jpg'
	);
	shuffle($slideshow_photos);
	include('../templates/slideshow.php');
	?>
	<div class="clearb"></div>

</div>

<?php

print_footer();

?>
