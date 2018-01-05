<?php

include('../../lib/base.php');
include('../../lib/portfolio.php');

print_header(array('page_classname' => 'portfolio-page portfolio-index-page', 'banner_title' => 'PORTFOLIO'));

?>

<div class="slideshow-links-container">
	<a href="/portfolio/new-homes/">
		<div class="slideshow-link">
			NEW HOME EXTERIORS
		</div>
	</a>
	<a href="/portfolio/remodels/">
		<div class="slideshow-link">
			REMODELED EXTERIORS
		</div>
	</a>
	<a href="/portfolio/interiors/">
		<div class="slideshow-link">
			INTERIORS
		</div>
	</a>
	<a href="/portfolio/details/">
		<div class="slideshow-link">
			DETAILS
		</div>
	</a>
	<div class="clearb"></div>
</div>

<?

print_footer();

?>