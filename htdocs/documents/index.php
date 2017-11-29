<?php
include('../../lib/base.php');

$VIEW_WIDTH = $SIZE['PAGE_WIDTH'];
$VIEW_HEIGHT = 400;

class DocAlbum {
  public $docNum;
  public $name;
  public $title;
  public $photos;
  public $photosPos;

  public function __construct($albumNum, $name, $title) {
    $this->albumNum = $albumNum;
    $this->name = $name;
    $this->title = $title;
    $this->photos = get_photos($name);
  }
}

$albums = array(
  new DocAlbum(0, 'new-home-docs', 'New Home'),
  new DocAlbum(1, 'remodel-docs', 'Remodel')
);

$albums_by_name = array();
foreach ($albums as $album) {
  $albums_by_name[$album->name] = $album;
}

$album_name = 'new-home-docs';
foreach ($albums as $album) {
  if ($_GET['album'] == $album->name) {
    $album_name = $album->name;
    break;
  }
}

$album = $albums_by_name[$album_name];

$page = $_GET['page'] ? intval($_GET['page']) : 1;

print_header();

$prev_style = $page > 1 ? '' : ' style="visibility: hidden;"';
$next_style = $page < count($album->photos) ? '' : ' style="visibility: hidden;"';

?>

<div id="documents">
  <div id="control-bar">
    <div id="control-bar-body" class="center-page">
      <div class="control title">Our Documents</div>
      <?php foreach ($albums as $link_album) {
        $selected = ($link_album->name == $album->name) ? ' selected' : '';
	?>
        <a class="album-link<?php echo $selected; ?>" href="?album=<?php echo $link_album->name; ?>"><div class="control"><?php echo $link_album->title; ?></div></a>
      <?php } ?>
      <a id="next-link" href="?album=<?php echo $album_name; ?>&page=<?php echo ($page + 1); ?>"<?php echo $next_style; ?>><div class="control">&gt;</div></a>
      <div id="page-number" class="control">Document <?php echo $page; ?> of <?php echo count($album->photos); ?></div>
      <a id="prev-link" href="?album=<?php echo $album_name; ?>&page=<?php echo ($page - 1); ?>"<?php echo $prev_style; ?>><div class="control">&lt;</div></a>
      <div style="clear: both;"></div>
    </div>
  </div>
  <noscript class="script-only">
    <div style="width: <?php echo $SIZE['DOCUMENT_WIDTH']; ?>px; height: <?php echo $SIZE['DOCUMENT_HEIGHT']; ?>px; background: #FFFFFF;">
      <img src="<?php echo get_photo_url($album->photos, $page); ?>">
    </div>
  </noscript>
  <div class="center-page">
  <noscript>
    <div class="explanation" style="visibility: visible;"><a id="photo-link" target="_blank" href="<?php echo get_photo_url($album->photos, $page); ?>">Download the full-sized image</a>.</div>
  </noscript>
  <div class="explanation script-only">Put your mouse over the document to zoom in, or <a id="photo-link" target="_blank" href="javascript:void(0);">download the full-sized image</a>.</div>
  <div id="view">
    <div id="document" style="width: <?php echo $SIZE['DOCUMENT_VIEW_WIDTH']; ?>px; height: <?php echo $SIZE['DOCUMENT_VIEW_HEIGHT']; ?>px;">
      <?php
      $photo_sequence_photos = array();
      foreach ($albums as $concat_album) {
        $concat_album->photosPos = count($photo_sequence_photos);
        foreach ($concat_album->photos as $photo) {
          $photo_sequence_photos[] = $photo;
        }
      }
      $photo_sequence_photo = $album->photosPos + $page;
      $photo_sequence_speed = 'fast';
      $photo_sequence_id = 'docPhotoSequence';
      $photo_sequence_use_thumbs = true;
      $photo_sequence_width = $SIZE['DOCUMENT_VIEW_WIDTH'];
      $photo_sequence_height = $SIZE['DOCUMENT_VIEW_HEIGHT'];
      $photo_sequence_init = false;
      require('../../templates/photo-sequence.php');
      ?>
    </div>
    <div id="magnifier" style="width: <?php echo $SIZE['DOCUMENT_MAG_WIDTH']; ?>px; height: <?php echo $SIZE['DOCUMENT_MAG_HEIGHT']; ?>px; border-width: <?php echo $SIZE['DOCUMENT_MAG_BORDER']; ?>px;">
      <div id="mag-photo-container">
        <div id="mag-photo-positioner">
          <?php
          $photo_sequence_id = 'magPhotoSequence';
          $photo_sequence_use_thumbs = false;
          $photo_sequence_width = $SIZE['DOCUMENT_WIDTH'];
          $photo_sequence_height = $SIZE['DOCUMENT_HEIGHT'];
          $photo_sequence_print_photo = false;
          require('../../templates/photo-sequence.php');
          ?>
        </div>
      </div>
    </div>
    <div id="sensors"></div>
  </div>
  </div>

</div>

<?php

$JS .= js('documents.js') . '<script type="text/javascript"><!--' . "\n";
$JS .= 'var documents = new FB.Modules.Documents(docPhotoSequence, magPhotoSequence);' . "\n";
foreach ($albums as $add_album) {
  $JS .= 'documents.setAlbumDocuments("' . $add_album->name . '", ' . $add_album->photosPos . ', new Array(' . "\n" . '"' . implode('",' . "\n" . '"', $add_album->photos) . '"));' . "\n";
}
$JS .= 'documents.setAlbum("' . $album_name . '", ' . $page . ');' . "\n";
$JS .= '--></script>';
END;

print_footer();

?>