<?php

$doc_width = 500;

$docs = get_photos($album_name);

?>

<div id="photo-album" class="documents">
  <?php
  if ($doc) { ?>
    <div class="photo">
      <img src="<?php echo get_photo_url($docs, $doc); ?>" />
    </div>
    <div class="pager">
      <?php if ($doc > 1) { ?>
        <div class="prev"><a href="?doc=<?php echo ($doc - 1); ?>">Previous</a></div>
      <?php }
      if ($doc < count($docs)) { ?>
        <div class="next"><a href="?doc=<?php echo ($doc + 1); ?>">Next</a></div>
      <?php } ?>
      <div style="clear: both;"></div>
    </div>
  <?php } else {
    if ($thumb) {
      $page = floor(($thumb - 1) / $per_page) + 1;
    }
  $start = $per_page * ($page - 1) + 1;
  $end = $per_page * $page + 1;
  if (count($docs) < $end) { $end = count($docs) + 1; }
  $bottom = $start - 1 + floor(($end - $start - 1) / $per_row) * $per_row;
  for ($d = $start; $d < $end; $d++) {
    $class = $d % $per_row ? '' : ' right';
    if ($d > $bottom) { $class .= ' bottom'; } 
    ?>
    <div class="thumb<?php echo $class; ?>">
      <a href="?doc=<?php echo $d; ?>">
        <img src="<?php echo get_thumb_url($docs, $d); ?>">
      </a>
    </div>
  <?php } ?>
  <div class="pager">
    <?php if ($page > 1) { ?>
      <div class="prev"><a href="?page=<?php echo ($page - 1); ?>">Previous</a></div>
    <?php }
    if ($page * $per_page < count($docs)) { ?>
      <div class="next"><a href="?page=<?php echo ($page + 1); ?>">Next</a></div>
    <?php } ?>
    <div style="clear: both;"></div>
  </div>
  <?php } ?>
</div>