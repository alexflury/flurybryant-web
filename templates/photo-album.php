<?php

$per_page = 9;
$per_row = 3;

$page = $_GET['page'] ? intval($_GET['page']) : 1;
$photo = intval($_GET['photo']);
$thumb = intval($_GET['thumb']);

$photos = get_photos($album_name);

?>

<div id="photo-album">
  <?php
  if ($photo) {
    $slideshow_photos = $photos;
    $slideshow_photo = $photo;
    $slideshow_auto = false;
    include('slideshow.php');
  } else {
    if ($thumb) {
      $page = floor(($thumb - 1) / $per_page) + 1;
    }
    $start = $per_page * ($page - 1) + 1;
    $end = $per_page * $page + 1;
    if (count($photos) < $end) { $end = count($photos) + 1; }
    $bottom = $start - 1 + floor(($end - $start - 1) / $per_row) * $per_row;
    for ($p = $start; $p < $end; $p++) {
      $class = $p % $per_row ? '' : ' right';
      if ($p > $bottom) { $class .= ' bottom'; } 
      ?>
      <div class="thumb<?php echo $class; ?>">
        <a href="?photo=<?php echo $p; ?>">
	  <img src="<?php echo get_thumb_url($photos, $p); ?>" />
	</a>
      </div>
    <?php } ?>
    <div class="pager">
      <?php if ($page > 1) { ?>
	<div class="prev"><a href="?page=<?php echo ($page - 1); ?>">Previous</a></div>
      <?php }
      if ($page * $per_page < count($photos)) { ?>
	<div class="next"><a href="?page=<?php echo ($page + 1); ?>">Next</a></div>
      <?php } ?>
      <div style="clear: both;"></div>
    </div>
  <?php } ?>
</div>