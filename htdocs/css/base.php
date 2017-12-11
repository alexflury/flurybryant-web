<?php

include('../../lib/base.php');
header('Content-type: text/css');

?>

/* Global */

body {
  font-family: garamond;
  font-size: 16px;
  color: <?php echo $COLOR['TEXT']; ?>;
  margin: 0;
  background: <?php echo $COLOR['HEADER']; ?>;
}

a {
  color: <?php echo $COLOR['LINK']; ?>;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

p {
  margin: 0;
  padding: 0 10px 10px 10px;
}

em {
  font-weight: normal;
  font-style: normal;
}

ul {
  padding: 0;
  margin: 0;
}

h1 {
  margin: 0;
  padding: 15px;
}

/* Shared */

#page {
  width: <?php echo $SIZE['PAGE_WIDTH']; ?>px;
  margin: auto;
  text-align: left;
  position: relative;
}

.center-page {
  margin: auto;
  text-align: left;
  position: relative;
  width: <?php echo $SIZE['PAGE_WIDTH']; ?>px;
  padding: 0 10px;
}

#page-left {
  float: left;
  width: 200px;
}

#page-left h1 {
  margin: 0 0 5px 0;
  font-size: 22px;
}

#page-main {
  float: left;
  width: 570px;
  margin-left: 10px;
}

#page-left #menu ul {
  list-style-type: none;
}

#page-left #menu li {
  padding: 3px 0;
}

.clearb {
  clear: both;
}

/* Header */

#hd {
  background: <?php echo $COLOR['HEADER']; ?>;
  height: <?php echo $SIZE['HD_HEIGHT']; ?>px;
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #214536;
  overflow: hidden;
}

#hd .house-logo-container {
  position: absolute;
  left: 0px;
  top: 5px;
  overflow: hidden;
}

#hd .house-logo {

}

#hd .flurybryant-logo {
  width: 552px;
  height: 46px;
  background: url(/images/flurybryant.jpg);
  position: absolute;
  z-index: 20;
  left: 220px;
  top: 20px;
}

#hd .links-container {
  margin: 6px 0 0 0;
  position: absolute;
  left: 232px;
  top: 75px;
  z-index: 20;
  width: <?php echo ($SIZE['MIN_PAGE_WIDTH'] - 252); ?>px;
  height: <?php echo ($SIZE['HD_HEIGHT'] - 75); ?>px;
}

#hd .links {
  list-style: none;
  padding: 0;
}

#hd .links a {
  color: #FFFFFF;
  font-size: 18px;
}

#hd .links a:hover {
  text-decoration: none;
}

#hd .links li {
  float: left;
  padding: 0 17px;
  line-height: 1.1em;
  height: <?php echo ($SIZE['HD_HEIGHT'] - 75); ?>px;
  cursor: pointer;
}

#hd .links li.left {
  padding-left: 0;
  border-left: 0;
}

#hd .moulding {
  position: absolute;
  top: 110px;
  left: 0;
  top: 110px;
  width: 100%;
  height: <?php echo $SIZE['MOULDING_HEIGHT']; ?>px;
  background: url(/images/moulding-top.jpg);
}

#hd .menu-panel {
  position: absolute;
  left: 0;
  top: <?php echo $SIZE['HD_HEIGHT'] ?>px;
  width: 100%;
  height: <?php echo $SIZE['MENU_PANEL_HEIGHT'] ?>px;
  background: <?php echo $COLOR['MENU_PANEL']; ?>;
  display: none;
  z-index: 1000;
  cursor: pointer;
}

