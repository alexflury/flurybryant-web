<?php

include('../../lib/base.php');
include('../../lib/portfolio.php');

print_header(array('page_classname' => 'portfolio-page portfolio-index-page', 'banner_title' => 'PORTFOLIO'));

?>

<div class="slideshow-links-container">
	<a href="/portfolio/new-homes/">
		<div class="slideshow-link new-homes-slideshow-link">
			<div class="slideshow-link-text-container">
				<div class="slideshow-link-text">
					NEW HOME EXTERIORS
				</div>
			</div>
		</div>
	</a>
	<a href="/portfolio/remodels/">
		<div class="slideshow-link remodels-slideshow-link">
			<div class="slideshow-link-text-container">
				<div class="slideshow-link-text">
					REMODELED EXTERIORS
				</div>
			</div>
		</div>
	</a>
	<a href="/portfolio/interiors/">
		<div class="slideshow-link interiors-slideshow-link">
			<div class="slideshow-link-text-container">
				<div class="slideshow-link-text">
					INTERIORS
				</div>
			</div>
		</div>
	</a>
	<a href="/portfolio/details/">
		<div class="slideshow-link details-slideshow-link">
			<div class="slideshow-link-text-container">
				<div class="slideshow-link-text">
					DETAILS
				</div>
			</div>
		</div>
	</a>
	<div class="clearb"></div>
</div>

<?

global $JS;
$JS .= js('portfolio-index.js') . raw_js("var portfolioIndex = new FB.Modules.PortfolioIndex();");

print_footer();

?>