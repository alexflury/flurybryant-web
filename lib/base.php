<?php

$COLOR = array(
  'TEXT' => '#333',
  'LINK' => '#323329',
  'LINK_HOVER' => '#A1A686',
  'LINE' => '#183328',
  'HEADER' => '#2F614C',
  'FRAME' => '#ECF3C5',
  'BODY' => '#B8B8B8',
  'MENU_PANEL' => '#A9A9A9',
  'MENU_PANEL_GRAD' => '#DCDCDC'
);

$SIZE = array(
  'PAGE_WIDTH' => 780,
  'MOULDING_HEIGHT' => 22,
  'BD_PADDING_TOP' => 0,
  'BD_PADDING_BOTTOM' => 0,
  'PHOTO_WIDTH' => 500,
  'PHOTO_HEIGHT' => 375,
  'DOCUMENT_WIDTH' => 3150,
  'DOCUMENT_HEIGHT' => 2250,
  'DOCUMENT_VIEW_WIDTH' => 780,
  'DOCUMENT_VIEW_HEIGHT' => 557,
  'DOCUMENT_MAG_WIDTH' => 468,
  'DOCUMENT_MAG_HEIGHT' => 336,
  'DOCUMENT_MAG_BORDER' => 3,
  'HD_HEIGHT' => 110,
  'FT_HEIGHT' => 70,
  'MIN_PAGE_HEIGHT' => 500,
  'MIN_PAGE_WIDTH' => 880,
  'MENU_PANEL_HEIGHT' => 150
);

$JS = js('fb.js');
$CSS = css('base.php');

function print_header() {
  require('header.php');
}

function print_header_plain() {
  require('header_plain.php');
}

function print_footer() {
  require('footer.php');
}

function print_footer_plain() {
  require('footer_plain.php');
}

function css($src) {
  return '<link rel="stylesheet" href="/css/' . $src . '" />';
}

function raw_css($css) {
  return "<style type=\"text/css\">\n$css\n</style>\n";
}

function js($src) {
  return '<script src="/js/' . $src . '"></script>';
}

function raw_js($js) {
  return "<script type=\"text/javascript\"><!--\n$js\n--></script>\n";
}

function get_photos($album_name) {
  if (is_array($album_name)) {
    $photos = array();
    foreach ($album_name as $name) {
      $album_photos = get_photos($name);
      foreach ($album_photos as $photo) {
        $photos[] = $photo;
      }
    }
    return $photos;
  }
  $dir = opendir(getenv('DOCUMENT_ROOT') . '/images/photos/' . $album_name);
  $photos = array();
  readdir($dir);
  readdir($dir);
  while ($filename = readdir($dir)) {
    if (substr($filename, 0, 1) != '.') {
      $photos[] = $album_name . '/' . $filename;
    }
  }
  closedir($dir);
  usort($photos, 'strcmp');
  return $photos;
}

function get_photo_url($photos, $p) {
  if ($p < 1 or $p > count($photos)) { return ''; }
  return '/images/photos/' . $photos[$p - 1];
}

function get_thumb_url($photos, $p) {
  if ($p < 1 or $p > count($photos)) { return ''; }
  return '/images/thumbs/' . $photos[$p - 1];
}

?>