#hd .menu-panel .sublink-menu-panel {
  display: none;
  position: absolute;
  top: 0;
  width: 500px;
  height: <?php echo $SIZE['MENU_PANEL_HEIGHT'] ?>px;
  background: <?php echo $COLOR['MENU_PANEL']; ?>; /* For browsers that do not support gradients */
  background: -webkit-linear-gradient(left, <?php echo $COLOR['MENU_PANEL_GRAD']; ?>, <?php echo $COLOR['MENU_PANEL'] ?>); /* For Safari 5.1 to 6.0 */
  background: -o-linear-gradient(right, <?php echo $COLOR['MENU_PANEL_GRAD']; ?>, <?php echo $COLOR['MENU_PANEL'] ?>); /* For Opera 11.1 to 12.0 */
  background: -moz-linear-gradient(right, <?php echo $COLOR['MENU_PANEL_GRAD']; ?>, <?php echo $COLOR['MENU_PANEL'] ?>); /* For Firefox 3.6 to 15 */
  background: linear-gradient(to right, <?php echo $COLOR['MENU_PANEL_GRAD']; ?>, <?php echo $COLOR['MENU_PANEL'] ?>); /* Standard syntax */
}

#hd .menu-panel .sublink-menu-panel ul {
  list-style: none;
  text-align: left;
}

#hd .menu-panel li {
  padding: 9px 17px;
}

#hd .menu-panel a:hover {
  text-decoration: none;
  color: <?php echo $COLOR['HEADER'] ?>;
}

#hd .sublink-menu-panel.contact-menu-panel {
  width: 100%;
  min-width: 950px;
}

#hd .contact-menu-panel ul {
  height: 50px;
}

#hd .contact-menu-panel li {
  float: left;
  display: block;
  padding: 0;
  margin-left 10px;
}

#hd .contact-menu-panel td {
  padding: 3px 7px;
}

#hd .contact-menu-panel td.left {
  padding-left: 0;
}

#hd .contact-menu-panel td.label {
  font-weight: bold;
}

#hd .contact-menu-panel h1 {
  margin: 15px 0;
  font-size: 30px;
}

/* Footer */

#ft {
  background: <?php echo $COLOR['HEADER']; ?>;
  text-align: center;
  width: 100%;
  border-top: 1px solid #214536;
  height: <?php echo $SIZE['FT_HEIGHT'] - 20; ?>px;
}

#ft .moulding {
  width: 100%;
  height: <?php echo $SIZE['MOULDING_HEIGHT']; ?>px;
  background: url(/images/moulding-bottom.jpg);
}

#ft .houzz-container {
  padding: 10px 10px 0 10px;
  float: right;
}


/* Body */

#bd {
  background: <?php echo $COLOR['BODY'] ?>;
  padding: <?php echo $SIZE['BD_PADDING_TOP']; ?>px 0 <?php echo $SIZE['BD_PADDING_BOTTOM']; ?>px 0;
  width: 100%;
}

#bd p {
  margin: 0;
  padding: 0 10px 10px 10px;
}

#bd h1 {
  margin: 0;
  padding: 15px;
}

#bd ul {
  padding: 0 15px 15px 15px;
  list-style: none;
}

/* Home */

#home #slideshow {

}

/* About */

#about #page-main h1 {
  text-align: center;
  font-size: 22px;
  margin: 0 0 5px 0;
}

#about #page-main h2 {
  font-size: 18px;
  margin: 0 0 5px 0;
}

#about #page-main .column {
  float: left;
  width: 275px;
}

#about #page-main .column.left {
  clear: both;
}

#about #page-main .column.right {
  margin-left: 20px;
}

#about #page-main ul {
  list-style: none;
  margin-bottom: 10px;
  margin-left: 30px;
}

table#towns {
  margin-bottom: 1em;
  padding: 0.5em 0;
  border: 0 solid <?php echo $COLOR['LINE']; ?>;
  border-width: 1px 0;
}

table#towns td {
  padding: 0 75px;
}

/* Portfolio */

#photo-menu {
  margin: -5px 0 -5px -10px;
  float: left;
}

#photo-menu #links {
  list-style: none;
/*  border-right: 5px solid <?php echo $COLOR['FRAME']; ?>; */
}

#photo-menu #links li {
  background: <?php echo $COLOR['FRAME']; ?>;
}

#photo-menu #links li.selected {
  background: <?php echo $COLOR['BODY']; ?>;
}

#photo-menu #links li .title {
  padding: 0 5px;
  cursor: pointer;
}

#photo-menu #links li.hover .title {
  color: <?php echo $COLOR['LINK_HOVER']; ?>;
}

