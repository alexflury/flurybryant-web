<?php

include('../../lib/base.php');

print_header();

?>

<div id="contact" class="center-page">
  <div id="page-left">
    <h1>Office Hours</h1>
    <p>
      8:00 AM - 6:00 PM<br />
      Monday - Thursday
    </p>
    <p>
      8:00 AM - 12:00 noon<br />
      Friday
    </p>
    <h1>Location</h1>
    <p>
      761 University Avenue, Suite A<br />
      Los Gatos, CA 95032
    </p>
    <table>
      <tr>
        <td class="left">Phone</td>
	<td>(408) 356-5500</td>
      </tr>
      <tr>
        <td class="left">Fax</td>
        <td>(408) 356-5115</td>
      </tr>
      <tr>
        <td class="left">Email</td>
        <td></td>
      </tr>
    </table>
    <p>
      <a href="mailto:bobflury@flurybryant.com">bobflury@flurybryant.com</a><br />
      <a href="mailto:bobbryant@flurybryant.com">bobbryant@flurybryant.com</a>
    </p>
    <h1><a href="/resources">Resources</a></h1>
  </div>
  <div id="page-main">
    <?php include('../../templates/slideshow.php'); ?>
  </div>
  <div style="clear: both;"></div>
</div>

<?php print_footer(); ?>
