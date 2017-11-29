<?php

if (!isset($photo_sequence_id)) {
  $photo_sequence_id = 'photoSequence';
}

if (isset($photo_sequence_use_thumbs) and $photo_sequence_use_thumbs) {
  $img_src = get_thumb_url($photo_sequence_photos, $photo_sequence_photo);
} else {
  $img_src = get_photo_url($photo_sequence_photos, $photo_sequence_photo);
}

?>

<div id="<?php echo $photo_sequence_id; ?>" class="photo-sequence">
  <noscript>
    <img src="<?php echo $img_src ?>">
  </noscript>
  <div class="script-only">
    <div id="photo-frame-A" class="photo-frame"></div>
    <div class="photo-frame"></div>
    <div class="photo-frame"></div>
  </div>
</div>

<?php

if (!isset($photo_sequence_speed)) {
  $photo_sequence_speed = '';
}

if (!isset($photo_sequence_width)) {
  $photo_sequence_width = -1;
}
if (!isset($photo_sequence_height)) {
  $photo_sequence_height = -1;
}
if (!isset($photo_sequence_use_thumbs)) {
  $photo_sequence_use_thumbs = false;
}
$photo_sequence_use_thumbs = $photo_sequence_use_thumbs ? 'true' : 'false';
$photo_sequence_init_photo = $photo_sequence_photo;
if (isset($photo_sequence_init) and !$photo_sequence_init) {
  $photo_sequence_init_photo = -1;
}

$JS .= js('photoSequence.js') . '<script type="text/javascript"><!--' . "\n";
$JS .= "var $photo_sequence_id = new FB.Modules.PhotoSequence(new Array('" . implode("','", $photo_sequence_photos) . "'), $photo_sequence_init_photo, '$photo_sequence_speed', $photo_sequence_width, $photo_sequence_height, '$photo_sequence_id', $photo_sequence_use_thumbs);\n";
$JS .= '--></script>' . "\n";

?>