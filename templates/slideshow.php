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

if (!isset($slideshow_auto_resize_delta)) {
  $slideshow_auto_resize_delta = 'null';
}

$prev_style = $slideshow_photo > 1 ? '' : ' style="visibility: hidden;"';
$next_style = $slideshow_photo < count($slideshow_photos) ? '' : ' style="visibility: hidden;"';

?>

<div id="slideshow">
  <div class="photo">
    <div class="matte">
      <?php
      $photo_sequence_photos = $slideshow_photos;
      $photo_sequence_photo = $slideshow_photo;
      include('photo-sequence.php');
      ?>
    </div>
  </div>
  <?php if (!$slideshow_auto) { ?>
    <div class="pager">
      <div class="prev"><a id="prev-link"<?php echo $prev_style; ?> href="?photo=<?php echo ($slideshow_photo - 1); ?>">Previous</a></div>
      <div class="next"><a id="next-link"<?php echo $next_style; ?> href="?photo=<?php echo ($slideshow_photo + 1); ?>">Next</a></div>
      <div style="clear: both;"></div>
    </div>
  <?php } ?>
</div>

<?php

$JS .= js('Slideshow.js') . '<script type="text/javascript"><!--' . "\n";
$JS .= 'var slideshow = new FB.Modules.Slideshow(photoSequence, ' . ($slideshow_auto ? 'true' : 'false') . ', ' . $slideshow_period . ', ' . $slideshow_auto_resize_delta . ');' . "\n";
$JS .= '--></script>' . "\n";