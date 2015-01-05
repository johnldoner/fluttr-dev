<?php
$ideaID = $_POST['ideaID'];
$ideaTitle = $_POST['ideaTitle'];
$senderName = $_POST['senderName'];
$to      = $_POST['tags_1'];
$subject = $senderName . " has shared '" . $ideaTitle . "' with you!";
$message = "
Friend,<br><br>
". $senderName . " has sent you an awesome idea. <a href='https://crowdfluttr.firebaseapp.com/login.html'>Login</a> to Crowdfluttr or go straight to the <a href='https://crowdfluttr.firebaseapp.com/idea.html?id=". $ideaID ."'>Idea page</a> to view it.
<br><br>
Happy Innovating!
<br><br>
--Crowdfluttr
<br><br>
_______________________<br>
Be great. Fluttr.<br>
crowdfluttr.com<br>
hello@crowdfluttr.com<br>
<br><br>
";
$headers = 'From: no-reply-notifications@crowdfluttr.com' . "\r\n" .
    'Reply-To: no-reply-notifications@crowdfluttr.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
$headers .= "CC: susan@example.com\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

mail($to, $subject, $message, $headers);
echo "Success!";
?>