#photo-menu #links li.selected.hover .title {
  cursor: default;
  color: <?php echo $COLOR['LINK']; ?>;
}

#photo-menu #links li .chooser {
  display: none;
  height: 300px;
}

#photo-menu #links li.selected .chooser {
  display: block;
}

/* Contact */

#contact #page-left {

}

#contact #page-left td.left {
  padding-right: 10px;
  font-weight: bold;
}

#contact #page-left table {
  margin: 0 0 3px -3px;
}

#contact #page-left td {
  vertical-align: top;
}

/* Resources */

#resources h1 {
  text-align: center;
  font-size: 22px;
  margin: 0;
}

#resources .sort {
  text-align: center;
}

#resources .column {
  float: left;
  width: 185px;
  margin: 15px 0 0 10px;
}

#resources .column.left {
  margin-left: 0;
}

#resources .column h2 {
  font-size: 18px;
  margin: 0 0 10px 0;
}

#resources .column h3 {
  font-size: 18px;
  margin: 0 0 3px 0;
  text-decoration: underline;
}

#resources .resource {
  margin-bottom: 10px;
}

#resources .resource .name {
  font-weight: bold;
}

/* Photo Album */

#photo-album {

}

#photo-album .thumb {
  float: left;
  width: 160px;
  height: 120px;
  margin: 0 42px 39px 0;
  text-align: center;
}

#photo-album .thumb.right {
  margin-right: 0;
}

#photo-album .thumb.bottom {
  margin-bottom: 1px;
}

#photo-album .thumb img {
  border: 0;
}

#photo-album .photo {
  margin-top: 10px;
}

#photo-album .pager {
  clear: both;
  width: 564px;
}

#photo-album .pager div {
  margin-top: 3px;
}

#photo-album .pager .prev {
  float: left;
}

#photo-album .pager .next {
  float: right;
}

/* Documents */

#documents {
  margin-bottom: -<?php echo $SIZE['BD_PADDING_BOTTOM']; ?>px;
  background: #FFF;
}

#documents a {
  cursor: pointer;
}

#documents #control-bar {
  margin-top: -<?php echo $SIZE['BD_PADDING_TOP']; ?>px;
  background: <?php echo $COLOR['BODY']; ?>;
}

#documents #control-bar-body .control {
  float: left;
  height: 22px;
  padding: 3px 5px 0 5px;
}

#documents #control-bar .title,
#documents #control-bar #prev-link div,
#documents #control-bar #next-link div {
  font-size: 22px;
  height: 25px;
  padding-top: 0;
}

#documents #control-bar-body a:hover {
  text-decoration: none;
}

#documents #control-bar-body a:hover div {
  color: <?php echo $COLOR['TEXT']; ?>;
}

#documents #control-bar .title {
  padding: 0;
  width: 205px;
}

#documents #control-bar .album-link div {
  font-weight: bold;
}

#documents #control-bar .album-link.selected div {
  background: #FFFFFF;
}

#documents #control-bar #prev-link:hover div,
#documents #control-bar #next-link:hover div {
  background: #FFFFFF;
}

#documents #control-bar a:hover {
  background: transparent;
}

#documents #control-bar #page-number {
  width: 180px;
  text-align: center;
}

#documents #control-bar #next-link div,
#documents #control-bar #page-number,
#documents #control-bar #prev-link div {
  float: right;
  font-weight: bold;
}

#documents .explanation {
  visibility: hidden;
  padding-top: 5px;
  text-align: center;
}

#documents .explanation a {
  text-decoration: underline;
}

#documents #view {
  position: relative;
  height: 558px;
}

#documents #document {
  position: absolute;
  z-index: 0;
  width: 780px;
  height: 558px;
  overflow: hidden;
}

#documents #magnifier {
  display: none;
  position: absolute;
  z-index: 2;
  width: 156px;
  height: 112px;
  overflow: hidden;
  border: 3px solid #999;
}

#documents #magnifier #mag-photo-container {
  position: relative;
}

#documents #magnifier #mag-photo-positioner {
  position: absolute;
}

