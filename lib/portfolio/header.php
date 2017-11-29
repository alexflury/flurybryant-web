<?php

global $album_name;

$new_query = array();
if ($_GET['photo']) {
  $new_query[$album_name] = '?thumb=' . $_GET['photo'];
}

?>

<div id="portfolio" class="center-page">
  <div id="page-left">
    <div id="menu">
      <h1>Portfolio</h1>
      <ul>
        <li><a href="/portfolio/new-homes<?php echo $new_query['new-homes']; ?>">New Home Exteriors</a></li>
        <li><a href="/portfolio/remodels<?php echo $new_query['remodels']; ?>">Remodeled Exteriors</a></li>
        <li><a href="/portfolio/interiors<?php echo $new_query['interiors']; ?>">Interiors</a></li>
        <li><a href="/portfolio/details<?php echo $new_query['details']; ?>">Details</a></li>
      </ul>
    </div>
  </div>
  <div id="page-main">