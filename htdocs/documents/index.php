<?php

include('../../lib/base.php');
include('../../lib/portfolio.php');

print_header(array('page_classname' => 'documents-page documents-index-page', 'banner_title' => 'OUR DOCUMENTS'));

?>

<div class="slideshow-links-container">
  <a href="/documents/new-home/">
    <div class="slideshow-link new-home-slideshow-link">
      <div class="slideshow-link-shade"></div>
      <div class="slideshow-link-text-container">
        <div class="slideshow-link-text">
          NEW HOME
        </div>
      </div>
    </div>
  </a>
  <a href="/documents/remodel/">
    <div class="slideshow-link remodel-slideshow-link">
      <div class="slideshow-link-shade"></div>
      <div class="slideshow-link-text-container">
        <div class="slideshow-link-text">
          REMODEL
        </div>
      </div>
    </div>
  </a>
  <div class="clearb"></div>
</div>

<?php

global $JS;
$JS .= js('documents-index.js') . raw_js("var documentsIndex = new FB.Modules.DocumentsIndex();");

print_footer();

?>