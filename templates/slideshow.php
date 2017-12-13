<?php

if (!isset($slideshow_photos)) {
  $slideshow_photos = get_photos(array('new-homes', 'remodels', 'interiors', 'details'));
  shuffle($slideshow_photos);
}

if (!isset($slideshow_photo)) {
  $slideshow_photo = 1;
}

if (!isset($slideshow_auto)) {
  $slideshow_auto = true;
}

if (!isset($slideshow_period)) {
  $slideshow_period = 20000;
}

if (!isset($slideshow_has_photo_picker)) {
  $slideshow_has_photo_picker = false;
}

if (!isset($slideshow_auto_resize_delta)) {
  if ($slideshow_has_photo_picker) {
    $slideshow_auto_resize_delta = $SIZE['HD_HEIGHT'] + $SIZE['FT_HEIGHT'] + $SIZE['PHOTO_PICKER_HEIGHT'];
  } else {
    $slideshow_auto_resize_delta = $SIZE['HD_HEIGHT'] + $SIZE['FT_HEIGHT'];
  }
}

if (!isset($slideshow_auto_resize_min)) {
  if ($slideshow_has_photo_picker) {
    $slideshow_auto_resize_min = $SIZE['MIN_PAGE_HEIGHT'] - $SIZE['HD_HEIGHT'] - $SIZE['FT_HEIGHT'] - $SIZE['PHOTO_PICKER_HEIGHT'];
  } else {
    $slideshow_auto_resize_min = $SIZE['MIN_PAGE_HEIGHT'] - $SIZE['HD_HEIGHT'] - $SIZE['FT_HEIGHT'];
  }
}

$prev_style = $slideshow_photo > 1 ? '' : ' style="visibility: hidden;"';
$next_style = $slideshow_photo < count($slideshow_photos) ? '' : ' style="visibility: hidden;"';

?>

<div id="slideshow">
  <?php if (isset($slideshow_has_photo_picker) && $slideshow_has_photo_picker) { ?>
    <div class="photo-picker">
    </div>
  <?php } ?>
  <div class="photo">
    <div class="matte">
      <?php
      $photo_sequence_photos = $slideshow_photos;
      $photo_sequence_photo = $slideshow_photo;
      include('photo-sequence.php');
      ?>
    </div>
    <div class="left-arrow"></div>
    <div class="right-arrow"></div>
  </div>
</div>

<?php

$JS .= js('Slideshow.js') . '<script type="text/javascript"><!--' . "\n";
$JS .= 'var slideshow = new FB.Modules.Slideshow(photoSequence, ' . ($slideshow_auto ? 'true' : 'false') . ', ' . $slideshow_period . ', ' . $slideshow_auto_resize_delta . ', ' . $slideshow_auto_resize_min . ');' . "\n";
$JS .= '--></script>' . "\n";