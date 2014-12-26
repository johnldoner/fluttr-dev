<?php
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];
$like = $_POST['radio_list_value'];
$to      = "johnldoner@gmail.com";
$subject = "[Crowdfluttr] New Feedback Submission";
$message = "
"
. $name ."<br>"
. $email ."<br>"
. $message ."<br>"
. $like ."<br>"
;
$headers = 'From: feedback-notifications@crowdfluttr.com' . "\r\n" .
    'Reply-To: feedback-notifications@crowdfluttr.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

mail($to, $subject, $message, $headers);
echo "Success!";
?>