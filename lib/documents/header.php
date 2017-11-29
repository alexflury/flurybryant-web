<?php

global $album_name;

$new_query = array();
if ($_GET['doc']) {
  $new_query[$album_name] = '?thumb=' . $_GET['doc'];
}

?>

<div id="documents" class="center-page">
  <div id="page-left">
    <div id="menu">
      <h1>Our Documents</h1>
      <lu>
        <li><a href="/documents/new-homes<?php echo $new_query['new-homes']; ?>">New Homes</a></li>
        <li><a href="/documents/remodels<?php echo $new_query['remodels']; ?>">Remodels</a></li>
      </lu>
    </div>
  </div>
  <div id="page-main">