#documents #sensors {
  position: absolute;
  z-index: 3;
  display: none;
}

#documents #sensors div {
  position: absolute;
  z-index: 3;
  background: #FFF;
}

#documents #view.dragged div {
  cursor: url(/cursors/closedhand.cur), default;
}

/* PhotoSequence */

.photo-sequence {
  position: relative;
  width: 100%;
  min-width: <?php echo $SIZE['MIN_PAGE_WIDTH'] ?>px;
}

.photo-sequence .script-only {
  position: absolute;
  left: 0;
  top: 0;
}

.photo-sequence div {
  position: absolute;
  left: 0;
  right: 0;
}

.photo-sequence .photo-frame {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  background-color: <?php echo $COLOR['BODY'] ?>;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

/* Slideshow */

#slideshow {

}

#slideshow .photo-sequence .photo-frame {
  width: 100%;
  min-width: <?php echo $SIZE['MIN_PAGE_WIDTH'] ?>px;
}

#slideshow .photo {
  text-align: center;
  position: relative;
}

#slideshow .photo .photo-moulding-top {
  position: absolute;
  left: 0px;
  top: -22px;
  width: <?php echo ($SIZE['PHOTO_WIDTH'] + 20); ?>px;
  height: 22px;
  background: url(/images/moulding-top.jpg);
}

#slideshow .photo .photo-moulding-right {
  position: absolute;
  left: <?php echo ($SIZE['PHOTO_WIDTH'] + 20); ?>px;
  top: 0px;
  width: 22px;
  height: <?php echo ($SIZE['PHOTO_HEIGHT'] + 20); ?>px;
  background: url(/images/moulding-right.jpg);
}

#slideshow .photo .photo-moulding-bottom {
  position: absolute;
  left: 0px;
  top: <?php echo ($SIZE['PHOTO_HEIGHT'] + 20); ?>px;
  width: <?php echo ($SIZE['PHOTO_WIDTH'] + 20); ?>px;
  height: 22px;
  background: url(/images/moulding-bottom.jpg);
}

#slideshow .photo .photo-moulding-left {
  position: absolute;
  left: -22px;
  top: 0px;
  width: 22px;
  height: <?php echo ($SIZE['PHOTO_HEIGHT'] + 20); ?>px;
  background: url(/images/moulding-left.jpg);
}

#slideshow .photo .photo-moulding-tl {
  position: absolute;
  top: -22px;
  left: -22px;
  width: 22px;
  height: 22px;
  background: url(/images/moulding-tl.jpg);
}

#slideshow .photo .photo-moulding-tr {
  position: absolute;
  top: -22px;
  left: <?php echo ($SIZE['PHOTO_WIDTH'] + 20); ?>px;
  width: 22px;
  height: 22px;
  background: url(/images/moulding-tr.jpg);
}

#slideshow .photo .photo-moulding-br {
  position: absolute;
  top: <?php echo ($SIZE['PHOTO_HEIGHT'] + 20); ?>px;
  left: <?php echo ($SIZE['PHOTO_WIDTH'] + 20); ?>px;
  width: 22px;
  height: 22px;
  background: url(/images/moulding-br.jpg);
}

#slideshow .photo .photo-moulding-bl {
  position: absolute;
  top: <?php echo ($SIZE['PHOTO_HEIGHT'] + 20); ?>px;
  left: -22px;
  width: 22px;
  height: 22px;
  background: url(/images/moulding-bl.jpg);
}

#slideshow .photo .matte {

}

#slideshow .photo img {
  border: 0;
}

#slideshow .left-arrow {
  width: 64px;
  height: 64px;
  background-image: url(/images/arrows.png);
  background-position: 0px 0px;
  position: absolute;
  left: 10px;
  z-index: 1000;
  display: none;
  cursor: pointer;
}

#slideshow .right-arrow {
  width: 64px;
  height: 64px;
  background-image: url(/images/arrows.png);
  background-position: 64px 0px;
  position: absolute;
  right: 10px;
  z-index: 1000;
  display: none;
  cursor: pointer;
}
