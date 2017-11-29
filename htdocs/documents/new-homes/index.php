<?php
include('../../../lib/base.php');

class DocAlbum {
  public $name;
  public $title;
  public $photos;

  public function __construct($name, $title) {
    $this->name = $name;
    $this->title = $title;
    $this->photos = get_photos($name);
  }
}

$albums = array(
  new DocAlbum('new-homes-docs', 'New Home'),
  new DocAlbum('remodels-docs', 'Remodel')
);

print_header();

?>

<div id="documents">
</div>

<?php

print_footer();

?>