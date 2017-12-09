<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>

  <head>
    <title>Flury Bryant Design Group</title>
    <?php
    global $CSS;
    echo $CSS;
    ?>
    <noscript><style> .script-only { display: none; } </style></noscript>
  </head>

  <body>
    <div id="hd">
      <div class="house-logo-container">
        <a href="/">
          <img src="/images/house.jpg" class="house-logo" />
        </a>
      </div>
      <div class="flurybryant-logo" src="/images/flurybryant.jpg"></div>
      <div class="links-container">
        <ul class="links">
          <li class="left home-link"><a href="/">Home</a></li>
          <li class="about-link"><a href="/about">About Us</a></li>
          <li class="portfolio-link"><a href="/portfolio">Portfolio</a></li>
          <li class="documents-link"><a href="/documents">Our Documents</a></li>
          <li class="contact-link"><a href="/contact">Contact Us</a></li>
        </ul>
      </div>
      <div class="menu-panel">
        <div class="sublink-menu-panel about-menu-panel">
          <ul>
            <li><a href="/about/who/">Who We Are</a></li>
            <li><a href="/about/philosophy/">Our Operating Philosophy</a></li>
            <li><a href="/about/mission/">Our Mission Statement</a></li>
            <li><a href="/about/staff/">Our Staff</a></li>
          </ul>
        </div>
        <div class="sublink-menu-panel portfolio-menu-panel">
          <ul>
            <li><a href="/portfolio/new-home-exteriors/">New Home Exteriors</a></li>
            <li><a href="/portfolio/remodeled-exteriors/">Remodeled Exteriors</a></li>
            <li><a href="/portfolio/interiors/">Interiors</a></li>
            <li><a href="/portfolio/details/">Details</a></li>
          </ul>
        </div>
        <div class="sublink-menu-panel documents-menu-panel">
          <ul>
            <li><a href="/documents/new-homes/">New Homes</a></li>
            <li><a href="/documents/remodels/">Remodels</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div id="bd">

<?php

global $JS;
$JS .= js('header.js') . raw_js('var header = new FB.Modules.Header();');

?>